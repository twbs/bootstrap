<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_List
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rlist: List style matching
	 * @param (array) groupings: Group of list combinationals
	 */
	private $Control;
	private $Combine;
	private $rlist = "/(^|(?<!\\\);)list-style-(type|position|image):(.*?)((?<!\\\);|$)/";
	private $groupings = array(
		array( 'type', 'position', 'image' ),
		array( 'type', 'position' ),
		array( 'type', 'image' ),
		array( 'position', 'image' ),
		array( 'type' ),
		array( 'position' ),
		array( 'image' ),
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
	 * Combines multiple list style props into single definition
	 *
	 * @param (string) val: Rule Set
	 */ 
	public function combine( $val ) {
		// If replacement string found, run it on all declarations
		if ( ( $replace = $this->replace( $val ) ) !== false ) {
			$pos = 0;
			while ( preg_match( $this->rlist, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
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
	 * Build the replacement string for list props
	 *
	 * @param (string) val: Rule Set
	 */
	private function replace( $val ) {
		$storage = array();
		$pos = 0;

		// Find all possible occurences and build the replacement
		while ( preg_match( $this->rlist, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$storage[ $match[ 2 ][ 0 ] ] = $match[ 3 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// Run background checks and get replacement str
		foreach ( $this->groupings as $props ) {
			if ( $replace = $this->Combine->searchDefinitions( 'list-style', $storage, $props ) ) {
				return $replace;
			}
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
			throw new CSSCompression_Exception( "Unknown method in List Class - " . $method );
		}
	}
};

?>
