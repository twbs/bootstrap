<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Individuals
{
	/**
	 * Individual patterns
	 *
	 * @class Control: Compression Controller
	 * @class Numeric: Numeric handler
	 * @class Color: Color Handler
	 * @param (array) options: Reference to options
	 * @param (regex) rdirectional: Properties that may have multiple directions
	 * @param (regex) rborderradius: Checks property for border-radius declaration
	 * @param (regex) rnoneprop: Properties that can have none as their value(will be converted to 0)
	 * @param (regex) rclip: Looks for rect grouping in clip declaration
	 * @param (regex) rsplitter: Checks font properties for font-size/line-height split
	 * @param (regex) rfilter: Special alpha filter for msie
	 * @param (regex) rspace: Checks for unescaped space
	 * @param (regex) rspace: Checks for unescaped slash
	 * @param (array) weights: Array of font-weight name conversions to their numeric counterpart
	 */
	private $Control;
	private $Numeric;
	private $Color;
	private $options = array();
	private $rdirectional = "/^(margin|padding|border-spacing)$/";
	private $rborderradius = "/border[a-z-]*radius/";
	private $rradiusfull = "/^(-moz-|-webkit-)?border-radius$/";
	private $rnoneprop = "/^(border|background|border-(top|right|bottom|left))$/";
	private $rclip = "/^rect\(\s*(\-?\d*\.?\d*?\w*)(,|\s)(\-?\d*\.?\d*?\w*)(,|\s)(\-?\d*\.?\d*?\w*)(,|\s)(\-?\d*\.?\d*?\w*)\s*\)$/";
	private $rsplitter = "/(^|(?<!\\\)\s)([^\/ ]+)\/([^\/ ]+)((?<!\\\)\s|$)/";
	private $rfilter = "/[\"']?PROGID\\\?:DXImageTransform\\\?.Microsoft\\\?.Alpha\(Opacity\\\?=(\d+\\\?\.?\d*)\)[\"']?/i";
	private $rspace = "/(?<!\\\)\s/";
	private $rslash = "/(?<!\\\)\//";
	private $weights = array(
		"normal" => 400,
		"bold" => 700,
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->Numeric = $control->Numeric;
		$this->Color = $control->Color;
		$this->options = &$control->Option->options;
	}

	/**
	 * Runs special unit/directional compressions
	 *
	 * @param (string) prop: CSS Property
	 * @param (string) val: Value of CSS Property
	 */ 
	public function individuals( $prop, $val ) {
		// Properties should always be lowercase
		$prop = strtolower( $prop );

		// Split up each definiton for color and numeric compressions
		$parts = preg_split( $this->rspace, $val );
		foreach ( $parts as &$v ) {
			if ( ! $v || $v == '' ) {
				continue;
			}

			// Remove uneeded decimals/units
			if ( $this->options['format-units'] ) {
				$v = $this->Numeric->numeric( $v );
			}

			// Color compression
			$v = $this->Color->color( $v );
		}
		$val = trim( implode( ' ', $parts ) );

		// Special border radius handling
		if ( preg_match( $this->rborderradius, $prop ) ) {
			$val = $this->borderRadius( $prop, $val );
		}
		// Remove uneeded side definitions if possible
		else if ( $this->options['directional-compress'] && count( $parts ) > 1 && preg_match( $this->rdirectional, $prop ) ) {
			$val = $this->directionals( strtolower( $val ) );
		}

		// Font-weight converter
		if ( $this->options['fontweight2num'] && ( $prop == 'font-weight' || $prop == 'font' ) ) {
			$val = $this->fontweight( $val );
		}

		// Special font value conversions
		if ( $prop == 'font' ) {
			$val = $this->font( $val );
		}
		
		// Special clip value compressions
		if ( $prop == 'clip' ) {
			$val = $this->clip( $val );
		}

		// None to 0 converter
		$val = $this->none( $prop, $val );

		// MSIE Filters
		$val = $this->filter( $prop, $val );

		// Return for list retrival
		return array( $prop, $val );
	}

	/**
	 * Preps border radius for directional compression
	 *
	 * @param (string) prop: Property Declaration
	 * @param (string) val: Declaration Value
	 */ 
	private function borderRadius( $prop, $val ) {
		if ( preg_match( $this->rslash, $val ) ) {
			$parts = preg_split( $this->rslash, $val, 2 );
			// We have to redo numeric compression because the slash may hav intruded
			foreach ( $parts as &$row ) {
				$p = preg_split( $this->rspace, $row );
				foreach ( $p as &$v ) {
					if ( ! $v || $v == '' ) {
						continue;
					}

					// Remove uneeded decimals/units
					if ( $this->options['format-units'] ) {
						$v = $this->Numeric->numeric( $v );
					}
				}
				$row = implode( ' ', $p );
				if ( $this->options['directional-compress'] ) {
					$row = $this->directionals( strtolower( $row ) );
				}
			}
			$val = implode( '/', $parts );
		}
		else if ( $this->options['directional-compress'] && preg_match( $this->rradiusfull, $prop ) ) {
			$val = $this->directionals( strtolower( $val ) );
		}

		return $val;
	}

	/**
	 * Finds directional compression on methods like margin/padding
	 *
	 * @param (string) val: Value of CSS Property
	 */ 
	private function directionals( $val ) {
		// Split up each definiton
		$direction = preg_split( $this->rspace, $val );

		// 4 Direction reduction
		$count = count( $direction );
		if ( $count == 4 ) {
			// All 4 sides are the same, combine into 1 definition
			if ( $direction[ 0 ] == $direction[ 1 ] && $direction[ 2 ] == $direction[ 3 ] && $direction[ 0 ] == $direction[ 3 ] ) {
				$direction = array( $direction[ 0 ] );
			}
			// top-bottom/left-right are the same, reduce definition
			else if ( $direction[ 0 ] == $direction[ 2 ] && $direction[ 1 ] == $direction[ 3 ] ) {
				$direction = array( $direction[ 0 ], $direction[ 1 ] );
			}
			// Only left-right are the same
			else if ( $direction[ 1 ] == $direction[ 3 ] ) {
				$direction = array( $direction[ 0 ], $direction[ 1 ], $direction[ 2 ] );
			}
		}
		// 3 Direction reduction
		else if ( $count == 3 ) {
			// All directions are the same
			if ( $direction[ 0 ] == $direction[ 1 ] && $direction[ 1 ] == $direction[ 2 ] ) {
				$direction = array( $direction[ 0 ] );
			}
			// Only top(first) and bottom(last) are the same
			else if ( $direction[ 0 ] == $direction[ 2 ] ) {
				$direction = array( $direction[ 0 ], $direction[ 1 ] );
			}
		}
		// 2 Direction reduction
		// Both directions are the same, combine into single definition
		else if ( $count == 2 && $direction[ 0 ] == $direction[ 1 ] ) {
			$direction = array( $direction[ 0 ] );
		}

		// Return the combined version of the directions
		// Single entries will just return
		return implode( ' ', $direction );
	}

	/**
	 * Converts font-weight names to numbers
	 *
	 * @param (string) val: font-weight prop value
	 */ 
	private function fontweight( $val ) {
		if ( preg_match( $this->rspace, $val ) ) {
			$parts = preg_split( $this->rspace, $val );
			foreach ( $parts as &$item ) {
				$lower = strtolower( $item );
				if ( isset( $this->weights[ $lower ] ) && $lower != 'normal' ) {
					$item = $this->weights[ $lower ];
				}
			}
			$val = implode( ' ', $parts );
		}
		else if ( isset( $this->weights[ strtolower( $val ) ] ) ) {
			$val = $this->weights[ strtolower( $val ) ];
		}

		return $val;
	}

	/**
	 * Special font conversions
	 *
	 * @param (string) val: property value
	 */
	private function font( $val ) {
		// Split out the font-size/line-height split and run through numerical handlers
		if ( preg_match( $this->rsplitter, $val, $match, PREG_OFFSET_CAPTURE ) ) {
			$size = $this->Numeric->numeric( $match[ 2 ][ 0 ] );
			$height = $this->Numeric->numeric( $match[ 3 ][ 0 ] );
			$concat = $match[ 1 ][ 0 ] . $size . '/' . $height . $match[ 4 ][ 0 ];
			$val = substr_replace( $val, $concat, $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] )  );
		}

		return $val;
	}

	/**
	 * Special clip conversions
	 *
	 * @param (string) val: property value
	 */
	private function clip( $val ) {
		if ( preg_match( $this->rclip, $val, $match ) ) {
			$positions = array( 1, 3, 5, 7 );
			$clean = 'rect(';
			foreach ( $positions as $pos ) {
				if ( ! isset( $match[ $pos ] ) ) {
					return $val;
				}

				$clean .= $this->Numeric->numeric( $match[ $pos ] ) . ( isset( $match[ $pos + 1 ] ) ? $match[ $pos + 1 ] : '' );
			}
			$val = $clean . ')';
		}

		return $val;
	}

	/**
	 * Convert none vals to 0
	 *
	 * @param (string) prop: Current Property
	 * @param (string) val: property value
	 */ 
	private function none( $prop, $val ) {
		if ( preg_match( $this->rnoneprop, $prop ) && $val == 'none' ) {
			$val = '0';
		}

		return $val;
	}

	/**
	 * MSIE Filter Conversion
	 *
	 * @param (string) prop: Current Property
	 * @param (string) val: property value
	 */ 
	private function filter( $prop, $val ) {
		if ( preg_match( "/filter/", $prop ) ) {
			$val = preg_replace( $this->rfilter, "alpha(opacity=$1)", $val );
		}

		return $val;
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
			throw new CSSCompression_Exception( "Unknown method in Individuals Class - " . $method );
		}
	}
};

?>
