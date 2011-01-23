<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Control
{
	/**
	 * Control Patterns
	 *
	 * @param (string) css: Holds compressed css string
	 * @param (string) mode: Current compression mode state
	 * @param (array) stats: Holds compression stats
	 * @param (array) getters: Array of accessible getters
	 */ 
	public $css = '';
	public $mode = '';
	public $stats = array();
	private $getters = array(
		'css',
		'mode',
		'stats',
	);

	/**
	 * Subclasses that do the ground work for this compressor
	 *
	 * @class CSSCompression: Public facing compression class
	 * @class Option: Option handling
	 * @class Trim: Does the initial trimming for the css
	 * @class Format: Formats the output
	 * @class Numeric: Handles numeric compression
	 * @class Color: Handles color compression
	 * @class Individuals: Runs compression algorithms on individual properties and values
	 * @class Selectors: Runs selector specific compressions
	 * @class Combine: Handles combining of various properties
	 * @class Organize: Reorganizes the sheet for futher compression
	 * @class Cleanup: Cleans out all injected characters during compression
	 * @class Compress: Central compression unit.
	 * @param (array) subclasses: Array holding all the subclasses for inlusion
	 */
	public $CSSCompression;
	public $Option;
	public $Trim;
	public $Format;
	public $Numeric;
	public $Color;
	public $Individuals;
	public $Selectors;
	public $Combine;
	public $Organize;
	public $Cleanup;
	public $Setup;
	public $Compress;
	private $subclasses = array(
		'Option',
		'Trim',
		'Format',
		'Numeric',
		'Color',
		'Individuals',
		'Selectors',
		'Combine',
		'Organize',
		'Cleanup',
		'Setup',
		'Compress',
	);

	/**
	 * Pull in the Compression instance and build the subclasses
	 *
	 * @param (class) CSSCompression: CSSCompression Instance
	 */
	public function __construct( CSSCompression $CSSCompression ) {
		$this->CSSCompression = $CSSCompression;

		// Load all subclasses on demand
		if ( ! class_exists( "CSSCompression_Option", false ) ) {
			$path = dirname(__FILE__) . '/';
			foreach ( $this->subclasses as $class ) {
				require( $path . $class . '.php' );
			}
		}

		// Initialize each subclass
		foreach ( $this->subclasses as $class ) {
			$full = "CSSCompression_$class";
			$this->$class = new $full( $this );
		}
	}

	/**
	 * Control access to properties
	 *
	 *	- Getting stats/mode/css returns the current value of that property
	 *	- Getting options will return the current full options array
	 *	- Getting anything else returns that current value in the options array or NULL
	 *
	 * @param (string) name: Name of property that you want to access
	 */ 
	public function get( $name ) {
		if ( in_array( $name, $this->getters ) ) {
			return $this->$name;
		}
		else if ( $name == 'options' ) {
			return $this->Option->options;
		}
		else {
			return $this->Option->option( $name );
		}
	}

	/**
	 * The setter method only allows access to setting values in the options array
	 *
	 * @param (string) name: Key name of the option you want to set
	 * @param (mixed) value: Value of the option you want to set
	 */ 
	public function set( $name, $value ) {
		// Allow for passing array of options to merge into current ones
		if ( $name === 'options' && is_array( $value ) ) {
			return $this->Option->merge( $value );
		}
		else if ( isset( CSSCompression::$defaults[ $name ] ) ) {
			return $this->Option->option( $name, $value );
		}
		else {
			throw new CSSCompression_Exception( "Invalid Private Access to $name in CSSCompression." );
		}
	}

	/**
	 * Merges a predefined set options
	 *
	 * @param (string) mode: Name of mode to use.
	 */
	public function mode( $mode = NULL ) {
		return $this->Options->merge( $mode );
	}

	/**
	 * Resets options to their defaults, and flushes out variables
	 *
	 * @params none
	 */
	public function reset(){
		$this->Option->reset();
		return $this->flush();
	}

	/**
	 * Cleans out class variables for next run
	 *
	 * @params none
	 */
	public function flush(){
		$this->css = '';
		$this->stats = array(
			'before' => array(
				'props' => 0,
				'selectors' => 0,
				'size' => 0,
				'time' => 0,
			), 
			'after' => array(
				'props' => 0,
				'selectors' => 0,
				'size' => 0,
				'time' => 0,
			),
		);

		return true;
	}

	/**
	 * Proxy to run Compression on the sheet passed. Handle options here.
	 *
	 * @param (string) css: Stylesheet to be compressed
	 * @param (mixed) options: Array of options or mode to use.
	 */
	public function compress( $css = NULL, $options = NULL ) {
		// Flush out old stats and variables
		$this->flush();

		// If no additional options, just run compression
		if ( $options === NULL ) {
			return $this->css = $this->Compress->compress( $css );
		}

		// Store old params
		$old = $this->mode == '__custom' ? $this->Option->option() : $this->mode;
		$readability = $this->Option->option( 'readability' );

		// Compress with new set of options
		$this->Option->merge( $options );
		$css = $this->Compress->compress( $css );

		// Reset original options
		$this->reset();
		$this->Option->merge( $old );

		// Return the compressed css
		return $this->css = $css;
	}

	/**
	 * Backdoor access to subclasses
	 * ONLY FOR DEVELOPMENT/TESTING.
	 *
	 * @param (string) class: Name of the focus class
	 * @param (array) config: Contains name reference and test arguments
	 */
	public function access( $class, $method, $args ) {
		if ( $class == 'Control' ) {
			return call_user_func_array( array( $class, $method ), $args );
		}
		else if ( strpos( $class, '.' ) !== false ) {
			$parts = explode( '.', $class );
			$class = $parts[ 0 ];
			$subclass = $parts[ 1 ];
			return $this->$class->access( $subclass, $method, $args );
		}
		else if ( in_array( $class, $this->subclasses ) ) {
			return $this->$class->access( $method, $args );
		}
		else {
			throw new CSSCompression_Exception( "Unknown Class Access - " . $class );
		}
	}
};

?>
