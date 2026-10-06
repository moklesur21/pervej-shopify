/**
 * Lighthouse, measured the same way twice (§4 "Measured the same way twice"): mobile, default
 * simulated throttling, a fresh browser per run, three runs, the middle score reported, every
 * report kept. Never runs while frames are being captured.
 */

import fs from 'node:fs';
import net from 'node:net';
import { createRequire } from 'node:module';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

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
 * @return {Promise<object>} Summary.
 */
export async function measure( { url, stem, runs = 3, categories = [ 'performance' ] } ) {
	if ( runs < 1 || runs % 2 === 0 ) {
		throw new Error( 'Lighthouse runs must be an odd number, so there is a middle value.' );
	}
	// Lighthouse always runs signed out. With WooCommerce's Coming soon mode on, a store page answers a
	// signed-out visitor with the placeholder, and the score would be the placeholder's, not the page's.
	const html = await fetch( url ).then( ( r ) => r.text() ).catch( () => '' );
	if ( html.includes( 'wp-block-woocommerce-coming-soon' ) ) {
		throw new Error( `${ url } shows WooCommerce's Coming soon page to signed-out visitors, so Lighthouse would measure that, not the page. Make the store live (WooCommerce → Settings → Site visibility), then measure again.` );
	}
	const results = [];
	let chromiumVersion;
	let settings;
	for ( let run = 1; run <= runs; run++ ) {
		const port = await freePort();
		const browser = await chromium.launch( { args: [ `--remote-debugging-port=${ port }` ] } );
		chromiumVersion = browser.version();
		try {
			const result = await lighthouse( url, { port, output: [ 'html', 'json' ], logLevel: 'error', onlyCategories: categories } );
			const lhr = result.lhr;
			if ( lhr.runtimeError ) {
				throw new Error( `Lighthouse run ${ run }: ${ lhr.runtimeError.message }` );
			}
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
			await browser.close();
		}
	}
	const main = categories[ 0 ];
	const sorted = [ ...results ].sort( ( a, b ) => a.scores[ main ] - b.scores[ main ] );
	const median = sorted[ Math.floor( sorted.length / 2 ) ];
	const summary = {
		url,
		measured: `Lighthouse ${ LH_VERSION }, mobile, local site`,
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
