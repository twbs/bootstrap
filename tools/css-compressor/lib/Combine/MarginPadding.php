<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_MarginPadding
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rspace: Checks for space without an escape '\' character before it
	 * @param (regex) rmp: Margin/Padding matching
	 * @param (regex) rmpbase: Margin/Padding base match
	 */
	private $Control;
	private $Combine;
	private $rspace = "/(?<!\\\)\s/";
	private $rmp = "/(^|(?<!\\\);)(margin|padding)-(top|right|bottom|left):(.*?)((?<!\\\);|$)/";
	private $rmpbase = "/(^|(?<!\\\);)(margin|padding):(.*?)((?<!\\\);|$)/";

	/**
	 * Stash a reference to the controller & combiner
	 *
	 * @param (class) control: CSSCompression Controller
	 * @param (class) combine: CSSCompression Combiner
	 */
	public function __construct( CSSCompression_Control $control, CSSCompression_Combine $combine ) {
		$this->Control = $control;
		$this->Combine = $combine;
	}

	/**
	 * Combines multiple directional properties of 
	 * margin/padding into single definition.
	 *
	 * @param (string) val: Rule Set
	 */ 
	public function combine( $val ) {
		$val = $this->expand( $val );
		$storage = $this->storage( $val );
		$pos = 0;

		// Now rebuild the string replacing all instances of margin/padding if shorthand exists
		while ( preg_match( $this->rmp, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$prop = $match[ 2 ][ 0 ];
			if ( isset( $storage[ $prop ] ) ) {
				$colon = strlen( $match[ 1 ][ 0 ] );
				$val = substr_replace( $val, $storage[ $prop ], $match[ 0 ][ 1 ] + $colon, strlen( $match[ 0 ][ 0 ] ) - $colon );
				$pos = $match[ 0 ][ 1 ] + strlen( $storage[ $prop ] ) - $colon - 1;
				$storage[ $prop ] = '';
			}
			else {
				$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
			}
		}

		// Return converted val
		return $val;
	}

	/**
	 * Build the storage object for iteration
	 *
	 * @param (string) val: Rule Set
	 */
	private function storage( $val ) {
		$storage = array();
		$pos = 0;

		// Find all possible occurences of margin/padding and mark their directional value
		while ( preg_match( $this->rmp, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			if ( ! isset( $storage[ $match[ 2 ][ 0 ] ] ) ) {
				$storage[ $match[ 2 ][ 0 ] ] = array( $match[ 3 ][ 0 ] => $match[ 4 ][ 0 ] );
			}

			// Override double written properties
			$storage[ $match[ 2 ][ 0 ] ][ $match[ 3 ][ 0 ] ] = $match[ 4 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// Go through each tag for possible combination
		foreach ( $storage as $tag => $arr ) {
			// Only combine if all 4 definitions are found
			if ( count( $arr ) == 4 && ! $this->Combine->checkUncombinables( $arr ) ) {
				// All 4 are the same
				if ( $arr['top'] == $arr['bottom'] && $arr['left'] == $arr['right'] && $arr['top'] == $arr['left'] ) {
					$storage[ $tag ] = "$tag:" . $arr['top'] . ';';
				}
				// Opposites are the same
				else if ( $arr['top'] == $arr['bottom'] && $arr['left'] == $arr['right'] ) {
					$storage[ $tag ] = "$tag:" . $arr['top'] . ' ' . $arr['left'] . ';';
				}
				// 3-point directional
				else if ( $arr['right'] == $arr['left'] ) {
					$storage[ $tag ] = "$tag:" . $arr['top'] . ' ' . $arr['right'] . ' ' . $arr['bottom'] . ';';
				}
				// none are the same, but can still use shorthand notation
				else {
					$storage[ $tag ] = "$tag:" . $arr['top'] . ' ' . $arr['right'] . ' ' . $arr['bottom'] . ' ' . $arr['left'] . ';';
				}
			}
			else {
				unset( $storage[ $tag ] );
			}
		}

		return $storage;
	}

	/**
	 * Explodes shorthanded margin/padding properties for later combination
	 *
	 * @param (string) val: Rule set
	 */
	private function expand( $val ) {
		$pos = 0;
		while ( preg_match( $this->rmpbase, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$replace = '';
			$prop = $match[ 2 ][ 0 ];
			$value = preg_split( $this->rspace, trim( $match[ 3 ][ 0 ] ) );
			$positions = array(
				'top' => 0,
				'right' => 0,
				'bottom' => 0,
				'left' => 0
			);

			// Skip uncombinables
			if ( $this->Combine->checkUncombinables( $value ) ) {
				$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] );
				continue;
			}

			// Each position needs a value
			switch ( count( $value ) ) {
				case 1:
					$positions['top'] = $positions['right'] = $positions['bottom'] = $positions['left'] = $value[ 0 ];
					break;
				case 2:
					$positions['top'] = $positions['bottom'] = $value[ 0 ];
					$positions['right'] = $positions['left'] = $value[ 1 ];
					break;
				case 3:
					$positions['top'] = $value[ 0 ];
					$positions['right'] = $positions['left'] = $value[ 1 ];
					$positions['bottom'] = $value[ 2 ];
					break;
				case 4:
					$positions['top'] = $value[ 0 ];
					$positions['right'] = $value[ 1 ];
					$positions['bottom'] = $value[ 2 ];
					$positions['left'] = $value[ 3 ];
					break;
				default:
					continue;
			}

			// Build the replacement
			foreach ( $positions as $p => $v ) {
				$replace .= "$prop-$p:$v;";
			}
			$colon = strlen( $match[ 1 ][ 0 ] );
			$val = substr_replace( $val, $replace, $match[ 0 ][ 1 ] + $colon, strlen( $match[ 0 ][ 0 ] ) - $colon );
			$pos = $match[ 0 ][ 1 ] + strlen( $replace ) - $colon - 1;
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
			throw new CSSCompression_Exception( "Unknown method in MarginPadding Class - " . $method );
		}
	}
};

?>
