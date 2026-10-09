#!/usr/bin/env node
/**
 * The self-check (video guideline §8) for one demo, written into post/check.md.
 *
 *   node tools/video/check.mjs <id> --words   the words of all three posts, before anything is voiced
 *   node tools/video/check.mjs <id>           everything: the delivery, the clips and every rendered file
 *
 * Exit code 0 only when nothing failed and nothing is left to look at.
 */

import { resolveDemo } from './lib/paths.mjs';
import { runCheck } from './lib/checks.mjs';

try {
	const args = process.argv.slice( 2 );
	const words = args.includes( '--words' );
	const demo = resolveDemo( args.find( ( a ) => ! a.startsWith( '--' ) ) );
	console.log( `Self-check ${ demo.id }${ words ? ' · words only' : '' }` );
	process.exitCode = ( await runCheck( demo, { words } ) ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
