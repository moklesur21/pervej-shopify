/**
 * Slides are small HTML pages photographed by Playwright (guideline §11). This opens
 * `slides/frame.html` once and draws every still, overlay, contact sheet, carousel page and the
 * insight image; it also prints the carousel's pages into one PDF.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { CANVAS } from './layout.mjs';
import { TOOL_DIR } from './paths.mjs';

/**
 * @return {Promise<{draw: Function, sheet: Function, pdf: Function, close: Function}>} Frame painter.
 */
export async function openFrames() {
	const browser = await chromium.launch();
	const page = await browser.newPage( { viewport: { width: CANVAS, height: CANVAS }, deviceScaleFactor: 1 } );
	await page.goto( pathToFileURL( path.join( TOOL_DIR, 'slides', 'frame.html' ) ).href );
	await page.evaluate( () => document.fonts.ready );
	return {
		/**
		 * Draw one square frame: 1080 × 1080, or 1200 for the insight image.
		 *
		 * @param {object}  spec        See slides/frame.js.
		 * @param {string}  file        PNG to write.
		 * @param {boolean} transparent Keep the middle see-through (an overlay for a clip).
		 * @param {number}  size        Canvas, px.
		 * @return {Promise<{problems: string[], sizes: object}>} What the page measured.
		 */
		async draw( spec, file, transparent = false, size = CANVAS ) {
			await page.setViewportSize( { width: size, height: size } );
			const result = await page.evaluate( ( s ) => window.renderFrame( s ), spec );
			await page.screenshot( { path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: size, height: size } } );
			return result;
		},
		/**
		 * Draw a contact sheet (any size).
		 *
		 * @param {object} spec { title, columns, tile, tiles: [{ src, caption }] }.
		 * @param {string} file PNG to write.
		 */
		async sheet( spec, file ) {
			const width = 48 + spec.columns * spec.tile + ( spec.columns - 1 ) * 16;
			await page.setViewportSize( { width, height: CANVAS } );
			const result = await page.evaluate( ( s ) => window.renderFrame( { kind: 'sheet', sheet: s } ), spec );
			await page.setViewportSize( { width, height: result.height } );
			await page.screenshot( { path: file, fullPage: true } );
		},
		/**
		 * Print square PNG pages into one PDF, every page the same size with no margins (§7a).
		 * The print page is written beside the PNGs so it can load them from disk.
		 *
		 * @param {string[]} pngs Page images, in order.
		 * @param {string}   file PDF to write.
		 * @return {Promise<number>} Pages printed.
		 */
		async pdf( pngs, file ) {
			const dir = path.dirname( pngs[ 0 ] );
			const html = path.join( dir, 'print.html' );
			const imgs = pngs.map( ( p ) => `<img src="${ encodeURI( path.basename( p ) ) }" alt="">` ).join( '\n' );
			fs.writeFileSync( html, `<!doctype html>\n<html><head><meta charset="utf-8"><style>@page{size:${ CANVAS }px ${ CANVAS }px;margin:0}html,body{margin:0;padding:0}img{display:block;width:${ CANVAS }px;height:${ CANVAS }px}img+img{break-before:page}</style></head><body>\n${ imgs }\n</body></html>\n` );
			const printer = await browser.newPage();
			try {
				await printer.goto( pathToFileURL( html ).href );
				await printer.evaluate( () => Promise.all( Array.from( document.images ).map( ( i ) => i.decode() ) ) );
				await printer.pdf( { path: file, width: `${ CANVAS }px`, height: `${ CANVAS }px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } } );
			} finally {
				await printer.close();
			}
			return pdfPages( fs.readFileSync( file ) );
		},
		close: () => browser.close(),
	};
}

/**
 * Page count of a PDF: its page objects (/Type /Page, not /Pages).
 *
 * @param {Buffer} pdf PDF bytes.
 * @return {number} Pages.
 */
export function pdfPages( pdf ) {
	return ( pdf.toString( 'latin1' ).match( /\/Type\s*\/Page(?![a-z])/g ) || [] ).length;
}

/**
 * Pixel size of a PNG, from its header.
 *
 * @param {Buffer} png PNG bytes.
 * @return {{width: number, height: number}} Size.
 */
export function pngSize( png ) {
	return { width: png.readUInt32BE( 16 ), height: png.readUInt32BE( 20 ) };
}

/** A local file as a URL the frame page can load. */
export const fileUrl = ( file ) => pathToFileURL( file ).href;
