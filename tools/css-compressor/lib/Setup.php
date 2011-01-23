<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Setup
{
	/**
	 * Trim Patterns
	 *
	 * @class Control: Compression Controller
	 * @class Individuals: Individuals Instance
	 * @instance instance: CSSCompression Instance
	 * @param (string) token: Copy of the injection token
	 * @param (array) options: Reference to options
	 * @param (array) stats: Reference to stats
	 * @param (regex) rsemicolon: Checks for semicolon without an escape '\' character before it
	 * @param (regex) rcolon: Checks for colon without an escape '\' character before it
	 * @param (regex) rbang: Checks for '!' without an escape '\' character before it
	 * @param (regex) rspacebank: Checks for an unescaped space before a bang character
	 * @param (regex) rliner: Matching known 1-line intros
	 * @param (regex) rnested: Matching known subsection handlers
	 * @param (regex) rurl: url wrapper matching
	 * @param (regex) rsinglequote: Checks for unescaped escaped single quote (mouthfull)
	 * @param (array) rsetup: Expanding stylesheet for semi-tokenizing
	 */
	private $Control;
	private $Individuals;
	private $instance;
	private $token = '';
	private $options = array();
	private $stats = array();
	private $rsemicolon = "/(?<!\\\);/";
	private $rcolon = "/(?<!\\\):/";
	private $rbang = "/(?<!\\\)\!/";
	private $rspacebang = "/(?<!\\\)\s\!/";
	private $rliner = "/^@(import|charset|namespace)/i";
	private $rmedia = "/^@media/i";
	private $rurl = "/url\((.*?)\)/";
	private $rsinglequote = "/(?<!\\\)\\\'/";
	private $rsetup = array(
		'patterns' => array(
			"/(?<!\\\){/",
			"/(?<!\\\)}/",
			"/(?<!\\\)@/",
			"/(@(charset|import)[^;]*(?<!\\\);)/",
		),
		'replacements' => array(
			"\n{\n",
			"\n}\n",
			"\n@",
			"$1\n",
		),
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->Individuals = $control->Individuals;
		$this->token = CSSCompression::TOKEN;
		$this->options = &$control->Option->options;
		$this->stats = &$control->stats;
	}

	/**
	 * Setup selector and details arrays for compression methods
	 *
	 * @param (string) css: Trimed stylesheet
	 */ 
	public function setup( $css ) {
		// Seperate the element from the elements details
		$css = explode( "\n", preg_replace( $this->rsetup['patterns'], $this->rsetup['replacements'], $css ) );
		$newline = $this->options['readability'] > CSSCompression::READ_NONE ? "\n" : '';
		$setup = array(
			'selectors' => array(),
			'details' => array(),
			'unknown' => array(),
			'introliner' => '',
			'namespace' => '',
			'import' => '',
			'charset' => '',
		);

		while ( count( $css ) ) {
			$row = trim( array_shift( $css ) );

			if ( $row == '' ) {
				continue;
			}
			// Single block At-Rule set
			else if ( $row[ 0 ] == '@' && $css[ 0 ] == '{' && trim( $css[ 1 ] ) != '' && $css[ 2 ] == '}' ) {
				// Stash selector
				array_push( $setup['selectors'], $row );

				// Stash details (after the opening brace)
				array_push( $setup['details'], $this->details( trim( $css[ 1 ] ) ) );

				// drop the details from the stack
				$css = array_slice( $css, 3 );
			}
			// Single line At-Rules (import/charset/namespace)
			else if ( preg_match( $this->rliner, $row, $match ) ) {
				$setup[ $match[ 1 ] ] .= $this->liner( $row ) . $newline;
			}
			// Nested At-Rule declaration blocks
			else if ( $row[ 0 ] == '@' && $css[ 0 ] == '{' ) {
				// Stash atrule as selector
				array_push( $setup['selectors'], $this->token . $row );

				// Stash details (after the opening brace)
				array_push( $setup['details'], $this->nested( $css, preg_match( $this->rmedia, $row ) ) . $newline );
			}
			// Unknown single line At-Rules
			else if ( $row[ 0 ] == '@' && substr( $row, -1 ) == ';' ) {
				$setup[ 'introliner' ] .= $row . $newline;
			}
			// Declaration Block
			else if ( count( $css ) >= 3 && $css[ 0 ] == '{' && $css[ 2 ] == '}' ) {
				// Stash selector
				array_push( $setup['selectors'], $row );

				// Stash details (after the opening brace)
				array_push( $setup['details'], $this->details( trim( $css[ 1 ] ) ) );

				// drop the details from the stack
				$css = array_slice( $css, 3 );
			}
			// Last catch, store unknown artifacts as selectors with a token
			// and give it an empty rule set
			else {
				// Still add to unknown stack, for notification
				array_push( $setup['unknown'], $row );

				// Stash unknown artifacts as selectors with a token
				array_push( $setup['selectors'], $this->token . $row );

				// Give it an empty rule set
				array_push( $setup['details'], '' );
			}
		}

		return $setup;
	}

	/**
	 * Run nested elements through a separate instance of compression
	 *
	 * @param (array) css: Reference to the original css array
	 * @param (bool) organize: Whether or not to organize the subsection (only true for media sections)
	 */
	private function nested( &$css = array(), $organize = false ) {
		$options = $this->options;
		$left = 0;
		$right = 0;
		$row = '';
		$independent = '';
		$content = '';
		$spacing = '';
		$newline = $this->options['readability'] > CSSCompression::READ_NONE ? "\n" : '';

		// Find the end of the nested section
		while ( count( $css ) && ( $left < 1 || $left > $right ) ) {
			$row = trim( array_shift( $css ) );

			if ( $row == '' ) {
				continue;
			}
			else if ( $row == '{' ) {
				$left++;
			}
			else if ( $row == '}' ) {
				$right++;
			}
			else if ( count( $css ) && substr( $row, 0, 1 ) != '@' && substr( $css[ 0 ], 0, 1 ) == '@' && substr( $row, -1 ) == ';' ) {
				$independent .= $row;
				continue;
			}

			$content .= $row;
		}

		// Ensure copy of instance exists
		if ( ! $this->instance ) {
			$this->instance = new CSSCompression();
		}

		// Fresh start
		$this->instance->reset();

		// Compress the nested section independently after removing the wrapping braces
		// Also make sure to only organize media sections
		if ( $options['organize'] == true && $organize == false ) {
			$options['organize'] = false;
		}
		// Independent sections should be prepended to the next compressed section
		$content = ( $independent == '' ? '' : $independent . $newline )
			. $this->instance->compress( substr( $content, 1, -1 ), $options );

		// Formatting for anything higher then 0 readability
		if ( $newline == "\n" ) {
			$content = "\n\t" . str_replace( "\n", "\n\t", $content ) . "\n";
			$spacing = $this->options['readability'] > CSSCompression::READ_MIN ? ' ' : '';
		}

		// Stash the compressed nested script
		return "$spacing{" . $content . "}$newline";
	}

	/**
	 * Converts import/namespace urls into strings
	 *
	 * @param (string) row: At-rule
	 */
	private function liner( $row ) {
		$pos = 0;
		while ( preg_match( $this->rurl, $row, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$quote = preg_match( $this->rsinglequote, $match[ 1 ][ 0 ] ) ? '"' : "'";
			$replace = $quote . $match[ 1 ][ 0 ] . $quote;
			$row = substr_replace( $row, $replace, $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] ) );
			$pos = $match[ 0 ][ 1 ] + strlen( $replace );
		}

		return $row;
	}

	/**
	 * Run individual compression techniques on each property of a selector
	 *
	 * @param (string) row: Selector properties
	 */
	private function details( $row ) {
		$row = preg_split( $this->rsemicolon, $row );
		$parts = array();
		$details = '';

		foreach ( $row as $line ) {
			// Set loopers
			$parts = preg_split( $this->rcolon, $line, 2 );
			$prop = '';
			$value = '';

			// Property
			if ( isset( $parts[ 0 ] ) && ( $parts[ 0 ] = trim( $parts[ 0 ] ) ) != '' ) {
				$prop = $parts[ 0 ];
			}

			// Value
			if ( isset( $parts[ 1 ] ) && ( $parts[ 1 ] = trim( $parts[ 1 ] ) ) != '' ) {
				$value = preg_replace( $this->rbang, ' !', $parts[ 1 ] );
			}

			// Fail safe, remove unspecified property/values
			if ( $prop == '' || $value == '' ) {
				continue;
			}

			// Run the tag/element through each compression
			list ( $prop, $value ) = $this->Individuals->individuals( $prop, $value );

			// Add counter to before stats
			$this->stats['before']['props']++;

			// Store the compressed element
			$details .= "$prop:" . preg_replace( $this->rspacebang, '!', $value ) . ";";
		}

		return $details;
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
			throw new CSSCompression_Exception( "Unknown method in Setup Class - " . $method );
		}
	}
};

?>
