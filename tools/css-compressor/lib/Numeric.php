<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Numeric
{
	/**
	 * Numeric Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (array) options: Reference to options
	 * @param (regex) rdecimal: Checks for zero decimal
	 * @param (regex) rzero: Checks for preceding 0 to decimal unit
	 * @param (regex) runit: Checks for suffix on 0 unit
	 */
	private $Control;
	private $options = array();
	private $rdecimal = "/^(\+|\-)?(\d*\.[1-9]*0*)(\%|[a-z]{2})$/i";
	private $rzero = "/^(\+|\-)?0(\.\d+)(\%|[a-z]{2})?$/i";
	private $runit = "/^0(\%|[a-z]{2})$/i";

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->options = &$control->Option->options;
	}

	/**
	 * Runs all numeric operations
	 *
	 * @param (string) str: Unit string
	 */
	public function numeric( $str ) {
		$str = $this->decimal( $str );
		$str = $this->zeroes( $str );
		$str = $this->units( $str );
		return $str;
	}

	/**
	 * Remove's unecessary decimal, ie 13.0px => 13px
	 *
	 * @param (string) str: Unit string
	 */ 
	private function decimal( $str ) {
		if ( preg_match( $this->rdecimal, $str, $match ) ) {
			$str = ( $match[ 1 ] == '-' ? '-' : '' ) . floatval( $match[ 2 ] ) . $match[ 3 ];
		}

		return $str;
	}

	/**
	 * Removes suffix from 0 unit, ie 0px; => 0;
	 *
	 * @param (string) str: Unit string
	 */ 
	private function units( $str ) {
		if ( preg_match( $this->runit, $str, $match ) ) {
			$str = '0';
		}

		return $str;
	}


	/**
	 * Removes leading zero in decimal, ie 0.33px => .33px
	 *
	 * @param (string) str: Unit string
	 */
	private function zeroes( $str ) {
		if ( preg_match( $this->rzero, $str, $match ) ) {
			$str = ( isset( $match[ 1 ] ) && $match[ 1 ] == '-' ? '-' : '' ) . $match[ 2 ] . ( isset( $match[ 3 ] ) ? $match[ 3 ] : '' );
		}

		return $str;
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
			throw new CSSCompression_Exception( "Unknown method in Numeric Class - " . $method );
		}
	}
};

?>
