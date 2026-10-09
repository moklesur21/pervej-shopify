/**
 * The self-check (guideline §8), written into post/check.md: layer 1 of three (self-check, audit, go).
 *
 * Words only (check.mjs <id> --words, and the gate before any voice or render): the words of all
 * three posts — script, copies, carousel pages, the insight image's words — against their sources,
 * the banned words, the stand-alone rule and the counts. Everything (check.mjs <id>, and after each
 * render): adds the delivery, the clips, and each rendered file — the video (a manifest for the current
 * script.md), the carousel PDF and the insight image (manifests for the current carousel.md and
 * insight.md). What a machine cannot judge — the leaks scan of every frame, page and image — is LOOK
 * until a look is recorded under "## Looked at" for that render's hash.
 *
 * Only the block between the check:begin and check:end markers is rewritten; "## Looked at" and
 * "## Decisions" (every decision made without asking, §3) are never touched.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readText } from './paths.mjs';
import { loadPackage } from './package.mjs';
import { imageText, onScreenText, pageText, plain, section, tables, words } from './script.mjs';
import { pngSize } from './slides.mjs';
import { ffmpeg, FROM_YUV, probe } from './ffmpeg.mjs';
import { CANVAS, FPS, MIN_PX, PACE, SPEC, STRIP, VOICE } from './layout.mjs';
import { loudness } from './audio.mjs';
import { config as voiceConfig } from './elevenlabs.mjs';
import { spokenWordCount } from './voice.mjs';

const BEGIN = '<!-- check:begin — written by tools/video/check.mjs; everything up to check:end is replaced on every run -->';
const END = '<!-- check:end -->';
const LOOKED = [
	'## Looked at',
	'',
	'Checks that need eyes. One row per look; a look counts only for the hash it names: the video\'s render hash (printed on every contact sheet), the carousel\'s and the insight image\'s (printed by their commands and in the check\'s header).',
	'',
	'| Check | Render | Result | By · when | Note |',
	'|---|---|---|---|---|',
].join( '\n' );
const DECISIONS = [
	'## Decisions',
	'',
	'Every decision made without asking (guideline §3): a wording choice, a framing, a slide that ran long — what was decided and why.',
	'',
	'| Decision | Why |',
	'|---|---|',
].join( '\n' );

const BANNED = [
	[ /\bcase stud(?:y|ies)\b/i, '"case study"' ],
	[ /\b(?:my|our) clients?\b|\ba recent project\b|\bclient work\b|\bpaid (?:project|work|job)\b/i, 'presents the demo as paid work' ],
	[ /\b(?:upwork|fiverr|freelancer\.com|peopleperhour|toptal|guru\.com|99designs)\b/i, 'a freelance marketplace' ],
	[ /[$€£৳]\s?\d|\b\d+\s?(?:usd|dollars?|bdt|taka)\b|\bpric(?:e|es|ed|ing)\b|\bhourly\b|\bbudget\b/i, 'a price' ],
	[ /\bfree\b/i, '"free"' ],
	[ /\bterms\b|\bNDA\b|\blog-?ins?\b|\bpasswords?\b|\bcredentials?\b/i, 'terms, NDA or logins' ],
	[ /\bAI\b|\bA\.I\./, 'AI' ],
	[ /\b(?:claude|anthropic|chatgpt|openai|gpt-?\d\w*|copilot|gemini|llms?|artificial intelligence|machine learning)\b/i, 'an AI tool' ],
	[ /\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|minutes?|mins?)\b/i, 'effort totalled' ],
	[ /\bexcited\b|\bi'?d love to\b|\bavailable for (?:work|hire)\b|\bhire me\b/i, 'not an expert\'s voice' ],
	[ /\bhow to\b|\btips?\b|\blessons?\b/i, 'teaching' ],
];
const COPY_ONLY = [
	[ /(?:^|\s)#\w/m, 'a hashtag' ],
	[ /(?:^|\s)@\w/m, 'a tag' ],
	[ /\p{Extended_Pictographic}/u, 'an emoji' ],
	[ /\b(?:like|comment|share|repost)\b[^.\n]{0,30}\b(?:below|this post|if you)\b|\bwatch (?:to|till|until) the end\b|\bsave (?:this|it) for\b/i, 'asks for engagement' ],
	[ /\bswip(?:e|ing)\b/i, '"swipe"' ],
];
/** Each post stands alone (§2): no pointer to the other two. */
const CROSS_REF = /\bpart (?:\d|one|two|three)\b|\b(?:see|watch|in) the (?:video|carousel|pages)\b|\b(?:previous|last|next|earlier) post\b|\byesterday's post\b/i;
/** The insight post (§7b): never a claim about the reader, a list of tips, or a time the publish date can make wrong. */
const READER_CLAIM = /\bmost (?:agencies|stores|developers|owners)\b|\byou (?:probably|likely|might)\b|\bagencies (?:don't|do not|never|always|rarely)\b/i;
const TIME_WORDS = /\b(?:last|this|next) (?:week|month|year|weekend)\b|\byesterday\b|\btoday\b|\btomorrow\b|\brecently\b|\bthis morning\b/i;
const NUMBERED = /^\s*\d+[.)]\s/m;
const LIMITS = { pageWords: 30, imageWords: 20, carouselCopy: [ 40, 90 ], insightCopy: [ 100, 180 ], firstLine: 80, title: 60, pdfBytes: 10 * 1024 * 1024, insightBytes: 5 * 1024 * 1024, insightCanvas: 1200, pages: [ 8, 10 ] };
const INSIGHT_PX = { label: 34, line: 60, number: 160, source: 34 };
export const LEAK = /[A-Za-z]:\\|(?:^|\s)\/[\w.-]+\/|\.(?:php|mjs|js|json|md)\b|wp-(?:content|admin|includes)|myshopify\.com|preview_theme_id|localhost|127\.0\.0\.1|https?:\/\/|\b[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
const NUMBER = /\d+(?:[:.,/]\d+)*%?/g;
const TIME = /\b\d{1,2}:\d{2}\b/g;

const escapeRe = ( s ) => s.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
const has = ( corpus, token ) => new RegExp( `(?<![\\d])${ escapeRe( token ) }(?![\\d])` ).test( corpus );
const cell = ( text ) => String( text ).replace( /\r?\n/g, '; ' ).replace( /\|/g, '\\|' );

function stamp( date = new Date() ) {
	const parts = Object.fromEntries( new Intl.DateTimeFormat( 'en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' } ).formatToParts( date ).map( ( p ) => [ p.type, p.value ] ) );
	return `${ parts.weekday } ${ parts.day } ${ parts.month } ${ parts.year } ${ parts.hour }:${ parts.minute }`;
}

function row( check, result, detail ) {
	return { check, result, detail };
}

/** Raw RGB of the top strip, one frame per second of a video (or of one PNG). */
async function strips( file, everySecond ) {
	const select = everySecond ? `select=not(mod(n\\,${ FPS })),` : '';
	const args = [ '-i', file, '-vf', `${ select }crop=${ CANVAS }:${ STRIP.height }:0:0,scale=${ FROM_YUV },format=rgb24` ];
	if ( everySecond ) {
		args.push( '-fps_mode', 'vfr' );
	}
	const { stdout } = await ffmpeg( [ ...args, '-f', 'rawvideo', '-' ] );
	return stdout;
}

/** A command's manifest, if it was made from the current file; `stale` when an older one exists. */
function rendered( dir, sha, key, finalFile ) {
	const text = readText( path.join( dir, 'manifest.json' ) );
	const m = text ? JSON.parse( text ) : null;
	const current = Boolean( m && sha && m[ key ] === sha && fs.existsSync( finalFile ) );
	return { manifest: current ? m : null, stale: Boolean( m ) && ! current && fs.existsSync( finalFile ) };
}

const same = ( a, b ) => plain( a ).toLowerCase().replace( /[^\p{L}\p{N}]+/gu, ' ' ).trim() === plain( b ).toLowerCase().replace( /[^\p{L}\p{N}]+/gu, ' ' ).trim();

/**
 * Run the self-check and write it into post/check.md.
 *
 * @param {object}  demo       Demo paths.
 * @param {object}  opts       Options.
 * @param {boolean} opts.words Words only (the rows checked before anything is voiced).
 * @return {Promise<boolean>} True when every row passed (nothing failed, nothing left to look at).
 */
export async function runCheck( demo, { words: wordsOnly = false } = {} ) {
	const { rows, header, open, waiting } = await collect( demo, wordsOnly );
	let summary;
	if ( open.length ) {
		summary = `**Not passed:** ${ open.map( ( r ) => `${ r.check } (${ r.result })` ).join( ', ' ) }. A fail is fixed or reported, never waved through.`;
	} else if ( wordsOnly ) {
		summary = '**The words passed.** The voice and the renders may run.';
	} else if ( waiting.length ) {
		summary = `**Every row checked so far passed.** Still to check: ${ waiting.map( ( r ) => r.check ).join( ', ' ) }.`;
	} else {
		summary = '**Every row passed.** Next: the audit by a separate reviewer (§8).';
	}
	writeCheck( demo, header, rows, summary );
	for ( const r of rows ) {
		console.log( `  ${ r.result.padEnd( 4 ) }  ${ r.check } — ${ r.detail }` );
	}
	console.log( `\n${ summary.replace( /\*\*/g, '' ) }\nWritten to ${ path.join( 'post', 'check.md' ) }.` );
	return ! open.length;
}

/**
 * The words rows, run live and written nowhere: the gate before any voice or render (§8, §10).
 *
 * @param {object} demo Demo paths.
 * @return {Promise<{ok: boolean, problems: string[]}>} Result.
 */
export async function checkWords( demo ) {
	const { open } = await collect( demo, true );
	return { ok: ! open.length, problems: open.map( ( r ) => `${ r.check }: ${ r.detail }` ) };
}

async function collect( demo, wordsOnly ) {
	const pkg = loadPackage( demo );
	const { brand, script, copy, clips, plan, carousel, insight } = pkg;
	const rows = [];
	const scenes = script.scenes;
	const file = ( name ) => readText( demo.file( name ) );
	const carouselDir = path.join( demo.media, 'carousel' );
	const insightDir = path.join( demo.media, 'insight' );
	const pdf = demo.finalFile( 'carousel.pdf' );
	const png = demo.finalFile( 'insight.png' );
	const cr = wordsOnly ? { manifest: null, stale: false } : rendered( carouselDir, pkg.carouselSha, 'carousel', pdf );
	const ir = wordsOnly ? { manifest: null, stale: false } : rendered( insightDir, pkg.insightSha, 'insight', png );
	const pages = carousel?.pages || [];
	const pageTexts = pages.map( ( page ) => ( { page, texts: pageText( page, brand ) } ) );
	const carouselPost = carousel?.copy.post || '';
	const carouselLines = ( carousel?.copy.lines || [] ).map( ( l ) => l.trim() );
	const image = insight?.image || null;
	const imageWords = image ? imageText( image ) : [];
	const insightPost = insight?.copy.post || '';
	const insightLines = ( insight?.copy.lines || [] ).map( ( l ) => l.trim() );
	const demoFiles = [ 'brief.md', 'spec.md', 'log.md', 'qa.md', 'handoff.md' ].map( ( name ) => file( name ) || '' ).join( '\n' );

	const manifestText = readText( path.join( demo.work, 'manifest.json' ) );
	const manifest = manifestText ? JSON.parse( manifestText ) : null;
	const mp4 = demo.finalFile( 'linkedin.mp4' );
	const cut = ! wordsOnly && Boolean( manifest && manifest.script === pkg.scriptSha && fs.existsSync( mp4 ) );
	const usedClips = [ ...new Set( scenes.flatMap( ( s ) => s.shots.filter( ( shot ) => shot.kind === 'clip' ).map( ( shot ) => shot.name ) ) ) ];
	// What the viewer reads, and — for sources, banned words and leaks — what the voice says too.
	const texts = scenes.map( ( s ) => ( { scene: s, texts: [ ...onScreenText( s, brand ), ...( s.spoken ? [ s.spoken ] : [] ) ] } ) );
	const allScreen = scenes.flatMap( ( s ) => onScreenText( s, brand ) );
	const allSpoken = scenes.map( ( s ) => s.spoken ).filter( Boolean );
	const post = copy.post || '';
	const postLines = copy.lines.map( ( l ) => l.trim() );

	{
		const errors = [ ...pkg.errors, ...pkg.postErrors ];
		if ( ! carousel ) {
			errors.push( 'post/carousel.md does not exist yet' );
		}
		if ( ! insight ) {
			errors.push( 'post/insight.md does not exist yet' );
		}
		if ( errors.length ) {
			rows.push( row( 'Script and copy', 'FAIL', errors.join( ' · ' ) ) );
		}
	}

	// Delivery: what the client would have checked at acceptance (demo plan §4.3).
	if ( ! wordsOnly ) {
		const problems = [];
		const raw = fs.existsSync( demo.raw ) ? fs.readdirSync( demo.raw ) : [];
		if ( ! raw.some( ( f ) => f.startsWith( `${ demo.id }-before-` ) && f.endsWith( '.mp4' ) ) ) {
			problems.push( 'no before clip in media/raw/' );
		}
		const qa = file( 'qa.md' );
		const table = qa === null ? null : tables( qa ).find( ( t ) => t.header.some( ( h ) => /^result$/i.test( h.trim() ) ) );
		if ( ! table ) {
			problems.push( qa === null ? 'qa.md does not exist' : 'qa.md has no table with a Result column' );
		} else {
			const at = table.header.findIndex( ( h ) => /^result$/i.test( h.trim() ) );
			const open = table.rows.filter( ( r ) => r.some( Boolean ) && ! /^(?:pass(?:ed)?|ok|✓)\b/i.test( plain( r[ at ] ) ) );
			if ( open.length ) {
				problems.push( `qa.md: ${ open.length } line(s) not passed — ${ open.map( ( r ) => plain( r[ 0 ] ) ).join( ', ' ) }` );
			}
		}
		const handoff = ( file( 'handoff.md' ) || '' ).replace( /\r/g, '' );
		for ( const [ heading, what ] of [ [ /How to roll back/, 'the rollback note' ], [ /What I.d flag to the client/, 'the flag' ] ] ) {
			const body = ( section( handoff, heading ) || '' ).trim();
			if ( ! body || body.startsWith( '<' ) ) {
				problems.push( `handoff.md has no ${ what }` );
			}
		}
		rows.push( row( 'Delivery', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : 'a before clip exists, every qa.md line passed, handoff.md has the rollback note and the flag' ) );
	}

	// Label.
	{
		const problems = [];
		const details = [];
		if ( postLines[ 1 ] !== brand.label ) {
			problems.push( `copy line 2 is "${ postLines[ 1 ] || '' }", not the label` );
		} else {
			details.push( 'line 2 of the copy is the label' );
		}
		if ( carousel && carouselLines[ 1 ] !== brand.label ) {
			problems.push( `carousel copy line 2 is "${ carouselLines[ 1 ] || '' }", not the label` );
		}
		if ( insight && ! insightLines.slice( 1 ).includes( brand.label ) ) {
			problems.push( 'the insight copy has no line that is the label, in full, after the demo is mentioned' );
		}
		if ( cr.manifest ) {
			if ( cr.manifest.label !== brand.label ) {
				problems.push( 'the carousel pages were drawn with another label' );
			} else {
				details.push( `the label is on all ${ cr.manifest.pages.length } carousel pages` );
			}
		}
		if ( ir.manifest ) {
			const needs = image?.layout === 'still' || ! ir.manifest.outsideNumber;
			if ( needs && ir.manifest.label !== brand.label ) {
				problems.push( 'the insight image shows the demo but has no label strip' );
			} else if ( ir.manifest.label ) {
				details.push( 'the insight image carries the label strip' );
			}
		}
		if ( cut ) {
			const ref = await strips( path.join( demo.work, manifest.labelRef ), false );
			const all = await strips( mp4, true );
			const size = ref.length;
			const count = Math.floor( all.length / size );
			let bad = 0;
			for ( let f = 0; f < count; f++ ) {
				let sum = 0;
				for ( let i = 0; i < size; i++ ) {
					sum += Math.abs( all[ f * size + i ] - ref[ i ] );
				}
				if ( sum / size > 6 ) {
					bad++;
				}
			}
			if ( bad ) {
				problems.push( `label strip differs on ${ bad } of ${ count } frames sampled every second` );
			} else {
				details.push( `the label strip matches on all ${ count } frames sampled every second` );
			}
		} else if ( ! wordsOnly ) {
			details.push( 'the video frames are checked after the render' );
		}
		rows.push( row( 'Label', problems.length ? 'FAIL' : 'PASS', [ ...problems, ...details ].join( '; ' ) ) );
	}

	// Sources.
	{
		const problems = [];
		let checked = 0;
		for ( const { scene, texts: list } of texts ) {
			if ( ! scene.sources.length ) {
				problems.push( `scene ${ scene.n } names no source` );
				continue;
			}
			const corpus = scene.sources.map( ( name ) => {
				const text = file( name );
				if ( text === null ) {
					problems.push( `scene ${ scene.n }: ${ name } does not exist` );
				}
				return text || '';
			} ).join( '\n' );
			for ( const text of list ) {
				for ( const token of text.match( NUMBER ) || [] ) {
					checked++;
					if ( ! has( corpus, token ) ) {
						problems.push( `scene ${ scene.n }: "${ token }" is not in ${ scene.sources.join( ', ' ) }` );
					}
				}
				for ( const [ , quote ] of text.matchAll( /[“"]([^”"]{3,})[”"]/g ) ) {
					checked++;
					if ( ! corpus.includes( quote ) ) {
						problems.push( `scene ${ scene.n }: the quote "${ quote }" is not in ${ scene.sources.join( ', ' ) }` );
					}
				}
			}
		}
		const everything = demoFiles + '\n' + allScreen.join( '\n' );
		for ( const line of postLines.slice( 2 ) ) {
			for ( const token of line.match( NUMBER ) || [] ) {
				checked++;
				if ( ! has( everything, token ) ) {
					problems.push( `copy: "${ token }" is in no demo file and not on screen` );
				}
			}
		}
		// The carousel: nothing new (§7a). Each page against its own sources; the copy against the demo and the pages.
		for ( const { page, texts: list } of pageTexts ) {
			if ( ! page.sources.length ) {
				problems.push( `carousel page ${ page.n } names no source` );
				continue;
			}
			const corpus = page.sources.map( ( name ) => file( name ) || '' ).join( '\n' );
			for ( const text of list ) {
				for ( const token of text.match( NUMBER ) || [] ) {
					checked++;
					if ( ! has( corpus, token ) ) {
						problems.push( `carousel page ${ page.n }: "${ token }" is not in ${ page.sources.join( ', ' ) }` );
					}
				}
			}
		}
		const carouselCorpus = demoFiles + '\n' + pageTexts.flatMap( ( p ) => p.texts ).join( '\n' );
		for ( const line of carouselLines ) {
			for ( const token of line.match( NUMBER ) || [] ) {
				checked++;
				if ( ! has( carouselCorpus, token ) ) {
					problems.push( `carousel copy: "${ token }" is in no demo file and not on a page` );
				}
			}
		}
		// The insight post: demo facts from the demo's files; at most one outside figure, with its source (§7b).
		if ( insight ) {
			const outside = insight.outside;
			if ( outside.length > 1 ) {
				problems.push( `insight.md lists ${ outside.length } outside figures; one at most` );
			}
			for ( const o of outside ) {
				if ( ! o.source || ! /^https?:\/\//.test( o.url ) || ! o.sentence || ! /\d/.test( o.checked ) ) {
					problems.push( 'the outside figure needs its source name, URL, the sentence it rests on and the date checked' );
				}
			}
			const outsideText = outside.map( ( o ) => o.sentence ).join( '\n' );
			const imageCorpus = image.sources.map( ( name ) => file( name ) || '' ).join( '\n' );
			for ( const text of imageWords ) {
				for ( const token of text.match( NUMBER ) || [] ) {
					checked++;
					if ( ! has( imageCorpus, token ) && ! has( outsideText, token ) ) {
						problems.push( `insight image: "${ token }" is not in ${ image.sources.join( ', ' ) || 'its sources' }` );
					}
				}
			}
			const insightCorpus = demoFiles + '\n' + imageWords.join( '\n' );
			for ( const line of insightLines ) {
				for ( const token of line.match( NUMBER ) || [] ) {
					checked++;
					if ( ! has( insightCorpus, token ) && ! has( outsideText, token ) ) {
						problems.push( `insight copy: "${ token }" is in no demo file, not on the image and not the outside figure` );
					}
				}
			}
		}
		rows.push( row( 'Sources', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ checked } numbers, times and quotes in the three posts found verbatim in their source files` ) );
	}

	// Timeline.
	{
		const log = file( 'log.md' ) || '';
		const spec = file( 'spec.md' ) || '';
		const problems = [];
		const everyText = [ ...allScreen, ...allSpoken, post, ...pageTexts.flatMap( ( p ) => p.texts ), carouselPost, ...imageWords, insightPost ];
		const times = [ ...new Set( everyText.flatMap( ( t ) => t.match( TIME ) || [] ) ) ];
		for ( const t of times ) {
			if ( ! has( log, t ) ) {
				problems.push( `${ t } is not in log.md` );
			}
		}
		// The clause after "promised", up to the end of its sentence: "Promised Wednesday, end of day."
		const promised = [ ...allScreen, post, ...pageTexts.flatMap( ( p ) => p.texts ), carouselPost ].flatMap( ( t ) => [ ...t.matchAll( /promis\w*\s+([^.\n]+)/gi ) ].map( ( m ) => m[ 1 ] ) );
		if ( ! [ ...allScreen, post ].some( ( t ) => /promis\w*\s+[^.\n]+/i.test( t ) ) ) {
			problems.push( 'no promised delivery date on screen or in the copy (§2: the promise kept)' );
		}
		for ( const t of promised ) {
			for ( const token of t.match( /\d+/g ) || [] ) {
				if ( ! has( spec, token ) ) {
					problems.push( `promise "${ t }": ${ token } is not in spec.md` );
				}
			}
			for ( const [ day ] of t.matchAll( /\b(?:mon|tue|wed|thu|fri|sat|sun)/gi ) ) {
				if ( ! new RegExp( `\\b${ day }`, 'i' ).test( spec ) ) {
					problems.push( `promise "${ t }": ${ day }… is not in spec.md` );
				}
			}
		}
		rows.push( row( 'Timeline', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ times.length } times found in log.md unconverted; the promise matches spec.md` ) );
	}

	// Banned words.
	{
		const hits = [];
		const scan = ( where, text, list ) => {
			for ( const [ re, why ] of list ) {
				const m = re.exec( text );
				if ( m ) {
					hits.push( `${ where }: "${ m[ 0 ].trim() }" (${ why })` );
				}
			}
		};
		texts.forEach( ( { scene, texts: list } ) => list.forEach( ( t ) => scan( `scene ${ scene.n }`, t, BANNED ) ) );
		scan( 'copy', post, [ ...BANNED, ...COPY_ONLY ] );
		copy.alternatives.forEach( ( a, i ) => scan( `alternative ${ i + 1 }`, a, BANNED ) );
		pageTexts.forEach( ( { page, texts: list } ) => list.forEach( ( t ) => scan( `carousel page ${ page.n }`, t, BANNED ) ) );
		if ( carousel ) {
			scan( 'carousel copy', carouselPost, [ ...BANNED, ...COPY_ONLY ] );
			scan( 'carousel title', carousel.title, BANNED );
			carousel.copy.alternatives.forEach( ( a, i ) => scan( `carousel alternative ${ i + 1 }`, a, BANNED ) );
		}
		if ( insight ) {
			imageWords.forEach( ( t ) => scan( 'insight image', t, BANNED ) );
			scan( 'insight copy', insightPost, [ ...BANNED, ...COPY_ONLY ] );
			scan( 'insight alt text', insight.alt, BANNED );
			insight.copy.alternatives.forEach( ( a, i ) => scan( `insight alternative ${ i + 1 }`, a, BANNED ) );
		}
		rows.push( row( 'Banned words', hits.length ? 'FAIL' : 'PASS', hits.length ? hits.join( '; ' ) : 'none of the §2 words in the video, the carousel or the insight post; no emoji, hashtags, tags or "swipe" in any copy' ) );
	}

	// Leaks.
	{
		const texts3 = [ ...allScreen, ...allSpoken, post, ...pageTexts.flatMap( ( p ) => p.texts ), carouselPost, ...imageWords, insightPost ];
		const hits = texts3.filter( ( t ) => LEAK.test( t ) ).map( ( t ) => `"${ t.match( LEAK )[ 0 ] }" in "${ t.slice( 0, 50 ) }"` );
		// Every rendered file is looked at, each for its own hash (§8 hard stops).
		const looks = [];
		if ( cut ) {
			looks.push( { hash: manifest.render, what: `every frame of ${ manifest.files.contact.join( ', ' ) }` } );
		}
		if ( cr.manifest ) {
			looks.push( { hash: cr.manifest.hash, what: `every page of ${ cr.manifest.files.contact }` } );
		}
		if ( ir.manifest ) {
			looks.push( { hash: ir.manifest.hash, what: ir.manifest.files.png } );
		}
		if ( hits.length ) {
			rows.push( row( 'Leaks', 'FAIL', `path, URL or email in text: ${ hits.join( '; ' ) }` ) );
		} else if ( ! looks.length ) {
			rows.push( row( 'Leaks', 'PASS', `no path, URL or email in the text of the three posts${ wordsOnly ? '' : '; every frame, page and image is looked at once rendered' }` ) );
		} else {
			const md = readText( path.join( demo.post, 'check.md' ) );
			const done = looks.map( ( l ) => ( { ...l, look: lookedAt( md, 'Leaks', l.hash ) } ) );
			const failed = done.filter( ( l ) => l.look && ! l.look.pass );
			const missing = done.filter( ( l ) => ! l.look );
			if ( failed.length ) {
				rows.push( row( 'Leaks', 'FAIL', failed.map( ( l ) => `${ l.hash } (${ l.look.by }): ${ l.look.note || l.look.result }` ).join( '; ' ) ) );
			} else if ( missing.length ) {
				rows.push( row( 'Leaks', 'LOOK', `look at ${ missing.map( ( l ) => `${ l.what } (hash ${ l.hash })` ).join( '; ' ) } — no terminal, editor, path, username, password page, real name or email, no product blamed — then add a row under "Looked at" for each hash` ) );
			} else {
				rows.push( row( 'Leaks', 'PASS', `looked at: ${ done.map( ( l ) => `${ l.hash } (${ l.look.by })` ).join( '; ' ) }` ) );
			}
		}
	}

	// Before and after.
	if ( ! wordsOnly ) {
		{
			const problems = [];
			const notes = [];
			const raw = ( name ) => {
				const text = readText( demo.rawFile( `${ demo.id }-${ name }.json` ) );
				return text ? JSON.parse( text ) : null;
			};
			const phases = usedClips.map( ( n ) => n.split( '-' )[ 0 ] );
			if ( ! phases.includes( 'before' ) ) {
				problems.push( 'no before clip in the script' );
			}
			if ( ! phases.includes( 'after' ) ) {
				problems.push( 'no after clip in the script' );
			}
			const pairs = new Set( usedClips.filter( ( n ) => /^(before|after)-/.test( n ) ).map( ( n ) => n.replace( /^(before|after)-/, '' ) ) );
			for ( const base of pairs ) {
				const b = raw( `before-${ base }` );
				const a = raw( `after-${ base }` );
				if ( ! b || ! a ) {
					problems.push( `"${ base }": ${ b ? 'after' : 'before' } clip not captured` );
					continue;
				}
				const same = [ 'script', 'steps', 'framing', 'view', 'scale', 'platform' ].filter( ( k ) => b[ k ] !== a[ k ] );
				if ( JSON.stringify( b.viewport ) !== JSON.stringify( a.viewport ) ) {
					same.push( 'viewport' );
				}
				if ( JSON.stringify( b.region ) !== JSON.stringify( a.region ) ) {
					same.push( `region (${ JSON.stringify( b.region ) } vs ${ JSON.stringify( a.region ) })` );
				}
				if ( same.length ) {
					problems.push( `"${ base }": before and after differ in ${ same.join( ', ' ) }` );
				}
				if ( b.theme && a.theme && b.theme.id === a.theme.id ) {
					problems.push( `"${ base }": before and after were both recorded on theme #${ b.theme.id } — the before clip comes from the before theme, the after clip from the after theme` );
				}
			}
			for ( const name of usedClips ) {
				const clip = clips.get( name );
				if ( ! clip?.speed ) {
					continue;
				}
				const shots = scenes.flatMap( ( s ) => s.shots ).filter( ( s ) => s.kind === 'clip' && s.name === name );
				if ( shots.length > 1 ) {
					problems.push( `speed clip "${ name }" is used ${ shots.length } times — it plays uncut` );
				}
				if ( shots.some( ( s ) => s.speed !== 1 ) ) {
					problems.push( `speed clip "${ name }" is sped up — it plays at real speed` );
				}
				if ( shots.some( ( s ) => s.from !== null || s.to !== null ) ) {
					notes.push( `speed clip "${ name }" is trimmed at its ends` );
				}
			}
			rows.push( row( 'Before and after', problems.length ? 'FAIL' : 'PASS', [ ...problems, ...notes ].join( '; ' ) || `${ pairs.size } before/after pair(s): same script, steps, view, scale, framing and platform; speed clips uncut at real speed` ) );
		}
	}

	// View.
	if ( ! wordsOnly ) {
		{
			const brief = file( 'brief.md' ) || '';
			const viewLine = ( /^\s*\**View:?\**:?\s*(.+)$/im.exec( brief ) || [] )[ 1 ] || '';
			const phone = /\bphone\b|\b390\s*px\b/i.test( viewLine ) && ! /^\W*desktop/i.test( viewLine );
			const expected = phone ? 'phone' : 'desktop';
			const problems = [];
			for ( const name of usedClips.filter( ( n ) => /^(before|after)-/.test( n ) ) ) {
				const clip = clips.get( name );
				if ( ! clip ) {
					continue;
				}
				if ( clip.view !== expected ) {
					problems.push( `"${ name }" is ${ clip.view }; the brief's view is ${ expected }` );
				}
				if ( clip.view === 'desktop' && clip.region.width >= clip.viewport.width ) {
					problems.push( `"${ name }" is the whole desktop page, not a framed part` );
				}
			}
			rows.push( row( 'View', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `before/after clips are ${ expected }${ viewLine ? ' as the brief says' : ' (the brief has no View line: desktop assumed)' }${ expected === 'desktop' ? ', each framed on a part of the page' : '' }` ) );
		}
	}

	// Legibility.
	if ( ! wordsOnly ) {
		{
			const problems = [];
			const details = [];
			for ( const name of usedClips ) {
				const clip = clips.get( name );
				if ( ! clip ) {
					continue;
				}
				if ( clip.display.scale > clip.scale + 1e-6 ) {
					problems.push( `"${ name }" is scaled up (${ clip.display.scale }× from a ${ clip.scale }× capture)` );
				}
				const t = clip.smallestText;
				if ( t && t.canvas < MIN_PX.footage ) {
					problems.push( `"${ name }": site text "${ t.sample }" is ${ t.canvas } px on the canvas, under ${ MIN_PX.footage }` );
				}
			}
			details.push( `footage: ${ usedClips.length } clip(s), smallest site text ≥ ${ MIN_PX.footage } px, none scaled up` );
			if ( cut ) {
				const min = ( key ) => Math.min( ...manifest.steps.map( ( s ) => s.sizes?.[ key ] ).filter( ( n ) => typeof n === 'number' ) );
				const sizes = { label: min( 'label' ), line: min( 'line' ), slide: min( 'slide' ), mark: min( 'mark' ) };
				for ( const [ key, floor ] of [ [ 'label', MIN_PX.label ], [ 'line', MIN_PX.line ], [ 'slide', MIN_PX.slide ], [ 'mark', MIN_PX.slide ] ] ) {
					if ( Number.isFinite( sizes[ key ] ) && sizes[ key ] < floor ) {
						problems.push( `${ key } text drawn at ${ sizes[ key ] } px, under ${ floor }` );
					}
				}
				details.push( `drawn: label ${ sizes.label } px, line ${ sizes.line } px${ Number.isFinite( sizes.slide ) ? `, slides ≥ ${ sizes.slide } px` : '' }` );
			} else {
				details.push( 'drawn text sizes are measured at the render' );
			}
			if ( cr.manifest ) {
				const min = ( key ) => Math.min( ...cr.manifest.pages.map( ( pg ) => pg.sizes?.[ key ] ).filter( ( n ) => typeof n === 'number' ) );
				for ( const [ key, floor ] of [ [ 'label', MIN_PX.label ], [ 'counter', MIN_PX.label ], [ 'line', MIN_PX.line ], [ 'slide', MIN_PX.slide ], [ 'mark', MIN_PX.slide ] ] ) {
					if ( Number.isFinite( min( key ) ) && min( key ) < floor ) {
						problems.push( `carousel: ${ key } text drawn at ${ min( key ) } px, under ${ floor }` );
					}
				}
				const up = cr.manifest.pages.filter( ( pg ) => pg.scale > 1 + 1e-6 );
				if ( up.length ) {
					problems.push( `carousel: a still is scaled up on page(s) ${ up.map( ( pg ) => pg.n ).join( ', ' ) }` );
				}
				details.push( `carousel: line ≥ ${ min( 'line' ) } px, no still scaled up` );
			}
			if ( ir.manifest ) {
				const sz = ir.manifest.sizes || {};
				for ( const [ key, floor ] of Object.entries( INSIGHT_PX ) ) {
					if ( typeof sz[ key ] === 'number' && sz[ key ] < floor ) {
						problems.push( `insight image: ${ key } drawn at ${ sz[ key ] } px, under ${ floor }` );
					}
				}
				if ( ir.manifest.scale > 1 + 1e-6 ) {
					problems.push( 'insight image: the still is scaled up' );
				}
				details.push( `insight: line ${ sz.line } px${ sz.number ? `, number ${ sz.number } px` : '' }` );
			}
			rows.push( row( 'Legibility', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : details.join( '; ' ) ) );
		}
	}

	// Spec.
	if ( ! wordsOnly ) {
		if ( cut ) {
			const problems = [];
			const info = await probe( mp4 );
			const v = info.streams.find( ( s ) => s.codec_type === 'video' );
			const a = info.streams.find( ( s ) => s.codec_type === 'audio' );
			const seconds = Number( info.format.duration );
			const bytes = fs.statSync( mp4 ).size;
			if ( ! v || v.width !== CANVAS || v.height !== CANVAS ) {
				problems.push( `${ v?.width } × ${ v?.height }, not ${ CANVAS } × ${ CANVAS }` );
			}
			if ( v?.codec_name !== 'h264' || v?.pix_fmt !== 'yuv420p' ) {
				problems.push( `${ v?.codec_name } ${ v?.pix_fmt }, not h264 yuv420p` );
			}
			if ( v?.r_frame_rate !== `${ FPS }/1` ) {
				problems.push( `${ v?.r_frame_rate } fps, not ${ FPS }` );
			}
			if ( seconds > PACE.maxTotal + 0.05 ) {
				problems.push( `${ seconds.toFixed( 1 ) } s, longer than ${ PACE.maxTotal }` );
			}
			if ( a?.codec_name !== 'aac' ) {
				problems.push( 'no AAC audio track' );
			}
			if ( bytes >= SPEC.maxBytes ) {
				problems.push( `${ ( bytes / 1048576 ).toFixed( 1 ) } MB, not under 200 MB` );
			}
			const coverFile = demo.finalFile( 'cover.png' );
			if ( ! fs.existsSync( coverFile ) ) {
				problems.push( 'no cover' );
			} else if ( fs.statSync( coverFile ).size >= SPEC.maxCoverBytes ) {
				problems.push( `cover ${ ( fs.statSync( coverFile ).size / 1048576 ).toFixed( 2 ) } MB, not under 2 MB` );
			}
			const first = manifest.steps[ 0 ];
			if ( ! first || first.scene !== scenes[ 0 ]?.n || ! [ 'clip', 'wide' ].includes( first.kind ) ) {
				problems.push( 'the first frame is not scene 1 footage (the problem itself comes first)' );
			}
			const short = seconds < PACE.minTotal ? `; ${ seconds.toFixed( 1 ) } s is under ${ PACE.minTotal } — fine only because a scene was dropped` : '';
			rows.push( row( 'Spec', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `1080 × 1080 · ${ seconds.toFixed( 1 ) } s · h264 yuv420p ${ FPS } fps · aac · ${ ( bytes / 1048576 ).toFixed( 1 ) } MB · cover ${ ( fs.statSync( coverFile ).size / 1024 ).toFixed( 0 ) } KB · first frame is scene 1 footage with the problem line${ short }` ) );
		} else {
			rows.push( row( 'Spec', '—', `checked on the rendered file; the plan runs ${ plan.total.toFixed( 1 ) } s` ) );
		}
	}

	// Carousel (§7a): 8–10 square pages from the video's own files, one PDF under 10 MB.
	{
		const problems = [];
		const details = [];
		if ( ! carousel ) {
			problems.push( 'post/carousel.md does not exist yet' );
		} else {
			const questions = scenes.some( ( sc ) => sc.shots.some( ( sh ) => sh.layout === 'questions' ) );
			const least = LIMITS.pages[ 0 ] - ( questions ? 0 : 1 );
			if ( pages.length < least || pages.length > LIMITS.pages[ 1 ] ) {
				problems.push( `${ pages.length } pages; ${ least }–${ LIMITS.pages[ 1 ] }${ questions ? '' : ' (no questions page, so one fewer)' }` );
			}
			for ( const { n, middle } of pages ) {
				if ( middle?.kind === 'still' && ! fs.existsSync( demo.rawFile( `${ demo.id }-${ middle.name }.png` ) ) ) {
					problems.push( `page ${ n }: no still ${ demo.id }-${ middle.name }.png in media/raw/` );
				}
				if ( middle?.kind === 'frame' ) {
					const sidecar = readText( demo.rawFile( `${ demo.id }-${ middle.name }.json` ) );
					if ( ! sidecar ) {
						problems.push( `page ${ n }: clip "${ middle.name }" was not captured` );
					} else if ( middle.at > JSON.parse( sidecar ).seconds ) {
						problems.push( `page ${ n }: ${ middle.at } s is past the end of "${ middle.name }"` );
					}
				}
			}
			const first = pages[ 0 ]?.middle;
			if ( first && ! ( [ 'still', 'frame' ].includes( first.kind ) && first.phase === 'before' ) ) {
				problems.push( 'page 1 is not the before still (the cover is the problem itself)' );
			}
			details.push( `${ pages.length } pages` );
			if ( cr.manifest ) {
				const m = cr.manifest;
				const bytes = fs.statSync( pdf ).size;
				if ( bytes >= LIMITS.pdfBytes ) {
					problems.push( `the PDF is ${ ( bytes / 1048576 ).toFixed( 1 ) } MB, not under 10 MB` );
				}
				if ( m.pdfPages !== pages.length ) {
					problems.push( `the PDF has ${ m.pdfPages } pages; carousel.md has ${ pages.length }` );
				}
				for ( const pg of m.pages ) {
					const f = path.join( carouselDir, pg.png );
					const size = fs.existsSync( f ) ? pngSize( fs.readFileSync( f ) ) : null;
					if ( ! size || size.width !== CANVAS || size.height !== CANVAS ) {
						problems.push( `page ${ pg.n } is not ${ CANVAS } × ${ CANVAS }` );
					}
				}
				problems.push( ...m.problems );
				details.push( `${ path.basename( pdf ) } ${ ( bytes / 1048576 ).toFixed( 1 ) } MB, ${ m.pdfPages } pages at ${ CANVAS } × ${ CANVAS }, carousel ${ m.hash }` );
			}
		}
		if ( cr.stale ) {
			problems.push( `${ path.basename( pdf ) } was made from an older carousel.md — run node tools/video/carousel.mjs ${ demo.id }` );
		}
		const done = wordsOnly || Boolean( cr.manifest );
		rows.push( row( 'Carousel', problems.length ? 'FAIL' : ( done ? 'PASS' : '—' ), problems.length ? problems.join( '; ' ) : `${ details.join( '; ' ) }${ done ? '' : `; the PDF comes from node tools/video/carousel.mjs ${ demo.id }` }` ) );
	}

	// Insight (§7b): one observation, no how-to, no ask; a 1200 × 1200 image under 5 MB.
	{
		const problems = [];
		const details = [];
		if ( ! insight ) {
			problems.push( 'post/insight.md does not exist yet' );
		} else {
			if ( /\?/.test( insightPost ) ) {
				problems.push( 'the insight copy asks a question; it ends on the point' );
			}
			if ( insightPost.includes( brand.ask ) ) {
				problems.push( 'the insight copy carries the ask; the video and the carousel carry it' );
			}
			for ( const [ re, why ] of [ [ NUMBERED, 'numbered tips' ], [ READER_CLAIM, 'a claim about the reader' ], [ TIME_WORDS, 'a time word the publish date can make wrong' ] ] ) {
				const m = re.exec( insightPost );
				if ( m ) {
					problems.push( `insight copy: "${ m[ 0 ].trim() }" (${ why })` );
				}
			}
			if ( ! insight.alt ) {
				problems.push( 'insight.md has no "## Alt text"' );
			}
			if ( image.layout === 'still' && image.picture?.kind === 'still' && ! fs.existsSync( demo.rawFile( `${ demo.id }-${ image.picture.name }.png` ) ) ) {
				problems.push( `no still ${ demo.id }-${ image.picture.name }.png in media/raw/` );
			}
			details.push( `${ image.layout || '—' } and line; alt text set` );
			if ( ir.manifest ) {
				const size = pngSize( fs.readFileSync( png ) );
				const bytes = fs.statSync( png ).size;
				if ( size.width !== LIMITS.insightCanvas || size.height !== LIMITS.insightCanvas ) {
					problems.push( `the image is ${ size.width } × ${ size.height }, not ${ LIMITS.insightCanvas } × ${ LIMITS.insightCanvas }` );
				}
				if ( bytes >= LIMITS.insightBytes ) {
					problems.push( `the image is ${ ( bytes / 1048576 ).toFixed( 1 ) } MB, not under 5 MB` );
				}
				problems.push( ...ir.manifest.problems );
				details.push( `${ path.basename( png ) } ${ size.width } × ${ size.height }, ${ ( bytes / 1024 ).toFixed( 0 ) } KB, insight ${ ir.manifest.hash }` );
			}
		}
		if ( ir.stale ) {
			problems.push( `${ path.basename( png ) } was made from an older insight.md — run node tools/video/insight.mjs ${ demo.id }` );
		}
		const done = wordsOnly || Boolean( ir.manifest );
		rows.push( row( 'Insight', problems.length ? 'FAIL' : ( done ? 'PASS' : '—' ), problems.length ? problems.join( '; ' ) : `${ details.join( '; ' ) }${ done ? '' : `; the image comes from node tools/video/insight.mjs ${ demo.id }` }` ) );
	}

	// Stand-alone (§2): three different first lines, and no post leans on another.
	{
		const problems = [];
		const firsts = [ [ 'video', postLines[ 0 ] ], [ 'carousel', carouselLines[ 0 ] ], [ 'insight', insightLines[ 0 ] ] ].filter( ( [ , l ] ) => l );
		for ( let i = 0; i < firsts.length; i++ ) {
			for ( let j = i + 1; j < firsts.length; j++ ) {
				if ( same( firsts[ i ][ 1 ], firsts[ j ][ 1 ] ) ) {
					problems.push( `the ${ firsts[ i ][ 0 ] } and ${ firsts[ j ][ 0 ] } posts open on the same sentence` );
				}
			}
		}
		if ( insight && scenes[ 0 ] && same( insightLines[ 0 ], scenes[ 0 ].line ) ) {
			problems.push( 'the insight post opens on the problem line' );
		}
		for ( const [ name, text ] of [ [ 'video', post ], [ 'carousel', carouselPost ], [ 'insight', insightPost ] ] ) {
			const m = CROSS_REF.exec( text );
			if ( m ) {
				problems.push( `the ${ name } copy points at another post: "${ m[ 0 ] }"` );
			}
		}
		if ( firsts.length < 3 ) {
			problems.push( 'all three posts are needed to compare their first lines' );
		}
		rows.push( row( 'Stand-alone', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : 'three different first lines; no post points at another' ) );
	}

	// Voice: every video is voiced from the checked Spoken words (§10), every pick word for word.
	if ( ! wordsOnly ) {
		{
			const v = pkg.voice;
			if ( ! v.chunks.length ) {
				rows.push( row( 'Voice', 'FAIL', 'post/script.md has no Spoken words — every video is voiced (§10): add the Spoken column' ) );
			} else if ( ! v.made ) {
				rows.push( row( 'Voice', '—', `${ v.chunks.length } scene(s) to voice once the words check passes: node tools/video/voice.mjs ${ demo.id }` ) );
			} else if ( v.problems.length ) {
				rows.push( row( 'Voice', 'FAIL', v.problems.join( '; ' ) ) );
			} else {
				const p = v.state.processed;
				const listen = v.flags.length ? `; listen to ${ v.flags.join( '; ' ) }` : '';
				rows.push( row( 'Voice', 'PASS', `${ v.map.size } scene(s), ${ voiceConfig.voice_name } (${ voiceConfig.tts_model_id }); every pick reads the checked words (word check ≥ ${ voiceConfig.min_accuracy * 100 } %, no clipped ending); one chain at ${ p.lufs } LUFS${ listen }` ) );
			}
		}
	}

	// Sound: the finished mix on the rendered file.
	if ( ! wordsOnly ) {
		if ( cut && manifest.sound?.voiced ) {
			const problems = [];
			const info = await probe( mp4 );
			const a = info.streams.find( ( s ) => s.codec_type === 'audio' );
			const L = await loudness( mp4 );
			if ( a?.codec_name !== 'aac' || Number( a?.sample_rate ) !== SPEC.sampleRate || a?.channels !== 2 ) {
				problems.push( `${ a?.codec_name } ${ a?.sample_rate } Hz ${ a?.channels } ch, not AAC 48 kHz stereo` );
			}
			if ( ! ( Math.abs( L.I - SPEC.lufs ) <= SPEC.lufsTolerance ) ) {
				problems.push( `${ L.I } LUFS, not ${ SPEC.lufs } ±${ SPEC.lufsTolerance }` );
			}
			if ( ! ( L.TP <= SPEC.truePeak ) ) {
				problems.push( `true peak ${ L.TP } dBTP, above ${ SPEC.truePeak }` );
			}
			const s = manifest.sound;
			rows.push( row( 'Sound', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ L.I } LUFS · true peak ${ L.TP } dBTP · AAC 48 kHz stereo · voice in ${ s.voice.length } scene(s), the music bed under it, ${ s.clicks } click(s), ${ s.typing } typed stretch(es) — heard by Yeasir at the go` ) );
		} else if ( cut ) {
			rows.push( row( 'Sound', 'FAIL', 'the render is silent: make the voice, then render again' ) );
		} else {
			rows.push( row( 'Sound', '—', 'measured on the rendered file' ) );
		}
	}

	// Word counts.
	{
		const problems = [];
		const marks = new Set( usedClips.map( ( n ) => ( { before: 'Before', after: 'After' } )[ n.split( '-' )[ 0 ] ] ).filter( Boolean ) );
		const onScreen = words( brand.label ) + allScreen.reduce( ( s, t ) => s + words( t ), 0 ) + marks.size;
		const copyWords = words( post );
		const l1 = postLines[ 0 ] || '';
		const l2 = postLines[ 1 ] || '';
		if ( onScreen > PACE.maxOnScreenWords ) {
			problems.push( `${ onScreen } words on screen, more than ${ PACE.maxOnScreenWords }` );
		}
		if ( copyWords < 80 || copyWords > 130 ) {
			problems.push( `copy is ${ copyWords } words, not 80–130` );
		}
		if ( l1.length > 80 ) {
			problems.push( `copy line 1 is ${ l1.length } characters, more than 80` );
		}
		if ( l1.length + l2.length >= 150 ) {
			problems.push( `copy lines 1 and 2 are ${ l1.length + l2.length } characters, not under 150` );
		}
		const spoken = spokenWordCount( script );
		if ( spoken > VOICE.maxWords ) {
			problems.push( `${ spoken } words spoken, more than ${ VOICE.maxWords }` );
		}
		const between = ( n, [ lo, hi ] ) => n >= lo && n <= hi;
		const details = [ `${ onScreen } words on screen · ${ spoken } spoken · copy ${ copyWords } words · lines 1 + 2 ${ l1.length + l2.length } characters` ];
		if ( carousel ) {
			const cw = words( carouselPost );
			if ( ! between( cw, LIMITS.carouselCopy ) ) {
				problems.push( `carousel copy is ${ cw } words, not ${ LIMITS.carouselCopy.join( '–' ) }` );
			}
			if ( ( carouselLines[ 0 ] || '' ).length > LIMITS.firstLine ) {
				problems.push( `carousel copy line 1 is ${ carouselLines[ 0 ].length } characters, more than ${ LIMITS.firstLine }` );
			}
			for ( const { page, texts: list } of pageTexts ) {
				const n = list.reduce( ( sum, t ) => sum + words( t ), 0 );
				if ( n > LIMITS.pageWords ) {
					problems.push( `carousel page ${ page.n } has ${ n } words, more than ${ LIMITS.pageWords }` );
				}
			}
			details.push( `carousel copy ${ cw } words, every page ≤ ${ LIMITS.pageWords }` );
		}
		if ( insight ) {
			const iw = words( insightPost );
			const onImage = imageWords.reduce( ( sum, t ) => sum + words( t ), 0 );
			if ( ! between( iw, LIMITS.insightCopy ) ) {
				problems.push( `insight copy is ${ iw } words, not ${ LIMITS.insightCopy.join( '–' ) }` );
			}
			if ( ( insightLines[ 0 ] || '' ).length > LIMITS.firstLine ) {
				problems.push( `insight copy line 1 is ${ insightLines[ 0 ].length } characters, more than ${ LIMITS.firstLine }` );
			}
			if ( onImage > LIMITS.imageWords ) {
				problems.push( `${ onImage } words on the insight image, more than ${ LIMITS.imageWords }` );
			}
			details.push( `insight copy ${ iw } words, ${ onImage } on the image` );
		}
		rows.push( row( 'Word counts', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : details.join( ' · ' ) ) );
	}

	// First line and close.
	{
		const problems = [];
		const last = scenes[ scenes.length - 1 ];
		const body = postLines.filter( Boolean );
		const url = brand.endCard.url;
		if ( scenes.length && plain( scenes[ 0 ].line ) !== postLines[ 0 ] ) {
			problems.push( 'the video\'s first line and the copy\'s first line are not the same sentence' );
		}
		if ( last && last.line !== brand.ask ) {
			problems.push( `the last scene's line is not the approved ask ("${ brand.ask }")` );
		}
		// Words only: a pause ("...") may stand where the ask has a comma.
		const said = ( s ) => s.toLowerCase().replace( /[^\p{L}\p{N}']+/gu, ' ' ).trim();
		if ( last?.spoken && ! said( last.spoken ).endsWith( said( brand.ask ) ) ) {
			problems.push( `the last scene's Spoken words do not end on the approved ask ("${ brand.ask }")` );
		}
		if ( ! last || last.shots[ last.shots.length - 1 ]?.kind !== 'endcard' ) {
			problems.push( 'the video does not end on the end card' );
		}
		const linkLine = url ? body[ body.length - 1 ] : null;
		const close = url ? body[ body.length - 2 ] : body[ body.length - 1 ];
		if ( close !== brand.ask ) {
			problems.push( `the copy does not close with the approved ask${ url ? ' before the link' : '' }` );
		}
		if ( url && linkLine !== url ) {
			problems.push( `the copy's last line is not ${ url }` );
		}
		if ( ! url && /pervej\.com/i.test( post ) ) {
			problems.push( 'pervej.com is in the copy, but brand.json has no URL yet (§14: left out until the site is live)' );
		}
		if ( copy.alternatives.length < 2 ) {
			problems.push( `copy.md has ${ copy.alternatives.length } alternative first line(s), not two` );
		}
		// The link line closes all three copies once pervej.com is live; until then it is left out (§14).
		const linkRule = ( name, lines, text ) => {
			const kept = lines.filter( Boolean );
			if ( url && kept[ kept.length - 1 ] !== url ) {
				problems.push( `the ${ name } copy's last line is not ${ url }` );
			}
			if ( ! url && /pervej\.com/i.test( text ) ) {
				problems.push( `pervej.com is in the ${ name } copy, but brand.json has no URL yet (§14)` );
			}
			return url ? kept.slice( 0, -1 ) : kept;
		};
		if ( carousel ) {
			const kept = linkRule( 'carousel', carouselLines, carouselPost );
			if ( kept[ kept.length - 1 ] !== brand.ask ) {
				problems.push( 'the carousel copy does not close with the approved ask' );
			}
			if ( carousel.copy.alternatives.length < 2 ) {
				problems.push( `carousel.md has ${ carousel.copy.alternatives.length } alternative first line(s), not two` );
			}
			if ( ! carousel.title ) {
				problems.push( 'carousel.md has no "## Document title"' );
			} else if ( carousel.title.length >= LIMITS.title ) {
				problems.push( `the document title is ${ carousel.title.length } characters, not under ${ LIMITS.title }` );
			}
		}
		if ( insight ) {
			linkRule( 'insight', insightLines, insightPost );
			if ( insight.copy.alternatives.length < 2 ) {
				problems.push( `insight.md has ${ insight.copy.alternatives.length } alternative first line(s), not two` );
			}
		}
		rows.push( row( 'First line and close', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `video and copy open on the same sentence; video and carousel close on "${ brand.ask }"; two alternative first lines for each post; the document title is set` ) );
	}

	// Pace.
	if ( ! wordsOnly ) {
		{
			const problems = [];
			const notes = [];
			for ( const step of plan.steps ) {
				if ( step.kind === 'slide' && step.seconds + 1e-6 < Math.max( PACE.minSlide, step.words / PACE.wordsPerSecond ) ) {
					problems.push( `scene ${ step.scene }: a slide step is up ${ step.seconds.toFixed( 1 ) } s for ${ step.words } words` );
				}
				if ( [ 'slide', 'endcard', 'wide' ].includes( step.kind ) && step.seconds > PACE.maxStill + 1 ) {
					problems.push( `scene ${ step.scene }: a still sits unchanged ${ step.seconds.toFixed( 1 ) } s (about ${ PACE.maxStill } at most — split the row)` );
				}
			}
			for ( const s of plan.scenes ) {
				if ( s.seconds > PACE.maxScene ) {
					problems.push( `scene ${ s.n } runs ${ s.seconds.toFixed( 1 ) } s` );
				}
				notes.push( `${ s.n }: ${ s.seconds.toFixed( 1 ) } s${ s.guide ? ` (guide ${ s.guide })` : '' }` );
			}
			notes.push( ...plan.notes );
			rows.push( row( 'Pace', problems.length ? 'FAIL' : 'PASS', [ ...problems, ...notes ].join( '; ' ) ) );
		}
	}

	const header = `Run ${ stamp() } · ${ wordsOnly ? 'words only, before any voice or render' : `everything · video ${ cut ? manifest.render : '—' } · carousel ${ cr.manifest?.hash || '—' } · insight ${ ir.manifest?.hash || '—' }` } · script.md ${ pkg.scriptSha || '—' } · carousel.md ${ pkg.carouselSha || '—' } · insight.md ${ pkg.insightSha || '—' }`;
	const open = rows.filter( ( r ) => r.result === 'FAIL' || r.result === 'LOOK' );
	const waiting = rows.filter( ( r ) => r.result === '—' );
	return { rows, header, open, waiting };
}

/**
 * A look recorded under "## Looked at" for this check and render.
 *
 * @param {string|null} md     check.md.
 * @param {string}      check  Check name.
 * @param {string}      render Render hash.
 * @return {object|null} { pass, result, by, note }.
 */
function lookedAt( md, check, render ) {
	if ( ! md ) {
		return null;
	}
	const at = /^##\s+Looked at\s*$/im.exec( md );
	if ( ! at ) {
		return null;
	}
	const table = tables( md.slice( at.index ) )[ 0 ];
	if ( ! table ) {
		return null;
	}
	const hit = table.rows.filter( ( r ) => plain( r[ 0 ] ).toLowerCase() === check.toLowerCase() && plain( r[ 1 ] ) === render ).pop();
	return hit ? { pass: /^pass$/i.test( plain( hit[ 2 ] ) ), result: plain( hit[ 2 ] ), by: plain( hit[ 3 ] ), note: plain( hit[ 4 ] ) } : null;
}

function writeCheck( demo, header, rows, summary ) {
	const target = path.join( demo.post, 'check.md' );
	const block = [
		BEGIN,
		header,
		'',
		'| Check | Result | Detail |',
		'|---|---|---|',
		...rows.map( ( r ) => `| ${ r.check } | ${ r.result } | ${ cell( r.detail ) } |` ),
		'',
		summary,
		END,
	].join( '\n' );
	let text = readText( target );
	if ( text === null ) {
		text = `# Self-check — ${ demo.id }\n\n${ block }\n\n${ LOOKED }\n\n${ DECISIONS }\n`;
	} else {
		text = text.replace( /\r\n/g, '\n' );
		const start = text.indexOf( '<!-- check:begin' );
		const end = text.indexOf( END );
		if ( start >= 0 && end > start ) {
			text = text.slice( 0, start ) + block + text.slice( end + END.length );
		} else {
			const title = /^#\s.*$/m.exec( text );
			const at = title ? title.index + title[ 0 ].length : 0;
			text = `${ text.slice( 0, at ) }\n\n${ block }\n${ text.slice( at ) }`;
		}
		if ( ! /^##\s+Looked at\s*$/im.test( text ) ) {
			const decisions = /^##\s+Decisions\s*$/im.exec( text );
			text = decisions
				? `${ text.slice( 0, decisions.index ) }${ LOOKED }\n\n${ text.slice( decisions.index ) }`
				: `${ text.replace( /\s*$/, '' ) }\n\n${ LOOKED }\n`;
		}
		if ( ! /^##\s+Decisions\s*$/im.test( text ) ) {
			text = `${ text.replace( /\s*$/, '' ) }\n\n${ DECISIONS }\n`;
		}
	}
	fs.mkdirSync( demo.post, { recursive: true } );
	fs.writeFileSync( target, text );
}
