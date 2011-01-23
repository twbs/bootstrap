<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Combine_BorderRadius
{
	/**
	 * Combine Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Combine: Combine Controller
	 * @param (regex) rspace: Checks for space without an escape '\' character before it
	 * @param (regex) rslash: Checks for unescaped slash character
	 * @param (array) borderRadius: Various border radii components
	 */
	private $Control;
	private $Combine;
	private $rspace = "/(?<!\\\)\s/";
	private $rslash = "/(?<!\\\)\//";
	private $borderRadius = array(
		'css3' => array(
			'mod' => '',
			'base' => "/(^|(?<!\\\);)border-radius:(.*?)((?<!\\\);|$)/",
			'full' => "/(^|(?<!\\\);)border-(top|bottom)-(left|right)-radius:(.*?)((?<!\\\);|$)/",
		),
		'moz' => array(
			'mod' => '-moz-',
			'base' => "/(^|(?<!\\\);)-moz-border-radius:(.*?)((?<!\\\);|$)/",
			'full' => "/(^|(?<!\\\);)-moz-border-radius-(top|bottom)(left|right):(.*?)((?<!\\\);|$)/"
		),
		'webkit' => array(
			'mod' => '-webkit-',
			'base' => "/(^|(?<!\\\);)-webkit-border-radius:(.*?)((?<!\\\);|$)/",
			'full' => "/(^|(?<!\\\);)-webkit-border-(top|bottom)-(left|right)-radius:(.*?)((?<!\\\);|$)/"
		),
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
	 * Main handler to combine border-radii into a single rule
	 *
	 * @param (string) val: Rule Set
	 */
	public function combine( $val ) {
		foreach ( $this->borderRadius as $regex ) {
			$val = $this->fix( $val, $regex );
		}

		return $val;
	}

	/**
	 * Does the actual combining
	 *
	 * @param (string) val: Rule Set
	 */
	private function fix( $val, $regex ) {
		$val = $this->base( $val, $regex );
		$replace = $regex['mod'];

		// Storage builder
		if ( ( $storage = $this->storage( $val, $regex ) ) === false ) {
			return $val;
		}

		// Setup horizontal/vertical radii
		foreach ( $storage as $dir => &$config ) {
			// Verticals are optional
			if ( $dir == 'vertical' && ! $config['keep'] ) {
				break;
			}
			// All 4 are the same
			else if ( $config['top-left'] == $config['top-right'] && 
				$config['top-right'] == $config['bottom-right'] && 
				$config['bottom-right'] == $config['bottom-left'] ) {
					$config['replace'] .= $config['top-left'];
			}
			// Opposites are the same
			else if ( $config['top-left'] == $config['bottom-right'] && $config['top-right'] == $config['bottom-left'] ) {
				$config['replace'] .= $config['top-left'] . ' ' . $config['top-right'];
			}
			// 3-point directional
			else if ( $config['top-right'] == $config['bottom-left'] ) {
				$config['replace'] .= $config['top-left'] . ' ' . $config['top-right'] . ' ' . $config['bottom-right'];
			}
			// none are the same, but can still use shorthand notation
			else {
				$config['replace'] .= $config['top-left'] . ' ' . $config['top-right'] . ' ' 
					. $config['bottom-right'] . ' ' . $config['bottom-left'];
			}
		}

		// Now rebuild the string replacing all instances of margin/padding if shorthand exists
		$pos = 0;
		$replace = $regex['mod'] . "border-radius:" . $storage['horizontal']['replace'] . $storage['vertical']['replace'] . ';';
		while ( preg_match( $regex['full'], $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$colon = strlen( $match[ 1 ][ 0 ] );
			$val = substr_replace( $val, $replace, $match[ 0 ][ 1 ] + $colon, strlen( $match[ 0 ][ 0 ] ) - $colon );
			$pos = $match[ 0 ][ 1 ] + strlen( $replace ) - $colon - 1;
			$replace = '';
		}

		// Return converted val
		return $val;
	}

	/**
	 * Expands short handed border radius props for combination
	 *
	 * @param (string) val: Rule Set
	 */
	private function base( $val, $regex ) {
		$pos = 0;
		while ( preg_match( $regex['base'], $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$replace = '';
			$parts = preg_split( $this->rslash, trim( $match[ 2 ][ 0 ] ), 2 );
			$positions = array(
				'top-left' => 0,
				'top-right' => 0,
				'bottom-right' => 0,
				'bottom-left' => 0,
			);
			$base = array(
				'horizontal' => array(
					'parts' => preg_split( $this->rspace, trim( $parts[ 0 ] ) ),
					'pos' => $positions,
				),
				'vertical' => array(
					'parts' => isset( $parts[ 1 ] ) ? preg_split( $this->rspace, trim( $parts[ 1 ] ) ) : '',
					'pos' => $positions,
				),
			);

			foreach ( $base as &$config ) {
				// Skip uncombinables
				if ( $this->Combine->checkUncombinables( $config['parts'] ) ) {
					$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
					continue 2;
				}
				// Might not have verticals
				else if ( $config['parts'] === '' ) {
					continue;
				}

				// Each position needs a value
				switch ( count( $config['parts'] ) ) {
					case 1:
						$config['pos']['top-left'] = $config['pos']['top-right'] = $config['parts'][ 0 ];
						$config['pos']['bottom-left'] = $config['pos']['bottom-right'] = $config['parts'][ 0 ];
						break;
					case 2:
						$config['pos']['top-left'] = $config['pos']['bottom-right'] = $config['parts'][ 0 ];
						$config['pos']['bottom-left'] = $config['pos']['top-right'] = $config['parts'][ 1 ];
						break;
					case 3:
						$config['pos']['top-left'] = $config['parts'][ 0 ];
						$config['pos']['bottom-left'] = $config['pos']['top-right'] = $config['parts'][ 1 ];
						$config['pos']['bottom-right'] = $config['parts'][ 2 ];
						break;
					case 4:
						$config['pos']['top-left'] = $config['parts'][ 0 ];
						$config['pos']['top-right'] = $config['parts'][ 1 ];
						$config['pos']['bottom-right'] = $config['parts'][ 2 ];
						$config['pos']['bottom-left'] = $config['parts'][ 3 ];
						break;
					default:
						continue 2;
				}

			}

			// Build the replacement
			foreach ( $positions as $p => $v ) {
				if ( $regex['mod'] == '-moz-' ) {
					$replace .= "-moz-border-radius-" . preg_replace( "/-/", '', $p ) . ":"
						. $base['horizontal']['pos'][ $p ]
						. ( $base['vertical']['parts'] === '' ? '' : ' ' . $base['vertical']['pos'][ $p ] )
						. ';';
				}
				else {
					$replace .= $regex['mod'] . "border-$p-radius:"
						. $base['horizontal']['pos'][ $p ]
						. ( $base['vertical']['parts'] === '' ? '' : ' ' . $base['vertical']['pos'][ $p ] )
						. ';';
				}
			}
			$pos += strlen( $replace );
			$val = substr_replace( $val, $replace, $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] ) );
		}

		return $val;
	}

	/**
	 * Builds the storage object for border radius props
	 *
	 * @param (string) val: Rule Set
	 * @param (array) regex: Current border radius type checking props
	 */
	private function storage( $val, $regex ) {
		$storage = array(
			'horizontal' => array( 'replace' => '' ),
			'vertical' => array( 'replace' => '', 'keep' => false ),
		);

		// Find all possible occurences of this border-radius type and mark their directional value
		$pos = 0;
		while ( preg_match( $regex['full'], $val, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] ) - 1;
			$parts = preg_split( $this->rspace, $match[ 4 ][ 0 ], 2 );
			$storage['horizontal'][ $match[ 2 ][ 0 ] . '-' . $match[ 3 ][ 0 ] ] = trim( $parts[ 0 ] );
			if ( isset( $parts[ 1 ] ) ) {
				$storage['vertical'][ $match[ 2 ][ 0 ] . '-' . $match[ 3 ][ 0 ] ] = trim( $parts[ 1 ] );
				$storage['vertical']['keep'] = true;
				$storage['vertical']['replace'] = '/';
			}
			else {
				$storage['vertical'][ $match[ 2 ][ 0 ] . '-' . $match[ 3 ][ 0 ] ] = '0';
			}
		}

		// Only combine if all 4 definitions are found (5 including replace)
		if ( count( $storage['horizontal'] ) != 5 || 
			$this->Combine->checkUncombinables( $storage['horizontal'] ) || 
			$this->Combine->checkUncombinables( $storage['vertical'] ) ) {
				return false;
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
			throw new CSSCompression_Exception( "Unknown method in BorderRadius Class - " . $method );
		}
	}
};

?>
