#!/usr/bin/env node
/**
 * Renders the approved script into the LinkedIn video and everything the VA needs (guideline §6, §11).
 *
 *   node tools/video/render.mjs <id>
 *
 * Refuses unless post/check.md carries a committed "Approved 1" line and script.md / copy.md are
 * unchanged since. Writes media/final/: <id>-linkedin.mp4 · -cover.png · -contact-N.png ·
 * -timeline.png · -copy.txt; a manifest and the drawn frames in media/render/. Then runs the check.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { resolveDemo, ensureDir, shown, toolVersion } from './lib/paths.mjs';
import { loadPackage } from './lib/package.mjs';
import { approval } from './lib/approvals.mjs';
import { openFrames, pngSize, fileUrl } from './lib/slides.mjs';
import { ffmpeg, FROM_YUV, TO_YUV, x264 } from './lib/ffmpeg.mjs';
import { CANVAS, FPS, MIDDLE, PALETTE } from './lib/layout.mjs';
import { runCheck } from './lib/checks.mjs';

const MARKS = { before: 'Before', after: 'After' };
const SHEET = { columns: 4, rows: 4, tile: 432 };
const pad = ( n ) => String( n ).padStart( 3, '0' );

/** Where a clip sits in the middle: its display size, centred. */
function footage( clip ) {
	const { width, height } = clip.display;
	return { x: Math.round( ( MIDDLE.width - width ) / 2 ), y: Math.round( ( MIDDLE.height - height ) / 2 ), width, height };
}

function marks( phase, rect, speed = 1 ) {
	const out = [];
	if ( MARKS[ phase ] ) {
		out.push( { text: MARKS[ phase ], side: 'left', ...rect } );
	}
	if ( speed !== 1 ) {
		out.push( { text: `×${ speed }`, side: 'right', ...rect } );
	}
	return out;
}

function fitStill( file ) {
	const size = pngSize( fs.readFileSync( file ) );
	const s = Math.min( 1, MIDDLE.width / size.width, MIDDLE.height / size.height );
	const width = Math.round( size.width * s );
	const height = Math.round( size.height * s );
	return { x: Math.round( ( MIDDLE.width - width ) / 2 ), y: Math.round( ( MIDDLE.height - height ) / 2 ), width, height };
}

async function main() {
	const demo = resolveDemo( process.argv[ 2 ] );
	const pkg = loadPackage( demo );
	if ( pkg.errors.length ) {
		throw new Error( `Not rendered — fix the script first:\n- ${ pkg.errors.join( '\n- ' ) }` );
	}
	const gate = approval( demo );
	if ( ! gate.ok ) {
		throw new Error( `Not rendered — ${ gate.reason }` );
	}
	const { steps, total } = pkg.plan;
	console.log( `Render ${ demo.id } · script ${ pkg.scriptSha } (approved in ${ gate.commit }) · ${ steps.length } shots · ${ total.toFixed( 1 ) } s` );
	for ( const note of pkg.plan.notes ) {
		console.log( `  note: ${ note }` );
	}

	fs.rmSync( demo.work, { recursive: true, force: true } );
	ensureDir( demo.work );
	ensureDir( demo.final );
	for ( const old of fs.readdirSync( demo.final ).filter( ( f ) => f.startsWith( `${ demo.id }-contact-` ) ) ) {
		fs.rmSync( path.join( demo.final, old ) );
	}

	const lines = new Map( pkg.script.scenes.map( ( s ) => [ s.n, s.line ] ) );
	const label = pkg.brand.label;
	const painter = await openFrames();
	const out = {
		mp4: demo.finalFile( 'linkedin.mp4' ),
		cover: demo.finalFile( 'cover.png' ),
		timeline: demo.finalFile( 'timeline.png' ),
		copy: demo.finalFile( 'copy.txt' ),
	};
	let cover;
	try {
		// 1. Draw every frame: slides, stills, overlays for clips.
		const problems = new Set();
		for ( const [ i, step ] of steps.entries() ) {
			const line = lines.get( step.scene );
			let spec;
			let transparent = false;
			if ( step.kind === 'clip' ) {
				const clip = pkg.clips.get( step.clip );
				spec = { kind: 'overlay', transparentMiddle: true, label, line, marks: marks( clip.phase, footage( clip ), step.speed ) };
				transparent = true;
			} else if ( step.kind === 'wide' ) {
				const clip = pkg.clips.get( step.clip );
				const rect = fitStill( clip.widePng );
				spec = { kind: 'image', label, line, image: { src: fileUrl( clip.widePng ), ...rect }, marks: marks( clip.phase, rect ) };
			} else if ( step.kind === 'slide' ) {
				spec = { kind: 'slide', label, line, slide: { layout: step.layout, rows: step.rows, shown: step.shown } };
			} else {
				spec = { kind: 'endcard', label, line, endCard: pkg.brand.endCard };
			}
			step.png = path.join( demo.work, `${ step.kind === 'clip' ? 'overlay' : 'still' }-${ pad( i + 1 ) }.png` );
			const result = await painter.draw( spec, step.png, transparent );
			step.sizes = result.sizes;
			result.problems.forEach( ( p ) => problems.add( `Scene ${ step.scene }: ${ p }` ) );
		}
		if ( problems.size ) {
			throw new Error( `Not rendered:\n- ${ [ ...problems ].join( '\n- ' ) }` );
		}

		// 2. The cover: the zoomed frame where the problem is plain to see, with the label and the problem line.
		const firstClip = steps.find( ( s ) => s.kind === 'clip' );
		const coverName = pkg.script.cover?.name || firstClip?.clip;
		if ( coverName ) {
			const clip = pkg.clips.get( coverName );
			const at = pkg.script.cover?.at ?? Math.max( 0, clip.seconds - 0.2 );
			const src = path.join( demo.work, 'cover-frame.png' );
			await ffmpeg( [ '-ss', String( at ), '-i', clip.mp4, '-frames:v', '1', '-vf', `scale=${ FROM_YUV },format=rgb24`, src ] );
			const rect = footage( clip );
			await painter.draw( { kind: 'image', label, line: pkg.script.scenes[ 0 ].line, image: { src: fileUrl( src ), ...rect }, marks: marks( clip.phase, rect ) }, out.cover );
			cover = { clip: coverName, at, bytes: fs.statSync( out.cover ).size };
		}

		// 3. One segment per shot, all with identical H.264 settings, then joined without re-encoding.
		for ( const [ i, step ] of steps.entries() ) {
			step.segment = `seg-${ pad( i + 1 ) }.mp4`;
			const target = path.join( demo.work, step.segment );
			if ( step.kind === 'clip' ) {
				const clip = pkg.clips.get( step.clip );
				const r = footage( clip );
				const trim = [];
				if ( step.from > 0 ) {
					trim.push( '-ss', String( step.from ) );
				}
				if ( step.to < clip.seconds ) {
					trim.push( '-to', String( step.to ) );
				}
				const graph = [
					`[1:v]setpts=(PTS-STARTPTS)/${ step.speed },scale=${ r.width }:${ r.height }:flags=lanczos:${ FROM_YUV },format=gbrp,fps=${ FPS },tpad=stop_mode=clone:stop_duration=${ ( step.hold / FPS + 1 ).toFixed( 3 ) }[c]`,
					'[0:v]format=gbrp[b]',
					`[b][c]overlay=${ r.x }:${ MIDDLE.y + r.y }:eof_action=repeat:format=gbrp[v1]`,
					'[2:v]format=gbrap[o]',
					`[v1][o]overlay=0:0:format=gbrp,${ TO_YUV }[v]`,
				].join( ';' );
				await ffmpeg( [
					'-f', 'lavfi', '-i', `color=c=0x${ PALETTE.grey.slice( 1 ) }:s=${ CANVAS }x${ CANVAS }:r=${ FPS }`,
					...trim, '-i', clip.mp4,
					'-loop', '1', '-framerate', String( FPS ), '-i', step.png,
					'-filter_complex', graph, '-map', '[v]', '-frames:v', String( step.frames ),
					...x264( 16 ), '-an', target,
				] );
			} else {
				await ffmpeg( [ '-loop', '1', '-framerate', String( FPS ), '-i', step.png, '-frames:v', String( step.frames ), '-vf', TO_YUV, ...x264( 16 ), '-an', target ] );
			}
			process.stdout.write( `\r  encoded ${ i + 1 }/${ steps.length }` );
		}
		process.stdout.write( '\n' );
		fs.writeFileSync( path.join( demo.work, 'segments.txt' ), steps.map( ( s ) => `file '${ s.segment }'` ).join( '\n' ) + '\n' );
		await ffmpeg( [
			'-f', 'concat', '-safe', '0', '-i', 'segments.txt',
			'-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
			'-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out.mp4,
		], { cwd: demo.work } );
		steps.forEach( ( s ) => fs.rmSync( path.join( demo.work, s.segment ), { force: true } ) );

		// 4. The timeline scene as a still (the alternative Thursday post), and the copy as plain text.
		const timelineSteps = steps.filter( ( s ) => s.layout === 'timeline' );
		const fullTimeline = timelineSteps.find( ( s ) => s.shown === s.rows.length );
		if ( fullTimeline ) {
			fs.copyFileSync( fullTimeline.png, out.timeline );
		} else {
			fs.rmSync( out.timeline, { force: true } );
		}
		fs.writeFileSync( out.copy, pkg.copy.post + '\n' );

		// 5. Contact sheets: a frame every second, for the scan before Approval 2.
		const hash = crypto.createHash( 'sha1' ).update( fs.readFileSync( out.mp4 ) ).digest( 'hex' ).slice( 0, 7 );
		const sheetDir = ensureDir( path.join( demo.work, 'sheet' ) );
		await ffmpeg( [ '-i', out.mp4, '-vf', `select=not(mod(n\\,${ FPS })),scale=${ FROM_YUV }`, '-fps_mode', 'vfr', '-q:v', '3', path.join( sheetDir, 'f%03d.jpg' ) ] );
		const frames = fs.readdirSync( sheetDir ).filter( ( f ) => f.endsWith( '.jpg' ) ).sort();
		const perSheet = SHEET.columns * SHEET.rows;
		const sheets = Math.ceil( frames.length / perSheet );
		for ( let k = 0; k < sheets; k++ ) {
			const tiles = frames.slice( k * perSheet, ( k + 1 ) * perSheet ).map( ( f, j ) => {
				const t = k * perSheet + j;
				return { src: fileUrl( path.join( sheetDir, f ) ), caption: `${ Math.floor( t / 60 ) }:${ String( t % 60 ).padStart( 2, '0' ) }` };
			} );
			await painter.sheet( {
				title: `${ demo.id } · contact sheet ${ k + 1 } of ${ sheets } · render ${ hash } · a frame every second`,
				columns: SHEET.columns,
				tile: SHEET.tile,
				tiles,
			}, demo.finalFile( `contact-${ k + 1 }.png` ) );
		}

		// 6. The manifest the check reads.
		const manifest = {
			tool: toolVersion(),
			renderedAt: new Date().toISOString(),
			script: pkg.scriptSha,
			approval: gate.commit,
			render: hash,
			seconds: total,
			files: {
				mp4: path.basename( out.mp4 ),
				cover: cover ? path.basename( out.cover ) : null,
				timeline: fullTimeline ? path.basename( out.timeline ) : null,
				copy: path.basename( out.copy ),
				contact: Array.from( { length: sheets }, ( _, k ) => `${ demo.id }-contact-${ k + 1 }.png` ),
			},
			labelRef: path.basename( steps[ 0 ].png ),
			cover,
			steps: steps.map( ( s ) => ( {
				scene: s.scene,
				kind: s.kind,
				layout: s.layout,
				clip: s.clip,
				speed: s.speed,
				from: s.from,
				to: s.to,
				shown: s.shown,
				start: s.start / FPS,
				seconds: s.seconds,
				sizes: s.sizes,
			} ) ),
		};
		fs.writeFileSync( path.join( demo.work, 'manifest.json' ), JSON.stringify( manifest, null, '\t' ) + '\n' );
		console.log( `  ${ shown( out.mp4 ) } · render ${ hash } · ${ total.toFixed( 1 ) } s` );
		console.log( `  ${ sheets } contact sheet(s), cover${ fullTimeline ? ', timeline' : '' }, copy in ${ shown( demo.final ) }/` );
	} finally {
		await painter.close();
	}

	console.log( '\nSelf-check' );
	return runCheck( demo );
}

try {
	process.exitCode = ( await main() ) ? 0 : 1;
} catch ( error ) {
	console.error( `\n${ error.message }` );
	process.exitCode = 1;
}
