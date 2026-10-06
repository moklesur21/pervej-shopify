/**
 * Slides are small HTML pages photographed by Playwright (guideline §11). This opens
 * `slides/frame.html` once and draws every still, overlay and contact sheet the render needs.
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { CANVAS } from './layout.mjs';
import { TOOL_DIR } from './paths.mjs';

/**
 * @return {Promise<{draw: Function, sheet: Function, close: Function}>} Frame painter.
 */
export async function openFrames() {
	const browser = await chromium.launch();
	const page = await browser.newPage( { viewport: { width: CANVAS, height: CANVAS }, deviceScaleFactor: 1 } );
	await page.goto( pathToFileURL( path.join( TOOL_DIR, 'slides', 'frame.html' ) ).href );
	await page.evaluate( () => document.fonts.ready );
	return {
		/**
		 * Draw one 1080 × 1080 frame.
		 *
		 * @param {object}  spec        See slides/frame.js.
		 * @param {string}  file        PNG to write.
		 * @param {boolean} transparent Keep the middle see-through (an overlay for a clip).
		 * @return {Promise<{problems: string[], sizes: object}>} What the page measured.
		 */
		async draw( spec, file, transparent = false ) {
			await page.setViewportSize( { width: CANVAS, height: CANVAS } );
			const result = await page.evaluate( ( s ) => window.renderFrame( s ), spec );
			await page.screenshot( { path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: CANVAS, height: CANVAS } } );
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
		close: () => browser.close(),
	};
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
