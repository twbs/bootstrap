/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

											   Copyright 2008 / Andrea Ercolino
===============================================================================
*/


( function($) {

ChiliBook = { //implied global

	  version:            "2.2" // 2008-07-06

// options --------------------------------------------------------------------

	, automatic:          true
	, automaticSelector:  "pre"

	, lineNumbers:        !true

	, codeLanguage:       function( el ) {
		var recipeName = $( el ).attr( "class" );
		return recipeName ? recipeName : '';
	}

	, recipeLoading:      true
	, recipeFolder:       "" // used like: recipeFolder + recipeName + '.js'

	// IE and FF convert &#160; to "&nbsp;", Safari and Opera do not
	, replaceSpace:       "&#160;"
	, replaceTab:         "&#160;&#160;&#160;&#160;"
	, replaceNewLine:     "&#160;<br/>"

	, selectionStyle:     [ "position:absolute; z-index:3000; overflow:scroll;"
						  , "width:16em;"
						  , "height:9em;"
						  , "border:1px solid gray;"
						  , "padding:15px;"
						  , "background-color:yellow;"
						  ].join( ' ' )

// ------------------------------------------------------------- end of options

	, defaultReplacement: '<span class="$0">$$</span>' // TODO: make this an option again
	, recipes:            {} //repository
	, queue:              {} //registry

	, unique:             function() {
		return (new Date()).valueOf();
	}
};



$.fn.chili = function( options ) {
	var book = $.extend( {}, ChiliBook, options || {} );

	function cook( ingredients, recipe, blockName ) {

		function prepareBlock( recipe, blockName ) {
			var steps = [];
			for( var stepName in recipe[ blockName ] ) {
				steps.push( prepareStep( recipe, blockName, stepName ) );
			}
			return steps;
		} // prepareBlock

		function prepareStep( recipe, blockName, stepName ) {
			var step = recipe[ blockName ][ stepName ];
			var exp = ( typeof step._match == "string" ) ? step._match : step._match.source;
			return {
				recipe: recipe
				, blockName: blockName
				, stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: step._replace ? step._replace : book.defaultReplacement
			};
		} // prepareStep
	
		function knowHow( steps ) {
			var prevLength = 1;
			var exps = [];
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum, 10 ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var prolog = '((?:\\s|\\S)*?)';
			var epilog = '((?:\\s|\\S)+)';
			var source = '(?:' + exps.join( "|" ) + ')';
			source = prolog + source + '|' + epilog;
			return new RegExp( source, recipe._case ? "g" : "gi" );
		} // knowHow

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // escapeHTML

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // replaceSpaces

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // filter

		function applyRecipe( subject, recipe ) {
			return cook( subject, recipe );
		} // applyRecipe

		function applyBlock( subject, recipe, blockName ) {
			return cook( subject, recipe, blockName );
		} // applyBlock

		function applyStep( subject, recipe, blockName, stepName ) {
			var replaceSpace       = book.replaceSpace;

			var step = prepareStep( recipe, blockName, stepName );
			var steps = [step];

			var perfect = subject.replace( knowHow( steps ), function() {
				return chef.apply( { steps: steps }, arguments );
			} );
			return perfect;
		} // applyStep

		function applyModule( subject, module, context ) {
			if( ! module ) {
				return filter( subject );
			}

			var sub = module.split( '/' );
			var recipeName = '';
			var blockName  = '';
			var stepName   = '';
			switch( sub.length ) {
				case 1:
					recipeName = sub[0];
					break;
				case 2:
					recipeName = sub[0]; blockName = sub[1];
					break;
				case 3:
					recipeName = sub[0]; blockName = sub[1]; stepName = sub[2];
					break;
				default:
					return filter( subject );
			}

			function getRecipe( recipeName ) {
				var path = getPath( recipeName );
				var recipe = book.recipes[ path ];
				if( ! recipe ) {
					throw {msg:"recipe not available"};
				}
				return recipe;
			}

			try {
				var recipe;
				if ( '' == stepName ) {
					if ( '' == blockName ) {
						if ( '' == recipeName ) {
							//nothing to do
						}
						else { // ( '' != recipeName )
							recipe = getRecipe( recipeName );
							return applyRecipe( subject, recipe );
						}
					}
					else { // ( '' != blockName )
						if( '' == recipeName ) {
							recipe = context.recipe;
						}
						else {
							recipe = getRecipe( recipeName );
						}
						if( ! (blockName in recipe) ) {
							return filter( subject );
						}
						return applyBlock( subject, recipe, blockName );
					}
				}
				else { // ( '' != stepName )
					if( '' == recipeName ) {
						recipe = context.recipe;
					}
					else {
						recipe = getRecipe( recipeName );
					}
					if( '' == blockName ) {
						blockName = context.blockName;
					}
					if( ! (blockName in recipe) ) {
						return filter( subject );
					}
					if( ! (stepName in recipe[blockName]) ) {
						return filter( subject );
					}
					return applyStep( subject, recipe, blockName, stepName );
				}
			}
			catch( e ) {
				if (e.msg && e.msg == "recipe not available") {
					var cue = 'chili_' + book.unique();
					if( book.recipeLoading ) {
						var path = getPath( recipeName );
						if( ! book.queue[ path ] ) {
							/* this is a new recipe to download */
							try {
								book.queue[ path ] = [ {cue: cue, subject: subject, module: module, context: context} ];
								$.getJSON( path, function( recipeLoaded ) {
									book.recipes[ path ] = recipeLoaded;
									var q = book.queue[ path ];
									for( var i = 0, iTop = q.length; i < iTop; i++ ) {
										var replacement = applyModule( q[ i ].subject, q[ i ].module, q[ i ].context );
										if( book.replaceTab ) {
											replacement = replacement.replace( /\t/g, book.replaceTab );
										}
										if( book.replaceNewLine ) {
											replacement = replacement.replace( /\n/g, book.replaceNewLine );
										}
										$( '#' + q[ i ].cue ).replaceWith( replacement );
									}
								} );
							}
							catch( recipeNotAvailable ) {
								alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
							}
						}
						else {
							/* not a new recipe, so just enqueue this element */
							book.queue[ path ].push( {cue: cue, subject: subject, module: module, context: context} );
						}
						return '<span id="' + cue + '">' + filter( subject ) + '</span>';
					}
					return filter( subject );
				}
				else {
					return filter( subject );
				}
			}
		} // applyModule

		function addPrefix( prefix, replacement ) {
			var aux = replacement.replace( /(<span\s+class\s*=\s*(["']))((?:(?!__)\w)+\2\s*>)/ig, "$1" + prefix + "__$3" );
			return aux;
		} // addPrefix

		function chef() {
			if (! arguments[ 0 ]) {
				return '';
			}
			var steps = this.steps;
			var i = 0;  // iterate steps
			var j = 2;	// iterate chef's arguments
			var prolog = arguments[ 1 ];
			var epilog = arguments[ arguments.length - 3 ];
			if (! epilog) {
				var step;
				while( step = steps[ i++ ] ) {
					var aux = arguments; // this unmasks chef's arguments inside the next function
					if( aux[ j ] ) {
						var replacement = '';
						if( $.isFunction( step.replacement ) ) {
							var matches = []; //Array.slice.call( aux, j, step.length );
							for (var k = 0, kTop = step.length; k < kTop; k++) {
								matches.push( aux[ j + k ] );
							}
							matches.push( aux[ aux.length - 2 ] );
							matches.push( aux[ aux.length - 1 ] );
							replacement = step.replacement
								.apply( { 
									x: function() { 
										var subject = arguments[0];
										var module  = arguments[1];
										var context = { 
											  recipe:    step.recipe
											, blockName: step.blockName 
										};
										return applyModule( subject, module, context );
									} 
								}, matches );
						}
						else { //we expect step.replacement to be a string
							replacement = step.replacement
								.replace( /(\\\$)|(?:\$\$)|(?:\$(\d+))/g, function( m, escaped, K ) {
									if( escaped ) {       /* \$ */ 
										return "$";
									}
									else if( !K ) {       /* $$ */ 
										return filter( aux[ j ] );
									}
									else if( K == "0" ) { /* $0 */ 
										return step.stepName;
									}
									else {                /* $K */
										return filter( aux[ j + parseInt( K, 10 ) ] );
									}
								} );
						}
						replacement = addPrefix( step.recipe._name, replacement );
						return filter( prolog ) + replacement;
					} 
					else {
						j+= step.length;
					}
				}
			}
			else {
				return filter( epilog );
			}
		} // chef

		if( ! blockName ) {
			blockName = '_main';
			checkSpices( recipe );
		}
		if( ! (blockName in recipe) ) {
			return filter( ingredients );
		}
		var replaceSpace = book.replaceSpace;
		var steps = prepareBlock( recipe, blockName );
		var kh = knowHow( steps );
		var perfect = ingredients.replace( kh, function() {
			return chef.apply( { steps: steps }, arguments );
		} );
		return perfect;

	} // cook

	function loadStylesheetInline( sourceCode ) { 
		if( document.createElement ) { 
			var e = document.createElement( "style" ); 
			e.type = "text/css"; 
			if( e.styleSheet ) { // IE 
				e.styleSheet.cssText = sourceCode; 
			}  
			else { 
				var t = document.createTextNode( sourceCode ); 
				e.appendChild( t ); 
			} 
			document.getElementsByTagName( "head" )[0].appendChild( e ); 
		} 
	} // loadStylesheetInline
			
	function checkSpices( recipe ) {
		var name = recipe._name;
		if( ! book.queue[ name ] ) {

			var content = ['/* Chili -- ' + name + ' */'];
			for (var blockName in recipe) {
				if( blockName.search( /^_(?!main\b)/ ) < 0 ) {
					for (var stepName in recipe[ blockName ]) {
						var step = recipe[ blockName ][ stepName ];
						if( '_style' in step ) {
							if( step[ '_style' ].constructor == String ) {
								content.push( '.' + name + '__' + stepName + ' { ' + step[ '_style' ] + ' }' );
							}
							else {
								for (var className in step[ '_style' ]) {
									content.push( '.' + name + '__' + className + ' { ' + step[ '_style' ][ className ] + ' }' );
								}
							}
						}
					}
				}
			}
			content = content.join('\n');

			loadStylesheetInline( content );

			book.queue[ name ] = true;
		}
	} // checkSpices

	function askDish( el ) {
		var recipeName = book.codeLanguage( el );
		if( '' != recipeName ) {
			var path = getPath( recipeName );
			if( book.recipeLoading ) {
				/* dynamic setups come here */
				if( ! book.queue[ path ] ) {
					/* this is a new recipe to download */
					try {
						book.queue[ path ] = [ el ];
						$.getJSON( path, function( recipeLoaded ) {
							book.recipes[ path ] = recipeLoaded;
							var q = book.queue[ path ];
							for( var i = 0, iTop = q.length; i < iTop; i++ ) {
								makeDish( q[ i ], path );
							}
						} );
					}
					catch( recipeNotAvailable ) {
						alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
					}
				}
				else {
					/* not a new recipe, so just enqueue this element */
					book.queue[ path ].push( el );
				}
				/* a recipe could have been already downloaded */
				makeDish( el, path ); 
			}
			else {
				/* static setups come here */
				makeDish( el, path );
			}
		}
	} // askDish

	function makeDish( el, recipePath ) {
		var recipe = book.recipes[ recipePath ];
		if( ! recipe ) {
			return;
		}
		var $el = $( el );
		var ingredients = $el.text();
		if( ! ingredients ) {
			return;
		}

		//fix for msie: \r (13) is used instead of \n (10)
		//fix for opera: \r\n is used instead of \n
		ingredients = ingredients.replace(/\r\n?/g, "\n");

		//reverse fix for safari: msie, mozilla and opera render the initial \n
		if( $el.parent().is('pre') ) {
			if( ! $.browser.safari ) {
				ingredients = ingredients.replace(/^\n/g, "");
			}
		}

		var dish = cook( ingredients, recipe ); // all happens here
	
		if( book.replaceTab ) {
			dish = dish.replace( /\t/g, book.replaceTab );
		}
		if( book.replaceNewLine ) {
			dish = dish.replace( /\n/g, book.replaceNewLine );
		}

		el.innerHTML = dish; //much faster than $el.html( dish );
		//tried also the function replaceHtml from http://blog.stevenlevithan.com/archives/faster-than-innerhtml
		//but it was not faster nor without sideffects (it was not possible to count spans into el)

		//opera and safari select PRE text correctly 
		if( $.browser.msie || $.browser.mozilla ) {
			enableSelectionHelper( el );
		}

		var $that = $el.parent();
		var classes = $that.attr( 'class' );
		var ln = /ln-(\d+)-([\w][\w\-]*)|ln-(\d+)|ln-/.exec( classes );
		if( ln ) {
			addLineNumbers( el );
			var start = 0;
			if( ln[1] ) {
				start = parseInt( ln[1], 10 );
				var $pieces = $( '.ln-' + ln[1] + '-' + ln[2] );
				var pos = $pieces.index( $that[0] );
				$pieces.slice( 0, pos ).each( function() {
					start += $( this ).find( 'li' ).length;
				} );
			}
			else if( ln[3] ) {
				start = parseInt( ln[3], 10 );
			}
			else {
				start = 1;
			}
			$el.find( 'ol' )[0].start = start;
			$('body').width( $('body').width() - 1 ).width( $('body').width() + 1 );
		}
		else if( book.lineNumbers ) {
			addLineNumbers( el );
		}

	} // makeDish

	function enableSelectionHelper( el ) {
		var element = null;
		$( el )
		.parents()
		.filter( "pre" )
		.bind( "mousedown", function() {
			element = this;
			if( $.browser.msie ) {
				document.selection.empty();
			}
			else {
				window.getSelection().removeAllRanges();
			}
		} )
		.bind( "mouseup", function( event ) {
			if( element && (element == this) ) {
				element = null;
				var selected = '';
				if( $.browser.msie ) {
					selected = document.selection.createRange().htmlText;
					if( '' == selected ) { 
						return;
					}
					selected = preserveNewLines( selected );
					var container_tag = '<textarea style="STYLE">';
				}
				else {
					selected = window.getSelection().toString(); //opera doesn't select new lines
					if( '' == selected ) {
						return;
					}
					selected = selected
						.replace( /\r/g, '' )
						.replace( /^# ?/g, '' )
						.replace( /\n# ?/g, '\n' )
					;
					var container_tag = '<pre style="STYLE">';
				}
				var $container = $( container_tag.replace( /\bSTYLE\b/, ChiliBook.selectionStyle ) )
					.appendTo( 'body' )
					.text( selected )
					.attr( 'id', 'chili_selection' )
					.click( function() { $(this).remove(); } )
				;
				var top  = event.pageY - Math.round( $container.height() / 2 ) + "px";
				var left = event.pageX - Math.round( $container.width() / 2 ) + "px";
				$container.css( { top: top, left: left } );
				if( $.browser.msie ) {
//					window.clipboardData.setData( 'Text', selected ); //I couldn't find anything similar for Mozilla
					$container[0].focus();
					$container[0].select();
				}
				else {
					var s = window.getSelection();
					s.removeAllRanges();
					var r = document.createRange();
					r.selectNodeContents( $container[0] );
					s.addRange( r );
				}
			}
		} )
		;
	} // enableSelectionHelper

	function getPath( recipeName ) {
		return book.recipeFolder + recipeName + ".js";
	} // getPath

	function getSelectedText() {
		var text = '';
		if( $.browser.msie ) {
			text = document.selection.createRange().htmlText;
		}
		else {
			text = window.getSelection().toString();
		}
		return text;
	} // getSelectedText

	function preserveNewLines( html ) {
		do { 
			var newline_flag = ChiliBook.unique();
		}
		while( html.indexOf( newline_flag ) > -1 );
		var text = '';
		if (/<br/i.test(html) || /<li/i.test(html)) {
			if (/<br/i.test(html)) {
				html = html.replace( /\<br[^>]*?\>/ig, newline_flag );
			}
			else if (/<li/i.test(html)) {
				html = html.replace( /<ol[^>]*?>|<\/ol>|<li[^>]*?>/ig, '' ).replace( /<\/li>/ig, newline_flag );
			}
			var el = $( '<pre>' ).appendTo( 'body' ).hide()[0];
			el.innerHTML = html;
			text = $( el ).text().replace( new RegExp( newline_flag, "g" ), '\r\n' );
			$( el ).remove();
		}
		return text;
	} // preserveNewLines

	function addLineNumbers( el ) {

		function makeListItem1( not_last_line, not_last, last, open ) {
			var close = open ? '</span>' : '';
			var aux = '';
			if( not_last_line ) {
				aux = '<li>' + open + not_last + close + '</li>';
			}
			else if( last ) {
				aux = '<li>' + open + last + close + '</li>';
			}
			return aux;
		} // makeListItem1

		function makeListItem2( not_last_line, not_last, last, prev_li ) {
			var aux = '';
			if( prev_li ) {
				aux = prev_li;
			}
			else {
				aux = makeListItem1( not_last_line, not_last, last, '' )
			}
			return aux;
		} // makeListItem2

		var html = $( el ).html();
		var br = /<br>/.test(html) ? '<br>' : '<BR>';
		var empty_line = '<li>' + book.replaceSpace + '</li>';
		var list_items = html
			//extract newlines at the beginning of a span
			.replace( /(<span [^>]+>)((?:(?:&nbsp;|\xA0)<br>)+)(.*?)(<\/span>)/ig, '$2$1$3$4' ) // I don't know why <span .*?> does not work here
			//transform newlines inside of a span
			.replace( /(.*?)(<span .*?>)(.*?)(?:<\/span>(?:&nbsp;|\xA0)<br>|<\/span>)/ig,       // but here it does
				function( all, before, open, content ) {
					if (/<br>/i.test(content)) {
						var pieces = before.split( br );
						var lastPiece = pieces.pop();
						before = pieces.join( br );
						var aux = (before ? before + br : '') //+ replace1( lastPiece + content, open );
							+ (lastPiece + content).replace( /((.*?)(?:&nbsp;|\xA0)<br>)|(.*)/ig, 
							function( tmp, not_last_line, not_last, last ) {
								var aux2 = makeListItem1( not_last_line, not_last, last, open );
								return aux2;
							} 
						);
						return aux;
					}
					else {
						return all;
					}
				} 
			)
			//transform newlines outside of a span
			.replace( /(<li>.*?<\/li>)|((.*?)(?:&nbsp;|\xA0)<br>)|(.+)/ig, 
				function( tmp, prev_li, not_last_line, not_last, last ) {
					var aux2 = makeListItem2( not_last_line, not_last, last, prev_li );
					return aux2;
				} 
			)
			//fix empty lines for Opera
			.replace( /<li><\/li>/ig, empty_line )
		;

		el.innerHTML = '<ol>' + list_items + '</ol>';
	} // addLineNumbers

	function revealChars( tmp ) {
		return $
			.map( tmp.split(''), 
				function(n, i) { 
					return ' ' + n + ' ' + n.charCodeAt( 0 ) + ' ';
				} )
			.join(' ');
	} // revealChars

//-----------------------------------------------------------------------------
// the coloring starts here
	this
	.each( function() {
		var $this = $( this );
		$this.trigger( 'chili.before_coloring' );
		askDish( this );
		$this.trigger( 'chili.after_coloring' );
	} );

	return this;
//-----------------------------------------------------------------------------
};



//main
$( function() {

	if( ChiliBook.automatic ) {
		$( ChiliBook.automaticSelector ).chili();
	}

} );

} ) ( jQuery );
