/**
 * The words gate (guideline §8, §10): nothing is voiced or rendered until the words pass the
 * self-check's words rows, and what is voiced and rendered is what is committed — post/script.md,
 * copy.md, carousel.md and insight.md unchanged on disk since their last commit. The words check is
 * run here, live, so a stale post/check.md can never open the gate.
 */

import { spawnSync } from 'node:child_process';
import { checkWords } from './checks.mjs';

export const POST_FILES = [ 'post/script.md', 'post/copy.md', 'post/carousel.md', 'post/insight.md' ];

function git( cwd, args ) {
	const r = spawnSync( 'git', args, { cwd, encoding: 'utf8', windowsHide: true } );
	return { ok: r.status === 0, status: r.status, out: ( r.stdout || '' ).trim(), err: ( r.stderr || '' ).trim() };
}

/**
 * Have the words passed, and are they committed as they stand?
 *
 * @param {object} demo Demo paths.
 * @return {Promise<{ok: boolean, reason?: string, commit?: string}>} Result; commit is the last one that touched the words.
 */
export async function wordsGate( demo ) {
	const words = await checkWords( demo );
	if ( ! words.ok ) {
		return { ok: false, reason: `the words check has not passed (node tools/video/check.mjs ${ demo.id } --words):\n- ${ words.problems.join( '\n- ' ) }` };
	}
	if ( ! git( demo.dir, [ 'rev-parse', '--show-toplevel' ] ).ok ) {
		return { ok: false, reason: 'The demo folder is not in a git repository, so what is voiced cannot be tied to a commit.' };
	}
	for ( const file of POST_FILES ) {
		if ( ! git( demo.dir, [ 'ls-files', '--error-unmatch', file ] ).ok ) {
			return { ok: false, reason: `${ file } is not committed. Commit the four post files, then voice and render.` };
		}
	}
	const diff = git( demo.dir, [ 'diff', '--quiet', 'HEAD', '--', ...POST_FILES ] );
	if ( diff.status === 1 ) {
		return { ok: false, reason: 'The post files changed since their last commit. Run the words check, commit, then voice and render: what is voiced is what is committed.' };
	}
	if ( ! diff.ok ) {
		return { ok: false, reason: `git diff failed: ${ diff.err }` };
	}
	const log = git( demo.dir, [ 'log', '-1', '--format=%h', '--', ...POST_FILES ] );
	return { ok: true, commit: log.out };
}
