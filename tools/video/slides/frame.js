/**
 * Builds one frame from a spec and reports what it measured. Called by tools/video/lib/slides.mjs:
 *
 *   window.renderFrame( { kind, label, line, marks, transparentMiddle, image, slide, endCard, sheet } )
 *
 * kind: 'overlay' (strip + band + marks over a transparent middle, laid on top of a clip),
 *       'image' (a still in the middle), 'slide', 'endcard', 'sheet' (contact sheet).
 * All text goes in through textContent; nothing is parsed as HTML.
 */
( function () {
	'use strict';

	var START = { rows: 44, statement: 60, questions: 40, checklist: 42, timeline: 40 };
	var MIN_SLIDE = 36;

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

	window.renderFrame = async function ( spec ) {
		var root = document.getElementById( 'frame' );
		root.textContent = '';
		root.removeAttribute( 'style' );
		document.documentElement.removeAttribute( 'style' );
		document.body.removeAttribute( 'style' );
		var problems = [];
		var sizes = {};

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

		if ( spec.line ) {
			sizes.line = px( line );
			var lines = Math.round( line.getBoundingClientRect().height / ( sizes.line * 1.2 ) );
			if ( lines > 2 ) {
				problems.push( 'the line runs to ' + lines + ' lines at 48 px; two at most — cut words' );
			}
		}
		if ( spec.kind === 'endcard' ) {
			sizes.slide = Math.min.apply( null, Array.from( middle.querySelectorAll( 'p' ) ).map( px ) );
		}
		if ( spec.marks && spec.marks.length ) {
			sizes.mark = Math.min.apply( null, Array.from( middle.querySelectorAll( '.mark' ) ).map( px ) );
		}

		return { problems: problems, sizes: sizes };
	};
}() );
