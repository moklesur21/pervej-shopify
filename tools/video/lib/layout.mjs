/**
 * The frame, the look and the reading rules — video guideline §5 and §6, in numbers.
 * Everything that draws, times or checks a frame reads these; change them here only.
 */

/** Square canvas, px. */
export const CANVAS = 1080;

/** Top strip: the label, alone. */
export const STRIP = { y: 0, height: 80 };

/** Middle: footage or slide. 4:3, so a 540 × 405 px part of the page at 2× fills it exactly. */
export const MIDDLE = { y: 80, width: 1080, height: 810 };

/** Bottom band: the line. */
export const BAND = { y: 890, height: 190 };

export const FPS = 30;

/** Minimum text sizes on the 1080 canvas (§6). */
export const MIN_PX = { label: 30, line: 48, slide: 36, footage: 32 };

/** The pervej.com palette (§6). Teal is for markers and outlines, never for text. */
export const PALETTE = {
	navy: '#0F172A',
	white: '#FFFFFF',
	grey: '#F1F5F9',
	teal: '#06C5BE',
};

export const FONT = 'IBM Plex Sans';

/** Browser views (§4). Desktop is the default; phone only for a mobile problem; the rest are QA widths. */
export const VIEWS = {
	desktop: { width: 1280, height: 800 },
	phone: { width: 390, height: 844 },
	tablet: { width: 768, height: 1024 },
};

/** A QA width given as a number gets this height. */
export const QA_HEIGHTS = { 360: 800, 390: 844, 768: 1024 };

/** Default desktop frame: 540 × 405 CSS px, so 16 px site text lands at 32 px (§4 "Framed"). */
export const FRAME = { width: 540, aspect: MIDDLE.width / MIDDLE.height };

/** Device scale for capture: two to three times (§4 "Sharp"). */
export const SCALE = { min: 2, max: 3 };

/** Reading and pace (§5 writing rules, §6 editing rules), seconds. */
export const PACE = {
	wordsPerSecond: 3,
	minSlide: 2.5,
	maxStill: 5,
	maxScene: 20,
	maxTotal: 90,
	minTotal: 60,
	endCard: 3.5,
	wideStill: 1,
	maxOnScreenWords: 180,
};

/** Spec limits (§6, §8). */
export const SPEC = {
	maxBytes: 200 * 1024 * 1024,
	maxCoverBytes: 2 * 1024 * 1024,
};
