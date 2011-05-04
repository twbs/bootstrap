/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

											   Copyright 2008 / Andrea Ercolino
===============================================================================
*/

/* ----------------------------------------------------------------------------
 * this recipe uses a little trick for highlighting php code
 *   1: replace each php snippet with a placeholder
 *   2: highlight html without php and php snippets apart
 *   3: replace each placeholder with its highlighted php snippet
 * 
 * the trick is not perfect only if the html without php is broken
 * however, in such a case many highlighters get fooled but Chili does not
 * 
 * ---
 * this recipe has been adapted for working with Safari
 * in fact, Safari cannot match more than 101236 characters with a lazy star
 * --------------------------------------------------------------------------*/
{
	  _name: "php"
	, _case: true
	, _main: {
		  all: {
			  _match: /[\w\W]*/ 
			, _replace: function( all ) {
				var placeholder = String.fromCharCode(0);
				var blocks = [];
				var that = this;
				var no_php_1 = all.replace( /<\?[^?]*\?+(?:[^>][^?]*\?+)*>/g, function( block ) {
					blocks.push( that.x( block, '/block/php_1' ) );
					return placeholder;
				} );
				var no_php_2 = no_php_1.replace( /^[^?]*\?+(?:[^>][^?]*\?+)*>|<\?[\w\W]*$/g, function( block ) {
					blocks.push( that.x( block, '/block/php_2' ) );
					return placeholder;
				} );
				if( blocks.length ) {
					var html = this.x( no_php_2, 'html' );
					var count = 0;
					return html.replace( new RegExp( placeholder, "g" ), function() {
						return blocks[ count++ ];
					} );
				}
				else {
					return this.x( all, '/php' );
				}
			}
		}
	}
	, block: {
		  php_1: { // --- <? +++ ?> ---
			  _match: /(<\?(?:php\b)?)([^?]*\?+(?:[^>][^?]*\?+)*>)/
			, _replace: function( all, open, content ) {
				return "<span class='start'>" + this.x( open ) + "</span>"
					+ this.x( content.replace( /\?>$/, '' ), '/php' ) 
					+ "<span class='end'>" + this.x( '?>' ) + "</span>";
			}
			, _style: {
					  start: "color: red; font-weight: bold"
					, end:   "color: red;"
			}
		}
		, php_2: { // +++ ?> --- <? +++
			  _match: /([^?]*\?+(?:[^>][^?]*\?+)*>)|(<\?(?:php\b)?)([\w\W]*)/
			, _replace: function( all, content, open2, content2 ) {
				if( open2 ) {
					return "<span class='start'>" + this.x( open2 ) + "</span>"
						+ this.x( content2, '/php' );
				}
				else {
					return this.x( content.replace( /\?>$/, '' ), '/php' ) 
						+ "<span class='end'>" + this.x( '?>' ) + "</span>";
				}
			}
			, _style: {
					  start: "color: red; font-weight: bold"
					, end:   "color: red;"
			}
		}
	}
	, php: {
		  mlcom: {
			  _match: /\/\*[^*]*\*+([^\/][^*]*\*+)*\// 
			, _style: "color: gray;"
		}
		, com: {
			  _match: /(?:\/\/.*)|(?:[^\\]\#.*)/ 
			, _style: "color: green;"
		}
		, string1: {
			  _match: /\'[^\'\\]*(?:\\.[^\'\\]*)*\'/ 
			, _style: "color: purple;"
		}
		, string2: {
			  _match: /\"[^\"\\]*(?:\\.[^\"\\]*)*\"/ 
			, _style: "color: fuchsia;"
		}
		, value: {
			  _match: /\b(?:[Nn][Uu][Ll][Ll]|[Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])\b/ 
			, _style: "color: gray; font-weight: bold;"
		}
		, number: {
			  _match: /\b[+-]?(\d*\.?\d+|\d+\.?\d*)([eE][+-]?\d+)?\b/ 
			, _style: "color: red;"
		}
		, const1: {
			  _match: /\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|VERSION))|__COMPILER_HALT_OFFSET__)\b/ 
			, _style: "color: red;"
		}
		, const2: {
			  _match: /\b(?:A(?:B(?:DAY_(?:1|2|3|4|5|6|7)|MON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9))|LT_DIGITS|M_STR|SSERT_(?:ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(?:ASE_(?:LOWER|UPPER)|HAR_MAX|O(?:DESET|NNECTION_(?:ABORTED|NORMAL|TIMEOUT)|UNT_(?:NORMAL|RECURSIVE))|R(?:EDITS_(?:ALL|DOCS|FULLPAGE|G(?:ENERAL|ROUP)|MODULES|QA|SAPI)|NCYSTR|YPT_(?:BLOWFISH|EXT_DES|MD5|S(?:ALT_LENGTH|TD_DES)))|URRENCY_SYMBOL)|D(?:AY_(?:1|2|3|4|5|6|7)|ECIMAL_POINT|IRECTORY_SEPARATOR|_(?:FMT|T_FMT))|E(?:NT_(?:COMPAT|NOQUOTES|QUOTES)|RA(?:_(?:D_(?:FMT|T_FMT)|T_FMT|YEAR)|)|XTR_(?:IF_EXISTS|OVERWRITE|PREFIX_(?:ALL|I(?:F_EXISTS|NVALID)|SAME)|SKIP))|FRAC_DIGITS|GROUPING|HTML_(?:ENTITIES|SPECIALCHARS)|IN(?:FO_(?:ALL|C(?:ONFIGURATION|REDITS)|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|I_(?:ALL|PERDIR|SYSTEM|USER)|T_(?:CURR_SYMBOL|FRAC_DIGITS))|L(?:C_(?:ALL|C(?:OLLATE|TYPE)|M(?:ESSAGES|ONETARY)|NUMERIC|TIME)|O(?:CK_(?:EX|NB|SH|UN)|G_(?:A(?:LERT|UTH(?:PRIV|))|C(?:ONS|R(?:IT|ON))|D(?:AEMON|EBUG)|E(?:MERG|RR)|INFO|KERN|L(?:OCAL(?:0|1|2|3|4|5|6|7)|PR)|MAIL|N(?:DELAY|EWS|O(?:TICE|WAIT))|ODELAY|P(?:ERROR|ID)|SYSLOG|U(?:SER|UCP)|WARNING)))|M(?:ON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|_(?:1_PI|2_(?:PI|SQRTPI)|E|L(?:N(?:10|2)|OG(?:10E|2E))|PI(?:_(?:2|4)|)|SQRT(?:1_2|2)))|N(?:EGATIVE_SIGN|O(?:EXPR|STR)|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|P(?:ATH(?:INFO_(?:BASENAME|DIRNAME|EXTENSION)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|RADIXCHAR|S(?:EEK_(?:CUR|END|SET)|ORT_(?:ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(?:BOTH|LEFT|RIGHT))|T(?:HOUS(?:ANDS_SEP|EP)|_FMT(?:_AMPM|))|YES(?:EXPR|STR))\b/ 
			, _style: "color: red;"
		}
		, global: {
			  _match: /(?:\$GLOBALS|\$_COOKIE|\$_ENV|\$_FILES|\$_GET|\$_POST|\$_REQUEST|\$_SERVER|\$_SESSION|\$php_errormsg)\b/ 
			, _style: "color: red;"
		}
		, keyword: {
			  _match: /\b(?:__CLASS__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exception|exit|extends|extends|final|for|foreach|function|global|if|implements|include|include_once|interface|isset|list|new|old_function|or|php_user_filter|print|private|protected|public|require|require_once|return|static|switch|this|throw|try|unset|use|var|while|xor)\b/ 
			, _style: "color: navy; font-weight: bold;"
		}
		, variable: {
			  _match: /\$(\w+)/
			, _replace: '<span class="keyword">$</span><span class="variable">$1</span>' 
			, _style: "color: #4040c2;"
		}
		, heredoc: {
			  _match: /(\<\<\<\s*)(\w+)((?:(?!\2).*\n)+)(\2)\b/
			, _replace: '<span class="keyword">$1</span><span class="string1">$2</span><span class="string2">$3</span><span class="string1">$4</span>' 
		}
	}
}