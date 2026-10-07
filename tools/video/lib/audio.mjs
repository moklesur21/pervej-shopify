/**
 * The sound of the video (guideline §6 "Sound", §10): measuring loudness, the one loudness chain over
 * the voice, and the final mix — the voice, one music bed ducked under it, a soft click on every
 * recorded click and quiet typing under every typed stretch — normalised to the delivery level.
 * Levels come from tools/video/audio/audio.json; the voice chain from tools/video/voice.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { TOOL_DIR } from './paths.mjs';
import { locate, run, probe } from './ffmpeg.mjs';

export const AUDIO_DIR = path.join( TOOL_DIR, 'audio' );

/** The audio library record and mix levels, tools/video/audio/audio.json. */
export const library = JSON.parse( fs.readFileSync( path.join( AUDIO_DIR, 'audio.json' ), 'utf8' ) );

const r2 = ( n ) => Math.round( n * 100 ) / 100;
const r3 = ( n ) => Math.round( n * 1000 ) / 1000;

function bin() {
	const ffmpeg = locate( 'ffmpeg' );
	if ( ! ffmpeg ) {
		throw new Error( 'ffmpeg not found. Install it (tools/video/README.md) or set FFMPEG_PATH.' );
	}
	return ffmpeg;
}

/** Absolute path of a library file, e.g. 'sfx/click-01.wav'. */
export const libraryFile = ( rel ) => path.join( AUDIO_DIR, ...rel.split( '/' ) );

/**
 * Integrated loudness (LUFS), loudness range (LU) and true peak (dBTP) of a file's audio.
 *
 * @param {string} file Media file.
 * @return {Promise<{I: number, LRA: number, TP: number}>} Measurement.
 */
export async function loudness( file ) {
	const { stderr } = await run( bin(), [ '-hide_banner', '-nostats', '-i', file, '-map', '0:a:0', '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-' ] );
	const s = stderr.split( 'Summary:' ).pop();
	const num = ( re ) => {
		const m = s.match( re );
		return m ? Number( m[ 1 ] ) : NaN;
	};
	return { I: num( /I:\s+(-?[\d.]+|-inf) LUFS/ ), LRA: num( /LRA:\s+(-?[\d.]+) LU/ ), TP: num( /Peak:\s+(-?[\d.]+|-inf) dBFS/ ) };
}

/**
 * One loudness chain over every scene's voice, joined in script order, split back at the same
 * samples — so the whole voice sits at one level, as if read in one sitting.
 *
 * @param {Array<{id: string, src: string}>} parts      Picked takes in order.
 * @param {object}                           chain      voice.json "processing".
 * @param {string}                           outDir     Where the WAVs go.
 * @param {Function}                         name       id → output file name.
 * @return {Promise<{I: number, TP: number, gain: number, files: object}>} Result.
 */
export async function processVoice( parts, chain, outDir, name ) {
	const ffmpeg = bin();
	const tmp = fs.mkdtempSync( path.join( outDir, '.chain-' ) );
	try {
		const wavs = [];
		for ( const p of parts ) {
			const w = path.join( tmp, `${ p.id }.wav` );
			await run( ffmpeg, [ '-y', '-loglevel', 'error', '-i', p.src, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', w ] );
			const stream = ( await probe( w ) ).streams.find( ( s ) => s.codec_type === 'audio' );
			wavs.push( { ...p, w, samples: Number( stream.duration_ts ) } );
		}
		const joined = path.join( tmp, 'joined.wav' );
		let gain = chain.gain_db;
		let L;
		for ( let i = 0; i < 5; i++ ) {
			const graph = `${ wavs.map( ( _, k ) => `[${ k }:a]` ).join( '' ) }concat=n=${ wavs.length }:v=0:a=1,${ chain.pre },volume=${ gain }dB,${ chain.post }`;
			await run( ffmpeg, [ '-y', '-loglevel', 'error', ...wavs.flatMap( ( p ) => [ '-i', p.w ] ), '-filter_complex', graph, '-ar', '48000', '-c:a', 'pcm_s16le', joined ] );
			L = await loudness( joined );
			if ( Math.abs( L.I - chain.target_lufs ) <= chain.tolerance_lu ) {
				break;
			}
			gain = r2( gain + chain.target_lufs - L.I );
		}
		const files = {};
		let at = 0;
		for ( const p of wavs ) {
			const file = path.join( outDir, name( p.id ) );
			await run( ffmpeg, [ '-y', '-loglevel', 'error', '-i', joined, '-af', `atrim=start_sample=${ at }:end_sample=${ at + p.samples },asetpts=PTS-STARTPTS`, '-c:a', 'pcm_s16le', file ] );
			files[ p.id ] = { file: path.basename( file ), seconds: r3( p.samples / 48000 ) };
			at += p.samples;
		}
		return { I: L.I, TP: L.TP, gain, chain: `${ chain.pre },volume=${ gain }dB,${ chain.post }`, files };
	} finally {
		fs.rmSync( tmp, { recursive: true, force: true } );
	}
}

/**
 * The finished soundtrack: voice, music bed ducked under it, clicks and typing, as a 48 kHz stereo
 * WAV at the delivery loudness (two-pass loudnorm, linear, so the mix is only turned up or down).
 *
 * @param {object} o         Options.
 * @param {number} o.total   Length of the video, seconds.
 * @param {Array}  o.voice   [{ file, at }] — processed voice WAVs and where each starts.
 * @param {Array}  o.clicks  [ at, … ] — seconds.
 * @param {Array}  o.typing  [{ at, len }] — seconds.
 * @param {string} o.out     WAV to write.
 * @param {string} o.workDir Scratch folder.
 * @return {Promise<{I: number, TP: number, clicks: number, typing: number}>} Measured result.
 */
export async function mixSoundtrack( { total, voice, clicks = [], typing = [], out, workDir } ) {
	const ffmpeg = bin();
	const mix = library.mix;
	const T = r3( total );
	const inputs = [];
	const graph = [];
	const input = ( file, loop = false ) => {
		inputs.push( ...( loop ? [ '-stream_loop', '-1' ] : [] ), '-i', file );
		return inputs.filter( ( a ) => a === '-i' ).length - 1;
	};

	// The voice bus (mono): each scene's voice at its start.
	const vLabels = voice.map( ( v, i ) => {
		const idx = input( v.file );
		graph.push( `[${ idx }:a]aresample=48000,aformat=channel_layouts=mono,adelay=${ Math.round( v.at * 1000 ) }:all=1[v${ i }]` );
		return `[v${ i }]`;
	} );
	graph.push( `${ vLabels.join( '' ) }amix=inputs=${ vLabels.length }:normalize=0,apad,atrim=duration=${ T },asplit=2[vbus][vkey0]` );
	graph.push( '[vkey0]pan=stereo|c0=c0|c1=c0[vkey]' );

	// Clicks (the three files used in turn) and typing, mono, at their own levels.
	const fx = [];
	const usable = clicks.filter( ( at ) => at >= 0 && at < T - 0.05 );
	library.assets.clicks.forEach( ( c, k ) => {
		const times = usable.filter( ( _, n ) => n % library.assets.clicks.length === k );
		if ( ! times.length ) {
			return;
		}
		const idx = input( libraryFile( c.file ) );
		const gain = mix.click_peak_db - c.peak_db;
		const outs = times.map( ( _, n ) => `[c${ k }_${ n }]` );
		graph.push( `[${ idx }:a]aresample=48000,aformat=channel_layouts=mono,volume=${ r2( gain ) }dB,asplit=${ times.length }${ outs.join( '' ) }` );
		times.forEach( ( at, n ) => {
			graph.push( `${ outs[ n ] }adelay=${ Math.round( at * 1000 ) }:all=1[ck${ k }_${ n }]` );
			fx.push( `[ck${ k }_${ n }]` );
		} );
	} );
	const stretches = typing.filter( ( t ) => t.len > 0.15 && t.at >= 0 && t.at < T - 0.05 ).map( ( t ) => ( { at: t.at, len: Math.min( t.len, T - t.at ) } ) );
	if ( stretches.length ) {
		const ty = library.assets.typing;
		const idx = input( libraryFile( ty.file ), true );
		const outs = stretches.map( ( _, n ) => `[ty${ n }]` );
		graph.push( `[${ idx }:a]aresample=48000,aformat=channel_layouts=mono,volume=${ r2( mix.typing_lufs - ty.lufs ) }dB,asplit=${ stretches.length }${ outs.join( '' ) }` );
		stretches.forEach( ( t, n ) => {
			graph.push( `${ outs[ n ] }atrim=0:${ r3( t.len ) },asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=${ r3( Math.max( 0, t.len - 0.08 ) ) }:d=0.08,adelay=${ Math.round( t.at * 1000 ) }:all=1[tp${ n }]` );
			fx.push( `[tp${ n }]` );
		} );
	}
	const front = [ '[vbus]', ...fx ];
	graph.push( `${ front.join( '' ) }amix=inputs=${ front.length }:normalize=0,apad,atrim=duration=${ T },pan=stereo|c0=0.7071*c0|c1=0.7071*c0[front]` );

	// The music bed: one track under the whole video, faded in and out, ducked by the voice.
	const music = library.assets.music;
	const m = input( libraryFile( music.file ), true );
	graph.push( `[${ m }:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${ T },asetpts=PTS-STARTPTS,volume=${ r2( mix.music_lufs - music.lufs ) }dB,afade=t=in:d=${ mix.music_fade_in },afade=t=out:st=${ r3( Math.max( 0, T - mix.music_fade_out ) ) }:d=${ mix.music_fade_out }[bed]` );
	graph.push( `[bed][vkey]${ mix.duck }[ducked]` );
	graph.push( '[front][ducked]amix=inputs=2:normalize=0:duration=first[mix]' );

	const raw = path.join( workDir, 'soundtrack-raw.wav' );
	// Kept beside the render for reading when a mix sounds wrong; ffmpeg gets the same graph inline.
	fs.writeFileSync( path.join( workDir, 'soundtrack.filter.txt' ), graph.join( ';\n' ) + '\n' );
	await run( ffmpeg, [ '-y', '-loglevel', 'error', ...inputs, '-filter_complex', graph.join( ';' ), '-map', '[mix]', '-t', String( T ), '-ar', '48000', '-c:a', 'pcm_s16le', raw ] );

	// Two-pass loudnorm to the delivery level; linear, so it is one gain change, not a compressor.
	const target = `I=${ mix.final_lufs }:TP=${ mix.final_tp }:LRA=11`;
	const { stderr } = await run( ffmpeg, [ '-hide_banner', '-nostats', '-i', raw, '-af', `loudnorm=${ target }:print_format=json`, '-f', 'null', '-' ] );
	const measured = JSON.parse( stderr.slice( stderr.lastIndexOf( '{' ), stderr.lastIndexOf( '}' ) + 1 ) );
	await run( ffmpeg, [
		'-y', '-loglevel', 'error', '-i', raw,
		'-af', `loudnorm=${ target }:measured_I=${ measured.input_i }:measured_TP=${ measured.input_tp }:measured_LRA=${ measured.input_lra }:measured_thresh=${ measured.input_thresh }:offset=${ measured.target_offset }:linear=true,aresample=48000`,
		'-t', String( T ), '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', out,
	] );
	fs.rmSync( raw, { force: true } );
	const L = await loudness( out );
	return { I: L.I, TP: L.TP, clicks: usable.length, typing: stretches.length };
}
