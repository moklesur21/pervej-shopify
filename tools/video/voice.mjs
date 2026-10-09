#!/usr/bin/env node
/**
 * The voice (video guideline §10): the checked Spoken column of post/script.md, read by Yeasir's own
 * ElevenLabs voice clone, checked word for word, at one loudness.
 *
 *   node tools/video/voice.mjs <id> --dry          the chunks and the characters a run would send; no API call
 *   node tools/video/voice.mjs <id>                a take per scene → speech-to-text → word check → media/voice/
 *   node tools/video/voice.mjs <id> --redo s3,s5   new takes for those scenes (the old ones are kept)
 *   node tools/video/voice.mjs <id> --pick s3=t1   use another stored take (no API call)
 *   node tools/video/voice.mjs <id> --process      only the loudness chain again
 *
 * Refuses until the words check passes and the four post files are committed as they stand (§8): the
 * voice reads what was checked, nothing else. One take per scene, each with a fixed seed and joined to the
 * previous scene's take (request stitching) so the read flows; a take that fails the word check (a word
 * missing, added or changed, or a clipped ending) gets up to two more. Tone is never retried by machine:
 * Yeasir judges it at the go. Then one loudness chain over the whole voice → media/voice/<id>-voice-s<N>.wav.
 */

import fs from 'node:fs';
import path from 'node:path';
import { resolveDemo, ensureDir, shown, readText } from './lib/paths.mjs';
import { parseScript } from './lib/script.mjs';
import { wordsGate } from './lib/gate.mjs';
import { duration } from './lib/ffmpeg.mjs';
import { config, tts, stt, judge, failed, seedOf, keySource, keyHelp } from './lib/elevenlabs.mjs';
import { processVoice } from './lib/audio.mjs';
import { chunks, loadState, saveState, voiceFile, spokenWordCount } from './lib/voice.mjs';
import { VOICE } from './lib/layout.mjs';

const STITCH_MS = 2 * 3600e3 - 10 * 60e3; // a request id can be stitched to for about two hours
const r3 = ( n ) => Math.round( n * 1000 ) / 1000;
const plainText = ( t ) => t.replace( /\[[^\]]*\]\s*/g, '' ).replace( /\s+/g, ' ' ).trim();

function args( argv ) {
	const out = { positional: [], dry: false, process: false, redo: [], pick: [] };
	for ( let i = 0; i < argv.length; i++ ) {
		const a = argv[ i ];
		if ( a === '--dry' ) {
			out.dry = true;
		} else if ( a === '--process' ) {
			out.process = true;
		} else if ( a === '--redo' || a === '--pick' ) {
			out[ a.slice( 2 ) ] = ( argv[ ++i ] || '' ).split( ',' ).map( ( s ) => s.trim() ).filter( Boolean );
		} else {
			out.positional.push( a );
		}
	}
	return out;
}

/** The best current take: highest word accuracy; a tie goes to the length closest to the median. */
function autoPick( st ) {
	const cur = Object.entries( st.takes ).filter( ( [ , t ] ) => t.sent === st.sent && t.accuracy !== undefined && ! t.rejected );
	if ( ! cur.length ) {
		return null;
	}
	const best = Math.max( ...cur.map( ( [ , t ] ) => t.accuracy ) );
	const lens = cur.map( ( [ , t ] ) => t.seconds ).sort( ( a, b ) => a - b );
	const median = lens[ Math.floor( lens.length / 2 ) ];
	const top = cur.filter( ( [ , t ] ) => t.accuracy >= best - 1e-9 ).sort( ( a, b ) => Math.abs( a[ 1 ].seconds - median ) - Math.abs( b[ 1 ].seconds - median ) );
	return top[ 0 ][ 0 ];
}

async function processAll( demo, list, state ) {
	const parts = list.map( ( ch ) => {
		const st = state.chunks[ ch.id ];
		if ( ! st?.picked ) {
			throw new Error( `Scene ${ ch.n } has no take yet — run: node tools/video/voice.mjs ${ demo.id }` );
		}
		return { id: ch.id, src: path.join( demo.voice, 'takes', `${ ch.id }-${ st.picked }.mp3` ) };
	} );
	for ( const old of fs.readdirSync( demo.voice ).filter( ( f ) => f.startsWith( `${ demo.id }-voice-` ) ) ) {
		fs.rmSync( path.join( demo.voice, old ) );
	}
	const result = await processVoice( parts, config.processing, demo.voice, ( id ) => voiceFile( demo, id ) );
	state.processed = {
		at: new Date().toISOString(),
		lufs: result.I,
		truePeak: result.TP,
		chain: result.chain,
		files: Object.fromEntries( list.map( ( ch ) => [ ch.id, { ...result.files[ ch.id ], sent: state.chunks[ ch.id ].sent, take: state.chunks[ ch.id ].picked } ] ) ),
	};
	saveState( demo, state );
	const off = Math.abs( result.I - config.processing.target_lufs ) > config.processing.tolerance_lu;
	console.log( `✓ ${ list.length } scene(s) → ${ shown( demo.voice ) }/${ demo.id }-voice-s*.wav · ${ result.I } LUFS, true peak ${ result.TP } dBTP (gain ${ result.gain } dB)${ off ? ` — off the ${ config.processing.target_lufs } target, check the chain` : '' }` );
}

async function main() {
	const opts = args( process.argv.slice( 2 ) );
	const demo = resolveDemo( opts.positional[ 0 ] );
	const md = readText( path.join( demo.post, 'script.md' ) );
	if ( md === null ) {
		throw new Error( 'post/script.md does not exist yet.' );
	}
	const script = parseScript( md );
	if ( script.errors.length ) {
		throw new Error( `Fix the script first:\n- ${ script.errors.join( '\n- ' ) }` );
	}
	const list = chunks( script );
	if ( ! list.length ) {
		throw new Error( 'post/script.md has no Spoken words: add a Spoken column (guideline §10), then the words check.' );
	}
	const total = spokenWordCount( script );
	if ( total > VOICE.maxWords ) {
		throw new Error( `${ total } words are spoken; at most ${ VOICE.maxWords } (§10). Shorten the Spoken column, then the words check again.` );
	}
	const credits = list.reduce( ( sum, ch ) => sum + ch.sent.length, 0 );
	console.log( `Voice ${ demo.id } · ${ config.voice_name } · ${ config.tts_model_id } · ${ list.length } scene(s) · ${ total } words` );

	if ( opts.dry ) {
		for ( const ch of list ) {
			console.log( `  ${ ch.id.padEnd( 4 ) } ${ String( ch.sent.length ).padStart( 4 ) } chars  ${ ch.sent }` );
		}
		console.log( `About ${ credits } characters of text to speech for one take each, plus speech to text. Nothing was sent.` );
		return true;
	}

	const gate = await wordsGate( demo );
	if ( ! gate.ok ) {
		throw new Error( `No voice yet — ${ gate.reason }` );
	}
	ensureDir( path.join( demo.voice, 'takes' ) );
	const state = loadState( demo );

	if ( opts.process ) {
		await processAll( demo, list, state );
		return true;
	}

	if ( opts.pick.length ) {
		for ( const p of opts.pick ) {
			const [ id, t ] = p.split( '=' );
			const st = state.chunks[ id ];
			if ( ! st?.takes?.[ t ] ) {
				throw new Error( `No take ${ t } for ${ id }. Stored: ${ Object.keys( st?.takes || {} ).join( ', ' ) || 'none' }` );
			}
			if ( st.takes[ t ].sent !== st.sent ) {
				throw new Error( `${ id }-${ t } was made from other words than the checked script.` );
			}
			Object.assign( st, { picked: t, pinned: true } );
			console.log( `✓ ${ id } → ${ t } (pinned)` );
		}
		saveState( demo, state );
		await processAll( demo, list, state );
		return true;
	}

	for ( const id of opts.redo ) {
		if ( ! list.some( ( ch ) => ch.id === id ) ) {
			throw new Error( `No scene ${ id } with Spoken words. Scenes: ${ list.map( ( ch ) => ch.id ).join( ', ' ) }` );
		}
	}
	const source = keySource();
	if ( ! source ) {
		throw new Error( `No ElevenLabs API key on this machine. ${ keyHelp() }` );
	}

	for ( const [ i, ch ] of list.entries() ) {
		const st = ( state.chunks[ ch.id ] ||= { takes: {} } );
		const redo = opts.redo.includes( ch.id );
		if ( st.sent !== ch.sent ) {
			st.pinned = false;
		}
		Object.assign( st, { n: ch.n, text: ch.text, sent: ch.sent } );
		if ( redo ) {
			// A redo is a verdict on what exists: only new takes compete.
			st.pinned = false;
			for ( const t of Object.values( st.takes ) ) {
				t.rejected = true;
			}
		}
		const current = Object.values( st.takes ).filter( ( t ) => t.sent === ch.sent && ! t.rejected ).length;
		const need = redo ? config.takes : Math.max( 0, config.takes - current );
		const prev = i > 0 ? state.chunks[ list[ i - 1 ].id ] : null;
		const make = async () => {
			const prevTake = prev?.picked ? prev.takes[ prev.picked ] : null;
			const ctx = {
				prevIds: prevTake?.request_id && Date.now() - Date.parse( prevTake.created ) < STITCH_MS ? [ prevTake.request_id ] : null,
				prevText: i > 0 ? plainText( list[ i - 1 ].sent ) : null,
				nextText: i < list.length - 1 ? plainText( list[ i + 1 ].sent ) : null,
			};
			const n = Math.max( 0, ...Object.keys( st.takes ).map( ( t ) => Number( t.slice( 1 ) ) ) ) + 1;
			const t = `t${ n }`;
			const seed = seedOf( `${ demo.id }:${ ch.id }:${ t }:${ ch.sent }` );
			const r = await tts( ch.sent, seed, ctx );
			const file = path.join( demo.voice, 'takes', `${ ch.id }-${ t }.mp3` );
			fs.writeFileSync( file, r.buf );
			st.takes[ t ] = {
				sent: ch.sent,
				seed,
				request_id: r.requestId,
				stitched: ctx.prevIds ? 'request' : ctx.prevText ? 'text' : null,
				format: r.format,
				cost: r.cost,
				created: new Date().toISOString(),
				seconds: r3( await duration( file ) ),
			};
			// Paid for: kept even if the check below fails.
			saveState( demo, state );
			const transcript = await stt( file );
			Object.assign( st.takes[ t ], judge( transcript, st.takes[ t ].seconds, ch.text ) );
			saveState( demo, state );
		};
		for ( let k = 0; k < need; k++ ) {
			await make();
		}
		if ( ! ( st.pinned && st.takes[ st.picked ]?.sent === ch.sent ) ) {
			st.picked = autoPick( st );
			st.pinned = false;
			for ( let r = 0; r < ( config.retries ?? 0 ) && failed( st.takes[ st.picked ] ); r++ ) {
				console.log( `  ${ ch.id }: ${ st.takes[ st.picked ].flags.join( ' · ' ) } → another take` );
				await make();
				st.picked = autoPick( st );
			}
		}
		saveState( demo, state );
		const take = st.takes[ st.picked ];
		console.log( `✓ ${ ch.id.padEnd( 4 ) } ${ st.picked.padEnd( 4 ) } ${ ( `${ Math.round( take.accuracy * 1000 ) / 10 } %` ).padStart( 7 ) }  ${ take.seconds.toFixed( 2 ).padStart( 6 ) } s${ st.pinned ? '  (pinned)' : '' }${ take.flags.length ? `  ⚠ ${ take.flags.join( ' · ' ) }` : '' }` );
	}
	const cost = list.reduce( ( sum, ch ) => sum + Object.values( state.chunks[ ch.id ].takes ).reduce( ( s, t ) => s + ( t.cost || 0 ), 0 ), 0 );
	await processAll( demo, list, state );
	const flagged = list.filter( ( ch ) => state.chunks[ ch.id ].takes[ state.chunks[ ch.id ].picked ].flags.length ).map( ( ch ) => ch.id );
	console.log( flagged.length
		? `Listen to: ${ flagged.join( ', ' ) } — another stored take: --pick <scene>=tN · a new take: --redo <scene>`
		: 'Every scene reads the checked words, word for word.' );
	console.log( `Credits reported by the API for this video's takes so far: ${ cost || 'not reported' }. Key from the ${ source }.` );
	console.log( `Next: node tools/video/render.mjs ${ demo.id }` );
	return ! list.some( ( ch ) => failed( state.chunks[ ch.id ].takes[ state.chunks[ ch.id ].picked ] ) );
}

try {
	process.exitCode = ( await main() ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
