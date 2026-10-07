/**
 * The self-check (guideline §8), written into post/check.md before each approval.
 *
 * Before a render it checks the words: script, copy, sources, clips. After a render (a manifest for
 * the current script.md exists) it adds the cut: the file itself, the label on sampled frames, the
 * drawn text sizes. What a machine cannot judge — the leaks scan of every contact-sheet frame — is
 * LOOK until someone records the look under "## Looked at" for that render.
 *
 * Only the block between the check:begin and check:end markers is rewritten; "## Looked at" and
 * "## Approvals" are never touched.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readText } from './paths.mjs';
import { loadPackage } from './package.mjs';
import { onScreenText, plain, tables, words } from './script.mjs';
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
	'Checks that need eyes. One row per look; a look counts only for the render it names (the render hash is printed on every contact sheet).',
	'',
	'| Check | Render | Result | By · when | Note |',
	'|---|---|---|---|---|',
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
	[ /\b(?:like|comment|share|repost)\b[^.\n]{0,30}\b(?:below|this post|if you)\b|\bwatch (?:to|till|until) the end\b/i, 'asks for engagement' ],
];
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

/**
 * Run the self-check and write it into post/check.md.
 *
 * @param {object} demo Demo paths.
 * @return {Promise<boolean>} True when every row passed (nothing failed, nothing left to look at).
 */
export async function runCheck( demo ) {
	const pkg = loadPackage( demo );
	const { brand, script, copy, clips, plan } = pkg;
	const rows = [];
	const scenes = script.scenes;
	const file = ( name ) => readText( demo.file( name ) );

	const manifestText = readText( path.join( demo.work, 'manifest.json' ) );
	const manifest = manifestText ? JSON.parse( manifestText ) : null;
	const mp4 = demo.finalFile( 'linkedin.mp4' );
	const cut = Boolean( manifest && manifest.script === pkg.scriptSha && fs.existsSync( mp4 ) );
	const usedClips = [ ...new Set( scenes.flatMap( ( s ) => s.shots.filter( ( shot ) => shot.kind === 'clip' ).map( ( shot ) => shot.name ) ) ) ];
	// What the viewer reads, and — for sources, banned words and leaks — what the voice says too.
	const texts = scenes.map( ( s ) => ( { scene: s, texts: [ ...onScreenText( s, brand ), ...( s.spoken ? [ s.spoken ] : [] ) ] } ) );
	const allScreen = scenes.flatMap( ( s ) => onScreenText( s, brand ) );
	const allSpoken = scenes.map( ( s ) => s.spoken ).filter( Boolean );
	const post = copy.post || '';
	const postLines = copy.lines.map( ( l ) => l.trim() );

	if ( pkg.errors.length ) {
		rows.push( row( 'Script and copy', 'FAIL', pkg.errors.join( ' · ' ) ) );
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
		} else {
			details.push( 'the frames are checked after the render' );
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
		const everything = [ 'brief.md', 'spec.md', 'log.md', 'qa.md', 'handoff.md' ].map( file ).join( '\n' ) + '\n' + allScreen.join( '\n' );
		for ( const line of postLines.slice( 2 ) ) {
			for ( const token of line.match( NUMBER ) || [] ) {
				checked++;
				if ( ! has( everything, token ) ) {
					problems.push( `copy: "${ token }" is in no demo file and not on screen` );
				}
			}
		}
		rows.push( row( 'Sources', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ checked } numbers, times and quotes on screen and in the Spoken words found verbatim in their source files` ) );
	}

	// Timeline.
	{
		const log = file( 'log.md' ) || '';
		const spec = file( 'spec.md' ) || '';
		const problems = [];
		const times = [ ...new Set( [ ...allScreen, ...allSpoken, post ].flatMap( ( t ) => t.match( TIME ) || [] ) ) ];
		for ( const t of times ) {
			if ( ! has( log, t ) ) {
				problems.push( `${ t } is not in log.md` );
			}
		}
		// The clause after "promised", up to the end of its sentence: "Promised Wednesday, end of day."
		const promised = [ ...allScreen, post ].flatMap( ( t ) => [ ...t.matchAll( /promis\w*\s+([^.\n]+)/gi ) ].map( ( m ) => m[ 1 ] ) );
		if ( ! promised.length ) {
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
		rows.push( row( 'Banned words', hits.length ? 'FAIL' : 'PASS', hits.length ? hits.join( '; ' ) : 'none of the §2 words in the lines, slides, end card, Spoken words or copy; no emoji, hashtags or tags in the copy' ) );
	}

	// Leaks.
	{
		const hits = [ ...allScreen, ...allSpoken, post ].filter( ( t ) => LEAK.test( t ) ).map( ( t ) => `"${ t.match( LEAK )[ 0 ] }" in "${ t.slice( 0, 50 ) }"` );
		if ( hits.length ) {
			rows.push( row( 'Leaks', 'FAIL', `path, URL or email in text: ${ hits.join( '; ' ) }` ) );
		} else if ( ! cut ) {
			rows.push( row( 'Leaks', 'PASS', 'no path, URL or email in the text; every contact-sheet frame is looked at after the render' ) );
		} else {
			const looked = lookedAt( readText( path.join( demo.post, 'check.md' ) ), 'Leaks', manifest.render );
			rows.push( looked
				? row( 'Leaks', looked.pass ? 'PASS' : 'FAIL', `looked at for render ${ manifest.render } (${ looked.by }): ${ looked.note || looked.result }` )
				: row( 'Leaks', 'LOOK', `look at every frame of ${ manifest.files.contact.join( ', ' ) } — no terminal, editor, path, username, password page, real name or email, no product blamed — then add a row under "Looked at" for render ${ manifest.render }` ) );
		}
	}

	// Before and after.
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

	// View.
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

	// Legibility.
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
		rows.push( row( 'Legibility', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : details.join( '; ' ) ) );
	}

	// Spec.
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

	// Voice: every video is voiced from the approved Spoken words (§10), every pick word for word.
	{
		const v = pkg.voice;
		if ( ! v.chunks.length ) {
			rows.push( row( 'Voice', 'FAIL', 'post/script.md has no Spoken words — every video is voiced (§10): add the Spoken column' ) );
		} else if ( ! v.made ) {
			rows.push( row( 'Voice', '—', `${ v.chunks.length } scene(s) to voice after Approval 1: node tools/video/voice.mjs ${ demo.id }` ) );
		} else if ( v.problems.length ) {
			rows.push( row( 'Voice', 'FAIL', v.problems.join( '; ' ) ) );
		} else {
			const p = v.state.processed;
			const listen = v.flags.length ? `; listen to ${ v.flags.join( '; ' ) }` : '';
			rows.push( row( 'Voice', 'PASS', `${ v.map.size } scene(s), ${ voiceConfig.voice_name } (${ voiceConfig.tts_model_id }); every pick reads the approved words (word check ≥ ${ voiceConfig.min_accuracy * 100 } %, no clipped ending); one chain at ${ p.lufs } LUFS${ listen }` ) );
		}
	}

	// Sound: the finished mix on the rendered file.
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
		rows.push( row( 'Sound', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ L.I } LUFS · true peak ${ L.TP } dBTP · AAC 48 kHz stereo · voice in ${ s.voice.length } scene(s), the music bed under it, ${ s.clicks } click(s), ${ s.typing } typed stretch(es) — heard once at Approval 2` ) );
	} else if ( cut ) {
		rows.push( row( 'Sound', 'FAIL', 'the render is silent: make the voice, then render again' ) );
	} else {
		rows.push( row( 'Sound', '—', 'measured on the rendered file' ) );
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
		rows.push( row( 'Word counts', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `${ onScreen } words on screen · ${ spoken } spoken · copy ${ copyWords } words · lines 1 + 2 ${ l1.length + l2.length } characters` ) );
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
		rows.push( row( 'First line and close', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join( '; ' ) : `video and copy open on the same sentence and close on "${ brand.ask }"; two alternative first lines` ) );
	}

	// Pace.
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

	const header = `Run ${ stamp() } · ${ cut ? `words and cut · render ${ manifest.render }` : 'words (no render of this script yet)' } · script.md ${ pkg.scriptSha || '—' }`;
	const open = rows.filter( ( r ) => r.result === 'FAIL' || r.result === 'LOOK' );
	const summary = open.length
		? `**Not passed:** ${ open.map( ( r ) => `${ r.check } (${ r.result })` ).join( ', ' ) }. A fail is fixed or reported, never waved through.`
		: `**Every row passed${ cut ? '' : ' that can be checked before the render' }.**`;
	writeCheck( demo, header, rows, summary );

	for ( const r of rows ) {
		console.log( `  ${ r.result.padEnd( 4 ) }  ${ r.check } — ${ r.detail }` );
	}
	console.log( `\n${ summary.replace( /\*\*/g, '' ) }\nWritten to ${ path.join( 'post', 'check.md' ) }.` );
	return ! open.length;
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
		text = `# Self-check — ${ demo.id }\n\n${ block }\n\n${ LOOKED }\n\n## Approvals\n`;
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
			const approvals = /^##\s+Approvals\s*$/im.exec( text );
			text = approvals
				? `${ text.slice( 0, approvals.index ) }${ LOOKED }\n\n${ text.slice( approvals.index ) }`
				: `${ text.replace( /\s*$/, '' ) }\n\n${ LOOKED }\n`;
		}
		if ( ! /^##\s+Approvals\s*$/im.test( text ) ) {
			text = `${ text.replace( /\s*$/, '' ) }\n\n## Approvals\n`;
		}
	}
	fs.mkdirSync( demo.post, { recursive: true } );
	fs.writeFileSync( target, text );
}
