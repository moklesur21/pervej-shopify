/**
 * Builds one frame from a spec and reports what it measured. Called by tools/video/lib/slides.mjs:
 *
 *   window.renderFrame( { kind, label, line, marks, transparentMiddle, image, slide, endCard, counter, sheet, insight } )
 *
 * kind: 'overlay' (strip + band + marks over a transparent middle, laid on top of a clip),
 *       'image' (a still in the middle), 'slide', 'endcard', 'sheet' (contact sheet),
 *       'insight' (the 1200 × 1200 insight image, §7b).
 * counter: a carousel page's "3/9", at the right of the strip (§7a). endCard.lead: a line above the
 * name — the flag on the carousel's last page.
 * All text goes in through textContent; nothing is parsed as HTML.
 */
( function () {
	'use strict';

	var START = { rows: 44, statement: 60, questions: 40, checklist: 42, timeline: 40 };
	var MIN_SLIDE = 36;
	var LEAD = { start: 44, min: 36 };
	// The insight image (§7b), on its 1200 canvas: start sizes and the floors they never go under.
	var INSIGHT = { canvas: 1200, line: [ 64, 60 ], number: [ 240, 160 ], source: 34, label: 34 };

	function el( tag, className, text ) {
		var node = document.createElement( tag );
		if ( className ) {
			node.className = className;
		}
		if ( text !== undefined && text !== null ) {
			node.textContent = text;
		}
		return node;
	}

	function px( node ) {
		return parseFloat( window.getComputedStyle( node ).fontSize );
	}

	function slideBody( slide ) {
		var layout = slide.layout || 'rows';
		var body = el( 'div', 'slide slide--' + layout );
		body.style.setProperty( '--size', ( START[ layout ] || START.rows ) + 'px' );
		slide.rows.forEach( function ( text, i ) {
			var row = el( 'div', 'row' + ( i < slide.shown ? '' : ' is-hidden' ) );
			var parts = layout === 'questions' ? text.split( ' — ' ) : [ text ];
			if ( parts.length > 1 ) {
				row.append( el( 'span', 'q', parts[ 0 ] ), el( 'span', 'a', parts.slice( 1 ).join( ' — ' ) ) );
			} else {
				row.textContent = text;
			}
			body.append( row );
		} );
		return body;
	}

	function fit( body, problems ) {
		var size = parseFloat( body.style.getPropertyValue( '--size' ) );
		while ( body.scrollHeight > body.clientHeight + 1 && size > MIN_SLIDE ) {
			size -= 2;
			body.style.setProperty( '--size', size + 'px' );
		}
		if ( body.scrollHeight > body.clientHeight + 1 ) {
			problems.push( 'slide text does not fit even at ' + MIN_SLIDE + ' px — cut detail, not reading time' );
		}
	}

	function sheet( spec ) {
		var s = spec.sheet;
		var width = 48 + s.columns * s.tile + ( s.columns - 1 ) * 16;
		document.documentElement.style.cssText = 'width:' + width + 'px;height:auto;overflow:visible;background:#fff';
		document.body.style.cssText = 'width:' + width + 'px;height:auto;overflow:visible';
		var root = document.getElementById( 'frame' );
		root.style.cssText = 'width:' + width + 'px;height:auto';
		var wrap = el( 'div', 'sheet' );
		wrap.append( el( 'h1', null, s.title ) );
		var tiles = el( 'div', 'tiles' );
		tiles.style.gridTemplateColumns = 'repeat(' + s.columns + ', ' + s.tile + 'px)';
		s.tiles.forEach( function ( t ) {
			var fig = el( 'figure' );
			var img = el( 'img' );
			img.src = t.src;
			img.width = s.tile;
			img.height = s.tile;
			fig.append( img, el( 'figcaption', null, t.caption ) );
			tiles.append( fig );
		} );
		wrap.append( tiles );
		root.append( wrap );
		return wrap;
	}

	// Shrink a node's --size until its content fits the room it has, never under min. Heights are
	// measured on the content, not the box's scrollHeight: a centred flex box hides overflow at the top.
	function shrink( node, content, room, start, min ) {
		var size = start;
		var fits = function () {
			return content.getBoundingClientRect().height <= room + 1;
		};
		node.style.setProperty( '--size', size + 'px' );
		while ( ! fits() && size > min ) {
			size -= 2;
			node.style.setProperty( '--size', size + 'px' );
		}
		return fits();
	}

	// The height a box offers its content: inside its padding.
	function room( box ) {
		var cs = window.getComputedStyle( box );
		return box.clientHeight - parseFloat( cs.paddingTop ) - parseFloat( cs.paddingBottom );
	}

	function lineCount( node ) {
		return Math.round( node.getBoundingClientRect().height / ( px( node ) * 1.2 ) );
	}

	async function insight( spec, problems, sizes ) {
		var c = INSIGHT.canvas;
		var s = spec.insight;
		document.documentElement.style.cssText = 'width:' + c + 'px;height:' + c + 'px';
		document.body.style.cssText = 'width:' + c + 'px;height:' + c + 'px';
		var root = document.getElementById( 'frame' );
		root.style.cssText = 'width:' + c + 'px;height:' + c + 'px';
		root.className = 'insight insight--' + s.layout + ( spec.label ? '' : ' is-unlabelled' );
		var label = null;
		if ( spec.label ) {
			var strip = el( 'div', 'i-strip' );
			label = el( 'p', null, spec.label );
			strip.append( label );
			root.append( strip );
		}
		var middle = el( 'div', 'i-middle' );
		root.append( middle );
		var line = el( 'p', 'i-line', s.line );
		var number = null;
		var source = null;
		if ( s.layout === 'still' ) {
			var img = el( 'img', 'picture' );
			img.src = s.image.src;
			img.style.left = s.image.x + 'px';
			img.style.top = s.image.y + 'px';
			img.style.width = s.image.width + 'px';
			img.style.height = s.image.height + 'px';
			middle.append( img );
			( s.marks || [] ).forEach( function ( m ) {
				var mark = el( 'div', 'mark', m.text );
				mark.style.top = ( m.y + 20 ) + 'px';
				mark.style.left = ( m.x + 20 ) + 'px';
				middle.append( mark );
			} );
			var band = el( 'div', 'i-band' );
			band.append( line );
			root.append( band );
			await img.decode();
			await document.fonts.ready;
			if ( ! shrink( band, line, room( band ), INSIGHT.line[ 0 ], INSIGHT.line[ 1 ] ) ) {
				problems.push( 'the insight line does not fit the band even at ' + INSIGHT.line[ 1 ] + ' px — cut words' );
			}
		} else {
			number = el( 'p', 'i-number', s.number );
			source = el( 'p', 'i-source', s.sourceLine );
			var stack = el( 'div', 'i-stack' );
			stack.append( number, line );
			middle.append( stack, source );
			await document.fonts.ready;
			// The number first: it shrinks only when it can't sit on one line at full size.
			var size = INSIGHT.number[ 0 ];
			number.style.fontSize = size + 'px';
			while ( number.scrollWidth > stack.clientWidth + 1 && size > INSIGHT.number[ 1 ] ) {
				size -= 4;
				number.style.fontSize = size + 'px';
			}
			if ( number.scrollWidth > stack.clientWidth + 1 ) {
				problems.push( 'the number does not fit on one line even at ' + INSIGHT.number[ 1 ] + ' px' );
			}
			// The stack holds the number (with its rule), the gap and the line.
			var gap = parseFloat( window.getComputedStyle( stack ).rowGap ) || 0;
			if ( ! shrink( line, line, room( stack ) - number.getBoundingClientRect().height - gap - 36, INSIGHT.line[ 0 ], INSIGHT.line[ 1 ] ) ) {
				problems.push( 'the number and the line do not fit even with the line at ' + INSIGHT.line[ 1 ] + ' px — cut words' );
			}
			sizes.number = px( number );
			sizes.source = px( source );
		}
		sizes.line = px( line );
		if ( lineCount( line ) > 3 ) {
			problems.push( 'the insight line runs to ' + lineCount( line ) + ' lines; three at most — cut words' );
		}
		if ( label ) {
			sizes.label = px( label );
			if ( label.scrollWidth > label.parentNode.clientWidth - 80 ) {
				problems.push( 'the label does not fit on one line at ' + INSIGHT.label + ' px' );
			}
		}
		return { problems: problems, sizes: sizes };
	}

	window.renderFrame = async function ( spec ) {
		var root = document.getElementById( 'frame' );
		root.textContent = '';
		root.removeAttribute( 'style' );
		document.documentElement.removeAttribute( 'style' );
		document.body.removeAttribute( 'style' );
		root.className = '';
		var problems = [];
		var sizes = {};

		if ( spec.kind === 'insight' ) {
			return insight( spec, problems, sizes );
		}

		if ( spec.kind === 'sheet' ) {
			var wrap = sheet( spec );
			await Promise.all( Array.from( document.images ).map( function ( img ) {
				return img.decode();
			} ) );
			await document.fonts.ready;
			return { problems: problems, sizes: sizes, height: Math.ceil( wrap.getBoundingClientRect().height ) };
		}

		var stripNode = el( 'div', 'strip' );
		var label = el( 'p', null, spec.label );
		stripNode.append( label );
		var counter = null;
		if ( spec.counter ) {
			counter = el( 'span', 'counter', spec.counter );
			stripNode.append( counter );
		}

		var middle = el( 'div', 'middle' + ( spec.transparentMiddle ? ' is-transparent' : '' ) );

		var bandNode = el( 'div', 'band' );
		var line = el( 'p', null, spec.line || '' );
		bandNode.append( line );

		root.append( stripNode, middle, bandNode );

		var body = null;
		if ( spec.kind === 'image' ) {
			var img = el( 'img', 'picture' );
			img.src = spec.image.src;
			img.style.left = spec.image.x + 'px';
			img.style.top = spec.image.y + 'px';
			img.style.width = spec.image.width + 'px';
			img.style.height = spec.image.height + 'px';
			middle.append( img );
			await img.decode();
		} else if ( spec.kind === 'slide' ) {
			body = slideBody( spec.slide );
			middle.append( body );
		} else if ( spec.kind === 'endcard' ) {
			var card = el( 'div', 'endcard' );
			if ( spec.endCard.lead ) {
				card.append( el( 'p', 'lead', spec.endCard.lead ) );
			}
			card.append( el( 'p', 'name', spec.endCard.name ), el( 'div', 'rule' ), el( 'p', 'title', spec.endCard.title ) );
			if ( spec.endCard.url ) {
				card.append( el( 'p', 'url', spec.endCard.url ) );
			}
			middle.append( card );
		}

		( spec.marks || [] ).forEach( function ( m ) {
			var mark = el( 'div', 'mark', m.text );
			mark.style.top = ( m.y + 20 ) + 'px';
			middle.append( mark );
			if ( m.side === 'right' ) {
				mark.style.left = ( m.x + m.width - 20 - mark.offsetWidth ) + 'px';
			} else {
				mark.style.left = ( m.x + 20 ) + 'px';
			}
		} );

		await document.fonts.ready;

		if ( body ) {
			fit( body, problems );
			var rows = Array.from( body.querySelectorAll( '.row' ) );
			sizes.slide = Math.min.apply( null, rows.map( px ) );
			var shownRows = rows.filter( function ( r ) {
				return ! r.classList.contains( 'is-hidden' );
			} );
			if ( spec.slide.layout === 'timeline' && shownRows.length > 1 ) {
				// Marker centre: 0.32em + 13 px down, 38 px left of the row (see .slide--timeline .row::before).
				var dot = function ( r ) {
					return r.offsetTop + px( r ) * 0.32 + 13;
				};
				var rail = el( 'div', 'rail' );
				rail.style.left = ( rows[ 0 ].offsetLeft - 41 ) + 'px';
				rail.style.top = dot( shownRows[ 0 ] ) + 'px';
				rail.style.height = ( dot( shownRows[ shownRows.length - 1 ] ) - dot( shownRows[ 0 ] ) ) + 'px';
				body.prepend( rail );
			}
		}

		sizes.label = px( label );
		if ( label.scrollWidth > stripNode.clientWidth - 80 ) {
			problems.push( 'the label does not fit on one line at 30 px' );
		}
		if ( counter ) {
			sizes.counter = px( counter );
			if ( label.getBoundingClientRect().right > counter.getBoundingClientRect().left - 16 ) {
				problems.push( 'the label runs into the page counter' );
			}
		}

		if ( spec.line ) {
			sizes.line = px( line );
			var lines = Math.round( line.getBoundingClientRect().height / ( sizes.line * 1.2 ) );
			if ( lines > 2 ) {
				problems.push( 'the line runs to ' + lines + ' lines at 48 px; two at most — cut words' );
			}
		}
		if ( spec.kind === 'endcard' ) {
			var cardNode = middle.querySelector( '.endcard' );
			var cardContent = function () {
				var kids = Array.from( cardNode.children );
				return { getBoundingClientRect: function () {
					var top = kids[ 0 ].getBoundingClientRect().top;
					var bottom = kids[ kids.length - 1 ].getBoundingClientRect().bottom;
					return { height: bottom - top };
				} };
			};
			if ( spec.endCard.lead && ! shrink( cardNode, cardContent(), room( cardNode ), LEAD.start, LEAD.min ) ) {
				problems.push( 'the end card\'s lead does not fit even at ' + LEAD.min + ' px — cut words' );
			}
			sizes.slide = Math.min.apply( null, Array.from( middle.querySelectorAll( 'p' ) ).map( px ) );
		}
		if ( spec.marks && spec.marks.length ) {
			sizes.mark = Math.min.apply( null, Array.from( middle.querySelectorAll( '.mark' ) ).map( px ) );
		}

		return { problems: problems, sizes: sizes };
	};
}() );
