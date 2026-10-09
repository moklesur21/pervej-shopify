/**
 * A picture from the capture for a carousel page or the insight image (guideline §7a, §7b): a still
 * from media/raw/ (as cap.still and wide stills name them), or one frame of a clip — placed in a middle
 * of the given size, centred, scaled down to fit and never up, with its Before/After mark.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pngSize } from './slides.mjs';
import { ffmpeg, FROM_YUV } from './ffmpeg.mjs';

const MARKS = { before: 'Before', after: 'After' };

/**
 * @param {object} demo   Demo paths.
 * @param {object} pic    { kind: 'still'|'frame', name, at, phase } from the parsed file.
 * @param {string} work   Folder for a frame taken from a clip.
 * @param {object} middle { width, height } the picture sits in.
 * @return {Promise<{file: string, rect: object, scale: number, marks: object[]}>} The picture, placed.
 */
export async function placePicture( demo, pic, work, middle ) {
	let file;
	if ( pic.kind === 'still' ) {
		file = demo.rawFile( `${ demo.id }-${ pic.name }.png` );
		if ( ! fs.existsSync( file ) ) {
			throw new Error( `No still ${ path.basename( file ) } in media/raw/ — capture it first (cap.still, or wide: true on a clip).` );
		}
	} else {
		const mp4 = demo.rawFile( `${ demo.id }-${ pic.name }.mp4` );
		if ( ! fs.existsSync( mp4 ) ) {
			throw new Error( `No clip ${ path.basename( mp4 ) } in media/raw/ — capture it first.` );
		}
		file = path.join( work, `frame-${ pic.name }-${ String( pic.at ).replace( '.', '_' ) }.png` );
		fs.rmSync( file, { force: true } );
		await ffmpeg( [ '-ss', String( pic.at ), '-i', mp4, '-frames:v', '1', '-vf', `scale=${ FROM_YUV },format=rgb24`, file ] );
		if ( ! fs.existsSync( file ) ) {
			throw new Error( `No frame at ${ pic.at } s in ${ path.basename( mp4 ) }: pick a moment inside the clip.` );
		}
	}
	const size = pngSize( fs.readFileSync( file ) );
	const scale = Math.min( 1, middle.width / size.width, middle.height / size.height );
	const width = Math.round( size.width * scale );
	const height = Math.round( size.height * scale );
	const rect = { x: Math.round( ( middle.width - width ) / 2 ), y: Math.round( ( middle.height - height ) / 2 ), width, height };
	const mark = MARKS[ pic.phase ];
	return { file, rect, scale, marks: mark ? [ { text: mark, side: 'left', ...rect } ] : [] };
}
