/**
 * Site URL and sign-in details. Passwords come from the environment, never from a script (§4 "Clean"):
 * the process environment first, then `tools/wp/.env.local` (git-ignored, written by baseline.sh).
 */

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT, readText } from './paths.mjs';

const ENV_LOCAL = path.join( 'tools', 'wp', '.env.local' );

/**
 * `tools/wp/.env.local` of this checkout, or — in a git worktree, which has no copy of the
 * git-ignored file — of the main checkout.
 *
 * @return {string|null} File contents.
 */
function envLocal() {
	const here = readText( path.join( REPO_ROOT, ENV_LOCAL ) );
	if ( here !== null ) {
		return here;
	}
	const common = spawnSync( 'git', [ '-C', REPO_ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir' ], { encoding: 'utf8', windowsHide: true } );
	return common.status === 0 ? readText( path.join( path.dirname( common.stdout.trim() ), ENV_LOCAL ) ) : null;
}

/**
 * Parse KEY=VALUE lines; quotes stripped, comments and blanks skipped.
 *
 * @param {string|null} text File contents.
 * @return {object} Values by key.
 */
function parseEnv( text ) {
	const out = {};
	for ( const raw of ( text || '' ).split( /\r?\n/ ) ) {
		const line = raw.trim();
		if ( ! line || line.startsWith( '#' ) ) {
			continue;
		}
		const eq = line.indexOf( '=' );
		if ( eq < 1 ) {
			continue;
		}
		let value = line.slice( eq + 1 ).trim();
		if ( /^(['"]).*\1$/.test( value ) ) {
			value = value.slice( 1, -1 );
		}
		out[ line.slice( 0, eq ).trim() ] = value;
	}
	return out;
}

let cache;

/**
 * One setting: the process environment wins over `tools/wp/.env.local`.
 *
 * @param {string} key      Variable name.
 * @param {string} fallback Default.
 * @return {string|undefined} Value.
 */
export function setting( key, fallback ) {
	if ( ! cache ) {
		cache = parseEnv( envLocal() );
	}
	return process.env[ key ] || cache[ key ] || fallback;
}

/** Base URL of the local site, without a trailing slash. */
export function siteUrl() {
	return setting( 'WP_URL', 'http://localhost/pervej-woo' ).replace( /\/+$/, '' );
}

/**
 * Credentials for a sign-in before recording.
 *
 * @param {'admin'|'customer'} who Which account.
 * @return {{user: string, pass: string}} Credentials.
 */
export function credentials( who ) {
	const keys = who === 'admin'
		? [ 'WP_ADMIN_USER', 'WP_ADMIN_PASS' ]
		: [ 'PERVEJ_CAPTURE_USER', 'PERVEJ_CAPTURE_PASS' ];
	const user = setting( keys[ 0 ] );
	const pass = setting( keys[ 1 ] );
	if ( ! user || ! pass ) {
		throw new Error( `Sign-in as ${ who } needs ${ keys.join( ' and ' ) } in the environment or in tools/wp/.env.local.` );
	}
	return { user, pass };
}
