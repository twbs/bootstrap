<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

// Static dependencies, Subclasses loaded ondemand
require( dirname(__FILE__) . '/lib/Exception.php' );
require( dirname(__FILE__) . '/lib/Control.php' );


Class CSSCompression
{
	/**
	 * CSSCompression Info
	 *
	 * @const (string) VERSION: Release version
	 * @const (string) DATE: Release date
	 */
	const VERSION = "[VERSION]";
	const DATE = "[DATE]";

	/**
	 * WARNING: This should ALWAYS BE FALSE in production
	 * When DEV is true, backdoor access to private methods is opened.
	 * Only used for unit testing and development.
	 */
	const DEV = true;

	/**
	 * TOKEN is a special string that gets used as a marker within
	 * the compressor, and is removed before final output. Make sure
	 * this token is unique to your stylsheets.
	 *
	 * NOTE: This string gets used in regular expressions, and escaping
	 * won't help, so don't pick a complicated token.
	 */
	const TOKEN = "@____CSSCOMPRESSION_TOKEN____@";

	/**
	 * The default set of options for every instance.
	 */
	public static $defaults = array(
		// Converts long color names to short hex names
		// (aliceblue -> #f0f8ff)
		'color-long2hex' => true,

		// Converts rgb colors to hex
		// (rgb(159,80,98) -> #9F5062, rgb(100%) -> #FFFFFF)
		'color-rgb2hex' => true,

		// Converts long hex codes to short color names (#f5f5dc -> beige)
		// Only works on latest browsers, careful when using
		'color-hex2shortcolor' => false,

		// Converts long hex codes to short hex codes
		// (#44ff11 -> #4f1)
		'color-hex2shorthex' => true,

		// Converts hex codes to safe CSS Level 1 color names
		// (#F00 -> red)
		'color-hex2safe' => true,

		// Converts font-weight names to numbers
		// (bold -> 700)
		'fontweight2num' => true,

		// Removes zero decimals and 0 units
		// (15.0px -> 15px || 0px -> 0)
		'format-units' => true,

		// Lowercases html tags from list
		// (BODY -> body)
		'lowercase-selectors' => true,

		// Converts id and class attribute selectors, to their short selector counterpart
		// (div[id=blah][class=moreblah] -> div#blah.moreblah)
		'attr2selector' => true,

		// Promotes nested id's to the front of the selector
		// (body>div#elem p -> $elem p)
		'strict-id' => false,

		// Add space after pseudo selectors, for ie6
		// (a:first-child{ -> a:first-child {)
		'pseudo-space' => false,

		// Compresses single defined multi-directional properties
		// (margin: 15px 25px 15px 25px -> margin:15px 25px)
		'directional-compress' => true,

		// Combines multiply defined selectors and details
		// (p{color:blue;} p{font-size:12pt} -> p{color:blue;font-size:12pt;})
		// (p{color:blue;} a{color:blue;} -> p,a{color:blue;})
		'organize' => true,

		// Combines color/style/width properties
		// (border-style:dashed;border-color:black;border-width:4px; -> border:4px dashed black)
		'csw-combine' => true,

		// Combines cue/pause properties
		// (cue-before: url(before.au); cue-after: url(after.au) -> cue:url(before.au) url(after.au))
		'auralcp-combine' => true,

		// Combines margin/padding directionals
		// (margin-top:10px;margin-right:5px;margin-bottom:4px;margin-left:1px; -> margin:10px 5px 4px 1px;)
		'mp-combine' => true,

		// Combines border directionals
		// (border-top|right|bottom|left:1px solid black -> border:1px solid black)
		'border-combine' => true,

		// Combines font properties
		// (font-size:12pt; font-family: arial; -> font:12pt arial)
		'font-combine' => true,

		// Combines background properties
		// (background-color: black; background-image: url(bgimg.jpeg); -> background:black url(bgimg.jpeg))
		'background-combine' => true,

		// Combines list-style properties
		// (list-style-type: round; list-style-position: outside -> list-style:round outside)
		'list-combine' => true,

		// Combines border-radius properties
		// {
		//  border-top-left-radius: 10px;
		//  border-top-right-radius: 10px;
		//  border-bottom-right-radius: 10px;
		//  border-bottom-left-radius: 10px;
		// }
		// -> { border-radius: 10px; }
		'border-radius-combine' => true,

		// Removes the last semicolon of a property set
		// ({margin: 2px; color: blue;} -> {margin: 2px; color: blue})
		'unnecessary-semicolons' => true,

		// Removes multiple declarations within the same rule set
		'rm-multi-define' => true,

		// Adds all unknown blocks to the top of the output in a comment strip
		// Purely for bug reporting, but also useful to know what isn't being handled
		'add-unknown' => true,

		// Readibility of Compressed Output, Defaults to none
		'readability' => 0,
	);

	/**
	 * Modes are predefined sets of configuration for referencing. When creating a mode, all options are set to true,
	 * and the mode array defines which options are to be false
	 *
	 * @mode safe: Safe mode does zero combinations or organizing. It's the best mode if you use a lot of hacks
	 * @mode sane: Sane mode does most combinations(multiple long hand notations to single shorthand),
	 * --- but still keeps most declarations in their place
	 * @mode small: Small mode reorganizes the whole sheet, combines as much as it can, and will break most comment hacks
	 * @mode full: Full mode does everything small does, but also converts hex codes to their short color name alternatives
	 */
	private static $modes = array(
		'safe' => array(
			'color-hex2shortcolor' => false,
			'attr2selector' => false,
			'strict-id' => false,
			'organize' => false,
			'csw-combine' => false,
			'auralcp-combine' => false,
			'mp-combine' => false,
			'border-combine' => false,
			'font-combine' => false,
			'background-combine' => false,
			'list-combine' => false,
			'border-radius-combine' => false,
			'rm-multi-define' => false,
		),
		'sane' => array(
			'color-hex2shortcolor' => false,
			'strict-id' => false,
			'organize' => false,
			'font-combine' => false,
			'background-combine' => false,
			'list-combine' => false,
			'rm-multi-define' => false,
		),
		'small' => array(
			'color-hex2shortcolor' => false,
			'pseudo-space' => false,
		),
		'full' => array(
			'pseudo-space' => false,
		),
	);

	/**
	 * Readability Constants
	 *
	 * @param (int) READ_MAX: Maximum readability of output
	 * @param (int) READ_MED: Medium readability of output
	 * @param (int) READ_MIN: Minimal readability of output
	 * @param (int) READ_NONE: No readability of output (full compression into single line)
	 */ 
	const READ_MAX = 3;
	const READ_MED = 2;
	const READ_MIN = 1;
	const READ_NONE = 0;

	/**
	 * Static Helpers
	 *
	 * @instance express: Use a separate instance from singleton access 
	 * @instance instance: Saved instance of CSSCompression
	 * @param (array) instances: Array of stored instances
	 * @param (array) rjson: Comment removal before json decoding
	 */
	private static $express;
	private static $instance;
	private static $instances = array();
	private static $rjson = array(
		'patterns' => array(
			"/^(.*?){/s", 
			"/(\t|\s)+\/\/.*/",
		),
		'replacements' => array(
			'{',
			'',
		),
	);

	/**
	 * Controller Instance
	 */
	private $Control;

	/**
	 * Builds the subclasses, runs the compression if css passed, and merges options
	 *
	 * @param (string) css: CSS to compress on initialization if needed
	 * @param (array) options: Array of preferences to override the defaults
	 */ 
	public function __construct( $css = NULL, $options = NULL ) {
		$this->Control = new CSSCompression_Control( $this );

		// Autorun against css passed
		if ( $css ) {
			// Allow passing options/mode only
			if ( is_array( $css ) || array_key_exists( $css, self::$modes ) ) {
				$this->Control->Option->merge( $css );
			}
			else {
				$this->Control->compress( $css, $options );
			}
		}
		// Merge passed options
		else if ( $options ) {
			$this->Control->Option->merge( $options );
		}
	}

	/**
	 * (Proxy function) Control access to properties
	 *
	 *	- Getting stats/_mode/css returns the current value of that property
	 *	- Getting options will return the current full options array
	 *	- Getting anything else returns that current value in the options array or NULL
	 *
	 * @param (string) name: Name of property that you want to access
	 */ 
	public function __get( $name ) {
		return $this->Control->get( $name );
	}

	/**
	 * (Proxy function) The setter method only allows 
	 * access to setting values in the options array
	 *
	 * @param (string) name: Key name of the option you want to set
	 * @param (mixed) value: Value of the option you want to set
	 */ 
	public function __set( $name, $value ) {
		return $this->Control->set( $name, $value );
	}

	/**
	 * (Proxy function) Merges a predefined set options
	 *
	 * @param (string) mode: Name of mode to use.
	 */
	public function mode( $mode = NULL ) {
		return $this->Control->Option->merge( $mode );
	}

	/**
	 * Creates a new mode, or overwrites existing mode
	 *
	 * @param (mixed) mode: Name of the mode, or array of modes
	 * @param (array) config: Configuration of the mode
	 */
	public static function modes( $mode = NULL, $config = NULL ) {
		if ( $mode === NULL ) {
			return self::$modes;
		}
		else if ( is_array( $mode ) ) {
			return array_merge( self::$modes, $mode );
		}
		else if ( $config === NULL ) {
			return isset( self::$modes[ $mode ] ) ? self::$modes[ $mode ] : NULL;
		}
		else {
			return self::$modes[ $mode ] = $config;
		}
	}

	/**
	 * (Proxy function) Maintainable access to the options array
	 *
	 *	- Passing no arguments returns the entire options array
	 *	- Passing a single name argument returns the value for the option
	 *	- Passing an array will merge the options with the array passed, for object like extension
	 * 	- Passing both a name and value, sets the value to the name key, and returns the value
	 *
	 * @param (mixed) name: The key name of the option
	 * @param (mixed) value: Value to set the option
	 */
	public function option( $name = NULL, $value = NULL ) {
		return $this->Control->Option->option( $name, $value );
	}

	/**
	 * (Proxy function) Run compression on the sheet passed.
	 *
	 * @param (string) css: Stylesheet to be compressed
	 * @param (mixed) options: Array of options or mode to use.
	 */
	public function compress( $css = NULL, $options = NULL ) {
		return $this->Control->compress( $css, $options );
	}

	/**
	 * Static access for direct compression
	 *
	 * @param (string) css: Stylesheet to be compressed
	 * @param (mixed) options: Array of options or mode to use.
	 */
	public static function express( $css = NULL, $options = NULL ) {
		if ( ! self::$express ) {
			self::$express = new CSSCompression();
		}

		self::$express->reset();
		return self::$express->compress( $css, $options );
	}

	/**
	 * (Proxy Function) Cleans out compressor and it's subclasses to defaults
	 *
	 * @params none
	 */
	public function reset(){
		return $this->Control->reset();
	}

	/**
	 * (Proxy Function) Cleans out class variables for next run
	 *
	 * @params none
	 */
	public function flush(){
		return $this->Control->flush();
	}

	/**
	 * The Singleton access method (for those that want it)
	 *
	 * @param (string) name: Name of the stored instance
	 */
	public static function getInstance( $name = NULL ) {
		if ( $name !== NULL ) {
			if ( ! isset( self::$instances[ $name ] ) ) {
				self::$instances[ $name ] = new self;
			}

			return self::$instances[ $name ];
		}
		else if ( ! self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Reads JOSN based files, strips comments and converts to array
	 *
	 * @param (string) file: Filename
	 */
	public static function getJSON( $file ) {
		// Assume helper file if full path not given
		$file = $file[ 0 ] == '/' ? $file : dirname(__FILE__) . '/helpers/' . $file;

		// Strip comments
		$json = preg_replace( self::$rjson['patterns'], self::$rjson['replacements'], file_get_contents( $file ) );

		// Decode json
		$json = json_decode( $json, true );

		// Check for errors
		if ( $json === NULL ) {
			$e = '';
			// JSON Errors, taken directly from http://php.net/manual/en/function.json-last-error.php
			switch( json_last_error() ) {
				case JSON_ERROR_NONE:
					$e = 'No error has occurred';
					break;
				case JSON_ERROR_DEPTH:
					$e = 'The maximum stack depth has been exceeded';
					break;
				case JSON_ERROR_CTRL_CHAR:
					$e = 'Control character error, possibly incorrectly encoded';
					break;
				case JSON_ERROR_STATE_MISMATCH:
					$e = 'Invalid or malformed JSON';
					break;
				case JSON_ERROR_SYNTAX:
					$e = 'Syntax error';
					break;
				case JSON_ERROR_UTF8:
					$e = 'Malformed UTF-8 characters, possibly incorrectly encoded';
					break;
				default:
					$e = 'Unknown JSON Error';
					break;
			}

			throw new CSSCompression_Exception( "JSON Error in $file: $e" );
		}

		// Good to go
		return $json;
	}

	/**
	 * Backdoor access to subclasses
	 * ONLY FOR DEVELOPMENT/TESTING.
	 *
	 * @param (string) class: Name of the focus class
	 * @param (string) method: Method function to call
	 * @param (array) args: Array of arguments to pass in
	 */
	public function access( $class = NULL, $method = NULL, $args = NULL ) {
		if ( ! self::DEV ) {
			throw new CSSCompression_Exception( "CSSCompression is not in development mode." );
		}
		else if ( $class === NULL || $method === NULL || $args === NULL ) {
			throw new CSSCompression_Exception( "Invalid Access Call." );
		}
		else if ( ! is_array( $args ) ) {
			throw new CSSCompression_Exception( "Expecting array of arguments." );
		}

		return $this->Control->access( $class, $method, $args );
	}
};

?>
