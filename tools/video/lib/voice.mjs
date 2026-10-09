/**
 * The voice as the render and the check see it (guideline §10): one chunk per scene with Spoken
 * words, the takes made for it, and the processed WAVs in media/voice/. Everything is recorded in
 * media/voice/takes.json — seeds, request ids, the word check of every take, the pick, and the
 * loudness chain — so the render can prove it plays the checked words.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readText } from './paths.mjs';
import { config, failed } from './elevenlabs.mjs';
import { words } from './script.mjs';

/**
 * The chunks a script asks for: a scene with Spoken words is one chunk, s<N>.
 *
 * @param {object} script Parsed script (lib/script.mjs parseScript).
 * @return {Array<{id: string, n: number, text: string, sent: string}>} Chunks; sent = what goes to the API.
 */
export function chunks( script ) {
	return script.scenes.filter( ( s ) => s.spoken ).map( ( s ) => {
		const said = ( script.pronunciation || [] ).reduce( ( t, p ) => t.split( p.term ).join( p.say ), s.spoken );
		return { id: `s${ s.n }`, n: s.n, text: s.spoken, sent: `${ config.tag ? `${ config.tag } ` : '' }${ said }` };
	} );
}

/** Words spoken across the whole video. */
export const spokenWordCount = ( script ) => script.scenes.reduce( ( sum, s ) => sum + words( s.spoken ), 0 );

/** media/voice/takes.json, or an empty state. */
export function loadState( demo ) {
	const text = readText( path.join( demo.voice, 'takes.json' ) );
	return text ? JSON.parse( text ) : { id: demo.id, chunks: {}, processed: null };
}

export function saveState( demo, state ) {
	fs.mkdirSync( demo.voice, { recursive: true } );
	fs.writeFileSync( path.join( demo.voice, 'takes.json' ), JSON.stringify( state, null, '\t' ) + '\n' );
}

/** File name of a scene's processed voice. */
export const voiceFile = ( demo, id ) => `${ demo.id }-voice-${ id }.wav`;

/**
 * The processed voice for the script as it stands: per scene, the WAV and its length — and every
 * reason it cannot be used (made from other words, a failed word check, a missing file).
 *
 * @param {object} demo   Demo paths.
 * @param {object} script Parsed script.
 * @return {{map: Map, problems: string[], made: boolean, flags: string[], chunks: object[], state: object}} Voice.
 */
export function currentVoice( demo, script ) {
	const list = chunks( script );
	const state = loadState( demo );
	const map = new Map();
	const problems = [];
	const flags = [];
	const processed = state.processed?.files || {};
	for ( const ch of list ) {
		const st = state.chunks[ ch.id ];
		const take = st?.picked ? st.takes[ st.picked ] : null;
		const done = processed[ ch.id ];
		if ( ! take || ! done ) {
			problems.push( `scene ${ ch.n }: no voice yet` );
			continue;
		}
		if ( take.sent !== ch.sent || done.sent !== ch.sent ) {
			problems.push( `scene ${ ch.n }: the voice was made from other words — run voice.mjs again` );
			continue;
		}
		if ( done.take !== st.picked ) {
			problems.push( `scene ${ ch.n }: the pick changed after processing — run voice.mjs --process` );
			continue;
		}
		if ( ! fs.existsSync( path.join( demo.voice, done.file ) ) ) {
			problems.push( `scene ${ ch.n }: ${ done.file } is missing — run voice.mjs --process` );
			continue;
		}
		if ( failed( take ) ) {
			problems.push( `scene ${ ch.n }: ${ st.picked } fails the word check (${ take.flags.join( '; ' ) }) — redo it` );
		} else if ( take.flags.length ) {
			flags.push( `scene ${ ch.n }: ${ take.flags.join( '; ' ) }` );
		}
		map.set( ch.n, { file: path.join( demo.voice, done.file ), seconds: done.seconds, take: st.picked, accuracy: take.accuracy } );
	}
	const made = list.some( ( ch ) => state.chunks[ ch.id ]?.picked );
	return { map, problems, made, flags, chunks: list, state };
}
