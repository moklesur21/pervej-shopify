/**
 * Approval 1 gate (guideline §8): nothing renders before the words are approved, and any later change
 * to the words goes back to Approval 1. Proof comes from git: the commit that added the
 * "Approved 1 — <Day HH:MM> · Yeasir" line to post/check.md, and script.md / copy.md unchanged since.
 */

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { readText } from './paths.mjs';

const LINE = /^\s*(?:[-*]\s*)?Approved 1\b.*$/m;

function git( cwd, args ) {
	const r = spawnSync( 'git', args, { cwd, encoding: 'utf8', windowsHide: true } );
	return { ok: r.status === 0, status: r.status, out: ( r.stdout || '' ).trim(), err: ( r.stderr || '' ).trim() };
}

/**
 * Is the script approved, and unchanged since?
 *
 * @param {object} demo Demo paths.
 * @return {{ok: boolean, reason?: string, commit?: string, line?: string}} Result.
 */
export function approval( demo ) {
	const check = readText( path.join( demo.post, 'check.md' ) ) || '';
	const line = LINE.exec( check );
	if ( ! line ) {
		return { ok: false, reason: 'post/check.md has no "Approved 1" line. Approval 1 (the words) comes before any render (§8).' };
	}
	if ( ! git( demo.dir, [ 'rev-parse', '--show-toplevel' ] ).ok ) {
		return { ok: false, reason: 'The demo folder is not in a git repository, so the approval cannot be proven.' };
	}
	const log = git( demo.dir, [ 'log', '-1', '--format=%H', '-G', 'Approved 1', '--', 'post/check.md' ] );
	if ( ! log.ok || ! log.out ) {
		return { ok: false, reason: 'The "Approved 1" line is not committed yet. Commit post/ with it (procedure Stage 5a), then render.' };
	}
	const commit = log.out;
	for ( const file of [ 'post/script.md', 'post/copy.md' ] ) {
		if ( ! git( demo.dir, [ 'cat-file', '-e', `${ commit }:./${ file }` ] ).ok ) {
			return { ok: false, reason: `${ file } was not in the repository when Approval 1 was committed (${ commit.slice( 0, 7 ) }).` };
		}
	}
	const diff = git( demo.dir, [ 'diff', '--quiet', commit, '--', 'post/script.md', 'post/copy.md' ] );
	if ( diff.status === 1 ) {
		return { ok: false, reason: `post/script.md or post/copy.md changed after Approval 1 (${ commit.slice( 0, 7 ) }). Any change to the words goes back to Approval 1.` };
	}
	if ( ! diff.ok ) {
		return { ok: false, reason: `git diff failed: ${ diff.err }` };
	}
	return { ok: true, commit: commit.slice( 0, 7 ), line: line[ 0 ].trim() };
}
