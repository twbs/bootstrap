<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (string) token: Copy of the injection token
	 * @param (array) options: Reference to options
	 * @param (regex) rspace: Checks for space without an escape '\' character before it
	 * @param (regex) rslash: Checks for unescaped slash character
	 * @param (regex) rimportant: Checking props for uncombinables
	 * @param (array) methods: List of options with their corresponding class
	 */
	private $Control;
	private $token = '';
	private $options = array();
	private $rspace = "/(?<!\\\)\s/";
	private $rslash = "/(?<!\\\)\//";
	private $rimportant = "/inherit|\!important|\!ie|(?<!\\\)\s/i";
	private $methods = array(
		'csw-combine' => 'BorderOutline',
		'border-radius-combine' => 'BorderRadius',
		'border-combine' => 'Border',
		'mp-combine' => 'MarginPadding',
		'background-combine' => 'Background',
		'auralcp-combine' => 'Aural',
		'font-combine' => 'Font',
		'list-combine' => 'List',
	);

	/**
	 * Sub Comination Classes
	 *
	 * @class BorderOutline: Handles Color/Style/With combinations of border/outline properties
	 * @class BorderRadius: Handles border-radius combinations
	 * @class Border: Handles normal border combinations
	 * @class MarginPadding: Handles margin/padding combinations
	 * @class Background: Handles background combinations
	 * @class Aural: Handles aural combinations
	 * @class Font: Handles font combinations
	 * @class List: Handles list combinations
	 * @param (array) subcombines: Array holding all subcombination classes
	 */
	public $BorderOutline;
	public $BorderRadius;
	public $Border;
	public $MarginPadding;
	public $Background;
	public $Aural;
	public $Font;
	public $List;
	private $subcombines = array(
		'BorderOutline',
		'BorderRadius',
		'Border',
		'MarginPadding',
		'Background',
		'Aural',
		'Font',
		'List',
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->token = CSSCompression::TOKEN;
		$this->options = &$control->Option->options;

		// Include classes if not already done so
		if ( ! class_exists( "CSSCompression_Combine_Border", false ) ) {
			$path = dirname(__FILE__) . '/Combine/';
			foreach ( $this->subcombines as $class ) {
				require( $path . $class . '.php' );
			}
		}

		// Instantiate each sub combine
		foreach ( $this->subcombines as $class ) {
			$full = "CSSCompression_Combine_$class";
			$this->$class = new $full( $control, $this );
		}
	}

	/**
	 * Reads through each detailed package and checks for cross defn combinations
	 *
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of details
	 */
	public function combine( &$selectors = array(), &$details = array() ) {
		foreach ( $details as $i => &$value ) {
			if ( isset( $selectors[ $i ] ) && strpos( $selectors[ $i ], $this->token ) === 0 ) {
				continue;
			}

			foreach ( $this->methods as $option => $class ) {
				if ( $this->options[ $option ] ) {
					$value = $this->$class->combine( $value );
				}
			}
		}

		return array( $selectors, $details );
	}

	/**
	 * Helper function to ensure flagged words don't get
	 * overridden
	 *
	 * @param (mixed) obj: Array/String of definitions to be checked
	 */ 
	public function checkUncombinables( $obj ) {
		if ( is_array( $obj ) ) {
			foreach ( $obj as $item ) {
				if ( preg_match( $this->rimportant, $item ) ) {
					return true;
				}
			}
			return false;
		}
		else {
			return preg_match( $this->rimportant, $obj );
		}
	}

	/**
	 * Helper function to ensure all values of search array
	 * exist within the storage array
	 *
	 * @param (string) prop: CSS Property
	 * @param (array) storage: Array of definitions found
	 * @param (array) search: Array of definitions requred
	 */ 
	public function searchDefinitions( $prop, $storage, $search ) {
		// Return if storage & search don't match
		if ( count( $storage ) != count( $search ) ) {
			return false;
		}

		$str = "$prop:";
		foreach ( $search as $value ) {
			if ( ! isset( $storage[ $value ] ) || $this->checkUncombinables( $storage[ $value ] ) ) {
				return false;
			}
			$str .= $storage[ $value ] . ' ';
		}
		return trim( $str ) . ';';
	}

	/**
	 * Access to private methods for testing
	 *
	 * @param (string) subclass: Name of subclass to focus on
	 * @param (string) method: Method to be called
	 * @param (array) args: Array of paramters to be passed in
	 */
	public function access( $subclass, $method, $args ) {
		if ( $subclass == 'Combine' ) {
			if ( method_exists( $this, $method ) ) {
				if ( $method == 'combine' ) {
					return $this->combine( $args[ 0 ], $args[ 1 ] );
				}
				else {
					return call_user_func_array( array( $this, $method ), $args );
				}
			}
			else {
				throw new CSSCompression_Exception( "Unknown method in Combine Class - " . $method );
			}
		}
		else if ( in_array( $subclass, $this->subcombines ) ) {
			return $this->$subclass->access( $method, $args );
		}
		else {
			throw new CSSCompression_Exception( "Unknown Sub Combine Class - " . $subclass );
		}
	}
};

?>
