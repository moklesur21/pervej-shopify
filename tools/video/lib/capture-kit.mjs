/**
 * The capture helpers a demo's `capture/` script drives (video guideline §4).
 *
 * Sharp: no Playwright video recorder. Screenshots of the framed part of the page are taken in a loop
 * at 2–3× device scale, each stamped with the time it was taken, and ffmpeg assembles them at that
 * real timing. Followable: a teal tap marker is drawn into the page during capture only, and actions
 * are paced. Clean: the WordPress admin bar is hidden; sign-in happens before recording, with
 * credentials from the environment. Every clip leaves a JSON sidecar the self-check reads.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { devices } from 'playwright';
import { FPS, FRAME, MIDDLE, MIN_PX, PALETTE, QA_HEIGHTS, SCALE, VIEWS } from './layout.mjs';
import { ensureDir, shown, toolVersion } from './paths.mjs';
import { credentials, siteUrl } from './env.mjs';
import { ffmpeg, TO_YUV, x264 } from './ffmpeg.mjs';
import { measure } from './lighthouse.mjs';

export const PHASES = [ 'before', 'after', 'qa' ];
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MARK = 'data-pervej-capture';

const sleep = ( ms ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );
const hash = ( text ) => crypto.createHash( 'sha1' ).update( text ).digest( 'hex' ).slice( 0, 12 );

/** Hides the WordPress admin bar (and with it the signed-in username). */
function hideAdminBar() {
	const add = () => {
		const style = document.createElement( 'style' );
		style.setAttribute( 'data-pervej-capture', '' );
		style.textContent = '#wpadminbar{display:none!important}html,body.admin-bar{margin-top:0!important}';
		( document.head || document.documentElement ).append( style );
	};
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', add );
	} else {
		add();
	}
}

/**
 * Draw (or replace) a capture-only overlay in the page: the tap marker, the one highlight, or the
 * outline of the frame on the wide still. Never part of the site.
 *
 * @param {import('playwright').Page} page Page.
 * @param {object}                    o    { kind: aim|tap|outline|frame|clear, x, y, width, height }.
 */
async function overlay( page, o ) {
	await page.evaluate( ( { o, teal, mark } ) => {
		const ids = { aim: 'pervej-tap', tap: 'pervej-tap', clear: 'pervej-tap', outline: 'pervej-outline', unoutline: 'pervej-outline', frame: 'pervej-frame', unframe: 'pervej-frame' };
		document.getElementById( ids[ o.kind ] )?.remove();
		if ( [ 'clear', 'unoutline', 'unframe' ].includes( o.kind ) ) {
			return;
		}
		const node = document.createElement( 'div' );
		node.id = ids[ o.kind ];
		node.setAttribute( mark, '' );
		const base = 'position:fixed;z-index:2147483647;pointer-events:none;box-sizing:border-box;';
		if ( o.kind === 'aim' || o.kind === 'tap' ) {
			node.style.cssText = base + `left:${ o.x - 22 }px;top:${ o.y - 22 }px;width:44px;height:44px;border-radius:50%;border:4px solid ${ teal };background:rgba(6,197,190,.18);transition:transform .45s ease-out,opacity .45s ease-out;`;
		} else {
			const pad = o.kind === 'outline' ? 6 : 0;
			node.style.cssText = base + `left:${ o.x - pad }px;top:${ o.y - pad }px;width:${ o.width + pad * 2 }px;height:${ o.height + pad * 2 }px;border:${ o.kind === 'frame' ? 6 : 4 }px solid ${ teal };border-radius:${ o.kind === 'frame' ? 4 : 8 }px;`;
		}
		document.documentElement.append( node );
		if ( o.kind === 'tap' ) {
			requestAnimationFrame( () => requestAnimationFrame( () => {
				node.style.transform = 'scale(1.6)';
				node.style.opacity = '0';
			} ) );
			setTimeout( () => node.remove(), 700 );
		}
	}, { o, teal: PALETTE.teal, mark: MARK } );
}

/**
 * The smallest visible site text inside a viewport region, in CSS px, with a sample of it.
 *
 * @param {import('playwright').Page} page   Page.
 * @param {object}                    region { x, y, width, height } in viewport CSS px.
 * @return {Promise<{css: number|null, sample: string|null}>} Smallest text.
 */
function smallestText( page, region ) {
	return page.evaluate( ( { r, mark } ) => {
		let best = { css: null, sample: null };
		const walker = document.createTreeWalker( document.body, NodeFilter.SHOW_TEXT );
		const range = document.createRange();
		for ( let node = walker.nextNode(); node; node = walker.nextNode() ) {
			const text = node.textContent.trim();
			const el = node.parentElement;
			if ( ! text || ! el || el.closest( `[${ mark }]` ) ) {
				continue;
			}
			const style = getComputedStyle( el );
			if ( style.visibility !== 'visible' || Number( style.opacity ) === 0 ) {
				continue;
			}
			range.selectNodeContents( node );
			const hit = Array.from( range.getClientRects() ).some( ( b ) => b.width > 1 && b.height > 1 &&
				b.right > r.x && b.left < r.x + r.width && b.bottom > r.y && b.top < r.y + r.height );
			if ( ! hit ) {
				continue;
			}
			const size = parseFloat( style.fontSize );
			if ( best.css === null || size < best.css ) {
				best = { css: size, sample: text.slice( 0, 60 ) };
			}
		}
		return best;
	}, { r: region, mark: MARK } );
}

export class Capture {
	/**
	 * @param {object} args         Arguments.
	 * @param {object} args.demo    Demo paths (lib/paths.mjs resolveDemo).
	 * @param {string} args.phase   before | after | qa.
	 * @param {object} args.browser Playwright Browser.
	 * @param {string} args.script  Path of the capture script, for the sidecar.
	 * @param {string[]} args.only  Run only these clip / still / Lighthouse names (prefix match).
	 */
	constructor( { demo, phase, browser, script, only } ) {
		if ( ! PHASES.includes( phase ) ) {
			throw new Error( `Phase must be one of ${ PHASES.join( ', ' ) }.` );
		}
		this.demo = demo;
		this.phase = phase;
		this.browser = browser;
		this.script = script;
		this.only = only || [];
		this.pages = new Map();
		this.made = [];
		ensureDir( demo.raw );
	}

	get id() {
		return this.demo.id;
	}

	/**
	 * Full URL on the local site.
	 *
	 * @param {string} p Path such as '/checkout/' (or a full URL).
	 * @return {string} URL.
	 */
	url( p = '/' ) {
		return /^https?:\/\//.test( p ) ? p : `${ siteUrl() }/${ String( p ).replace( /^\/+/, '' ) }`;
	}

	wanted( name ) {
		return ! this.only.length || this.only.some( ( o ) => name === o || name.startsWith( o ) );
	}

	/**
	 * Open a fresh browser context (a clean, incognito-like profile) in a view.
	 *
	 * @param {object}        o          Options.
	 * @param {string|number} o.view     'desktop' (1280, default) · 'phone' (390) · 'tablet' (768) · a QA width (360, 390, 768).
	 * @param {number}        o.scale    Device scale, 2 (default) or 3.
	 * @param {string}        o.signIn   'admin' or 'customer' — signs in before anything is recorded.
	 * @param {boolean}       o.adminBar Keep the WordPress admin bar (only when the work lives in the admin).
	 * @return {Promise<import('playwright').Page>} Page.
	 */
	async open( { view = 'desktop', scale = SCALE.min, signIn = null, adminBar = false } = {} ) {
		let viewport;
		let name;
		if ( typeof view === 'number' ) {
			viewport = { width: view, height: QA_HEIGHTS[ view ] || 900 };
			name = `${ view }px`;
		} else if ( VIEWS[ view ] ) {
			viewport = { ...VIEWS[ view ] };
			name = view;
		} else {
			throw new Error( `Unknown view "${ view }": use desktop, phone, tablet or a width in px.` );
		}
		if ( ! Number.isInteger( scale ) || scale < SCALE.min || scale > SCALE.max ) {
			throw new Error( `Device scale must be ${ SCALE.min } or ${ SCALE.max } (§4 "Sharp").` );
		}
		const mobile = viewport.width < 768;
		const context = await this.browser.newContext( {
			viewport,
			deviceScaleFactor: scale,
			isMobile: mobile,
			hasTouch: mobile,
			userAgent: mobile ? devices[ 'Pixel 7' ].userAgent : undefined,
			locale: 'en-US',
			colorScheme: 'light',
		} );
		if ( ! adminBar ) {
			await context.addInitScript( hideAdminBar );
		}
		const page = await context.newPage();
		this.pages.set( page, { view: name, viewport, scale, context } );
		if ( signIn ) {
			await this.signIn( page, signIn );
		}
		return page;
	}

	/**
	 * Sign in through wp-login.php. Do it before any clip: nothing of it is recorded.
	 *
	 * @param {import('playwright').Page} page Page.
	 * @param {'admin'|'customer'}        who  Account.
	 */
	async signIn( page, who ) {
		const { user, pass } = credentials( who );
		await page.goto( this.url( '/wp-login.php' ) );
		await page.fill( '#user_login', user );
		await page.fill( '#user_pass', pass );
		// Wait for WordPress's answer to the sign-in itself, the response that sets the cookie: the login
		// page is already loaded, so waiting for "load" could return before it (seen once on a slow run).
		// The dashboard it redirects to is not waited for; the script's next goto replaces it.
		await Promise.all( [
			page.waitForResponse( ( r ) => r.request().method() === 'POST' && new URL( r.url() ).pathname.endsWith( '/wp-login.php' ) ),
			page.click( '#wp-submit' ),
		] );
		const cookies = await page.context().cookies();
		if ( ! cookies.some( ( c ) => c.name.startsWith( 'wordpress_logged_in_' ) ) ) {
			throw new Error( `Sign-in as ${ who } failed: check the credentials in the environment / tools/wp/.env.local.` );
		}
	}

	/**
	 * Work out the framed region, in viewport CSS px.
	 *
	 * frame: '<selector>'                       540 × 405 centred on the element (desktop default)
	 *        { selector, width, anchor, dx, dy } wider/narrower (4:3 kept), anchor center|top|left|top-left
	 *        'column' | { column: true, selector?, y? } full width × 405, for phone widths
	 *        { x, y, width, height }            an explicit rectangle
	 */
	async region( page, frame ) {
		if ( ! this.pages.has( page ) ) {
			throw new Error( 'Use a page from cap.open(): it carries the view and the device scale.' );
		}
		const { viewport } = this.pages.get( page );
		const vw = viewport.width;
		const vh = viewport.height;
		const clamp = ( v, lo, hi ) => Math.min( Math.max( v, lo ), hi );
		if ( ! frame ) {
			if ( vw <= MIDDLE.width / 2 ) {
				frame = 'column';
			} else {
				throw new Error( 'Desktop clips are framed, never whole (§4): pass frame: "<selector>".' );
			}
		}
		if ( typeof frame === 'string' ) {
			frame = frame === 'column' ? { column: true } : { selector: frame };
		}
		const box = async ( selector ) => {
			const locator = page.locator( selector ).first();
			await locator.scrollIntoViewIfNeeded();
			const b = await locator.boundingBox();
			if ( ! b ) {
				throw new Error( `Frame target "${ selector }" is not visible.` );
			}
			return b;
		};
		if ( frame.column ) {
			if ( vw > MIDDLE.width / 2 ) {
				throw new Error( `A ${ vw } px page is too wide to show whole as a column; frame a part of it.` );
			}
			const height = MIDDLE.height / 2;
			let y = frame.y ?? 0;
			if ( frame.selector ) {
				const b = await box( frame.selector );
				y = b.y + b.height / 2 - height / 2;
			}
			return { x: 0, y: clamp( Math.round( y ), 0, vh - height ), width: vw, height };
		}
		if ( frame.selector ) {
			const width = frame.width ?? FRAME.width;
			const height = Math.round( width / FRAME.aspect );
			if ( width > vw || height > vh ) {
				throw new Error( `A ${ width } px frame does not fit a ${ vw } × ${ vh } view.` );
			}
			const b = await box( frame.selector );
			const anchor = frame.anchor || 'center';
			const pad = 24;
			let x = b.x + b.width / 2 - width / 2;
			let y = b.y + b.height / 2 - height / 2;
			if ( anchor.includes( 'left' ) ) {
				x = b.x - pad;
			}
			if ( anchor.includes( 'top' ) ) {
				y = b.y - pad;
			}
			x += frame.dx || 0;
			y += frame.dy || 0;
			return { x: clamp( Math.round( x ), 0, vw - width ), y: clamp( Math.round( y ), 0, vh - height ), width, height };
		}
		const { x, y, width, height } = frame;
		if ( [ x, y, width, height ].some( ( n ) => typeof n !== 'number' ) || x < 0 || y < 0 || x + width > vw || y + height > vh ) {
			throw new Error( 'An explicit frame needs x, y, width, height inside the viewport.' );
		}
		return { x, y, width, height };
	}

	/**
	 * Record one clip: `media/raw/<id>-<phase>-<name>.mp4` + `.json` sidecar (+ `-wide.png`).
	 *
	 * @param {import('playwright').Page} page  Page, already on the right URL.
	 * @param {string}                    name  Clip name, e.g. 'coupon-applied' — the same in every phase.
	 * @param {object}                    o     { frame, wide, speed, pace, lead, tail }.
	 * @param {Function}                  steps async ( act ) => { … } — the same steps before and after.
	 * @return {Promise<object|null>} Sidecar.
	 */
	async clip( page, name, o, steps ) {
		if ( typeof o === 'function' ) {
			steps = o;
			o = {};
		}
		if ( ! NAME.test( name ) ) {
			throw new Error( `Clip name "${ name }": lowercase words joined by hyphens.` );
		}
		if ( ! this.wanted( name ) ) {
			console.log( `  skip ${ name }` );
			return null;
		}
		const meta = this.pages.get( page );
		const stem = `${ this.id }-${ this.phase }-${ name }`;
		const region = await this.region( page, o.frame );
		const show = Math.min( MIDDLE.width / region.width, MIDDLE.height / region.height );
		if ( show > meta.scale + 1e-9 ) {
			const fix = meta.scale < SCALE.max ? 'Widen the frame or open the view with { scale: 3 }.' : `Widen the frame: at ${ SCALE.max }× it needs at least ${ Math.ceil( MIDDLE.width / SCALE.max ) } px.`;
			throw new Error( `Clip ${ name }: the frame would be scaled up ${ show.toFixed( 2 ) }× from a ${ meta.scale }× capture. ${ fix }` );
		}
		const display = { width: Math.round( region.width * show ), height: Math.round( region.height * show ), scale: Number( show.toFixed( 4 ) ) };
		const fontStart = await smallestText( page, region );

		let wide = null;
		if ( o.wide ) {
			await overlay( page, { kind: 'frame', ...region } );
			wide = `${ stem }-wide.png`;
			await page.screenshot( { path: this.demo.rawFile( wide ) } );
			await overlay( page, { kind: 'unframe' } );
		}

		const framesDir = path.join( this.demo.raw, `.frames-${ stem }` );
		fs.rmSync( framesDir, { recursive: true, force: true } );
		ensureDir( framesDir );
		const type = meta.scale >= 3 ? 'jpeg' : 'png';
		const frames = [];
		const writes = [];
		let recording = true;
		const t0 = performance.now();
		const loop = ( async () => {
			let errors = 0;
			while ( recording ) {
				const ta = performance.now();
				let buffer;
				try {
					// Short timeout: a screenshot that starts while the page is navigating hangs until its
					// timeout (Playwright 1.63), and at 10 s that silently lost everything after a page load.
					// At 500 ms the loop holds the last frame for about half a second and carries on.
					buffer = await page.screenshot( { clip: region, type, quality: type === 'jpeg' ? 95 : undefined, caret: 'initial', timeout: 500 } );
				} catch ( error ) {
					// A navigation can swallow a frame; many in a row is a real failure.
					if ( ++errors > 25 ) {
						throw error;
					}
					await sleep( 40 );
					continue;
				}
				const tb = performance.now();
				errors = 0;
				const file = `f${ String( frames.length + 1 ).padStart( 6, '0' ) }.${ type === 'jpeg' ? 'jpg' : 'png' }`;
				frames.push( { file, t: ( ( ta + tb ) / 2 - t0 ) / 1000 } );
				writes.push( fs.promises.writeFile( path.join( framesDir, file ), buffer ) );
			}
		} )();

		const startedAt = new Date();
		const url = page.url();
		let failure = null;
		try {
			await sleep( o.lead ?? 600 );
			await steps( this.act( page, o.pace ?? 500 ) );
			await sleep( o.tail ?? 800 );
		} catch ( error ) {
			failure = error;
		}
		recording = false;
		try {
			await loop;
		} catch ( error ) {
			failure = failure || error;
		}
		await Promise.all( writes );
		await overlay( page, { kind: 'clear' } ).catch( () => {} );
		await overlay( page, { kind: 'unoutline' } ).catch( () => {} );
		if ( failure || frames.length < 2 ) {
			fs.rmSync( framesDir, { recursive: true, force: true } );
			// §4 "Honest": a failed run is fixed in the site or the script, never in the footage.
			throw new Error( `Clip ${ name } failed${ failure ? `: ${ failure.message }` : ': no frames' }` );
		}
		const fontEnd = await smallestText( page, region ).catch( () => ( { css: null } ) );

		const first = frames[ 0 ].t;
		const lines = [ 'ffconcat version 1.0' ];
		frames.forEach( ( f, i ) => {
			const next = frames[ i + 1 ];
			lines.push( `file '${ f.file }'`, `duration ${ ( next ? next.t - f.t : 1 / FPS ).toFixed( 4 ) }` );
		} );
		lines.push( `file '${ frames[ frames.length - 1 ].file }'` );
		fs.writeFileSync( path.join( framesDir, 'frames.txt' ), lines.join( '\n' ) + '\n' );
		const mp4 = `${ stem }.mp4`;
		await ffmpeg( [
			'-f', 'concat', '-safe', '0', '-i', 'frames.txt',
			'-vf', `crop=floor(iw/2)*2:floor(ih/2)*2:0:0,fps=${ FPS },${ TO_YUV }`,
			...x264( 12 ), '-an', '-movflags', '+faststart', this.demo.rawFile( mp4 ),
		], { cwd: framesDir } );
		fs.rmSync( framesDir, { recursive: true, force: true } );

		const sizes = [ fontStart.css, fontEnd.css ].filter( ( n ) => n !== null );
		const minCss = sizes.length ? Math.min( ...sizes ) : null;
		const seconds = frames[ frames.length - 1 ].t - first + 1 / FPS;
		// The longest a single frame stays on screen — a page load shows up here, not in the average.
		const maxGap = Math.max( ...frames.slice( 1 ).map( ( f, i ) => f.t - frames[ i ].t ) );
		const sidecar = {
			tool: toolVersion(),
			id: this.id,
			phase: this.phase,
			name,
			file: mp4,
			wide,
			script: shown( this.script ),
			// Line endings normalised: the same steps saved with CRLF (Windows) or LF (macOS) are the same steps.
			steps: hash( steps.toString().replace( /\r\n/g, '\n' ) ),
			framing: hash( JSON.stringify( { frame: o.frame ?? null, view: meta.view, scale: meta.scale } ) ),
			view: meta.view,
			viewport: meta.viewport,
			scale: meta.scale,
			region,
			display,
			speed: Boolean( o.speed ),
			frames: frames.length,
			fps: Number( ( frames.length / seconds ).toFixed( 1 ) ),
			maxGap: Number( maxGap.toFixed( 3 ) ),
			seconds: Number( seconds.toFixed( 3 ) ),
			smallestText: minCss === null ? null : {
				css: Number( minCss.toFixed( 1 ) ),
				canvas: Number( ( minCss * show ).toFixed( 1 ) ),
				sample: ( fontStart.css === minCss ? fontStart : fontEnd ).sample,
			},
			url,
			startedAt: startedAt.toISOString(),
			browser: this.browser.version(),
			// Fonts render differently on macOS and Windows, and each database is local: the check
			// compares this so a before/after pair from two machines is caught.
			platform: process.platform,
		};
		fs.writeFileSync( this.demo.rawFile( `${ stem }.json` ), JSON.stringify( sidecar, null, '\t' ) + '\n' );
		this.made.push( sidecar );
		const text = sidecar.smallestText;
		const small = text && text.canvas < MIN_PX.footage
			? ` — smallest text ${ text.css } px → ${ text.canvas } px on the canvas ("${ text.sample }"), under ${ MIN_PX.footage }: frame narrower or cut the shot`
			: '';
		console.log( `  ${ mp4 }: ${ sidecar.seconds } s at ${ sidecar.fps } fps (longest frame ${ sidecar.maxGap } s), frame ${ region.width } × ${ region.height } @${ meta.scale }× → ${ display.width } × ${ display.height }${ small }` );
		return sidecar;
	}

	/**
	 * The paced, marked actions inside a clip. Each waits `pace` ms afterwards (§4 "Followable").
	 *
	 * @param {import('playwright').Page} page Page.
	 * @param {number}                    pace Milliseconds between actions.
	 * @return {object} Actions.
	 */
	act( page, pace ) {
		const cap = this;
		const loc = ( target ) => ( typeof target === 'string' ? page.locator( target ).first() : target );
		const pause = ( ms = pace ) => page.waitForTimeout( ms );
		const centre = async ( locator ) => {
			await locator.scrollIntoViewIfNeeded();
			const b = await locator.boundingBox();
			if ( ! b ) {
				throw new Error( 'target is not visible' );
			}
			return { x: b.x + b.width / 2, y: b.y + b.height / 2, b };
		};
		const tapThen = async ( target, action ) => {
			const locator = loc( target );
			const p = await centre( locator );
			await overlay( page, { kind: 'aim', ...p } );
			await pause( 350 );
			await overlay( page, { kind: 'tap', ...p } );
			await action( locator );
			await pause();
		};
		return {
			page,
			click: ( target, options ) => tapThen( target, ( l ) => l.click( options ) ),
			type: ( target, text, { delay = 70 } = {} ) => tapThen( target, async ( l ) => {
				await l.click();
				await l.pressSequentially( text, { delay } );
			} ),
			fill: ( target, value ) => tapThen( target, ( l ) => l.fill( value ) ),
			select: ( target, value ) => tapThen( target, ( l ) => l.selectOption( value ) ),
			check: ( target ) => tapThen( target, ( l ) => l.check() ),
			async hover( target ) {
				const locator = loc( target );
				const p = await centre( locator );
				await overlay( page, { kind: 'aim', ...p } );
				await locator.hover();
				await pause();
				await overlay( page, { kind: 'clear' } );
			},
			async press( key ) {
				await page.keyboard.press( key );
				await pause();
			},
			async scroll( by ) {
				if ( typeof by === 'number' ) {
					await page.evaluate( ( top ) => window.scrollBy( { top, behavior: 'smooth' } ), by );
				} else {
					await loc( by ).evaluate( ( el ) => el.scrollIntoView( { behavior: 'smooth', block: 'center' } ) );
				}
				await page.waitForTimeout( 700 );
				await pause();
			},
			async goto( p ) {
				await page.goto( cap.url( p ) );
				await pause();
			},
			wait: ( ms ) => page.waitForTimeout( ms ),
			waitFor: ( target, options ) => loc( target ).waitFor( options ),
			/** The one highlight (§6): a teal outline; a new one replaces the last. */
			async outline( target ) {
				const { b } = await centre( loc( target ) );
				await overlay( page, { kind: 'outline', x: b.x, y: b.y, width: b.width, height: b.height } );
			},
			clearOutline: () => overlay( page, { kind: 'unoutline' } ),
		};
	}

	/**
	 * A still for evidence (qa.md): `media/raw/<id>-<phase>-<name>.png`.
	 *
	 * @param {import('playwright').Page} page Page.
	 * @param {string}                    name Name.
	 * @param {object}                    o    { frame } for a framed part, { fullPage: true } for the whole page.
	 * @return {Promise<string|null>} File name.
	 */
	async still( page, name, o = {} ) {
		if ( ! NAME.test( name ) ) {
			throw new Error( `Still name "${ name }": lowercase words joined by hyphens.` );
		}
		if ( ! this.wanted( name ) ) {
			console.log( `  skip ${ name }` );
			return null;
		}
		const file = `${ this.id }-${ this.phase }-${ name }.png`;
		const clip = o.frame ? await this.region( page, o.frame ) : undefined;
		await page.screenshot( { path: this.demo.rawFile( file ), clip, fullPage: Boolean( o.fullPage ) && ! clip } );
		this.made.push( { file } );
		console.log( `  ${ file }` );
		return file;
	}

	/**
	 * Lighthouse, three runs, middle score (§4). Run it outside any clip, never while capturing.
	 *
	 * @param {string} p Page path, e.g. '/checkout/'.
	 * @param {object} o { runs, categories, name }.
	 * @return {Promise<object|null>} Summary.
	 */
	async lighthouse( p = '/', o = {} ) {
		const slug = o.name || String( p ).replace( /^https?:\/\/[^/]+/, '' ).replace( /[^a-z0-9]+/gi, '-' ).replace( /^-|-$/g, '' ).toLowerCase() || 'home';
		const name = `lighthouse-${ slug }`;
		if ( ! this.wanted( name ) ) {
			console.log( `  skip ${ name }` );
			return null;
		}
		const stem = this.demo.rawFile( `${ this.id }-${ this.phase }-${ name }` );
		console.log( `  ${ name }: ${ o.runs || 3 } runs…` );
		const summary = await measure( { url: this.url( p ), stem, runs: o.runs, categories: o.categories } );
		const cat = summary.category;
		const scores = summary.runs.map( ( r ) => r.scores[ cat ] ).join( ' · ' );
		console.log( `  ${ path.basename( stem ) }.json — ${ cat } ${ scores } → ${ summary.median.scores[ cat ] } (middle of ${ summary.runs.length }; ${ summary.measured })` );
		this.made.push( { file: `${ path.basename( stem ) }.json`, lighthouse: summary.median.scores[ cat ] } );
		return summary;
	}

	async close() {
		for ( const { context } of this.pages.values() ) {
			await context.close().catch( () => {} );
		}
		this.pages.clear();
	}
}
