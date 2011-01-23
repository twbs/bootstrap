<?php
/**
 * CSS Compressor [VERSION]
 * [DATE]
 * Corey Hart @ http://www.codenothing.com
 */ 

Class CSSCompression_Organize
{
	/**
	 * Organize Patterns
	 *
	 * @class Control: Compression Controller
	 * @param (array) options: Reference to options
	 * @param (regex) rsemicolon: Checks for semicolon without an escape '\' character before it
	 * @param (regex) rlastsemi: Checks for semicolon at the end of the string
	 */
	private $Control;
	private $options = array();
	private $rsemicolon = "/(?<!\\\);/";
	private $rlastsemi = "/(?<!\\\);$/";

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
	 * Look to see if we can combine selectors to reduce the number
	 * of definitions.
	 *
	 * @param (array) selectors: Array of selectors, map directly to details
	 * @param (array) details: Array of rule sets, map directly to selectors
	 */
	public function organize( &$selectors = array(), &$details = array() ) {
		// Combining defns based on similar selectors
		list ( $selectors, $details ) = $this->reduceSelectors( $selectors, $details );

		// Combining defns based on similar details
		list ( $selectors, $details ) = $this->reduceDetails( $selectors, $details );

		// Return in package form
		return array( $selectors, $details );
	}

	/**
	 * Combines multiply defined selectors by merging the rule sets,
	 * latter declarations overide declaratins at top of file
	 *
	 * @param (array) selectors: Array of selectors broken down by setup
	 * @param (array) details: Array of rule sets broken down by setup
	 */ 
	private function reduceSelectors( $selectors, $details ) {
		$keys = array_keys( $selectors );
		$max = array_pop( $keys ) + 1;
		
		for ( $i = 0; $i < $max; $i++ ) {
			if ( ! isset( $selectors[ $i ] ) ) {
				continue;
			}

			for ( $k = $i + 1; $k < $max; $k++ ) {
				if ( ! isset( $selectors[ $k ] ) ) {
					continue;
				}

				if ( $selectors[ $i ] == $selectors[ $k ] ) {
					// Prevent noticies
					if ( ! isset( $details[ $i ] ) ) {
						$details[ $i ] = '';
					}
					if ( ! isset( $details[ $k ] ) ) {
						$details[ $k ] = '';
					}

					// We kill the last semicolon before organization, so account for that.
					if ( $details[ $i ] != '' && $details[ $k ] != '' && ! preg_match( $this->rlastsemi, $details[ $i ] ) ) {
						$details[ $i ] .= ';' . $details[ $k ];
					}
					else {
						$details[ $i ] .= $details[ $k ];
					}

					// Remove the second part
					unset( $selectors[ $k ], $details[ $k ] );
				}
			}
		}

		return array( $selectors, $details );
	}

	/**
	 * Combines multiply defined rule sets by merging the selectors
	 * in comma seperated format
	 *
	 * @param (array) selectors: Array of selectors broken down by setup
	 * @param (array) details: Array of rule sets broken down by setup
	 */ 
	private function reduceDetails( $selectors, $details ) {
		$keys = array_keys( $selectors );
		$max = array_pop( $keys ) + 1;
		for ( $i = 0; $i < $max; $i++ ) {
			if ( ! isset( $selectors[ $i ] ) ) {
				continue;
			}

			$arr = preg_split( $this->rsemicolon, isset( $details[ $i ] ) ? $details[ $i ] : '' );
			for ( $k = $i + 1; $k < $max; $k++ ) {
				if ( ! isset( $selectors[ $k ] ) ) {
					continue;
				}

				$match = preg_split( $this->rsemicolon, isset( $details[ $k ] ) ? $details[ $k ] : '' );
				$x = array_diff( $arr, $match );
				$y = array_diff( $match, $arr );

				if ( count( $x ) < 1 && count( $y ) < 1 ) {
					$selectors[ $i ] .= ',' . $selectors[ $k ];
					unset( $details[ $k ], $selectors[ $k ] );
				}
			}
		}

		return array( $selectors, $details );
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
			throw new CSSCompression_Exception( "Unknown method in Organize Class - " . $method );
		}
	}
};

?>
