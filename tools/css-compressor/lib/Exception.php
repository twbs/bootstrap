<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */


Class CSSCompression_Exception extends Exception
{
	/**
	 * Custom exception handler
	 *
	 * @param (string) message: Error message
	 * @param (int) code: Error code
	 * @instance (Exception Instance) previous: Previous exception
	 */
	public function __construct( $message = 'Unknown Exception', $code = 0, Exception $previous = NULL ) {
		parent::__construct( $message, $code, $previous );
	}

	/**
	 * String version of this custom exception
	 *
	 * @params none
	 */
	public function __toString(){
		return "CSSCompression Exception: [" . $this->code . "] " . $this->message . "\n";
	}
};

?>
