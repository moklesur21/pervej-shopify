/**
 * ffmpeg and ffprobe: finding them, running them, and the one set of encoder settings every clip and segment shares.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { FPS } from './layout.mjs';

/**
 * RGB in, BT.709 limited-range 4:2:0 out, tagged as such (matrix, primaries, transfer) — so navy
 * and teal play back as the palette, not shifted.
 */
export const TO_YUV = 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv';

/** Decode a BT.709 clip into planar RGB for compositing. */
export const FROM_YUV = 'in_color_matrix=bt709:in_range=tv';

/**
 * H.264 settings shared by raw clips and render segments (colour tags come from TO_YUV). Identical
 * settings let the segments be joined without a second encode.
 *
 * @param {number} crf Quality (lower is better).
 * @return {string[]} Arguments.
 */
export function x264( crf ) {
	return [
		'-c:v', 'libx264',
		'-preset', 'slow',
		'-crf', String( crf ),
		'-pix_fmt', 'yuv420p',
		'-profile:v', 'high',
		'-r', String( FPS ),
		'-g', String( FPS * 2 ),
		'-video_track_timescale', '15360',
	];
}

const found = {};

/**
 * Locate a binary: FFMPEG_PATH / FFPROBE_PATH, then PATH, then (Windows) winget's install folders,
 * which a terminal opened before the install does not have on PATH yet.
 *
 * @param {'ffmpeg'|'ffprobe'} name Binary.
 * @return {string|null} Command or full path.
 */
export function locate( name ) {
	if ( name in found ) {
		return found[ name ];
	}
	const candidates = [];
	const fromEnv = process.env[ `${ name.toUpperCase() }_PATH` ];
	if ( fromEnv ) {
		candidates.push( fromEnv );
	}
	candidates.push( name );
	if ( process.platform === 'win32' && process.env.LOCALAPPDATA ) {
		const winget = path.join( process.env.LOCALAPPDATA, 'Microsoft', 'WinGet' );
		candidates.push( path.join( winget, 'Links', `${ name }.exe` ) );
		const packages = path.join( winget, 'Packages' );
		try {
			for ( const pkg of fs.readdirSync( packages ).filter( ( d ) => /^Gyan\.FFmpeg/i.test( d ) ) ) {
				for ( const build of fs.readdirSync( path.join( packages, pkg ) ) ) {
					candidates.push( path.join( packages, pkg, build, 'bin', `${ name }.exe` ) );
				}
			}
		} catch {
			// No winget packages folder: nothing more to try.
		}
	}
	found[ name ] = candidates.find( ( c ) => spawnSync( c, [ '-version' ], { windowsHide: true } ).status === 0 ) || null;
	return found[ name ];
}

/**
 * Run a binary; resolve with stdout (Buffer) and stderr (string), reject with the stderr tail.
 *
 * @param {string}   bin  Command.
 * @param {string[]} args Arguments.
 * @param {object}   opts { cwd }.
 * @return {Promise<{stdout: Buffer, stderr: string}>} Output.
 */
export function run( bin, args, opts = {} ) {
	return new Promise( ( resolve, reject ) => {
		const child = spawn( bin, args, { cwd: opts.cwd, windowsHide: true } );
		const out = [];
		let err = '';
		child.stdout.on( 'data', ( d ) => out.push( d ) );
		child.stderr.on( 'data', ( d ) => {
			err += d;
		} );
		child.on( 'error', reject );
		child.on( 'close', ( code ) => {
			if ( code === 0 ) {
				resolve( { stdout: Buffer.concat( out ), stderr: err } );
			} else {
				const tail = err.trim().split( /\r?\n/ ).slice( -8 ).join( '\n' );
				reject( new Error( `${ path.basename( bin ) } exited ${ code }:\n${ tail }` ) );
			}
		} );
	} );
}

function need( name ) {
	const bin = locate( name );
	if ( ! bin ) {
		throw new Error( `${ name } not found. Install it (tools/video/README.md) or set ${ name.toUpperCase() }_PATH.` );
	}
	return bin;
}

/**
 * Run ffmpeg quietly, overwriting outputs.
 *
 * @param {string[]} args Arguments.
 * @param {object}   opts { cwd }.
 * @return {Promise<{stdout: Buffer, stderr: string}>} Output.
 */
export function ffmpeg( args, opts ) {
	return run( need( 'ffmpeg' ), [ '-hide_banner', '-loglevel', 'error', '-y', ...args ], opts );
}

/**
 * Streams and format of a media file.
 *
 * @param {string} file Path.
 * @return {Promise<object>} ffprobe JSON.
 */
export async function probe( file ) {
	const { stdout } = await run( need( 'ffprobe' ), [ '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', file ] );
	return JSON.parse( stdout.toString() );
}

/**
 * Duration of a media file, seconds.
 *
 * @param {string} file Path.
 * @return {Promise<number>} Seconds.
 */
export async function duration( file ) {
	const info = await probe( file );
	return Number( info.format.duration );
}
