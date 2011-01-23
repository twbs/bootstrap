<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_BorderOutline
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rcsw: Border/Outline matching
	 */
	private $Control;
	private $Combine;
	private $rcsw = "/(^|(?<!\\\);)(border|border-top|border-bottom|border-left|border-right|outline)-(color|style|width):(.*?)((?<!\\\);|$)/";

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
	 * Combines color/style/width of border/outline properties
	 *
	 * @param (string) val: Rule Set
	 */ 
	public function combine( $val ) {
		$storage = $this->storage( $val );
		$pos = 0;

		// Now rebuild the string replacing all instances
		while ( preg_match( $this->rcsw, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
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
	 * Builds a storage object for iteration
	 *
	 * @param (string) val: Rule Set
	 */
	private function storage( $val ) {
		$storage = array();
		$pos = 0;

		// Find all possible occurences and build the replacement
		while ( preg_match( $this->rcsw, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			if ( ! isset( $storage[ $match[ 2 ][ 0 ] ] ) ) {
				$storage[ $match[ 2 ][ 0 ] ] = array( $match[ 3 ][ 0 ] => $match[ 4 ][ 0 ] );
			}

			// Override double written properties
			$storage[ $match[ 2 ][ 0 ] ][ $match[ 3 ][ 0 ] ] = $match[ 4 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// Go through each tag for possible combination
		foreach ( $storage as $tag => $arr ) {
			// All three have to be defined
			if ( count( $arr ) == 3 && ! $this->Combine->checkUncombinables( $arr ) ) {
				$storage[ $tag ] = "$tag:" . $arr['width'] . ' ' . $arr['style'] . ' ' . $arr['color'] . ';';
			}
			else {
				unset( $storage[ $tag ] );
			}
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
			throw new CSSCompression_Exception( "Unknown method in BorderOutline Class - " . $method );
		}
	}
};

?>
