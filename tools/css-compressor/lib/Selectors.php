<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Selectors
{
	/**
	 * Selector patterns
	 *
	 * @class Control: Compression Controller
	 * @param (string) token: Copy of the injection token
	 * @param (regex) ridattr: ID Attribute matcher (combined with token)
	 * @param (regex) rclassattr: class Attribute matcher (combined with token)
	 * @param (array) options: Reference to options
	 * @param (regex) rmark: Stop points during selector parsing
	 * @param (regex) ridclassend: End of a id/class string
	 * @param (regex) rescapedspace: for replacement in class attributes
	 * @param (regex) rquote: Checks for the next quote character
	 * @param (regex) rcomma: looks for an unescaped comma character
	 * @param (regex) rspace: looks for an unescaped space character
	 * @param (regex) rid: looks for an unescaped hash character
	 * @param (regex) rpseudo: Add space after first-letter|line pseudo selector
	 * --- when it occurs before comma or rule set
	 */
	private $Control;
	private $token = '';
	private $ridattr = "";
	private $rclassattr = "";
	private $options = array();
	private $rmark = "/(?<!\\\)(#|\.|=)/";
	private $ridclassend = "/(?<!\\\)[:#>~\[\+\*\. ]/";
	private $rquote = "/(?<!\\\)(\"|')?\]/";
	private $rescapedspace = "/\\\ /";
	private $rcomma = "/(?<!\\\),/";
	private $rspace = "/(?<!\\\)\s/";
	private $rid = "/(?<!\\\)#/";
	private $rpseudo = "/:first-(letter|line)(,|$)/i";

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->token = CSSCompression::TOKEN;
		$this->ridattr = "/\[id=$this->token(.*?)$this->token\]/";
		$this->rclassattr = "/\[class=$this->token(.*?)$this->token\]/";
		$this->options = &$control->Option->options;
	}

	/**
	 * Selector specific optimizations
	 *
	 * @param (array) selectors: Array of selectors
	 */
	public function selectors( &$selectors = array() ) {
		foreach ( $selectors as &$selector ) {
			// Auto ignore sections
			if ( strpos( $selector, $this->token ) === 0 ) {
				continue;
			}

			// Smart casing and token injection
			$selector = $this->parse( $selector );

			// Converting attr to shorthanded selectors
			if ( $this->options['attr2selector'] ) {
				// Use id hash instead of id attr
				$selector = $this->idAttribute( $selector );

				// Use class notation instead of class attr
				$selector = $this->classAttribute( $selector );
			}

			// Remove everything before final id in a selector
			if ( $this->options['strict-id'] ) {
				$selector = $this->strictid( $selector );
			}

			// Get rid of possible repeated selectors
			$selector = $this->repeats( $selector );

			// Add space after pseudo selectors (so ie6 doesn't complain)
			if ( $this->options['pseudo-space'] ) {
				$selector = $this->pseudoSpace( $selector );
			}
		}

		return $selectors;
	}

	/**
	 * Converts selectors like BODY => body, DIV => div
	 * and injects tokens wrappers for attribute values
	 *
	 * @param (string) selector: CSS Selector
	 */ 
	private function parse( $selector ) {
		$clean = '';
		$substr = '';
		$pos = 0;

		while ( preg_match( $this->rmark, $selector, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$substr = substr( $selector, $pos, $match[ 0 ][ 1 ] + 1 - $pos );
			$clean .= $this->options['lowercase-selectors'] ? strtolower( $substr ) : $substr;
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 1 ][ 0 ] );

			// Class or id match
			if ( $match[ 1 ][ 0 ] == '#' || $match[ 1 ][ 0 ] == '.' ) {
				if ( preg_match( $this->ridclassend, $selector, $m, PREG_OFFSET_CAPTURE, $pos ) ) {
					$clean .= substr( $selector, $pos, $m[ 0 ][ 1 ] - $pos );
					$pos = $m[ 0 ][ 1 ];
				}
				else {
					$clean .= substr( $selector, $pos );
					$pos = strlen( $selector );
					break;
				}
			}
			// Start of a string
			else if ( preg_match( $this->rquote, $selector, $m, PREG_OFFSET_CAPTURE, $pos ) ) {
				if ( $selector[ $pos ] == "\"" || $selector[ $pos ] == "'" ) {
					$pos++;
				}
				$clean .= $this->token . substr( $selector, $pos, $m[ 0 ][ 1 ] - $pos ) . $this->token . ']';
				$pos = $m[ 0 ][ 1 ] + strlen( $m[ 0 ][ 0 ] );
			}
			// No break points left
			else {
				$clean .= substr( $selector, $pos );
				$pos = strlen( $selector );
				break;
			}
		}

		return $clean . ( $this->options['lowercase-selectors'] ? strtolower( substr( $selector, $pos ) ) : substr( $selector, $pos ) );
	}

	/**
	 * Convert [id=blah] attribute selectors into id form selector (#blah)
	 *
	 * @param (string) selector: CSS Selector
	 */
	private function idAttribute( $selector ) {
		$pos = 0;
		while ( preg_match( $this->ridattr, $selector, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			// Don't convert if space found (not valid hash selector)
			if ( strpos( $match[ 1 ][ 0 ], ' ' ) !== false ) {
				$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] );
				continue;
			}

			$selector = substr_replace( $selector, '#' . $match[ 1 ][ 0 ], $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] ) );
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 1 ][ 0 ] ) + 1;
		}

		return $selector;
	}

	/**
	 * Convert [class=blah] attribute selectors into class form selector (.blah)
	 *
	 * @param (string) selector: CSS Selector
	 */
	private function classAttribute( $selector ) {
		$pos = 0;
		while ( preg_match( $this->rclassattr, $selector, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			// Don't convert if prescense of dot separator found
			if ( strpos( $match[ 1 ][ 0 ], '.' ) !== false ) {
				$pos = $match[ 0 ][ 1 ] + strlen( $match[ 0 ][ 0 ] );
				continue;
			}

			$replace = '.' . preg_replace( $this->rescapedspace, ".", $match[ 1 ][ 0 ] );
			$selector = substr_replace( $selector, $replace, $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] ) );
			$pos = $match[ 0 ][ 1 ] + strlen( $match[ 1 ][ 0 ] ) + 1;
		}

		return $selector;
	}

	/**
	 * Promotes nested id's to the front of the selector
	 *
	 * @param (string) selector: CSS Selector
	 */
	private function strictid( $selector ) {
		$parts = preg_split( $this->rcomma, $selector );
		foreach ( $parts as &$s ) {
			if ( preg_match( $this->rid, $s ) ) {
				$p = preg_split( $this->rid, $s );
				$s = '#' . array_pop( $p );
			}
		}

		return implode( ',', $parts );
	}

	/**
	 * Removes repeated selectors that have been comma separated
	 *
	 * @param (string) selector: CSS Selector
	 */
	private function repeats( $selector ) {
		$parts = preg_split( $this->rcomma, $selector );
		$parts = array_flip( $parts );
		$parts = array_flip( $parts );
		return implode( ',', $parts );
	}

	/**
	 * Adds space after pseudo selector for ie6 like a:first-child{ => a:first-child {
	 *
	 * @param (string) selector: CSS Selector
	 */ 
	private function pseudoSpace( $selector ) {
		return preg_replace( $this->rpseudo, ":first-$1 $2", $selector );
	}

	/**
	 * Access to private methods for testing
	 *
	 * @param (string) method: Method to be called
	 * @param (array) args: Array of paramters to be passed in
	 */
	public function access( $method, $args ) {
		if ( method_exists( $this, $method ) ) {
			if ( $method == 'selectors' ) {
				return $this->selectors( $args[ 0 ] );
			}
			else {
				return call_user_func_array( array( $this, $method ), $args );
			}
		}
		else {
			throw new CSSCompression_Exception( "Unknown method in Selectors Class - " . $method );
		}
	}
};

?>
