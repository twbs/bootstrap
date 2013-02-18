# JavaScript CRC 8, 16 and 32.

This is a basic port/copy of the JavaScript CRC implementation. The module works with any CommonJS system supporting `module.exports` notation as well as in the browser. When loaded in the browser, all functions end up under the `window.crc` "namespace".

Original code is taken from http://www.digsys.se/JavaScript/CRC.aspx 

## Functions

The following functions are implemented:

    crc8(String)	#=> Number
    crcArc(String)	#=> Number
    crc16(String)	#=> Number
    fcs16(String)	#=> Number
    crc32(String)	#=> Number
    hex8(Number)	#=> String
    hex16(Number)	#=> String
    hex32(Number)	#=> String

## Installation

	git clone git://github.com/alexgorbatchev/node-crc.git

or

    npm install crc

