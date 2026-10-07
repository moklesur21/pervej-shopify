/**
 * Reads `post/script.md` and `post/copy.md` (video guideline §5, §7) and turns the approved script
 * into timed shots. The render and the self-check both use this, so what was approved is what is
 * rendered and what is checked.
 *
 * script.md is the guideline's one table — # | Sec | On screen | Line in the bottom band | Spoken | Source.
 * Spoken is what the voice says over the scene (§10); a scene may leave it empty. The "On screen"
 * cell lists shots, each after the first introduced by "Then" and its keyword (Then Clip …, Then Slide: …):
 *
 *   Clip <name> (wide first, from 2 s, to 7 s, ×2) — optional description, never shown
 *   Slide: *row* *row*            each italic run is one row, revealed one at a time; one row = statement
 *   Questions: *Q — A* *…*        Checklist: *…*        Timeline: *…*        (N s) after the keyword lengthens each step
 *   End card
 *
 * Under the table, optionally:  Cover: <clip name> at <seconds> s
 * and a "## Pronunciation" table — | Term | Say as | — for a name the voice gets wrong: the voice is
 * sent "Say as", the word check still listens for the term.
 */

import { FPS, PACE, VOICE } from './layout.mjs';

export const SOURCES = {
	brief: 'brief.md',
	questions: 'brief.md',
	'q&a': 'brief.md',
	plan: 'spec.md',
	spec: 'spec.md',
	log: 'log.md',
	qa: 'qa.md',
	handoff: 'handoff.md',
};

const SHOT_KINDS = [ 'slide', 'questions', 'checklist', 'timeline' ];

/**
 * Words as a reader counts them: anything with a letter or digit in it.
 *
 * @param {string} text Text.
 * @return {number} Count.
 */
export function words( text ) {
	return String( text || '' ).split( /\s+/ ).filter( ( w ) => /[\p{L}\p{N}]/u.test( w ) ).length;
}

function splitRow( line ) {
	let s = line.trim();
	if ( s.startsWith( '|' ) ) {
		s = s.slice( 1 );
	}
	if ( s.endsWith( '|' ) && ! s.endsWith( '\\|' ) ) {
		s = s.slice( 0, -1 );
	}
	const cells = [];
	let cur = '';
	for ( let i = 0; i < s.length; i++ ) {
		if ( s[ i ] === '\\' && s[ i + 1 ] === '|' ) {
			cur += '|';
			i++;
		} else if ( s[ i ] === '|' ) {
			cells.push( cur.trim() );
			cur = '';
		} else {
			cur += s[ i ];
		}
	}
	cells.push( cur.trim() );
	return cells;
}

/**
 * Every Markdown table in a document.
 *
 * @param {string} md Markdown.
 * @return {Array<{header: string[], rows: string[][]}>} Tables.
 */
export function tables( md ) {
	const lines = md.replace( /\r/g, '' ).split( '\n' );
	const out = [];
	for ( let i = 0; i < lines.length - 1; i++ ) {
		if ( lines[ i ].trim().startsWith( '|' ) && /^\s*\|?\s*:?-{3,}/.test( lines[ i + 1 ] ) ) {
			const table = { header: splitRow( lines[ i ] ), rows: [] };
			let j = i + 2;
			for ( ; j < lines.length && lines[ j ].trim().startsWith( '|' ); j++ ) {
				table.rows.push( splitRow( lines[ j ] ) );
			}
			out.push( table );
			i = j - 1;
		}
	}
	return out;
}

/** Plain text of a cell: no emphasis markers, no backticks, no surrounding quotes. */
export function plain( text ) {
	return String( text || '' ).replace( /[*_`]/g, '' ).replace( /^["“]|["”]$/g, '' ).replace( /\s+/g, ' ' ).trim();
}

function parseSources( cell, errors, n ) {
	const files = new Set();
	for ( const raw of cell.split( /[·,;&+]|\band\b/ ) ) {
		const item = raw.replace( /`/g, '' ).trim().toLowerCase();
		if ( ! item ) {
			continue;
		}
		if ( /\.md$/.test( item ) ) {
			files.add( item );
			continue;
		}
		const key = Object.keys( SOURCES ).find( ( k ) => item === k || item.startsWith( `${ k } ` ) );
		if ( key ) {
			files.add( SOURCES[ key ] );
		} else {
			errors.push( `Scene ${ n }: source "${ raw.trim() }" is not a demo file (brief, plan, log, qa, handoff or a file name).` );
		}
	}
	return [ ...files ];
}

function parseShots( cell, errors, n ) {
	const italics = [];
	const masked = cell.replace( /(?<![*\w])\*(?!\*)([^*]+?)\*(?!\*)/g, ( m, inner ) => {
		italics.push( inner.trim() );
		return `\u0001${ italics.length - 1 }\u0002`;
	} );
	// "Then" starts a new shot only when a shot keyword follows it, so a clip's description can say "then …".
	const parts = masked.split( /\s*\bThen\b[:,]?\s+(?=(?:clip|slide|questions|checklist|timeline|end card)\b)/i ).map( ( p ) => p.trim() ).filter( Boolean );
	const shots = [];
	for ( const part of parts ) {
		const rows = [ ...part.matchAll( /\u0001(\d+)\u0002/g ) ].map( ( m ) => italics[ Number( m[ 1 ] ) ] );
		const shown = part.replace( /\u0001(\d+)\u0002/g, ( m, i ) => `*${ italics[ Number( i ) ] }*` );
		let m = /^clip\s+`?([a-z0-9]+(?:-[a-z0-9]+)*)`?\s*(?:\(([^)]*)\))?/i.exec( part );
		if ( m ) {
			if ( rows.length ) {
				errors.push( `Scene ${ n }: italic text in a clip shot is never shown — "${ shown }".` );
			}
			const shot = { kind: 'clip', name: m[ 1 ].toLowerCase(), wide: false, from: null, to: null, speed: 1 };
			for ( const option of ( m[ 2 ] || '' ).split( ',' ).map( ( s ) => s.trim() ).filter( Boolean ) ) {
				let o;
				if ( /^wide( first)?$/i.test( option ) ) {
					shot.wide = true;
				} else if ( ( o = /^from\s+(\d+(?:\.\d+)?)\s*s$/i.exec( option ) ) ) {
					shot.from = Number( o[ 1 ] );
				} else if ( ( o = /^to\s+(\d+(?:\.\d+)?)\s*s$/i.exec( option ) ) ) {
					shot.to = Number( o[ 1 ] );
				} else if ( /^[×x]\s*2$/i.test( option ) ) {
					shot.speed = 2;
				} else {
					errors.push( `Scene ${ n }: unknown clip option "${ option }" (wide first · from N s · to N s · ×2).` );
				}
			}
			shots.push( shot );
			continue;
		}
		m = /^(slide|questions|checklist|timeline)\b\s*(?:\(([^)]*)\))?\s*:?/i.exec( part );
		if ( m ) {
			const kind = m[ 1 ].toLowerCase();
			const rest = part.slice( m[ 0 ].length ).replace( /\u0001\d+\u0002/g, '' );
			if ( ! rows.length ) {
				errors.push( `Scene ${ n }: "${ shown }" — slide text goes in *italics*, one italic run per row.` );
			}
			if ( /[\p{L}\p{N}]/u.test( rest ) ) {
				errors.push( `Scene ${ n }: "${ rest.trim() }" sits outside the italics of a ${ kind } — on-screen text goes in *italics*; anything else is not allowed there.` );
			}
			let min = 0;
			if ( m[ 2 ] ) {
				const o = /^(\d+(?:\.\d+)?)\s*s$/i.exec( m[ 2 ].trim() );
				if ( o ) {
					min = Number( o[ 1 ] );
				} else {
					errors.push( `Scene ${ n }: unknown ${ kind } option "${ m[ 2 ] }" (only "N s").` );
				}
			}
			const layout = kind === 'slide' ? ( rows.length === 1 ? 'statement' : 'rows' ) : kind;
			shots.push( { kind: 'slide', layout, rows, min } );
			continue;
		}
		if ( /^end card\b/i.test( part ) ) {
			shots.push( { kind: 'endcard' } );
			continue;
		}
		errors.push( `Scene ${ n }: "${ shown.slice( 0, 70 ) }" is not a shot — start with Clip, Slide:, Questions:, Checklist:, Timeline: or End card; separate shots with "Then".` );
	}
	if ( ! shots.length ) {
		errors.push( `Scene ${ n }: nothing on screen.` );
	}
	return shots;
}

/**
 * Parse post/script.md.
 *
 * @param {string} md Markdown.
 * @return {{scenes: object[], cover: object|null, errors: string[]}} Script.
 */
export function parseScript( md ) {
	const errors = [];
	const table = tables( md ).find( ( t ) => t.header.some( ( h ) => /on screen/i.test( h ) ) );
	if ( ! table ) {
		return { scenes: [], cover: null, pronunciation: [], spokenColumn: false, errors: [ 'post/script.md has no table with an "On screen" column.' ] };
	}
	const col = ( re ) => table.header.findIndex( ( h ) => re.test( h.trim() ) );
	const c = { n: col( /^(#|scene|no\.?)$/i ), sec: col( /^sec/i ), screen: col( /on screen/i ), line: col( /^line/i ), spoken: col( /^spoken/i ), source: col( /^source/i ) };
	for ( const [ key, label ] of [ [ 'n', '#' ], [ 'screen', 'On screen' ], [ 'line', 'Line in the bottom band' ], [ 'source', 'Source' ] ] ) {
		if ( c[ key ] < 0 ) {
			errors.push( `post/script.md: the table needs a "${ label }" column.` );
		}
	}
	if ( errors.length ) {
		return { scenes: [], cover: null, pronunciation: [], spokenColumn: false, errors };
	}
	const scenes = [];
	for ( const row of table.rows ) {
		if ( row.every( ( cell ) => ! cell ) ) {
			continue;
		}
		const n = Number( plain( row[ c.n ] ) ) || scenes.length + 1;
		const scene = {
			n,
			sec: c.sec >= 0 ? plain( row[ c.sec ] ) : '',
			onScreen: row[ c.screen ] || '',
			line: plain( row[ c.line ] ),
			// "—" or "-" marks a scene with nothing spoken.
			spoken: c.spoken >= 0 ? plain( row[ c.spoken ] ).replace( /^[—–-]$/, '' ) : '',
			sources: parseSources( row[ c.source ] || '', errors, n ),
		};
		if ( /!/.test( scene.spoken ) ) {
			errors.push( `Scene ${ n }: no exclamation marks in Spoken — the voice reads them as shouting (§10).` );
		}
		if ( /\b\d{1,2}:\d{2}\b/.test( scene.spoken ) ) {
			// Tested 7 Oct: the clone read 15:00 as "fifteen hundred" and 10:00 as "ten o'clock".
			errors.push( `Scene ${ n }: say a time in words in Spoken ("Wednesday morning", "that afternoon") — the screen shows the exact time from log.md (§10).` );
		}
		if ( ! scene.line ) {
			errors.push( `Scene ${ n }: no line for the bottom band.` );
		}
		scene.shots = parseShots( scene.onScreen, errors, n );
		scenes.push( scene );
	}
	if ( ! scenes.length ) {
		errors.push( 'post/script.md: the table has no scenes.' );
	}
	const cm = /^\s*Cover:\s*(?:clip\s+)?`?([a-z0-9]+(?:-[a-z0-9]+)*)`?\s+at\s+(\d+(?:\.\d+)?)\s*s\b/im.exec( md );
	const cover = cm ? { name: cm[ 1 ].toLowerCase(), at: Number( cm[ 2 ] ) } : null;
	const say = tables( md ).find( ( t ) => t.header.some( ( h ) => /^term$/i.test( h.trim() ) ) && t.header.some( ( h ) => /^say as$/i.test( h.trim() ) ) );
	const pronunciation = say
		? say.rows.map( ( r ) => ( { term: plain( r[ say.header.findIndex( ( h ) => /^term$/i.test( h.trim() ) ) ] ), say: plain( r[ say.header.findIndex( ( h ) => /^say as$/i.test( h.trim() ) ) ] ) } ) ).filter( ( p ) => p.term && p.say )
		: [];
	return { scenes, cover, pronunciation, spokenColumn: c.spoken >= 0, errors };
}

/**
 * Parse post/copy.md: the post in a fenced block under "## Post", then "## Alternative first lines".
 *
 * @param {string} md Markdown.
 * @return {{post: string|null, lines: string[], alternatives: string[], errors: string[]}} Copy.
 */
export function parseCopy( md ) {
	const text = md.replace( /\r/g, '' );
	const heading = /^##\s+Post\s*$/im.exec( text );
	const fence = heading ? /^```[^\n]*\n([\s\S]*?)\n```/m.exec( text.slice( heading.index ) ) : null;
	if ( ! fence ) {
		return { post: null, lines: [], alternatives: [], errors: [ 'post/copy.md: put the post in a ``` fenced block under "## Post".' ] };
	}
	const post = fence[ 1 ].replace( /\s+$/, '' );
	const alt = /^##\s+Alternative first lines\s*$/im.exec( text );
	const alternatives = alt
		? text.slice( alt.index + alt[ 0 ].length ).split( '\n' ).map( ( l ) => /^\s*(?:[-*]|\d+[.)])\s+(.+)$/.exec( l ) ).filter( Boolean ).map( ( m ) => plain( m[ 1 ] ) )
		: [];
	return { post, lines: post.split( '\n' ), alternatives, errors: [] };
}

/**
 * Every piece of text the viewer reads, by scene: the line, slide rows, end card.
 *
 * @param {object} scene Scene.
 * @param {object} brand brand.json.
 * @return {string[]} Texts.
 */
export function onScreenText( scene, brand ) {
	const out = [ scene.line ];
	for ( const shot of scene.shots ) {
		if ( shot.kind === 'slide' ) {
			out.push( ...shot.rows );
		} else if ( shot.kind === 'endcard' ) {
			out.push( brand.endCard.name, brand.endCard.title );
			if ( brand.endCard.url ) {
				out.push( brand.endCard.url );
			}
		}
	}
	return out;
}

/**
 * Time every shot. Durations are computed, never typed: a slide step stays up one second per three
 * words and never under 2.5 s; a clip runs its real length (halved for ×2); the end card 3.5 s.
 * A scene too short to read its line and rows in — or to fit its voice, with a short lead-in and
 * tail — is lengthened across its slide steps, or holds its last clip frame.
 *
 * @param {object[]} scenes Parsed scenes.
 * @param {Map}      clips  name → { seconds, wide, speed (sidecar) }.
 * @param {object}   brand  brand.json.
 * @param {Map}      voice  scene number → seconds of its processed voice (none: a silent plan).
 * @return {{steps: object[], total: number, scenes: object[], errors: string[], notes: string[]}} Plan.
 */
export function plan( scenes, clips, brand, voice = new Map() ) {
	const steps = [];
	const errors = [];
	const notes = [];
	const timing = [];
	const frames = ( seconds ) => Math.max( 1, Math.round( seconds * FPS ) );
	for ( const scene of scenes ) {
		const own = [];
		for ( const shot of scene.shots ) {
			if ( shot.kind === 'clip' ) {
				const clip = clips.get( shot.name );
				if ( ! clip ) {
					errors.push( `Scene ${ scene.n }: clip "${ shot.name }" has no file in media/raw/ — capture it first.` );
					continue;
				}
				if ( shot.speed !== 1 && clip.speed ) {
					errors.push( `Scene ${ scene.n }: "${ shot.name }" is a speed clip; it plays uncut at real speed, never ×${ shot.speed } (§2).` );
				}
				const from = shot.from ?? 0;
				const to = shot.to ?? clip.seconds;
				if ( from < 0 || to > clip.seconds + 0.05 || to - from < 0.5 ) {
					errors.push( `Scene ${ scene.n }: "${ shot.name }" from ${ from } s to ${ to } s does not fit the clip (${ clip.seconds } s).` );
					continue;
				}
				if ( shot.wide ) {
					if ( ! clip.wide ) {
						errors.push( `Scene ${ scene.n }: "${ shot.name }" was captured without a wide still (wide: true in the capture script).` );
					} else {
						own.push( { scene: scene.n, kind: 'wide', clip: shot.name, frames: frames( PACE.wideStill ) } );
					}
				}
				own.push( { scene: scene.n, kind: 'clip', clip: shot.name, from, to, speed: shot.speed, frames: frames( ( to - from ) / shot.speed ), hold: 0 } );
			} else if ( shot.kind === 'slide' ) {
				shot.rows.forEach( ( row, i ) => {
					const seconds = Math.max( PACE.minSlide, words( row ) / PACE.wordsPerSecond, shot.min );
					own.push( { scene: scene.n, kind: 'slide', layout: shot.layout, rows: shot.rows, shown: i + 1, frames: frames( seconds ), words: words( row ) } );
				} );
			} else {
				own.push( { scene: scene.n, kind: 'endcard', frames: frames( PACE.endCard ) } );
			}
		}
		const read = onScreenText( scene, brand ).reduce( ( sum, t ) => sum + words( t ), 0 ) / PACE.wordsPerSecond;
		const spoken = voice.get( scene.n ) || 0;
		const listen = spoken ? VOICE.lead + spoken + VOICE.tail : 0;
		const need = Math.max( read, listen );
		const have = own.reduce( ( sum, s ) => sum + s.frames, 0 ) / FPS;
		if ( own.length && have < need ) {
			const extra = frames( need - have );
			const why = listen > read ? 'the voice can finish' : 'the line can be read';
			const slides = own.filter( ( s ) => s.kind === 'slide' );
			const last = [ ...own ].reverse().find( ( s ) => s.kind === 'clip' );
			if ( slides.length ) {
				// Spread over the rows, so no one row sits much longer than the others.
				slides.forEach( ( s, i ) => {
					s.frames += Math.floor( extra / slides.length ) + ( i < extra % slides.length ? 1 : 0 );
				} );
			} else if ( last ) {
				last.hold = extra;
				last.frames += extra;
				notes.push( `Scene ${ scene.n }: holds the last frame of "${ last.clip }" ${ ( extra / FPS ).toFixed( 1 ) } s so ${ why }.` );
			} else {
				own[ own.length - 1 ].frames += extra;
			}
		}
		const seconds = own.reduce( ( sum, s ) => sum + s.frames, 0 ) / FPS;
		if ( seconds > PACE.maxScene ) {
			errors.push( `Scene ${ scene.n } runs ${ seconds.toFixed( 1 ) } s; no scene runs past ${ PACE.maxScene } s (§6) — cut detail${ spoken ? ', shorten its Spoken words' : '' } or trim a clip.` );
		}
		timing.push( { n: scene.n, guide: scene.sec, seconds, voice: spoken || null } );
		steps.push( ...own );
	}
	let start = 0;
	for ( const step of steps ) {
		step.start = start;
		step.seconds = step.frames / FPS;
		start += step.frames;
	}
	const total = start / FPS;
	if ( total > PACE.maxTotal ) {
		errors.push( `The video runs ${ total.toFixed( 1 ) } s; never longer than ${ PACE.maxTotal } s (§6) — cut detail, not reading time.` );
	}
	return { steps, total, scenes: timing, errors, notes };
}
