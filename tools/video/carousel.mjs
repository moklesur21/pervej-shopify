#!/usr/bin/env node
/**
 * The carousel (video guideline §7a): post/carousel.md → square pages in the video's own look → one PDF.
 *
 *   node tools/video/carousel.mjs <id>
 *
 * Refuses until the words check passes and the four post files are committed as they stand. Each page
 * is the video's three bands — the label (and the page counter) in the strip, a still, a frame, a slide
 * or the end card in the middle, the line in the band — drawn by the same frame page as the video.
 * Writes media/final/: <id>-carousel.pdf · -carousel-contact.png · -carousel-copy.txt ·
 * -carousel-title.txt (typed in at upload); the pages and a manifest in media/carousel/. Then runs the check.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { resolveDemo, ensureDir, shown, toolVersion } from './lib/paths.mjs';
import { loadPackage } from './lib/package.mjs';
import { wordsGate } from './lib/gate.mjs';
import { openFrames, fileUrl } from './lib/slides.mjs';
import { placePicture } from './lib/pictures.mjs';
import { pageText, words } from './lib/script.mjs';
import { MIDDLE } from './lib/layout.mjs';
import { runCheck } from './lib/checks.mjs';

const SHEET = { columns: 5, tile: 360 };
const pad = ( n ) => String( n ).padStart( 2, '0' );

async function main() {
	const demo = resolveDemo( process.argv[ 2 ] );
	const pkg = loadPackage( demo );
	if ( ! pkg.carousel ) {
		throw new Error( 'post/carousel.md does not exist yet.' );
	}
	if ( pkg.carousel.errors.length ) {
		throw new Error( `Not made — fix carousel.md first:\n- ${ pkg.carousel.errors.join( '\n- ' ) }` );
	}
	const gate = await wordsGate( demo );
	if ( ! gate.ok ) {
		throw new Error( `Not made — ${ gate.reason }` );
	}
	const { pages, copy, title } = pkg.carousel;
	const label = pkg.brand.label;
	const work = path.join( demo.media, 'carousel' );
	fs.rmSync( work, { recursive: true, force: true } );
	ensureDir( work );
	ensureDir( demo.final );
	// An older carousel goes first, so a failed run never leaves one that looks current.
	for ( const suffix of [ 'carousel.pdf', 'carousel-contact.png', 'carousel-copy.txt', 'carousel-title.txt' ] ) {
		fs.rmSync( demo.finalFile( suffix ), { force: true } );
	}
	console.log( `Carousel ${ demo.id } · carousel.md ${ pkg.carouselSha } (words ${ gate.commit }) · ${ pages.length } pages` );

	const out = {
		pdf: demo.finalFile( 'carousel.pdf' ),
		contact: demo.finalFile( 'carousel-contact.png' ),
		copy: demo.finalFile( 'carousel-copy.txt' ),
		title: demo.finalFile( 'carousel-title.txt' ),
	};
	const painter = await openFrames();
	try {
		const problems = [];
		const drawn = [];
		for ( const page of pages ) {
			const counter = `${ page.n }/${ pages.length }`;
			const m = page.middle;
			let spec;
			let scale = 1;
			if ( m.kind === 'still' || m.kind === 'frame' ) {
				const pic = await placePicture( demo, m, work, MIDDLE );
				scale = pic.scale;
				spec = { kind: 'image', label, line: page.line, counter, image: { src: fileUrl( pic.file ), ...pic.rect }, marks: pic.marks };
			} else if ( m.kind === 'slide' ) {
				spec = { kind: 'slide', label, line: page.line, counter, slide: { layout: m.layout, rows: m.rows, shown: m.rows.length } };
			} else {
				spec = { kind: 'endcard', label, line: page.line, counter, endCard: { ...pkg.brand.endCard, lead: m.lead } };
			}
			const png = `page-${ pad( page.n ) }.png`;
			const result = await painter.draw( spec, path.join( work, png ) );
			result.problems.forEach( ( p ) => problems.push( `Page ${ page.n }: ${ p }` ) );
			drawn.push( { n: page.n, kind: m.kind, png, sizes: result.sizes, scale: Number( scale.toFixed( 4 ) ), words: pageText( page, pkg.brand ).reduce( ( sum, t ) => sum + words( t ), 0 ) } );
		}
		if ( problems.length ) {
			throw new Error( `Not made:\n- ${ problems.join( '\n- ' ) }` );
		}

		const pdfPages = await painter.pdf( drawn.map( ( d ) => path.join( work, d.png ) ), out.pdf );
		// Hashed from the drawn pages, not the PDF: its bytes carry a creation time, so the same pages would
		// get a new hash on every run and void the look recorded for them.
		const sha = crypto.createHash( 'sha1' );
		drawn.forEach( ( d ) => sha.update( fs.readFileSync( path.join( work, d.png ) ) ) );
		const hash = sha.digest( 'hex' ).slice( 0, 7 );
		await painter.sheet( {
			title: `${ demo.id } · carousel · ${ pages.length } pages · carousel ${ hash }`,
			columns: SHEET.columns,
			tile: SHEET.tile,
			tiles: drawn.map( ( d ) => ( { src: fileUrl( path.join( work, d.png ) ), caption: `${ d.n }/${ pages.length }` } ) ),
		}, out.contact );
		fs.writeFileSync( out.copy, copy.post + '\n' );
		fs.writeFileSync( out.title, title + '\n' );

		const manifest = {
			tool: toolVersion(),
			renderedAt: new Date().toISOString(),
			carousel: pkg.carouselSha,
			words: gate.commit,
			hash,
			label,
			pdfPages,
			files: {
				pdf: path.basename( out.pdf ),
				contact: path.basename( out.contact ),
				copy: path.basename( out.copy ),
				title: path.basename( out.title ),
			},
			pages: drawn,
			problems: [],
		};
		fs.writeFileSync( path.join( work, 'manifest.json' ), JSON.stringify( manifest, null, '\t' ) + '\n' );
		console.log( `  ${ shown( out.pdf ) } · ${ pdfPages } pages · ${ ( fs.statSync( out.pdf ).size / 1048576 ).toFixed( 1 ) } MB · carousel ${ hash }` );
		console.log( `  contact sheet, copy and document title in ${ shown( demo.final ) }/` );
	} finally {
		await painter.close();
	}

	console.log( '\nSelf-check' );
	return runCheck( demo );
}

try {
	process.exitCode = ( await main() ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
