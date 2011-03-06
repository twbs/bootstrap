<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_Font
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rfont: Font matching
	 * @param (array) groupings: Set of font combinationals
	 */
	private $Control;
	private $Combine;
	private $rfont = "/(^|(?<!\\\);)(font|line)-(style|variant|weight|size|height|family):(.*?)((?<!\\\);|$)/";
	private $groupings = array(
		array( 'font-style', 'font-variant', 'font-weight', 'size/height', 'font-family' ),
		array( 'font-style', 'font-variant', 'font-weight', 'font-size', 'font-family' ),
		array( 'font-style', 'font-variant', 'size/height', 'font-family' ),
		array( 'font-style', 'font-variant', 'font-size', 'font-family' ),
		array( 'font-style', 'font-weight', 'size/height', 'font-family' ),
		array( 'font-style', 'font-weight', 'font-size', 'font-family' ),
		array( 'font-variant', 'font-weight', 'size/height', 'font-family' ),
		array( 'font-variant', 'font-weight', 'font-size', 'font-family' ),
		array( 'font-weight', 'size/height', 'font-family' ),
		array( 'font-weight', 'font-size', 'font-family' ),
		array( 'font-variant', 'size/height', 'font-family' ),
		array( 'font-variant', 'font-size', 'font-family' ),
		array( 'font-style', 'size/height', 'font-family' ),
		array( 'font-style', 'font-size', 'font-family' ),
		array( 'size/height', 'font-family' ),
		array( 'font-size', 'font-family' ),
	);

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
	 * Combines multiple font-definitions into single definition
	 *
	 * @param (string) val: Rule Set
	 */ 
	public function combine( $val ) {
		$storage = $this->storage( $val );

		// Loop through each property check and see if they can be replaced
		foreach ( $this->groupings as $props ) {
			if ( $replace = $this->Combine->searchDefinitions( 'font', $storage, $props ) ) {
				break;
			}
		}

		// If replacement string found, run it on all declarations
		if ( $replace ) {
			$pos = 0;
			while ( preg_match( $this->rfont, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
				if ( ! isset( $storage['line-height'] ) && stripos( $match[ 0 ][ 0 ], 'line-height') === 0 ) {
					$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
					continue;
				}
				$colon = strlen( $match[ 1 ][ 0 ] );
				$val = substr_replace( $val, $replace, $match[ 0 ][ 1 ] + $colon, strlen( $match[ 0 ][ 0 ] ) - $colon );
				$pos = $match[ 0 ][ 1 ] + strlen( $replace ) - $colon - 1;
				$replace = '';
			}
		}

		// Return converted val
		return $val;
	}

	/**
	 * Builds a storage object for iteration
	 *
	 * @param (string) val: Rule Set
	 */
	private function storage( $val ) {
		$storage = array();

		// Find all possible occurences and build the replacement
		$pos = 0;
		while ( preg_match( $this->rfont, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$storage[ $match[ 2 ][ 0 ] . '-' . $match[ 3 ][ 0 ] ] = $match[ 4 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// Combine font-size & line-height if possible
		if ( isset( $storage['font-size'] ) && isset( $storage['line-height'] ) ) {
			$storage['size/height'] = $storage['font-size'] . '/' . $storage['line-height'];
			unset( $storage['font-size'], $storage['line-height'] );
		}

		return $storage;
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
			throw new CSSCompression_Exception( "Unknown method in Font Class - " . $method );
		}
	}
};

?>
