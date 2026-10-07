/**
 * The ElevenLabs API, as the voice needs it (video guideline §10): text to speech with Yeasir's own
 * voice clone, speech to text for the word check, and the check itself. Ported from the ch repo's
 * voice-gen.mjs, made to run on macOS and Windows alike.
 *
 * The key never touches a file in the repo and is never printed: ELEVENLABS_API_KEY from the
 * environment (on Windows, a user environment variable), else the macOS Keychain (service
 * 'elevenlabs-api', the same entry the ch repo uses).
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { TOOL_DIR } from './paths.mjs';

const API = 'https://api.elevenlabs.io';
const KEYCHAIN = 'elevenlabs-api';
const sleep = ( ms ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );
const r3 = ( n ) => Math.round( n * 1000 ) / 1000;

/** The locked voice choices, tools/video/voice.json. */
export const config = JSON.parse( fs.readFileSync( path.join( TOOL_DIR, 'voice.json' ), 'utf8' ) );

/**
 * Where the key would come from, without reading it.
 *
 * @return {'environment'|'keychain'|null} Source.
 */
export function keySource() {
	if ( process.env.ELEVENLABS_API_KEY ) {
		return 'environment';
	}
	if ( process.platform === 'darwin' && spawnSync( 'security', [ 'find-generic-password', '-s', KEYCHAIN ], { stdio: 'ignore' } ).status === 0 ) {
		return 'keychain';
	}
	return null;
}

/** How to store the key on this machine, for error messages. */
export function keyHelp() {
	return process.platform === 'darwin'
		? `Store it once in the Keychain (the command asks for it, so it stays out of shell history):\n  security add-generic-password -a "$USER" -s ${ KEYCHAIN } -w`
		: 'Store it once as a user environment variable, in PowerShell (it asks for the key, so it stays out of the history), then open a new terminal:\n  $k = Read-Host "ElevenLabs key" -AsSecureString; [Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", [Net.NetworkCredential]::new("", $k).Password, "User")';
}

let KEY = null;
function apiKey() {
	if ( KEY ) {
		return KEY;
	}
	if ( process.env.ELEVENLABS_API_KEY ) {
		KEY = process.env.ELEVENLABS_API_KEY.trim();
		return KEY;
	}
	if ( process.platform === 'darwin' ) {
		const r = spawnSync( 'security', [ 'find-generic-password', '-s', KEYCHAIN, '-w' ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ] } );
		if ( r.status === 0 && r.stdout.trim() ) {
			KEY = r.stdout.trim();
			return KEY;
		}
	}
	throw new Error( `No ElevenLabs API key on this machine. ${ keyHelp() }` );
}

/**
 * One API call, retried on rate limits and server errors.
 *
 * @param {string} method HTTP method.
 * @param {string} p      Path.
 * @param {object} o      { json, form, query }.
 * @return {Promise<Response>} Response.
 */
async function api( method, p, { json, form, query } = {} ) {
	const url = new URL( API + p );
	for ( const [ k, v ] of Object.entries( query || {} ) ) {
		url.searchParams.set( k, v );
	}
	const headers = { 'xi-api-key': apiKey() };
	let body;
	if ( json ) {
		headers[ 'content-type' ] = 'application/json';
		body = JSON.stringify( json );
	}
	if ( form ) {
		body = form;
	}
	for ( let attempt = 1; ; attempt++ ) {
		const r = await fetch( url, { method, headers, body } );
		if ( r.ok ) {
			return r;
		}
		const text = await r.text();
		if ( ( r.status === 429 || r.status >= 500 ) && attempt < 4 ) {
			await sleep( 3000 * attempt );
			continue;
		}
		const hint = r.status === 401 ? ' — the key needs the Text to Speech and Speech to Text permissions' : '';
		const error = new Error( `ElevenLabs ${ method } ${ p } → ${ r.status }${ hint }: ${ text.slice( 0, 300 ) }` );
		error.status = r.status;
		error.body = text;
		throw error;
	}
}

let format = config.output_format;

/**
 * One take: text to speech with the clone, a fixed seed, and the neighbouring text or the previous
 * take's request id so consecutive scenes read as one flow (request stitching).
 *
 * @param {string} text Text sent, tag included.
 * @param {number} seed Seed.
 * @param {object} ctx  { prevIds, prevText, nextText }.
 * @return {Promise<{buf: Buffer, requestId: string|null, cost: number|null, format: string}>} Audio.
 */
export async function tts( text, seed, ctx = {} ) {
	const settings = Object.fromEntries( Object.entries( config.voice_settings || {} ).filter( ( [ , v ] ) => v !== null ) );
	const body = { text, model_id: config.tts_model_id, seed, voice_settings: settings };
	if ( ctx.prevIds?.length ) {
		body.previous_request_ids = ctx.prevIds;
	} else if ( ctx.prevText ) {
		body.previous_text = ctx.prevText;
	}
	if ( ctx.nextText ) {
		body.next_text = ctx.nextText;
	}
	try {
		const r = await api( 'POST', `/v1/text-to-speech/${ config.voice_id }`, { json: body, query: { output_format: format } } );
		return { buf: Buffer.from( await r.arrayBuffer() ), requestId: r.headers.get( 'request-id' ), cost: Number( r.headers.get( 'character-cost' ) ) || null, format };
	} catch ( error ) {
		// A plan without the higher bitrate: fall back to the 128 kbps the web UI gives.
		if ( format !== 'mp3_44100_128' && [ 400, 401, 403, 422 ].includes( error.status ) && /format|tier|subscription/i.test( error.body || '' ) ) {
			format = 'mp3_44100_128';
			return tts( text, seed, ctx );
		}
		throw error;
	}
}

let keyterms = true;

/**
 * Speech to text with word timings, for the word check.
 *
 * @param {string} file Audio file.
 * @return {Promise<object>} Transcript.
 */
export async function stt( file ) {
	const form = new FormData();
	form.append( 'model_id', config.stt_model_id );
	form.append( 'language_code', 'en' );
	form.append( 'tag_audio_events', 'true' );
	form.append( 'timestamps_granularity', 'word' );
	if ( keyterms ) {
		for ( const k of config.keyterms || [] ) {
			form.append( 'keyterms', k );
		}
	}
	form.append( 'file', new Blob( [ fs.readFileSync( file ) ], { type: 'audio/mpeg' } ), path.basename( file ) );
	try {
		return await ( await api( 'POST', '/v1/speech-to-text', { form } ) ).json();
	} catch ( error ) {
		if ( keyterms && error.status === 422 && /keyterm/i.test( error.body || '' ) ) {
			keyterms = false;
			return stt( file );
		}
		throw error;
	}
}

// ── The word check ──────────────────────────────────────────────────────────────────────────────

const ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split( ' ' );
const TENS = ' ten twenty thirty forty fifty sixty seventy eighty ninety'.split( ' ' );
const say = ( n ) => {
	if ( n < 20 ) {
		return ONES[ n ];
	}
	if ( n < 100 ) {
		return TENS[ Math.floor( n / 10 ) ] + ( n % 10 ? ` ${ ONES[ n % 10 ] }` : '' );
	}
	return `${ ONES[ Math.floor( n / 100 ) ] } hundred${ n % 100 ? ` ${ say( n % 100 ) }` : '' }`;
};

/**
 * Words as the check compares them: lower case, tags dropped, numbers under 1,000 spelled out,
 * letter-by-letter names joined ("w p admin" → "wpadmin").
 *
 * @param {string} s Text.
 * @return {string[]} Words.
 */
export function spokenWords( s ) {
	const w = String( s ).replace( /\[[^\]]*\]/g, ' ' ).toLowerCase().replace( /[’']/g, '' ).replace( /(\d+)\s*%/g, '$1 percent' )
		.replace( /[^a-z0-9]+/g, ' ' ).trim().split( ' ' ).filter( Boolean )
		.flatMap( ( x ) => ( /^\d+$/.test( x ) && Number( x ) < 1000 ? say( Number( x ) ).split( ' ' ) : [ x ] ) );
	const out = [];
	for ( let i = 0; i < w.length; i++ ) {
		let j = i;
		while ( j < w.length && w[ j ].length === 1 ) {
			j++;
		}
		if ( j - i >= 2 ) {
			out.push( w.slice( i, j ).join( '' ) );
			i = j - 1;
		} else {
			out.push( w[ i ] );
		}
	}
	return out;
}

function lev( a, b ) {
	const d = Array.from( { length: a.length + 1 }, ( _, i ) => [ i ] );
	for ( let j = 1; j <= b.length; j++ ) {
		d[ 0 ][ j ] = j;
	}
	for ( let i = 1; i <= a.length; i++ ) {
		for ( let j = 1; j <= b.length; j++ ) {
			d[ i ][ j ] = Math.min( d[ i - 1 ][ j ] + 1, d[ i ][ j - 1 ] + 1, d[ i - 1 ][ j - 1 ] + ( a[ i - 1 ] === b[ j - 1 ] ? 0 : 1 ) );
		}
	}
	return d[ a.length ][ b.length ];
}

const same = ( a, b ) => a === b || ( Math.min( a.length, b.length ) >= 4 && 1 - lev( a, b ) / Math.max( a.length, b.length ) >= 0.75 );

/**
 * Word accuracy of a transcript against the script, and the differences. A word joined or split
 * by the transcriber ("set up" / "setup") costs nothing.
 *
 * @param {string} refText The approved words.
 * @param {string} hypText The transcript.
 * @return {{accuracy: number, diff: string[]}} Result.
 */
export function compare( refText, hypText ) {
	const R = spokenWords( refText );
	const H = spokenWords( hypText );
	const D = Array.from( { length: R.length + 1 }, () => new Array( H.length + 1 ).fill( Infinity ) );
	const B = Array.from( { length: R.length + 1 }, () => new Array( H.length + 1 ).fill( null ) );
	D[ 0 ][ 0 ] = 0;
	for ( let i = 0; i <= R.length; i++ ) {
		for ( let j = 0; j <= H.length; j++ ) {
			const v = D[ i ][ j ];
			if ( v === Infinity ) {
				continue;
			}
			const go = ( ii, jj, cost, op ) => {
				if ( ii <= R.length && jj <= H.length && v + cost < D[ ii ][ jj ] ) {
					D[ ii ][ jj ] = v + cost;
					B[ ii ][ jj ] = [ i, j, op ];
				}
			};
			if ( i < R.length && j < H.length ) {
				go( i + 1, j + 1, same( R[ i ], H[ j ] ) ? 0 : 1, 'sub' );
			}
			if ( i < R.length ) {
				go( i + 1, j, 1, 'missing' );
			}
			if ( j < H.length ) {
				go( i, j + 1, 1, 'extra' );
			}
			if ( i < R.length && j + 1 < H.length && same( R[ i ], H[ j ] + H[ j + 1 ] ) ) {
				go( i + 1, j + 2, 0, 'join' );
			}
			if ( i + 1 < R.length && j < H.length && same( R[ i ] + R[ i + 1 ], H[ j ] ) ) {
				go( i + 2, j + 1, 0, 'join' );
			}
		}
	}
	const diff = [];
	for ( let i = R.length, j = H.length; i || j; ) {
		const [ pi, pj, op ] = B[ i ][ j ];
		if ( op === 'sub' && ! same( R[ pi ], H[ pj ] ) ) {
			diff.unshift( `"${ R[ pi ] }" → "${ H[ pj ] }"` );
		}
		if ( op === 'missing' ) {
			diff.unshift( `missing "${ R[ pi ] }"` );
		}
		if ( op === 'extra' ) {
			diff.unshift( `extra "${ H[ pj ] }"` );
		}
		i = pi;
		j = pj;
	}
	return { accuracy: r3( Math.max( 0, 1 - D[ R.length ][ H.length ] / Math.max( 1, R.length ) ) ), diff };
}

/**
 * Judge a take: every word there, nothing added, the last word not clipped, no stray sounds.
 *
 * @param {object} transcript Speech-to-text result.
 * @param {number} seconds    Length of the take.
 * @param {string} refText    The approved words.
 * @return {{accuracy: number, diff: string[], flags: string[], words: Array}} Verdict.
 */
export function judge( transcript, seconds, refText ) {
	const all = transcript.words || [];
	const spoken = all.filter( ( x ) => x.type === 'word' );
	const { accuracy, diff } = compare( refText, spoken.map( ( x ) => x.text ).join( ' ' ) );
	const flags = [];
	if ( accuracy < config.min_accuracy ) {
		flags.push( `words ${ Math.round( accuracy * 1000 ) / 10 } %: ${ diff.join( ', ' ) }` );
	}
	const last = spoken[ spoken.length - 1 ];
	if ( last && seconds - last.end < 0.03 ) {
		flags.push( 'last word may be clipped' );
	}
	const events = all.filter( ( x ) => x.type === 'audio_event' ).map( ( x ) => x.text );
	if ( events.length ) {
		flags.push( `sound: ${ events.join( ' ' ) }` );
	}
	return { accuracy, diff, flags, words: spoken.map( ( x ) => [ x.text, r3( x.start ), r3( x.end ) ] ) };
}

/** A take fails the check when a word is wrong or the ending is clipped; tone is judged at Approval 2. */
export const failed = ( take ) => take.accuracy < config.min_accuracy || take.flags.includes( 'last word may be clipped' );

/** Deterministic seed for a take, so any take can be made again. */
export function seedOf( s ) {
	let h = 0x811c9dc5;
	for ( const ch of s ) {
		h ^= ch.codePointAt( 0 );
		h = Math.imul( h, 0x01000193 ) >>> 0;
	}
	return h;
}
