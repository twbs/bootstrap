<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Color
{
	/**
	 * Color Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (array) options: Reference to options array
	 * @param (regex) rrgb: Checks for rgb notation
	 * @param (regex) rhex: Checks for hex code
	 * @param (regex) rfullhex: Checks for full 6 character hex code
	 * @static (array) color2hex: Long color name to hex code conversions
	 * @static (array) hex2short: Hex code to short color name conversions
	 * @static (array) hex2short_safe: CSS Level 1 safe color names that are shorter than hex codes
	 * @static (array) files: List of static helpers with their class vars
	 */
	private $Control;
	private $options = array();
	private $rrgb = "/^rgb\((\d{1,3}\%?(,\d{1,3}\%?,\d{1,3}\%?)?)\)$/i";
	private $rhex = "/^#([0-9a-f]{3}|[0-9a-f]{6})$/i";
	private $rfullhex = "/^#([0-9a-f]{6})$/i";
	private static $color2hex = array();
	private static $hex2short = array();
	private static $hex2short_safe = array();
	private static $files = array(
		'color2hex' => 'long2hex-colors.json',
		'hex2short' => 'hex2short-colors.json',
		'hex2short_safe' => 'hex2short-safe.json',
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 * and install conversion helpers
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->options = &$control->Option->options;

		if ( ! self::$color2hex ) {
			foreach ( self::$files as $v => $file ) {
				self::$$v = CSSCompression::getJSON( $file );
			}
		}
	}

	/**
	 * Central handler for all color conversions.
	 *
	 * @param (string) val: Color to be parsed
	 */ 
	public function color( $val ) {
		// Converts rgb values to hex codes
		if ( $this->options['color-rgb2hex'] ) {
			$val = $this->rgb2hex( $val );
		}

		// Convert long color names to hex codes
		if ( $this->options['color-long2hex'] ) {
			$val = $this->color2hex( $val );
		}

		// Ensure all hex codes are lowercase
		if ( preg_match( $this->rhex, $val ) ) {
			$val = strtolower( $val );
		}

		// Convert large hex codes to small codes
		if ( $this->options['color-hex2shorthex'] ) {
			$val = $this->hex2short( $val );
		}

		// Convert 6 digit hex codes to short color names
		if ( $this->options['color-hex2shortcolor'] ) {
			$val = $this->hex2color( $val );
		}

		// Convert safe css level1 color names
		if ( $this->options['color-hex2safe'] ) {
			$val = $this->hex2safe( $val );
		}

		return $val;
	}

	/**
	 * Converts rgb values to hex codes
	 *
	 * @param (string) val: Color to be converted
	 */
	private function rgb2hex( $val ) {
		if ( ! preg_match( $this->rrgb, $val, $match ) ) {
			return $val;
		}

		// locals
		$hex = '0123456789abcdef';
		$str = explode( ',', $match[ 1 ] );
		$new = '';

		// Incase rgb was defined with single val
		if ( ! $str ) {
			$str = array( $match[ 1 ] );
		}

		foreach ( $str as $x ) {
			$x = strpos( $x, '%' ) !== false ? intval( ( intval( $x ) / 100 ) * 255 ) : intval( $x );

			if ( $x > 255 ) {
				$x = 255;
			}

			if ( $x < 0 ) {
				$x = 0;
			}

			$new .= $hex[ ( $x - $x % 16 ) / 16 ];
			$new .= $hex[ $x % 16 ];
		}

		// Repeat hex code to complete 6 digit hex requirement for single definitions
		if ( count( $str ) == 1 ) {
			$new .= $new . $new;
		}

		// Replace with hex value
		return "#$new";
	}

	/**
	 * Convert long color names to hex codes
	 *
	 * @param (string) val: Color to be converted
	 */
	private function color2hex( $val ) {
		return isset( self::$color2hex[ $val ] ) ? self::$color2hex[ $val ] : $val;
	}

	/**
	 * Convert large hex codes to small codes
	 *
	 * @param (string) val: Hex to be shortened
	 */
	private function hex2short( $val ) {
		if ( ! preg_match( $this->rfullhex, $val, $match ) ) {
			return $val;
		}

		// See if we can convert to 3 char hex
		$hex = $match[ 1 ];
		if ( $hex[ 0 ] == $hex[ 1 ] && $hex[ 2 ] == $hex[ 3 ] && $hex[ 4 ] == $hex[ 5 ] ) {
			$val = '#' . $hex[ 0 ] . $hex[ 2 ] . $hex[ 4 ];
		}

		return $val;
	}

	/**
	 * Convert large hex codes to small codes
	 *
	 * @param (string) val: Color to be converted
	 */
	private function hex2color( $val ) {
		return isset( self::$hex2short[ $val ] ) ? self::$hex2short[ $val ] : $val;
	}

	/**
	 * Convert large hex codes to small codes
	 *
	 * @param (string) val: Color to be converted
	 */
	private function hex2safe( $val ) {
		return isset( self::$hex2short_safe[ $val ] ) ? self::$hex2short_safe[ $val ] : $val;
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
			throw new CSSCompression_Exception( "Unknown method in Color Class - " . $method );
		}
	}
};

?>
