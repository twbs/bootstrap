<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Format
{
	/**
	 * Format Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (string) token: Copy of the injection token
	 * @param (array) options: Reference to options
	 * @param (regex) rsemicolon: Checks for semicolon without an escape '\' character before it
	 * @param (regex) rcolon: Checks for colon without an escape '\' character before it
	 * @param (array) readability: Mapping to readability functions
	 */
	private $Control;
	private $token = '';
	private $options = array();
	private $rsemicolon = "/(?<!\\\);/";
	private $rcolon = "/(?<!\\\):/";
	private $readability = array(
		CSSCompression::READ_MAX => 'maximum',
		CSSCompression::READ_MED => 'medium',
		CSSCompression::READ_MIN => 'minimum',
		CSSCompression::READ_NONE => 'none',
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->token = CSSCompression::TOKEN;
		$this->options = &$control->Option->options;
	}


	/**
	 * Reformats compressed CSS into specified format
	 *
	 * @param (int) readability: Readability level of compressed output
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of declarations
	 */ 
	public function readability( $readability = CSSCompression::READ_NONE, $selectors = array(), $details = array() ) {
		if ( isset( $this->readability[ $readability ] ) ) {
			$fn = $this->readability[ $readability ];
			return trim( $this->$fn( $selectors, $details ) );
		}
		else {
			return 'Invalid Readability Value';
		}
	}

	/**
	 * Returns maxium readability, breaking on every selector, brace, and property
	 *
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of declarations
	 */ 
	private function maximum( $selectors, $details ) {
		$css = '';
		foreach ( $selectors as $k => $v ) {
			if ( strpos( $v, $this->token ) === 0 ) {
				$css .= substr( $v, strlen( $this->token ) );
				$css .= $details[ $k ];
				continue;
			}
			else if ( ! $details[ $k ] || trim( $details[ $k ] ) == '' ) {
				continue;
			}

			$v = str_replace( '>', ' > ', $v );
			$v = str_replace( '+', ' + ', $v );
			$v = str_replace( ',', ', ', $v );
			$css .= "$v {\n";
			$arr = preg_split( $this->rsemicolon, $details[ $k ] );

			foreach ( $arr as $item ) {
				if ( ! $item ) {
					continue;
				}

				list( $prop, $val ) = preg_split( $this->rcolon, $item, 2 );
				$css .= "\t$prop: $val;\n";
			}

			// Kill that last semicolon at users request
			if ( $this->options['unnecessary-semicolons'] ) {
				$css = preg_replace( "/;\n$/", "\n", $css );
			}

			$css .= "}\n\n";
		}

		return $css;
	}

	/**
	 * Returns medium readability, putting selectors and rule sets on new lines
	 *
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of declarations
	 */ 
	private function medium( $selectors, $details ) {
		$css = '';
		foreach ( $selectors as $k => $v ) {
			if ( strpos( $v, $this->token ) === 0 ) {
				$css .= substr( $v, strlen( $this->token ) );
				$css .= $details[ $k ];
				continue;
			}
			else if ( $details[ $k ] && $details[ $k ] != '' ) {
				$css .= "$v {\n\t" . $details[ $k ] . "\n}\n";
			}
		}

		return $css;
	}

	/**
	 * Returns minimum readability, breaking after every selector and it's rule set
	 *
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of declarations
	 */ 
	private function minimum( $selectors, $details ) {
		$css = '';
		foreach ( $selectors as $k => $v ) {
			if ( strpos( $v, $this->token ) === 0 ) {
				$css .= substr( $v, strlen( $this->token ) );
				$css .= $details[ $k ];
				continue;
			}
			else if ( $details[ $k ] && $details[ $k ] != '' ) {
				$css .= "$v{" . $details[ $k ] . "}\n";
			}
		}

		return $css;
	}
	
	/**
	 * Returns an unreadable, but fully compressed script
	 *
	 * @param (array) selectors: Array of selectors
	 * @param (array) details: Array of declarations
	 */ 
	private function none( $selectors, $details ) {
		$css = '';
		foreach ( $selectors as $k => $v ) {
			if ( strpos( $v, $this->token ) === 0 ) {
				$css .= substr( $v, strlen( $this->token ) );
				$css .= $details[ $k ];
				continue;
			}
			else if ( $details[ $k ] && $details[ $k ] != '' ) {
				$css .= trim( "$v{" . $details[ $k ] . "}" );
			}
		}

		return $css;
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
			throw new CSSCompression_Exception( "Unknown method in Format Class - " . $method );
		}
	}
};

?>
