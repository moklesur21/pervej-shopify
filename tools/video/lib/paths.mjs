/**
 * Where things are: the toolkit, the repo, one demo's folders and file names (guideline §11).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOOL_DIR = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
export const REPO_ROOT = path.resolve( TOOL_DIR, '..', '..' );

/**
 * Resolve a demo from an ID (`w01-coupon-checkout-hang` → `demos/w01-coupon-checkout-hang/`)
 * or from a path to a demo folder.
 *
 * @param {string} arg Demo ID or folder path.
 * @return {object} Demo paths.
 */
export function resolveDemo( arg ) {
	if ( ! arg ) {
		throw new Error( 'Name the demo: its ID (w01-coupon-checkout-hang) or the path to its folder.' );
	}
	const asPath = path.resolve( arg );
	const asId = path.join( REPO_ROOT, 'demos', arg );
	let dir;
	if ( /[\\/]/.test( arg ) && fs.existsSync( asPath ) ) {
		dir = asPath;
	} else if ( fs.existsSync( asId ) ) {
		dir = asId;
	} else if ( fs.existsSync( asPath ) ) {
		dir = asPath;
	} else {
		throw new Error( `No demo folder for "${ arg }" (looked for ${ asId }).` );
	}
	const id = path.basename( dir );
	const media = path.join( dir, 'media' );
	return {
		id,
		dir,
		capture: path.join( dir, 'capture' ),
		post: path.join( dir, 'post' ),
		media,
		raw: path.join( media, 'raw' ),
		final: path.join( media, 'final' ),
		work: path.join( media, 'render' ),
		file: ( name ) => path.join( dir, name ),
		rawFile: ( name ) => path.join( media, 'raw', name ),
		finalFile: ( suffix ) => path.join( media, 'final', `${ id }-${ suffix }` ),
	};
}

/**
 * A path for printing: relative to the repo root when inside it, absolute otherwise.
 *
 * @param {string} p Absolute path.
 * @return {string} Display path with forward slashes.
 */
export function shown( p ) {
	const rel = path.relative( REPO_ROOT, p );
	const out = rel && ! rel.startsWith( '..' ) && ! path.isAbsolute( rel ) ? rel : p;
	return out.split( path.sep ).join( '/' );
}

/**
 * Create a directory (and parents) if missing.
 *
 * @param {string} dir Directory.
 * @return {string} The directory.
 */
export function ensureDir( dir ) {
	fs.mkdirSync( dir, { recursive: true } );
	return dir;
}

/**
 * Read a file as UTF-8, or return null when it does not exist.
 *
 * @param {string} file Path.
 * @return {string|null} Contents.
 */
export function readText( file ) {
	try {
		return fs.readFileSync( file, 'utf8' );
	} catch ( error ) {
		if ( error.code === 'ENOENT' ) {
			return null;
		}
		throw error;
	}
}

/** The toolkit's own words: label, approved ask, end card. */
export function brand() {
	return JSON.parse( fs.readFileSync( path.join( TOOL_DIR, 'brand.json' ), 'utf8' ) );
}

/** The toolkit version, for sidecars and manifests. */
export function toolVersion() {
	const pkg = JSON.parse( fs.readFileSync( path.join( TOOL_DIR, 'package.json' ), 'utf8' ) );
	return `${ pkg.name } ${ pkg.version }`;
}
