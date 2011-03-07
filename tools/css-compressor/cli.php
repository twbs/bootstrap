<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 
require( dirname(__FILE__) . '/CSSCompression.php' );


Class CSSCompression_Cli
{
	/**
	 * Cli Patterns
	 *
	 * @param (CSSCompression instance) instance: CSSCompression instance
	 * @param (array) args: Array of command line arguments
	 * @param (array) options: Array of options read from cli arguments
	 * @param (boolean) imports: Read import paths from the filesystem, and inject them into the script
	 * @param (string) mode: Compression mode
	 * @param (string) cwd: Current working directory
	 * @param (string) content: CSS Sheets read
	 * @param (regex) rcss: Matches css file name extension
	 * @param (regex) rprefix: Matches absolute paths
	 * @param (regex) rmarker: Marking points in css files when parsing for imports
	 * @param (regex) rquote: Unescaped quote
	 * @param (regex) rsinglequote: Unescaped single quote
	 * @param (regex) rsemicolon: Unescaped semicolon
	 * @param (regex) rimporturl: Import statement in a url() wrapper
	 * @param (regex) rimportstr: Import statement in a string wrapper
	 * @param (regex) rabsolutepath: Absolute path checker for import urls
	 * @param (regex) rfsabsolutepath: Matches absolute paths for the file system
	 */
	private $instance;
	private $args = array();
	private $options = array();
	private $files = array();
	private $imports = true;
	private $mode = 'safe';
	private $cwd = '';
	private $content = '';
	private $rcss = "/\.css$/";
	private $rchopfile= "/\/[^\/]*$/";
	private $rmarker = "/(\/\*|\"|'|@import)/";
	private $rquote = "/(?<!\\\)\"/";
	private $rsinglequote = "/(?<!\\\)'/";
	private $rsemicolon = "/(?<!\\\);/";
	private $rimporturl = "/^@import url\(['\"]?(.*?)['\"]?\)/";
	private $rimportstr = "/^@import ['\"](.*?)['\"]/";
	private $rabsolutepath = "/^(https?:\/\/|\/)/";
	private $rfsabsolutepath = "/^(\/|\~\/|\\\|[a-z]:(\\\|\/)?)/i";

	/**
	 * Run the compression across files passed to cli
	 *
	 * @param (array) args: Array of argument passed over the command line
	 */
	public function __construct( $args = array() ) {
		// Render arguments
		$this->cwd = getcwd() . DIRECTORY_SEPARATOR;
		$this->args = $args;
		$this->read();

		// Run the files through the css compressor
		$this->render();
	}

	/**
	 * Reads the cli arguments and puts them in their place
	 *
	 * @params none
	 */
	private function read(){
		while ( count( $this->args ) ) {
			$arg = array_shift( $this->args );

			// Adding contents of css files
			if ( preg_match( $this->rcss, $arg ) ) {
				// Handle absolute path prefixing
				if ( ! preg_match( $this->rfsabsolutepath, $arg ) && strpos( $arg, $this->cwd ) === false) {
					$path = $this->cwd . $arg;
				}
				else {
					$path = $arg;
				}

				$this->content .= $this->imports( $path );
			}
			// Longhand options
			else if ( substr( $arg, 0, 2 ) == '--' ) {
				$parts = explode( '=', $arg, 2 );
				$name = substr( $parts[ 0 ], 2 );
				$value = isset( $parts[ 1 ] ) ? $parts[ 1 ] : true;

				if ( $name == 'mode' ) {
					$this->mode = $value;
				}
				else if ( $name == 'imports' ) {
					$this->imports = true;
				}
				else {
					// Argument value is passed as string,
					// convert to boolean as needed
					if ( $value == 'false' ) {
						$value = false;
					}
					else if ( $value == 'true' ) {
						$value = true;
					}
					else {
						$value = intval( $value );
					}

					$this->options[ $name ] = $value;
				}
			}
			// Shorthand options
			else if ( substr( $arg, 0, 1 ) == '-' && strlen( $arg ) == 2 ) {
				$char = substr( $arg, 1, 1 );

				if ( $char == 'i' ) {
					$this->imports = true;
				}
			}
		}
	}

	/**
	 * Scans the css file for import defns
	 *
	 * @param (path) file: Path to the stylesheet passed as an argument
	 */
	private function imports( $file ) {
		// Set the content and the directory of the stylesheet
		$content = file_get_contents( $file );
		$cwd = preg_replace( $this->rchopfile, '/', $file );

		// Block import fixing if not set
		if ( $this->imports === false ) {
			return $content;
		}

		$pos = 0;
		while ( preg_match( $this->rmarker, $content, $match, PREG_OFFSET_CAPTURE, $pos ) ) {
			$marker = $match[ 1 ][ 0 ];
			if ( $marker == '/*' ) {
				if ( ( $pos = strpos( $content, '*/', $match[ 1 ][ 1 ] ) ) === false ) {
					break;
				}
			}
			else if ( $marker == '"' ) {
				if ( preg_match( $this->rquote, $content, $m, PREG_OFFSET_CAPTURE, $match[ 1 ][ 1 ] + 1 ) ) {
					$pos = $m[ 0 ][ 1 ] + 2;
				}
				else {
					break;
				}
			}
			else if ( $marker == "'" ) {
				if ( preg_match( $this->rsinglequote, $content, $m, PREG_OFFSET_CAPTURE, $match[ 1 ][ 1 ] + 1 ) ) {
					$pos = $m[ 0 ][ 1 ] + 2;
				}
				else {
					break;
				}
			}
			else if ( $marker == '@import' ) {
				list ( $content, $pos ) = $this->inject( $content, $cwd, $match[ 1 ][ 1 ] );
			}
			else {
				throw new CSSCompression_Exception( 'Unknown Import Error' );
			}
		}

		return $content;
	}

	/**
	 * Replaces the import declaration with it's contents
	 *
	 * @param (string) content: Contents of the stylesheet
	 * @param (path) cwd: Directory of the current stylesheet
	 * @param (int) pos: Position of the import declaration
	 */
	private function inject( $content, $cwd, $pos ) {
		if ( ! preg_match( $this->rsemicolon, $content, $m, PREG_OFFSET_CAPTURE, $pos ) ) {
			throw new CSSCompression_Exception( "@import stmt at character position $pos, has no line-ending semicolon." );
		}
		$import = substr( $content, $pos, $m[ 0 ][ 1 ] + 1 - $pos );

		// Check for valid import stmt, and replace into it the imports contents
		if ( ( preg_match( $this->rimporturl, $import, $m ) || preg_match( $this->rimportstr, $import, $m ) ) && 
			! preg_match( $this->rabsolutepath, $m[ 1 ] ) ) {
				if ( ! file_exists( $cwd . $m[ 1 ] ) ) {
					throw new CSSCompression_Exception( "Import Path '" . $cwd . $m[ 1 ] . "' not found." );
				}
				$content = substr_replace( $content, file_get_contents( $cwd . $m[ 1 ] ), $pos, strlen( $import ) );
		}
		else {
			$pos += strlen( $import );
		}

		return array( $content, $pos );
	}

	/**
	 * Outputs the compression of the content read
	 *
	 * @params none
	 */
	private function render(){
		$this->instance = new CSSCompression();

		if ( $this->mode ) {
			$this->instance->mode( $this->mode );
		}

		if ( $this->options ) {
			$this->instance->option( $this->options );
		}

		echo $this->instance->compress( $this->content );
	}
};

// Auto-initialize the cli script
new CSSCompression_Cli( $_SERVER['argv'] );

?>