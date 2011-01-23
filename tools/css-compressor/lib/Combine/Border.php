<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_Border
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rborder: Border matching
	 */
	private $Control;
	private $Combine;
	private $rborder = "/(^|(?<!\\\);)border-(top|right|bottom|left):(.*?)((?<!\\\);|$)/";

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
	 * Combines multiple border properties into single definition
	 *
	 * @param (string) val: Rule Set
	 */
	public function combine( $val ) {
		if ( ( $replace = $this->replace( $val ) ) === false ) {
			return $val;
		}

		// Rebuild the rule set with the combinations found
		$pos = 0;
		while ( preg_match( $this->rborder, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$colon = strlen( $match[ 1 ][ 0 ] );
			$val = substr_replace( $val, $replace, $match[ 0 ][ 1 ] + $colon, strlen( $match[ 0 ][ 0 ] ) - $colon );
			$pos = $match[ 0 ][ 1 ] + strlen( $replace ) - $colon - 1;
			$replace = '';
		}

		// Return converted val
		return $val;
	}

	/**
	 * Builds a replacement string
	 *
	 * @param (string) val: Rule Set
	 */
	private function replace( $val ) {
		$storage = array();

		// Find all possible occurences and build the replacement
		$pos = 0;
		while ( preg_match( $this->rborder, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			// Override double written properties
			$storage[ $match[ 2 ][ 0 ] ] = $match[ 3 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// All 4 have to be defined
		if ( count( $storage ) == 4 &&
			$storage['top'] == $storage['bottom'] &&
			$storage['left'] == $storage['right'] &&
			$storage['top'] == $storage['right'] ) {
				return "border:" . $storage['top'] . ';';
		}

		return false;
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
			throw new CSSCompression_Exception( "Unknown method in Border Class - " . $method );
		}
	}
};

?>
