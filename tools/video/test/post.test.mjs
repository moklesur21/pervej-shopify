/**
 * The post side of the toolkit (guideline §7a, §7b, §8): the carousel and insight parsers, the words
 * check and the words gate, on a throwaway demo in the OS temp folder with its own git repository.
 * No store, no network, no voice.
 *
 *   npm --prefix tools/video test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseCarousel, parseInsight } from '../lib/script.mjs';
import { resolveDemo } from '../lib/paths.mjs';
import { checkWords } from '../lib/checks.mjs';
import { wordsGate } from '../lib/gate.mjs';

const LABEL = 'Practice build from a public job brief. Anonymised.';
const ASK = 'When the next one lands, message me.';
// The smallest valid PNG: the check only needs the still to exist.
const PNG = Buffer.from( 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64' );

const FILES = {
	'brief.md': 'A UK agency, for a florist. A coupon left checkout spinning forever. Needed by Wednesday, end of day.\n',
	'spec.md': '## Plan\nPlan: find the hook, fix it once, test with a coupon. Delivery promised Wed, end of day.\n',
	'log.md': '| Event | Time |\n|---|---|\n| Brief received | Mon 10:00 |\n| Handoff written | Wed 15:10 |\n',
	'qa.md': '| # | Item | Result |\n|---|---|---|\n| 1 | Lighthouse 61 before, 74 after | Pass |\n',
	'handoff.md': '## How to roll back\n\nDeactivate it.\n\n## What I\'d flag to the client\n\nCheck the abandoned carts from the broken week.\n',
	'post/script.md': [
		'| # | Sec | On screen | Line in the bottom band | Spoken | Source |',
		'|---|---|---|---|---|---|',
		'| 1 | 0–6 | Slide: *A coupon left checkout spinning forever.* | A coupon left checkout spinning forever. | A coupon left checkout spinning forever. | brief |',
		'| 2 | 6–13 | Slide: *Delivery promised Wed, end of day* | The plan. | The fix was promised for Wednesday. | plan |',
		'| 3 | 13–20 | Timeline: *Mon 10:00 brief received* *Wed 15:10 handed over* | Promised Wednesday, delivered Wednesday. | Handed over on Wednesday afternoon. | log |',
		`| 4 | 20–24 | End card | ${ ASK } | ${ ASK } | brief |`,
		'',
	].join( '\n' ),
	'post/copy.md': [
		'## Post', '', '```text', 'A coupon left checkout spinning forever.', LABEL, '',
		'An agency needed a florist\'s checkout working again by Wednesday, end of day. Shoppers with a code saw a spinner that never stopped, and nothing else on the store looked wrong at all.',
		'',
		'One cause, one fix, then a test order with a coupon before handing it over on Wednesday afternoon, as promised to the agency and its client, with a rollback note beside it.',
		'', ASK, '```', '', '## Alternative first lines', '', '1. Checkout spun forever for coupon holders.', '2. One question found the cause.', '',
	].join( '\n' ),
	'post/carousel.md': [
		'| # | Middle | Band | Source |', '|---|---|---|---|',
		'| 1 | Still before-checkout | A coupon left checkout spinning forever. | brief |',
		'| 2 | Slide: *A UK agency, for a florist* | The brief. | brief |',
		'| 3 | Slide: *Plan: find the hook, fix it once* | Delivery promised Wed, end of day. | spec |',
		'| 4 | Slide: *One cause, one fix* | The fix. | handoff |',
		'| 5 | Checklist: *Lighthouse 61 before, 74 after* | QA passed. | qa |',
		'| 6 | Timeline: *Mon 10:00 brief received* *Wed 15:10 handed over* | Promised Wednesday, delivered Wednesday. | log |',
		'| 7 | End card: *Check the abandoned carts from the broken week.* | ' + ASK + ' | handoff |',
		'', '## Post', '', '```text', 'Promised Wednesday, end of day. Handed over Wednesday 15:10.', LABEL, '',
		'A coupon left checkout spinning forever.', '',
		'The pages show the brief, the plan, the fix, QA and what I\'d flag to the client.', '', ASK, '```', '',
		'## Alternative first lines', '', '1. A spinning checkout, page by page.', '2. The coupon bug in seven pages.', '',
		'## Document title', '', 'Checkout spins when a coupon is applied', '',
	].join( '\n' ),
	'post/insight.md': [
		'## Image', '', 'Layout: still', 'Still: before-checkout', 'Line: A broken coupon doesn\'t take a store down. It quietly loses orders.', 'Source: handoff', '',
		'<!-- Layout: number -->', '',
		'## Post', '', '```text', 'A broken checkout rarely looks like an outage. It looks like a slow week.', '',
		'I recreated a coupon bug that left checkout spinning forever.', LABEL, '',
		'Nothing else looked wrong. The store stayed up, products loaded and every other page worked. The only symptom was the orders that never arrived: from shoppers holding a code, the people a promotion exists to bring in.', '',
		'So the fix wasn\'t the end of it. What I\'d flag to the client: coupons failed for a week, and that week\'s abandoned carts are worth a look before the next campaign goes out.', '',
		'After any update that touches checkout, I\'d place one test order with a coupon before calling it done.', '```', '',
		'## Alternative first lines', '', '1. The costliest checkout bugs leave the store looking fine.', '2. A store can be up and still lose its promotion\'s orders.', '',
		'## Alt text', '', 'A checkout order summary with a spinner that never stops.', '',
	].join( '\n' ),
};

function git( cwd, ...args ) {
	const r = spawnSync( 'git', [ '-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args ], { cwd, encoding: 'utf8', windowsHide: true } );
	assert.equal( r.status, 0, r.stderr );
}

function fixture( change = {} ) {
	const dir = path.join( fs.mkdtempSync( path.join( os.tmpdir(), 'pervej-post-' ) ), 'zz-post-test' );
	for ( const [ name, text ] of Object.entries( { ...FILES, ...change } ) ) {
		fs.mkdirSync( path.dirname( path.join( dir, name ) ), { recursive: true } );
		fs.writeFileSync( path.join( dir, name ), text );
	}
	fs.mkdirSync( path.join( dir, 'media', 'raw' ), { recursive: true } );
	fs.writeFileSync( path.join( dir, 'media', 'raw', 'zz-post-test-before-checkout.png' ), PNG );
	git( dir, 'init', '-q' );
	git( dir, 'add', '-A' );
	git( dir, 'commit', '-qm', 'fixture' );
	return resolveDemo( dir );
}

test( 'carousel.md: pages, the end card lead, copy and title; comments are notes', () => {
	const c = parseCarousel( FILES[ 'post/carousel.md' ] + '\n<!-- | 8 | Slide: *never read* | x | brief | -->\n' );
	assert.deepEqual( c.errors, [] );
	assert.equal( c.pages.length, 7 );
	assert.deepEqual( c.pages[ 0 ].middle, { kind: 'still', name: 'before-checkout', phase: 'before' } );
	assert.equal( c.pages[ 6 ].middle.lead, 'Check the abandoned carts from the broken week.' );
	assert.equal( c.title, 'Checkout spins when a coupon is applied' );
	assert.equal( c.copy.alternatives.length, 2 );
} );

test( 'insight.md: the still layout, a commented-out alternative ignored, an outside figure read', () => {
	const i = parseInsight( FILES[ 'post/insight.md' ] );
	assert.deepEqual( i.errors, [] );
	assert.equal( i.image.layout, 'still' );
	assert.equal( i.alt, 'A checkout order summary with a spinner that never stops.' );
	const n = parseInsight( '## Image\n\nLayout: number\nNumber: 70%\nLine: Most carts are left.\nSource line: Baymard\nSource: qa\n\n## Outside figure\n\n| Source | URL | Sentence | Checked |\n|---|---|---|---|\n| Baymard | https://baymard.com/x | About 70% of carts are abandoned | 9 Oct 2026 |\n' );
	assert.equal( n.image.number, '70%' );
	assert.equal( n.outside.length, 1 );
	assert.equal( n.outside[ 0 ].url, 'https://baymard.com/x' );
} );

test( 'the words check passes clean words, and the gate opens on them once committed', async () => {
	const demo = fixture();
	const words = await checkWords( demo );
	assert.deepEqual( words.problems, [] );
	assert.equal( words.ok, true );
	assert.equal( ( await wordsGate( demo ) ).ok, true );
} );

test( 'the gate refuses words changed since their last commit', async () => {
	const demo = fixture();
	fs.appendFileSync( path.join( demo.post, 'script.md' ), '\n<!-- a note -->\n' );
	const gate = await wordsGate( demo );
	assert.equal( gate.ok, false );
	assert.match( gate.reason, /changed since their last commit/ );
} );

test( 'planted errors fail the words check: an unsourced number, a question and the ask, a repeated first line', async () => {
	const demo = fixture( {
		'post/carousel.md': FILES[ 'post/carousel.md' ].replace( '74 after', '99 after' ),
		'post/insight.md': FILES[ 'post/insight.md' ]
			.replace( 'A broken checkout rarely looks like an outage. It looks like a slow week.', 'Promised Wednesday, end of day. Handed over Wednesday 15:10.' )
			.replace( 'before calling it done.', `before calling it done. Would you? ${ ASK }` ),
	} );
	const words = await checkWords( demo );
	assert.equal( words.ok, false );
	const all = words.problems.join( '\n' );
	assert.match( all, /carousel page 5: "99" is not in qa\.md/ );
	assert.match( all, /asks a question/ );
	assert.match( all, /carries the ask/ );
	assert.match( all, /carousel and insight posts open on the same sentence/ );
	assert.equal( ( await wordsGate( demo ) ).ok, false );
} );
