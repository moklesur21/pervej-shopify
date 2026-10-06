#!/usr/bin/env node
/**
 * Runs a demo's capture script (video guideline §4).
 *
 *   node tools/video/capture.mjs <id> before      runs demos/<id>/capture/shoot.mjs on the before theme → media/raw/<id>-before-*
 *   node tools/video/capture.mjs <id> after       the same script, on the after theme → media/raw/<id>-after-*
 *   node tools/video/capture.mjs <id> qa          runs demos/<id>/capture/qa.mjs on the after theme → media/raw/<id>-qa-*
 *
 * The themes are the ones `tools/shopify/theme.sh push <id> before|after` recorded in media/themes.json.
 * Options: --only <name,…> (clips, stills or lighthouse-<page> to run; prefix match) · --theme <label|id|live>
 * (another theme than the phase's) · --script <file> · --headed
 * The script exports `default async function ( cap ) { … }` — see tools/video/README.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { resolveDemo, shown } from './lib/paths.mjs';
import { previewTheme } from './lib/env.mjs';
import { Capture, PHASES } from './lib/capture-kit.mjs';

function args( argv ) {
	const out = { positional: [], only: [], headed: false, script: null, theme: null };
	for ( let i = 0; i < argv.length; i++ ) {
		const a = argv[ i ];
		if ( a === '--only' ) {
			out.only = argv[ ++i ].split( ',' ).map( ( s ) => s.trim() ).filter( Boolean );
		} else if ( a === '--script' ) {
			out.script = argv[ ++i ];
		} else if ( a === '--theme' ) {
			out.theme = argv[ ++i ];
		} else if ( a === '--headed' ) {
			out.headed = true;
		} else {
			out.positional.push( a );
		}
	}
	return out;
}

const opts = args( process.argv.slice( 2 ) );
const [ which, phase ] = opts.positional;

try {
	if ( ! PHASES.includes( phase ) ) {
		throw new Error( `Usage: node tools/video/capture.mjs <id> <${ PHASES.join( '|' ) }> [--only name,…] [--theme label|id|live] [--script file] [--headed]` );
	}
	const demo = resolveDemo( which );
	const script = path.resolve( opts.script || path.join( demo.capture, phase === 'qa' ? 'qa.mjs' : 'shoot.mjs' ) );
	if ( ! fs.existsSync( script ) ) {
		throw new Error( `No capture script at ${ shown( script ) }.` );
	}
	const mod = await import( pathToFileURL( script ).href );
	if ( typeof mod.default !== 'function' ) {
		throw new Error( `${ shown( script ) } must export a default async function ( cap ).` );
	}
	// before → the before theme; after and qa → the after theme (the finished work).
	const theme = previewTheme( demo, opts.theme ?? ( phase === 'before' ? 'before' : 'after' ) );
	console.log( `Capture ${ demo.id } · ${ phase } · ${ theme ? `theme ${ theme.name ? `"${ theme.name }"` : theme.label } (#${ theme.id })` : 'the published theme' } · ${ shown( script ) }` );
	let browser;
	try {
		browser = await chromium.launch( { headless: ! opts.headed } );
	} catch ( error ) {
		if ( opts.headed ) {
			// Setup installs only the headless shell; a visible window needs the full Chromium.
			throw new Error( `--headed needs Playwright's full Chromium, which setup leaves out. Install it once:\n  npm --prefix tools/video exec -- playwright install chromium\n(${ error.message.split( '\n' )[ 0 ] })` );
		}
		throw error;
	}
	const cap = new Capture( { demo, phase, browser, script, only: opts.only, theme } );
	try {
		await mod.default( cap );
	} finally {
		await cap.close();
		await browser.close();
	}
	console.log( `Done: ${ cap.made.length } file(s) in ${ shown( demo.raw ) }/` );
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
