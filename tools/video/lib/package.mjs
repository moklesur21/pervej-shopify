/**
 * One demo's post package as the commands and the check see it: brand words, the parsed script and
 * copy, the clip sidecars the script names, the timed plan, and the carousel and insight files.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { brand, readText } from './paths.mjs';
import { parseCarousel, parseCopy, parseInsight, parseScript, plan } from './script.mjs';
import { currentVoice } from './voice.mjs';

/** Short hash of a text file's content; line endings normalised, so a CRLF checkout is the same script. */
export const sha = ( text ) => crypto.createHash( 'sha1' ).update( text.replace( /\r\n/g, '\n' ) ).digest( 'hex' ).slice( 0, 7 );

/**
 * @param {object} demo Demo paths.
 * @return {object} { brand, scriptMd, script, copy, clips, plan, carousel, insight, shas, errors }.
 */
export function loadPackage( demo ) {
	const errors = [];
	const scriptMd = readText( path.join( demo.post, 'script.md' ) );
	const copyMd = readText( path.join( demo.post, 'copy.md' ) );
	if ( scriptMd === null ) {
		errors.push( 'post/script.md does not exist yet.' );
	}
	if ( copyMd === null ) {
		errors.push( 'post/copy.md does not exist yet.' );
	}
	const script = scriptMd === null ? { scenes: [], cover: null, pronunciation: [], spokenColumn: false, errors: [] } : parseScript( scriptMd );
	const copy = copyMd === null ? { post: null, lines: [], alternatives: [], errors: [] } : parseCopy( copyMd );
	errors.push( ...script.errors, ...copy.errors );
	// The other two posts (§7a, §7b): parsed when drafted; a missing file is the check's to report.
	const carouselMd = readText( path.join( demo.post, 'carousel.md' ) );
	const insightMd = readText( path.join( demo.post, 'insight.md' ) );
	const carousel = carouselMd === null ? null : parseCarousel( carouselMd );
	const insight = insightMd === null ? null : parseInsight( insightMd );
	const postErrors = [ ...( carousel?.errors || [] ), ...( insight?.errors || [] ) ];

	const clips = new Map();
	const names = new Set( script.scenes.flatMap( ( s ) => s.shots.filter( ( shot ) => shot.kind === 'clip' ).map( ( shot ) => shot.name ) ) );
	if ( script.cover ) {
		names.add( script.cover.name );
	}
	for ( const name of names ) {
		const stem = `${ demo.id }-${ name }`;
		const json = readText( demo.rawFile( `${ stem }.json` ) );
		if ( json === null || ! fs.existsSync( demo.rawFile( `${ stem }.mp4` ) ) ) {
			continue;
		}
		const sidecar = JSON.parse( json );
		clips.set( name, { ...sidecar, mp4: demo.rawFile( `${ stem }.mp4` ), widePng: sidecar.wide ? demo.rawFile( sidecar.wide ) : null } );
	}
	const b = brand();
	// The plan is timed to the voice once every scene's voice matches the checked words; until then it is silent.
	const voice = currentVoice( demo, script );
	const voiced = voice.chunks.length > 0 && ! voice.problems.length;
	const timed = plan( script.scenes, clips, b, voiced ? new Map( [ ...voice.map ].map( ( [ n, v ] ) => [ n, v.seconds ] ) ) : new Map() );
	errors.push( ...timed.errors );
	return {
		brand: b,
		scriptMd,
		scriptSha: scriptMd === null ? null : sha( scriptMd ),
		script,
		copy,
		clips,
		voice,
		voiced,
		plan: timed,
		errors,
		carousel,
		carouselSha: carouselMd === null ? null : sha( carouselMd ),
		insight,
		insightSha: insightMd === null ? null : sha( insightMd ),
		postErrors,
	};
}
