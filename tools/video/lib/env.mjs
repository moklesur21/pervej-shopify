/**
 * The store, its storefront password, the capture customer and the demo's preview themes. Secrets
 * come from the environment, never from a script (§4 "Clean"): the process environment first, then
 * `tools/shopify/.env.local` (git-ignored, one per person — each person captures on their own dev store).
 */

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT, readText, shown } from './paths.mjs';

const ENV_LOCAL = path.join( 'tools', 'shopify', '.env.local' );

/**
 * `tools/shopify/.env.local` of this checkout, or — in a git worktree, which has no copy of the
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
 * One setting: the process environment wins over `tools/shopify/.env.local`.
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

/**
 * The store's origin, from `SHOPIFY_STORE` (`your-store.myshopify.com` → `https://your-store.myshopify.com`).
 * An explicit http(s) scheme is kept as given, which is how the toolkit's tests point it at a mock store.
 *
 * @return {string} Origin, without a trailing slash.
 */
export function storeUrl() {
	const raw = setting( 'SHOPIFY_STORE' );
	if ( ! raw ) {
		throw new Error( 'SHOPIFY_STORE is not set: copy tools/shopify/.env.example to tools/shopify/.env.local and fill it in.' );
	}
	return new URL( /^https?:\/\//i.test( raw ) ? raw : `https://${ raw }` ).origin;
}

/** The storefront password, or null when the store has none. */
export function storefrontPassword() {
	return setting( 'SHOPIFY_STOREFRONT_PASSWORD' ) || null;
}

/**
 * Credentials for a sign-in before recording.
 *
 * @param {'customer'|'admin'} who Which account.
 * @return {{user: string, pass: string}} Credentials.
 */
export function credentials( who ) {
	if ( who !== 'customer' ) {
		throw new Error( `Sign-in as "${ who }": only "customer" can be scripted. The Shopify admin sits behind a Shopify login with two-step verification, so admin evidence is a screenshot taken by hand.` );
	}
	const user = setting( 'PERVEJ_CAPTURE_USER' );
	const pass = setting( 'PERVEJ_CAPTURE_PASS' );
	if ( ! user || ! pass ) {
		throw new Error( 'Sign-in as customer needs PERVEJ_CAPTURE_USER and PERVEJ_CAPTURE_PASS in the environment or in tools/shopify/.env.local.' );
	}
	return { user, pass };
}

/**
 * The theme a capture runs on: a label pushed by `tools/shopify/theme.sh push` (recorded in the
 * demo's git-ignored `media/themes.json`), a theme ID, or 'live' for the store's published theme.
 *
 * @param {object} demo  Demo paths (lib/paths.mjs resolveDemo).
 * @param {string} label 'before', 'after', … · a numeric theme ID · 'live'.
 * @return {{id: number, label: string, name: string|null}|null} The theme, or null for the published one.
 */
export function previewTheme( demo, label ) {
	if ( label === 'live' ) {
		return null;
	}
	if ( /^\d+$/.test( String( label ) ) ) {
		return { id: Number( label ), label: `#${ label }`, name: null };
	}
	const file = path.join( demo.media, 'themes.json' );
	const text = readText( file );
	const push = `tools/shopify/theme.sh push ${ demo.id } ${ label }`;
	if ( text === null ) {
		throw new Error( `No ${ shown( file ) }: push the theme to your store first — ${ push }` );
	}
	const theme = JSON.parse( text )[ label ];
	if ( ! theme ) {
		throw new Error( `${ shown( file ) } has no "${ label }" theme: ${ push }` );
	}
	const host = new URL( storeUrl() ).host;
	if ( theme.store && theme.store !== host ) {
		throw new Error( `The "${ label }" theme was pushed to ${ theme.store }, but SHOPIFY_STORE is ${ host }. Push it to your own store: ${ push }` );
	}
	return { id: Number( theme.id ), label, name: theme.name || null };
}
