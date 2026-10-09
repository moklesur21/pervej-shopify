#!/usr/bin/env node
/**
 * The insight image (video guideline §7b): post/insight.md → one 1200 × 1200 PNG in the §6 look.
 *
 *   node tools/video/insight.mjs <id>
 *
 * Refuses until the words check passes and the four post files are committed as they stand. Two
 * layouts: a still and its line (a framed still from the capture, the insight line in the band), or a
 * number and its line (one number, large, the line under it, a small source line). The label strip is
 * on it whenever the image shows the demo. Writes media/final/: <id>-insight.png · -insight-copy.txt ·
 * -insight-alt.txt (for the upload screen); a manifest in media/insight/. Then runs the check.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { resolveDemo, ensureDir, shown, toolVersion, readText } from './lib/paths.mjs';
import { loadPackage } from './lib/package.mjs';
import { wordsGate } from './lib/gate.mjs';
import { openFrames, fileUrl } from './lib/slides.mjs';
import { placePicture } from './lib/pictures.mjs';
import { runCheck } from './lib/checks.mjs';

const CANVAS = 1200;
/** The insight image's middle under its strip, above its band (slides/frame.css). */
const MIDDLE = { width: 1200, height: 816 };

async function main() {
	const demo = resolveDemo( process.argv[ 2 ] );
	const pkg = loadPackage( demo );
	if ( ! pkg.insight ) {
		throw new Error( 'post/insight.md does not exist yet.' );
	}
	if ( pkg.insight.errors.length ) {
		throw new Error( `Not made — fix insight.md first:\n- ${ pkg.insight.errors.join( '\n- ' ) }` );
	}
	const gate = await wordsGate( demo );
	if ( ! gate.ok ) {
		throw new Error( `Not made — ${ gate.reason }` );
	}
	const { image, copy, alt } = pkg.insight;
	const work = path.join( demo.media, 'insight' );
	fs.rmSync( work, { recursive: true, force: true } );
	ensureDir( work );
	ensureDir( demo.final );
	// An older image goes first, so a failed run never leaves one that looks current.
	for ( const suffix of [ 'insight.png', 'insight-copy.txt', 'insight-alt.txt' ] ) {
		fs.rmSync( demo.finalFile( suffix ), { force: true } );
	}
	console.log( `Insight ${ demo.id } · insight.md ${ pkg.insightSha } (words ${ gate.commit }) · ${ image.layout } and line` );

	// The label goes on whenever the image shows the demo: always for a still; for a number, unless the
	// number is the outside figure rather than one from the demo's files (§7b).
	// The same digit-bounded match as the Sources row: 53% is not found inside 2.53 s.
	const corpus = image.sources.map( ( name ) => readText( demo.file( name ) ) || '' ).join( '\n' );
	const token = ( image.number.match( /\d+(?:[:.,/]\d+)*%?/ ) || [ image.number ] )[ 0 ];
	const found = new RegExp( `(?<![\\d])${ token.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ) }(?![\\d])` ).test( corpus );
	const outsideNumber = image.layout === 'number' && pkg.insight.outside.length > 0 && ! found;
	const label = outsideNumber ? null : pkg.brand.label;

	const out = {
		png: demo.finalFile( 'insight.png' ),
		copy: demo.finalFile( 'insight-copy.txt' ),
		alt: demo.finalFile( 'insight-alt.txt' ),
	};
	const painter = await openFrames();
	let result;
	let scale = 1;
	try {
		const spec = { kind: 'insight', label, insight: { layout: image.layout, line: image.line, number: image.number, sourceLine: image.sourceLine } };
		if ( image.layout === 'still' ) {
			const pic = await placePicture( demo, image.picture, work, MIDDLE );
			scale = pic.scale;
			spec.insight.image = { src: fileUrl( pic.file ), ...pic.rect };
			spec.insight.marks = pic.marks;
		}
		result = await painter.draw( spec, out.png, false, CANVAS );
	} finally {
		await painter.close();
	}
	if ( result.problems.length ) {
		fs.rmSync( out.png, { force: true } );
		throw new Error( `Not made:\n- ${ result.problems.join( '\n- ' ) }` );
	}
	fs.writeFileSync( out.copy, copy.post + '\n' );
	fs.writeFileSync( out.alt, alt + '\n' );
	const hash = crypto.createHash( 'sha1' ).update( fs.readFileSync( out.png ) ).digest( 'hex' ).slice( 0, 7 );
	const manifest = {
		tool: toolVersion(),
		renderedAt: new Date().toISOString(),
		insight: pkg.insightSha,
		words: gate.commit,
		hash,
		layout: image.layout,
		label,
		outsideNumber,
		sizes: result.sizes,
		scale: Number( scale.toFixed( 4 ) ),
		files: { png: path.basename( out.png ), copy: path.basename( out.copy ), alt: path.basename( out.alt ) },
		problems: [],
	};
	fs.writeFileSync( path.join( work, 'manifest.json' ), JSON.stringify( manifest, null, '\t' ) + '\n' );
	console.log( `  ${ shown( out.png ) } · ${ ( fs.statSync( out.png ).size / 1024 ).toFixed( 0 ) } KB · insight ${ hash }` );
	console.log( `  copy and alt text in ${ shown( demo.final ) }/` );

	console.log( '\nSelf-check' );
	return runCheck( demo );
}

try {
	process.exitCode = ( await main() ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
