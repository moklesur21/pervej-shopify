#!/usr/bin/env node
/**
 * Confirms everything the video toolkit needs is installed and works on this machine.
 *
 *   npm --prefix tools/video run doctor
 *
 * Exit code 0 when every required line passes. The store lines are warnings only: rendering
 * does not need the store, capturing does.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { TOOL_DIR } from './lib/paths.mjs';
import { locate, run, ffmpeg, probe, x264 } from './lib/ffmpeg.mjs';
import { storeUrl, storefrontPassword } from './lib/env.mjs';
import { enterPassword } from './lib/storefront.mjs';
import { FONT } from './lib/layout.mjs';
import { AUDIO_DIR, library, libraryFile } from './lib/audio.mjs';
import { keySource, keyHelp } from './lib/elevenlabs.mjs';

const require = createRequire( import.meta.url );
let failed = 0;

function line( status, text ) {
	if ( status === 'FAIL' ) {
		failed++;
	}
	console.log( `[${ status.padEnd( 4 ) }] ${ text }` );
}

function atLeast( version, min ) {
	const a = version.split( '.' ).map( Number );
	const b = min.split( '.' ).map( Number );
	for ( let i = 0; i < b.length; i++ ) {
		if ( ( a[ i ] || 0 ) !== b[ i ] ) {
			return ( a[ i ] || 0 ) > b[ i ];
		}
	}
	return true;
}

async function check( label, fn ) {
	try {
		const result = await fn();
		line( 'ok', `${ label }${ result ? ` — ${ result }` : '' }` );
		return true;
	} catch ( error ) {
		line( 'FAIL', `${ label } — ${ error.message.split( '\n' )[ 0 ] }` );
		return false;
	}
}

console.log( 'Video toolkit doctor\n' );

const pkg = JSON.parse( fs.readFileSync( path.join( TOOL_DIR, 'package.json' ), 'utf8' ) );

await check( 'Node', async () => {
	const min = pkg.engines.node.replace( /[^\d.]/g, '' );
	if ( ! atLeast( process.versions.node, min ) ) {
		throw new Error( `${ process.versions.node } is too old; needs ${ min }+` );
	}
	return `${ process.versions.node } (needs ${ min }+)`;
} );

const depsOk = await check( 'npm packages', async () => {
	const out = [];
	for ( const [ name, want ] of Object.entries( pkg.dependencies ) ) {
		let have;
		try {
			have = JSON.parse( fs.readFileSync( require.resolve( `${ name }/package.json` ), 'utf8' ) ).version;
		} catch {
			throw new Error( `${ name } missing — run: npm --prefix tools/video run setup` );
		}
		if ( have !== want ) {
			throw new Error( `${ name } ${ have } installed, ${ want } pinned — run: npm --prefix tools/video ci` );
		}
		out.push( `${ name } ${ have }` );
	}
	return out.join( ', ' );
} );

for ( const name of [ 'ffmpeg', 'ffprobe' ] ) {
	await check( name, async () => {
		const bin = locate( name );
		if ( ! bin ) {
			throw new Error( 'not found — install it (README), open a new terminal, or set ' + `${ name.toUpperCase() }_PATH` );
		}
		const { stdout } = await run( bin, [ '-hide_banner', '-version' ] );
		const version = ( stdout.toString().match( /version\s+n?(\d+(?:\.\d+)*)/ ) || [] )[ 1 ] || '?';
		if ( version !== '?' && ! atLeast( version, '6' ) ) {
			throw new Error( `${ version } is too old; needs 6+` );
		}
		if ( name === 'ffmpeg' ) {
			const { stdout: enc } = await run( bin, [ '-hide_banner', '-encoders' ] );
			for ( const codec of [ 'libx264', 'aac' ] ) {
				if ( ! new RegExp( `\\s${ codec }\\s` ).test( enc.toString() ) ) {
					throw new Error( `${ version } has no ${ codec } encoder — install a build with it` );
				}
			}
			return `${ version }, libx264 and aac (${ bin })`;
		}
		return `${ version } (${ bin })`;
	} );
}

if ( depsOk ) {
	const { chromium } = await import( 'playwright' );
	let browser;
	await check( 'Chromium (Playwright)', async () => {
		try {
			browser = await chromium.launch();
		} catch ( error ) {
			throw new Error( `does not launch — run: npm --prefix tools/video run setup (${ error.message.split( '\n' )[ 0 ] })` );
		}
		const context = await browser.newContext( { viewport: { width: 400, height: 300 }, deviceScaleFactor: 2 } );
		const page = await context.newPage();
		await page.setContent( '<p style="font-size:16px">Sharp</p>' );
		const png = await page.screenshot( { clip: { x: 0, y: 0, width: 100, height: 50 } } );
		const size = `${ png.readUInt32BE( 16 ) }×${ png.readUInt32BE( 20 ) }`;
		await context.close();
		if ( size !== '200×100' ) {
			throw new Error( `a 100×50 clip at 2× came out ${ size }, not 200×100` );
		}
		return `${ browser.version() }, 2× screenshots at full size`;
	} );
	if ( browser ) {
		await check( `Bundled font (${ FONT })`, async () => {
			const page = await browser.newPage();
			await page.goto( pathToFileURL( path.join( TOOL_DIR, 'slides', 'frame.html' ) ).href );
			const loaded = await page.evaluate( async ( family ) => {
				const faces = [];
				for ( const weight of [ 400, 600 ] ) {
					faces.push( ( await document.fonts.load( `${ weight } 30px "${ family }"` ) ).length );
				}
				return faces;
			}, FONT );
			await page.close();
			if ( loaded.some( ( n ) => n < 1 ) ) {
				throw new Error( 'did not load from tools/video/slides/fonts/' );
			}
			return 'regular and semibold load from slides/fonts/';
		} );
		await browser.close();
	}
	await check( 'Lighthouse', async () => {
		await import( 'lighthouse' );
		return 'imports';
	} );
}

if ( locate( 'ffmpeg' ) && locate( 'ffprobe' ) ) {
	await check( 'Encode test (1 s, 1080 × 1080, H.264 + AAC)', async () => {
		const out = path.join( os.tmpdir(), `pervej-video-doctor-${ process.pid }.mp4` );
		try {
			await ffmpeg( [
				'-f', 'lavfi', '-i', 'color=c=0x0F172A:s=1080x1080:r=30:d=1',
				'-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
				'-map', '0:v', '-map', '1:a', ...x264( 16 ), '-c:a', 'aac', '-shortest', out,
			] );
			const info = await probe( out );
			const v = info.streams.find( ( s ) => s.codec_type === 'video' );
			const a = info.streams.find( ( s ) => s.codec_type === 'audio' );
			if ( ! v || v.codec_name !== 'h264' || v.width !== 1080 || v.height !== 1080 || v.r_frame_rate !== '30/1' || ! a || a.codec_name !== 'aac' ) {
				throw new Error( 'the test file is not 1080 × 1080 H.264 30 fps with AAC' );
			}
			return 'probes as 1080 × 1080, h264, 30 fps, aac';
		} finally {
			fs.rmSync( out, { force: true } );
		}
	} );
}

if ( locate( 'ffmpeg' ) ) {
	await check( 'ffmpeg audio filters (voice chain, mix, loudness)', async () => {
		const { stdout } = await run( locate( 'ffmpeg' ), [ '-hide_banner', '-filters' ] );
		const have = stdout.toString();
		const needed = [ 'agate', 'acompressor', 'alimiter', 'loudnorm', 'ebur128', 'sidechaincompress', 'amix', 'adelay', 'afade', 'asplit', 'atrim', 'apad', 'pan', 'concat' ];
		const missing = needed.filter( ( f ) => ! new RegExp( `\\s${ f }\\s` ).test( have ) );
		if ( missing.length ) {
			throw new Error( `this ffmpeg has no ${ missing.join( ', ' ) } — install a full build (README)` );
		}
		return `${ needed.length } filters present`;
	} );
}

await check( 'Audio library (music bed, clicks, typing)', async () => {
	const files = [ library.assets.music.file, ...library.assets.clicks.map( ( c ) => c.file ), library.assets.typing.file ];
	const missing = files.filter( ( f ) => ! fs.existsSync( libraryFile( f ) ) );
	if ( missing.length ) {
		throw new Error( `missing in ${ path.relative( TOOL_DIR, AUDIO_DIR ) }/: ${ missing.join( ', ' ) } — git checkout tools/video/audio` );
	}
	return `${ files.length } files in tools/video/audio/`;
} );

// The voice needs the key; capture, render and check do not. Its value is never read here.
{
	const source = keySource();
	line( source ? 'ok' : 'warn', source
		? `ElevenLabs key — found in the ${ source } (not shown); the voice can be made on this machine`
		: `ElevenLabs key — not on this machine; needed for voice.mjs only. ${ keyHelp() }` );
}

let store = null;
try {
	store = storeUrl();
} catch ( error ) {
	line( 'warn', `Store — ${ error.message } (needed for capture only)` );
}
if ( store ) {
	try {
		const response = await fetch( store + '/', { signal: AbortSignal.timeout( 8000 ) } );
		line( response.ok ? 'ok' : 'warn', `Store ${ store } — HTTP ${ response.status }${ response.ok ? '' : ' (needed for capture only)' }` );
	} catch ( error ) {
		line( 'warn', `Store ${ store } — not reachable (${ error.cause?.code || error.name }); needed for capture only` );
	}
	const password = storefrontPassword();
	if ( ! password ) {
		line( 'warn', 'Storefront password — SHOPIFY_STOREFRONT_PASSWORD not set; a password-protected dev store needs it for capture' );
	} else if ( depsOk ) {
		// The real thing, the way capture does it: a fresh browser gets past the password page.
		const { chromium } = await import( 'playwright' );
		let browser;
		try {
			browser = await chromium.launch();
			const page = await ( await browser.newContext() ).newPage();
			const passed = await enterPassword( page, store, password, null );
			line( 'ok', `Storefront password — ${ passed ? 'accepted; a fresh browser gets past the password page' : 'no password page shown' }` );
		} catch ( error ) {
			line( 'warn', `Storefront password — ${ error.message.split( '\n' )[ 0 ] }` );
		} finally {
			await browser?.close();
		}
	}
}

console.log( failed ? `\n${ failed } check(s) failed. See tools/video/README.md.` : '\nAll set.' );
process.exitCode = failed ? 1 : 0;
