#!/usr/bin/env node
/**
 * To the drive (video guideline §3 step 7): copies demos/<id>/media/ into the recordings folder this
 * machine names as PERVEJ_DRIVE_DIR, as <platform>/<id>/ — woocommerce here, shopify in pervej-shopify.
 *
 *   node tools/video/drive.mjs <id>
 *
 * PERVEJ_DRIVE_DIR is a per-machine setting, like the site URL: the environment first, then the
 * git-ignored .env.local. Not set: nothing is copied and it says so; the package stays in media/final/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { resolveDemo, REPO_ROOT, shown } from './lib/paths.mjs';
import { setting } from './lib/env.mjs';

const PLATFORM = fs.existsSync( path.join( REPO_ROOT, 'tools', 'shopify' ) ) ? 'shopify' : 'woocommerce';

function size( dir ) {
	let files = 0;
	let bytes = 0;
	for ( const entry of fs.readdirSync( dir, { withFileTypes: true, recursive: true } ) ) {
		if ( entry.isFile() ) {
			files++;
			bytes += fs.statSync( path.join( entry.parentPath ?? entry.path, entry.name ) ).size;
		}
	}
	return { files, bytes };
}

try {
	const demo = resolveDemo( process.argv[ 2 ] );
	const root = setting( 'PERVEJ_DRIVE_DIR' );
	if ( ! fs.existsSync( demo.final ) ) {
		throw new Error( `Nothing to copy: ${ shown( demo.final ) }/ does not exist yet.` );
	}
	if ( ! root ) {
		console.log( `Not copied: PERVEJ_DRIVE_DIR is not set on this machine. The package is in ${ shown( demo.final ) }/.` );
	} else if ( ! fs.existsSync( root ) ) {
		throw new Error( `PERVEJ_DRIVE_DIR is ${ root }, which does not exist — is the drive synced on this machine?` );
	} else {
		const target = path.join( root, PLATFORM, demo.id );
		fs.cpSync( demo.media, target, { recursive: true, force: true } );
		const s = size( target );
		console.log( `Copied ${ shown( demo.media ) }/ → ${ target } · ${ s.files } files · ${ ( s.bytes / 1048576 ).toFixed( 1 ) } MB` );
	}
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
