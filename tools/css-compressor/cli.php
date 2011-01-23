<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 
require( dirname(__FILE__) . '/CSSCompression.php' );


Class Cli
{
	/**
	 * Cli Patterns
	 *
	 * @param (CSSCompression instance) instance: CSSCompression instance
	 * @param (array) args: Array of command line arguments
	 * @param (array) options: Array of options read from cli arguments
	 * @param (string) mode: Compression mode
	 * @param (string) cwd: Current working directory
	 * @param (string) content: CSS Sheets read
	 * @param (regex) rcss: Matches css file name extension
	 * @param (regex) roption: Matches the longhand options
	 * @param (regex) rsingle: Matches shorthand options
	 * @param (regex) rprefix: Matches absolute paths
	 */
	private $instance;
	private $args = array();
	private $options = array();
	private $mode = 'safe';
	private $cwd = '';
	private $content = '';
	private $rcss = "/\.css$/";
	private $roption = "/^--/i";
	private $rsingle = "/^-/";
	private $rprefix = "/^(\/|\~\/)/";

	/**
	 * Run the compression across files passed to cli
	 *
	 * @param (array) args: Array of argument passed over the command line
	 */
	public function __construct( $args = array() ) {
		$this->args = $args;
		$this->cwd = getcwd() . '/';

		$this->read();
		$this->render();
	}

	/**
	 * Reads the cli arguments and puts them in their place
	 *
	 * @params none
	 */
	public function read(){
		while ( count( $this->args ) ) {
			$arg = array_shift( $this->args );

			if ( preg_match( $this->rcss, $arg ) ) {
				$path = preg_match( $this->rprefix, $arg ) ? $arg : $this->cwd . $arg;
				$this->content .= file_get_contents( $path );
			}
			else if ( substr( $arg, 0, 2 ) == '--' ) {
				$parts = explode( '=', $arg, 2 );
				$name = substr( $parts[ 0 ], 2 );
				$value = isset( $parts[ 1 ] ) ? $parts[ 1 ] : true;

				if ( $name == 'mode' ) {
					$this->mode = $value;
				}
				else {
					$this->options[ $name ] = $value === 'false' ? false : $value;
				}
			}
		}
	}

	/**
	 * Outputs the compression of the content read
	 *
	 * @params none
	 */
	public function render(){
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
new Cli( $_SERVER['argv'] );

?>
