<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Trim
{
	/**
	 * Trim Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (array) options: Reference to options
	 * @param (regex) rcmark: Marking point when traversing through sheet for comments
	 * @param (regex) rendcomment: Finds the ending comment point
	 * @param (regex) rendquote: Finds the ending quote point
	 * @param (regex) rendsinglequote: Finds the ending single quote point
	 * @param (array) rescape: Array of patterns of groupings that should be escaped
	 * @param (array) trimmings: Stylesheet trimming patterns/replacements
	 * @param (array) escaped: Array of characters that need to be escaped
	 */
	private $Control;
	private $options = array();
	private $rcmark = "/((?<!\\\)\/\*|(?<!\\\)\"|(?<!\\\)')/";
	private $rendcomment = "/\*\//";
	private $rendquote = "/(?<!\\\)\"/";
	private $rendsinglequote = "/(?<!\\\)'/";
	private $rescape = array(
		"/(url\()([^'\"].*?)(\))/is",
		"/((?<!\\\)\")(.*?)((?<!\\\)\")/s",
		"/((?<!\\\)')(.*?)((?<!\\\)')/s",
	);
	private $trimmings = array(
		'patterns' => array(
			"/(?<!\\\)(\s+)?(?<!\\\)([!,{};>\~\+\/])(?<!\\\)(\s+)?/s", // Remove un-needed spaces around special characters
			"/url\((?<!\\\)\"(.*?)(?<!\\\)\"\)/is", // Remove quotes from urls
			"/url\((?<!\\\)'(.*?)(?<!\\\)'\)/is", // Remove single quotes from urls
			"/url\((.*?)\)/is", // Lowercase url wrapper
			"/(?<!\\\);{2,}/", // Remove unecessary semi-colons
			"/(?<!\\\)\s+/s", // Compress all spaces into single space
		),
		'replacements' => array(
			'$2',
			'url($1)',
			'url($1)',
			'url($1)',
			';',
			' ',
		)
	);
	private $escaped = array(
		'search' => array(
			":",
			";",
			"}",
			"{",
			"@",
			"!",
			",",
			">",
			"+",
			"~",
			"/",
			"*",
			".",
			"=",
			"#",
			"\r",
			"\n",
			"\t",
			" ",
		),
		'replace' => array(
			"\\:",
			"\\;",
			"\\}",
			"\\{",
			"\\@",
			"\\!",
			"\\,",
			"\\>",
			"\\+",
			"\\~",
			"\\/",
			"\\*",
			"\\.",
			"\\=",
			"\\#",
			"\\r",
			"\\n",
			"\\t",
			"\\ ",
		),
	);

	/**
	 * Stash a reference to the controller on each instantiation
	 *
	 * @param (class) control: CSSCompression Controller
	 */
	public function __construct( CSSCompression_Control $control ) {
		$this->Control = $control;
		$this->options = &$control->Option->options;
	}

	/**
	 * Central trim handler
	 *
	 * @param (string) css: Stylesheet to trim
	 */
	public function trim( $css ) {
		$css = $this->comments( $css );
		$css = $this->escape( $css );
		$css = $this->strip( $css );
		return $css;
	}

	/**
	 * Does a quick run through the script to remove all comments from the sheet,
	 *
	 * @param (string) css: Stylesheet to trim
	 */
	private function comments( $css ) {
		$pos = 0;
		while ( preg_match( $this->rcmark, $css, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			switch ( $match[ 1 ][ 0 ] ) {
				// Start of comment block
				case "/*":
					if ( preg_match( $this->rendcomment, $css, $m, PREG_OFFSET_CAPTURE, $match[ 1 ][ 1 ] + 1 ) ) {
						$end = $m[ 0 ][ 1 ] - $match[ 1 ][ 1 ] + strlen( $m[ 0 ][ 0 ] );
						$css = substr_replace( $css, '', $match[ 1 ][ 1 ], $end );
						$pos = $match[ 0 ][ 1 ];
					}
					else {
						$css = substr( $css, 0, $match[ 1 ][ 1 ] );
						break 2;
					}
					break;
				// Start of string
				case "\"":
					if ( preg_match( $this->rendquote, $css, $m, PREG_OFFSET_CAPTURE, $match[ 1 ][ 1 ] + 1 ) ) {
						$pos = $m[ 0 ][ 1 ] + strlen( $m[ 0 ][ 0 ] );
					}
					else {
						break 2;
					}
					break;
				// Start of string
				case "'":
					if ( preg_match( $this->rendsinglequote, $css, $m, PREG_OFFSET_CAPTURE, $match[ 1 ][ 1 ] + 1 ) ) {
						$pos = $m[ 0 ][ 1 ] + strlen( $m[ 0 ][ 0 ] );
					}
					else {
						break 2;
					}
					break;
				// Should have never gotten here
				default:
					break 2;
			}
		}

		return $css;
	}

	/**
	 * Escape out possible splitter characters within urls
	 *
	 * @param (string) css: Full stylesheet
	 */
	private function escape( $css ) {
		foreach ( $this->rescape as $regex ) {
			$start = 0;
			while ( preg_match( $regex, $css, $match, PREG_OFFSET_CAPTURE, $start ) ) {
				$value = $match[ 1 ][ 0 ]
					. str_replace( $this->escaped['search'], $this->escaped['replace'], $match[ 2 ][ 0 ] )
					. $match[ 3 ][ 0 ];
				$css = substr_replace( $css, $value, $match[ 0 ][ 1 ], strlen( $match[ 0 ][ 0 ] ) );
				$start = $match[ 0 ][ 1 ] + strlen( $value ) + 1;
			}
		}

		return $css;
	}

	/**
	 * Runs initial formatting to setup for compression
	 *
	 * @param (string) css: CSS Contents
	 */ 
	private function strip( $css ) {
		// Run replacements
		return trim( preg_replace( $this->trimmings['patterns'], $this->trimmings['replacements'], $css ) );
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
			throw new CSSCompression_Exception( "Unknown method in Trim Class - " . $method );
		}
	}
};

?>
