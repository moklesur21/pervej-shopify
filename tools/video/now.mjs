#!/usr/bin/env node
/**
 * The clock for log.md (video guideline §3): the system time now, in Dhaka, as the log writes it.
 * The same output on macOS and Windows, so a log never mixes formats.
 *
 *   node tools/video/now.mjs        → Fri 9 Oct 10:42
 */

const parts = Object.fromEntries( new Intl.DateTimeFormat( 'en-GB', {
	timeZone: 'Asia/Dhaka',
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23',
} ).formatToParts( new Date() ).map( ( p ) => [ p.type, p.value ] ) );

console.log( `${ parts.weekday } ${ parts.day } ${ parts.month } ${ parts.hour }:${ parts.minute }` );
