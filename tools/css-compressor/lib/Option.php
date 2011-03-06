<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Option
{
	/**
	 * Option Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (string) custom: Name of the custom mode
	 * @param (array) options: Instance settings
	 */
	private $Control;
	private $custom = '__custom';
	public $options = array();

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->options = CSSCompression::$defaults;
		$control->mode = $this->custom;
	}

	/**
	 * Maintainable access to the options array
	 *
	 *	- Passing no arguments returns the entire options array
	 *	- Passing a single name argument returns the value for the option
	 * 	- Passing both a name and value, sets the value to the name key, and returns the value
	 *	- Passing an array will merge the options with the array passed, for object like extension
	 *
	 * @param (mixed) name: The key name of the option
	 * @param (mixed) value: Value to set the option
	 */
	public function option( $name = NULL, $value = NULL ) {
		if ( $name === NULL ) {
			return $this->options;
		}
		else if ( is_array( $name ) ) {
			return $this->merge( $name );
		}
		else if ( $value === NULL ) {
			return isset( $this->options[ $name ] ) ? $this->options[ $name ] : NULL;
		}
		else {
			// Readability doesn't signify custom settings
			if ( $name != 'readability' ) {
				$this->Control->mode = $this->custom;
			}

			return ( $this->options[ $name ] = $value );
		}
	}

	/**
	 * Reset's the default options
	 *
	 * @params none;
	 */ 
	public function reset(){
		// Reset and return the new options
		return $this->options = CSSCompression::$defaults;
	}

	/**
	 * Extend like function to merge an array of preferences into
	 * the options array.
	 *
	 * @param (mixed) options: Array of preferences to merge into options
	 */ 
	public function merge( $options = array() ) {
		$modes = CSSCompression::modes();
		if ( $options && is_array( $options ) && count( $options ) ) {
			$this->Control->mode = $this->custom;
			foreach ( $this->options as $key => $value ) {
				if ( ! isset( $options[ $key ] ) ) {
					continue;
				}
				else if ( strtolower( $options[ $key ] ) == 'on' ) {
					$this->options[ $key ] = true;
				}
				else if ( strtolower( $options[ $key ] ) == 'off' ) {
					$this->options[ $key ] = false;
				}
				else {
					$this->options[ $key ] = intval( $options[ $key ] );
				}
			}
		}
		else if ( $options && is_string( $options ) && array_key_exists( $options, $modes ) ) {
			$this->Control->mode = $options;

			// Default all to true, the mode has to force false
			foreach ( $this->options as $key => $value ) {
				if ( $key != 'readability' ) {
					$this->options[ $key ] = true;
				}
			}

			// Merge mode into options
			foreach ( $modes[ $options ] as $key => $value ) {
				$this->options[ $key ] = $value;
			}
		}

		return $this->options;
	}

	/**
	 * Access to private methods for testing
	 *
	 * @param (string) method: Method to be called
	 * @param (array) args: Array of paramters to be passed in
	 */
	public function access( $method, $args ) {
		if ( method_exists( $this, $method ) ) {
			return call_user_func_array( array( $this, $method ), $args );
		}
		else {
			throw new CSSCompression_Exception( "Unknown method in Option Class - " . $method );
		}
	}
};

?>
