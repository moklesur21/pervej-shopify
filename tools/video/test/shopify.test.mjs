/**
 * The capture side against a mock password-protected dev store (test/mock-store.mjs):
 *
 *   npm --prefix tools/video test
 *
 * Proves the toolkit gets past the password page, stays on the demo's preview theme, keeps the
 * preview bar out of frame, signs a classic-accounts customer in, measures Lighthouse on the theme
 * rather than the password page, and fails with a clear message when any of that goes wrong.
 * The real dev store stays the final proof (docs/demo-procedure.md Stage 0).
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { startMockStore } from './mock-store.mjs';
import { resolveDemo } from '../lib/paths.mjs';
import { previewTheme } from '../lib/env.mjs';
import { Capture } from '../lib/capture-kit.mjs';
import { measure } from '../lib/lighthouse.mjs';
import { LEAK } from '../lib/checks.mjs';

const PASSWORD = 'mock-storefront-pass';
const LIVE = { id: 100, name: 'Published theme' };
const BEFORE = { id: 201, name: 's99-mock-test · before' };
const AFTER = { id: 202, name: 's99-mock-test · after' };
const CUSTOMER = { email: 'nadia@example.com', password: 'mock-customer-pass' };
const QUICK = { frame: 'main', lead: 100, tail: 100, pace: 100 };

let store;
let browser;
let root;
let demo;

before( async () => {
	store = await startMockStore( { password: PASSWORD, live: LIVE, previews: [ BEFORE, AFTER ], customer: CUSTOMER } );
	Object.assign( process.env, {
		SHOPIFY_STORE: store.url,
		SHOPIFY_STOREFRONT_PASSWORD: PASSWORD,
		PERVEJ_CAPTURE_USER: CUSTOMER.email,
		PERVEJ_CAPTURE_PASS: CUSTOMER.password,
	} );
	root = fs.mkdtempSync( path.join( os.tmpdir(), 'pervej-capture-test-' ) );
	const dir = path.join( root, 's99-mock-test' );
	fs.mkdirSync( path.join( dir, 'media' ), { recursive: true } );
	const host = new URL( store.url ).host;
	fs.writeFileSync( path.join( dir, 'media', 'themes.json' ), JSON.stringify( { before: { ...BEFORE, store: host }, after: { ...AFTER, store: host } } ) );
	demo = resolveDemo( dir );
	browser = await chromium.launch();
} );

after( async () => {
	await browser?.close();
	await store?.close();
	fs.rmSync( root, { recursive: true, force: true } );
} );

const capture = ( phase, label ) => new Capture( { demo, phase, browser, script: path.join( root, 'shoot.mjs' ), theme: previewTheme( demo, label ) } );

test( 'a clip is recorded on the before theme, past the password page, with the preview bar hidden', async () => {
	const cap = capture( 'before', 'before' );
	try {
		const page = await cap.open();
		await page.goto( cap.url( '/products/a' ) );
		const sidecar = await cap.clip( page, 'add', QUICK, async ( act ) => {
			await act.click( '#add' );
		} );
		assert.deepEqual( { id: sidecar.theme.id, role: sidecar.theme.role, label: sidecar.theme.label }, { id: BEFORE.id, role: 'unpublished', label: 'before' } );
		assert.ok( fs.existsSync( demo.rawFile( sidecar.file ) ), 'the clip file exists' );
		assert.match( sidecar.url, /preview_theme_id=201&_fd=0&pb=0/ );
		// pb=0 keeps the bar away; if the store shows it anyway, it is hidden.
		await page.goto( cap.url( '/products/c' ).replace( 'pb=0', 'pb=1' ) + '&bar=1' );
		assert.equal( await page.$eval( '#PBarNextFrameWrapper', ( el ) => getComputedStyle( el ).display ), 'none' );
	} finally {
		await cap.close();
	}
} );

test( 'the after phase records on the after theme; a page load inside a clip stays on it and keeps recording', async () => {
	const cap = capture( 'after', 'after' );
	try {
		const page = await cap.open();
		await page.goto( cap.url( '/products/a' ) );
		// Four page loads in a row: a screenshot started during a load used to hang for 10 s and cut
		// the footage off at the first click.
		const sidecar = await cap.clip( page, 'next', { ...QUICK, tail: 1500 }, async ( act ) => {
			for ( let i = 0; i < 4; i++ ) {
				await act.click( '#next' );
				await act.waitFor( '.title' );
			}
		} );
		assert.equal( sidecar.theme.id, AFTER.id );
		// The footage runs through every load and the tail, not cut off at the first click.
		assert.ok( sidecar.seconds > 3, `the clip covers ${ sidecar.seconds } s` );
		assert.ok( sidecar.maxGap < 1, `the page load holds one frame for ${ sidecar.maxGap } s` );
	} finally {
		await cap.close();
	}
} );

test( 'a page that loses the preview fails the clip and names both themes', async () => {
	const cap = capture( 'after', 'after' );
	try {
		const page = await cap.open();
		await page.goto( `${ store.url }/products/a?preview_theme_id=${ BEFORE.id }` );
		await assert.rejects( cap.clip( page, 'lost', QUICK, async () => {} ), /shows theme "s99-mock-test · before" \(#201, unpublished\), not "s99-mock-test · after" \(#202\)/ );
	} finally {
		await cap.close();
	}
} );

test( 'a wrong or missing storefront password stops the capture with a clear message', async () => {
	for ( const [ value, message ] of [ [ 'wrong', /storefront password was rejected/ ], [ '', /password page is showing/ ] ] ) {
		process.env.SHOPIFY_STOREFRONT_PASSWORD = value;
		const cap = capture( 'before', 'before' );
		try {
			await assert.rejects( cap.open(), message );
		} finally {
			process.env.SHOPIFY_STOREFRONT_PASSWORD = PASSWORD;
			await cap.close();
		}
	}
} );

test( 'a theme never pushed, or pushed to another store, is named with the command that fixes it', () => {
	const fresh = path.join( root, 's98-no-themes' );
	fs.mkdirSync( path.join( fresh, 'media' ), { recursive: true } );
	const other = resolveDemo( fresh );
	assert.throws( () => previewTheme( other, 'before' ), /tools\/shopify\/theme\.sh push s98-no-themes before/ );
	fs.writeFileSync( path.join( fresh, 'media', 'themes.json' ), JSON.stringify( { before: { ...BEFORE, store: 'someone-else.myshopify.com' } } ) );
	assert.throws( () => previewTheme( other, 'before' ), /pushed to someone-else\.myshopify\.com/ );
	assert.equal( previewTheme( other, 'live' ), null );
	assert.deepEqual( previewTheme( other, '777' ), { id: 777, label: '#777', name: null } );
} );

test( 'a classic-accounts customer is signed in before recording; admin and adminBar are refused', async () => {
	const cap = capture( 'qa', 'after' );
	try {
		const page = await cap.open( { signIn: 'customer' } );
		await page.goto( cap.url( '/account' ) );
		assert.equal( new URL( page.url() ).pathname, '/account' );
		assert.equal( await page.textContent( '.who' ), CUSTOMER.email );
		// Checkout declares no theme: evidence there is allowed.
		await page.goto( cap.url( '/checkouts/cn/1' ) );
		assert.ok( await cap.still( page, 'checkout' ) );
		await assert.rejects( cap.open( { signIn: 'admin' } ), /only "customer" can be scripted/ );
		await assert.rejects( cap.open( { adminBar: true } ), /WordPress option/ );
	} finally {
		await cap.close();
	}
} );

test( 'an emulated phone opens past the password page on the theme; the sidecar times every click and typed stretch', async () => {
	const cap = capture( 'qa', 'after' );
	try {
		const page = await cap.open( { device: 'iPhone 15' } );
		assert.ok( await page.evaluate( () => navigator.maxTouchPoints > 0 ), 'the emulated phone has touch' );
		await page.goto( cap.url( '/account/login' ) );
		const field = 'input[name="customer[email]"]';
		const sidecar = await cap.clip( page, 'phone-type', { ...QUICK, frame: 'column' }, async ( act ) => {
			await act.click( field );
			await act.type( field, 'test@example.com' );
		} );
		assert.equal( sidecar.device, 'iPhone 15' );
		assert.equal( sidecar.theme.id, AFTER.id );
		// A click, then type's own tap and its typed stretch: the render puts a click and typing there.
		assert.deepEqual( sidecar.events.map( ( e ) => e.do ), [ 'click', 'click', 'type' ] );
		const typed = sidecar.events[ 2 ];
		assert.ok( typed.end > typed.t, `the typed stretch runs ${ typed.t }–${ typed.end } s` );
		await assert.rejects( cap.open( { device: 'No Such Phone' } ), /Unknown device/ );
	} finally {
		await cap.close();
	}
} );

test( 'Lighthouse measures the preview theme, not the password page', async () => {
	const stem = path.join( root, 'lighthouse' );
	const theme = previewTheme( demo, 'after' );
	const summary = await measure( { url: `${ store.url }/?preview_theme_id=${ AFTER.id }&_fd=0&pb=0`, stem, runs: 1, theme } );
	assert.equal( typeof summary.median.scores.performance, 'number' );
	assert.match( summary.measured, /mobile, dev store preview$/ );
	const lhr = JSON.parse( fs.readFileSync( `${ stem }-run1.json`, 'utf8' ) );
	assert.equal( new URL( lhr.finalDisplayedUrl ).pathname, '/' );
	assert.ok( summary.chromium, 'the browser version is recorded' );
} );

test( 'the self-check counts store domains and preview links as leaks', () => {
	assert.ok( LEAK.test( 'kiln-and-cove.myshopify.com' ) );
	assert.ok( LEAK.test( 'open ?preview_theme_id=123' ) );
	assert.ok( ! LEAK.test( 'Checkout spins forever when a coupon is applied.' ) );
	assert.ok( ! LEAK.test( 'pervej.com' ) );
} );
