#!/usr/bin/env node
/**
 * The self-check (video guideline §8) for one demo, written into post/check.md.
 *
 *   node tools/video/check.mjs <id>
 *
 * Before the render it checks the words; after it, the cut as well. Exit code 0 only when every row passed.
 */

import { resolveDemo } from './lib/paths.mjs';
import { runCheck } from './lib/checks.mjs';

try {
	const demo = resolveDemo( process.argv[ 2 ] );
	console.log( `Self-check ${ demo.id }` );
	process.exitCode = ( await runCheck( demo ) ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
