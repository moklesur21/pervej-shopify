/**
 * Lighthouse, measured the same way twice (§4 "Measured the same way twice"): mobile, default
 * simulated throttling, a fresh browser profile per run, three runs, the middle score reported, every
 * report kept. Never runs while frames are being captured.
 *
 * On a dev store each run first gets past the password page and opens the preview theme in its own
 * profile, then Lighthouse measures in that same browser — the method of Shopify's lighthouse-ci-action.
 * Lighthouse keeps cookies between those steps, so it measures the theme, not the password page.
 */

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { storeUrl, storefrontPassword } from './env.mjs';
import { assertStorefront, enterPassword, isPasswordPage } from './storefront.mjs';

const require = createRequire( import.meta.url );
const LH_VERSION = JSON.parse( fs.readFileSync( require.resolve( 'lighthouse/package.json' ), 'utf8' ) ).version;
const METRICS = {
	fcp: 'first-contentful-paint',
	lcp: 'largest-contentful-paint',
	tbt: 'total-blocking-time',
	cls: 'cumulative-layout-shift',
	si: 'speed-index',
};

function freePort() {
	return new Promise( ( resolve, reject ) => {
		const server = net.createServer();
		server.on( 'error', reject );
		server.listen( 0, '127.0.0.1', () => {
			const { port } = server.address();
			server.close( () => resolve( port ) );
		} );
	} );
}

/**
 * Run Lighthouse `runs` times against `url` and keep the reports as `<stem>-run<n>.html/.json`
 * plus a summary `<stem>.json`.
 *
 * @param {object}   args            Arguments.
 * @param {string}   args.url        Page to measure.
 * @param {string}   args.stem       Output path without extension.
 * @param {number}   args.runs       Odd number of runs (default 3).
 * @param {string[]} args.categories Lighthouse categories; the median is taken on the first.
 * @param {object|null} args.theme  The preview theme the URL must show, or null for the published one.
 * @return {Promise<object>} Summary.
 */
export async function measure( { url, stem, runs = 3, categories = [ 'performance' ], theme = null } ) {
	if ( runs < 1 || runs % 2 === 0 ) {
		throw new Error( 'Lighthouse runs must be an odd number, so there is a middle value.' );
	}
	const password = storefrontPassword();
	const results = [];
	let chromiumVersion;
	let settings;
	for ( let run = 1; run <= runs; run++ ) {
		const port = await freePort();
		const profile = fs.mkdtempSync( path.join( os.tmpdir(), 'pervej-lighthouse-' ) );
		const context = await chromium.launchPersistentContext( profile, { args: [ `--remote-debugging-port=${ port }` ] } );
		try {
			const page = context.pages()[ 0 ] ?? await context.newPage();
			if ( password ) {
				await enterPassword( page, storeUrl(), password, theme?.id );
			}
			await page.goto( url );
			await assertStorefront( page, theme, `Lighthouse ${ url }` );
			// Leave the tab idle, not on the store, so it doesn't run beside the measured page.
			await page.goto( 'about:blank' );
			const result = await lighthouse( url, { port, output: [ 'html', 'json' ], logLevel: 'error', onlyCategories: categories } );
			const lhr = result.lhr;
			if ( lhr.runtimeError ) {
				throw new Error( `Lighthouse run ${ run }: ${ lhr.runtimeError.message }` );
			}
			if ( isPasswordPage( lhr.finalDisplayedUrl ) ) {
				throw new Error( `Lighthouse run ${ run } ended on the store's password page, so it measured that, not ${ url }.` );
			}
			chromiumVersion = ( lhr.environment?.hostUserAgent?.match( /Chrome\/([\d.]+)/ ) || [] )[ 1 ] ?? chromiumVersion;
			fs.writeFileSync( `${ stem }-run${ run }.html`, result.report[ 0 ] );
			fs.writeFileSync( `${ stem }-run${ run }.json`, result.report[ 1 ] );
			settings = { formFactor: lhr.configSettings.formFactor, throttlingMethod: lhr.configSettings.throttlingMethod };
			const scores = {};
			for ( const c of categories ) {
				scores[ c ] = Math.round( lhr.categories[ c ].score * 100 );
			}
			const metrics = {};
			for ( const [ key, audit ] of Object.entries( METRICS ) ) {
				metrics[ key ] = lhr.audits[ audit ]?.displayValue ?? null;
			}
			results.push( { run, scores, metrics, warnings: lhr.runWarnings } );
		} finally {
			await context.close();
			fs.rmSync( profile, { recursive: true, force: true } );
		}
	}
	const main = categories[ 0 ];
	const sorted = [ ...results ].sort( ( a, b ) => a.scores[ main ] - b.scores[ main ] );
	const median = sorted[ Math.floor( sorted.length / 2 ) ];
	const summary = {
		url,
		measured: `Lighthouse ${ LH_VERSION }, mobile, ${ theme ? 'dev store preview' : 'dev store' }`,
		lighthouse: LH_VERSION,
		chromium: chromiumVersion,
		settings,
		category: main,
		runs: results,
		median,
		at: new Date().toISOString(),
	};
	fs.writeFileSync( `${ stem }.json`, JSON.stringify( summary, null, '\t' ) + '\n' );
	return summary;
}
