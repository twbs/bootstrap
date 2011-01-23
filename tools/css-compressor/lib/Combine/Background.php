<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_Background
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rbackground: Background matching
	 * @param (array) groupings: List of background combinations
	 */
	private $Control;
	private $Combine;
	private $rbackground = "/(^|(?<!\\\);)background-(color|image|repeat|attachment|position):(.*?)((?<!\\\);|$)/";
	private $groupings = array(
		// With color
		array( 'color', 'image', 'repeat', 'attachment', 'position' ),
		array( 'color', 'image', 'attachment', 'position' ),
		array( 'color', 'image', 'repeat', 'position' ),
		array( 'color', 'image', 'repeat', 'attachment' ),
		array( 'color', 'image', 'repeat' ),
		array( 'color', 'image', 'attachment' ),
		array( 'color', 'image', 'position' ),
		array( 'color', 'image' ),
		// Without Color
		array( 'image', 'attachment', 'position' ),
		array( 'image', 'repeat', 'position' ),
		array( 'image', 'repeat', 'attachment' ),
		array( 'image', 'repeat' ),
		array( 'image', 'attachment' ),
		array( 'image', 'position' ),
		// Just Color/Image
		array( 'image' ),
		array( 'color' ),
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
	 * Combines multiple background props into single definition
	 *
	 * @param (string) val: Rule Set
	 */ 
	public function combine( $val ) {
		$storage = array();

		// Find all possible occurences and build the replacement
		$pos = 0;
		while ( preg_match( $this->rbackground, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$storage[ $match[ 2 ][ 0 ] ] = $match[ 3 ][ 0 ];
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
		}

		// Run background checks and get replacement str
		foreach ( $this->groupings as $props ) {
			if ( $replace = $this->Combine->searchDefinitions( 'background', $storage, $props ) ) {
				break;
			}
		}

		// If replacement string found, run it on all declarations
		if ( $replace ) {
			$pos = 0;
			while ( preg_match( $this->rbackground, $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
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
			throw new CSSCompression_Exception( "Unknown method in Background Class - " . $method );
		}
	}
};

?>
