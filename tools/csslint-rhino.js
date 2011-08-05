/*! 
CSSLint
Copyright (c) 2011 Nicole Sullivan and Nicholas C. Zakas. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
/* Build time: 5-July-2011 03:16:53 */
var CSSLint = (function(){
/*!
Parser-Lib
Copyright (c) 2009-2011 Nicholas C. Zakas. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
/* Build time: 5-July-2011 03:12:40 */
var parserlib = {};
(function(){

/**
 * A generic base to inherit from for any object
 * that needs event handling.
 * @class EventTarget
 * @constructor
 */
function EventTarget(){

    /**
     * The array of listeners for various events.
     * @type Object
     * @property _listeners
     * @private
     */
    this._listeners = {};    
}

EventTarget.prototype = {

    //restore constructor
    constructor: EventTarget,

    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method addListener
     */
    addListener: function(type, listener){
        if (!this._listeners[type]){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },
    
    /**
     * Fires an event based on the passed-in object.
     * @param {Object|String} event An object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @return {void}
     * @method fire
     */    
    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }
        
        if (!event.type){
            throw new Error("Event object missing 'type' property.");
        }
        
        if (this._listeners[event.type]){
        
            //create a copy of the array and use that so listeners can't chane
            var listeners = this._listeners[event.type].concat();
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }            
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method removeListener
     */
    removeListener: function(type, listener){
        if (this._listeners[type]){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
            
            
        }            
    }
};
/**
 * Convenient way to read through strings.
 * @namespace parserlib.util
 * @class StringReader
 * @constructor
 * @param {String} text The text to read.
 */
function StringReader(text){
    
    /**
     * The input text with line endings normalized.
     * @property _input
     * @type String
     * @private
     */
    this._input = text.replace(/\n\r?/g, "\n");
    
    
    /**
     * The row for the character to be read next.
     * @property _line
     * @type int
     * @private
     */
    this._line = 1;
    
    
    /**
     * The column for the character to be read next.
     * @property _col
     * @type int
     * @private
     */
    this._col = 1;
    
    /**
     * The index of the character in the input to be read next.
     * @property _cursor
     * @type int
     * @private
     */    
    this._cursor = 0;
}

StringReader.prototype = {

    //restore constructor
    constructor: StringReader,
        
    //-------------------------------------------------------------------------
    // Position info
    //-------------------------------------------------------------------------
    
    /**
     * Returns the column of the character to be read next.
     * @return {int} The column of the character to be read next.
     * @method getCol
     */
    getCol: function(){
        return this._col;
    },
    
    /**
     * Returns the row of the character to be read next.
     * @return {int} The row of the character to be read next.
     * @method getLine
     */    
    getLine: function(){
        return this._line ;
    },
    
    /**
     * Determines if you're at the end of the input.
     * @return {Boolean} True if there's no more input, false otherwise.
     * @method eof
     */    
    eof: function(){
        return (this._cursor == this._input.length)
    },
    
    //-------------------------------------------------------------------------
    // Basic reading
    //-------------------------------------------------------------------------
    
    /**
     * Reads the next character without advancing the cursor.
     * @param {int} count How many characters to look ahead (default is 1).
     * @return {String} The next character or null if there is no next character.
     * @method peek
     */
    peek: function(count){
        var c = null;
        count = (typeof count == "undefined" ? 1 : count);
        
        //if we're not at the end of the input...
        if (this._cursor < this._input.length){        
        
            //get character and increment cursor and column
            c = this._input.charAt(this._cursor + count - 1);
        }
        
        return c;
    },        
       
    /**
     * Reads the next character from the input and adjusts the row and column
     * accordingly.
     * @return {String} The next character or null if there is no next character.
     * @method read
     */
    read: function(){
        var c = null;
        
        //if we're not at the end of the input...
        if (this._cursor < this._input.length){
        
            //if the last character was a newline, increment row count
            //and reset column count
            if (this._input.charAt(this._cursor) == "\n"){
                this._line++;
                this._col=1;
            } else {
                this._col++;
            }
        
            //get character and increment cursor and column
            c = this._input.charAt(this._cursor++);
        }
        
        return c;
    },        
       
    //-------------------------------------------------------------------------
    // Misc
    //-------------------------------------------------------------------------
    
    /**
     * Saves the current location so it can be returned to later.
     * @method mark
     * @return {void}
     */
    mark: function(){
        this._bookmark = {
            cursor: this._cursor,
            line:   this._line,
            col:    this._col
        };
    },
    
    reset: function(){
        if (this._bookmark){
            this._cursor = this._bookmark.cursor;
            this._line = this._bookmark.line;
            this._col = this._bookmark.col;
            delete this._bookmark;
        }
    },
    
    //-------------------------------------------------------------------------
    // Advanced reading
    //-------------------------------------------------------------------------
    
    /**
     * Reads up to and including the given string. Throws an error if that
     * string is not found.
     * @param {String} pattern The string to read.
     * @return {String} The string when it is found.
     * @throws Error when the string pattern is not found.
     * @method readTo
     */       
    readTo: function(pattern){
    
        var buffer = "",
            c;

        /*
         * First, buffer must be the same length as the pattern.
         * Then, buffer must end with the pattern or else reach the
         * end of the input.
         */
        while (buffer.length < pattern.length || buffer.lastIndexOf(pattern) != buffer.length - pattern.length){
            c = this.read();
            if (c){
                buffer += c;
            } else {
                throw new Error("Expected \"" + pattern + "\" at line " + this._line  + ", col " + this._col + ".");
            }
        }
        
        return buffer;
    
    },
    
    /**
     * Reads characters while each character causes the given
     * filter function to return true. The function is passed
     * in each character and either returns true to continue
     * reading or false to stop.
     * @param {Function} filter The function to read on each character.
     * @return {String} The string made up of all characters that passed the
     *      filter check.
     * @method readWhile
     */           
    readWhile: function(filter){
        
        var buffer = "",
            c = this.read();
        
        while(c !== null && filter(c)){
            buffer += c;
            c = this.read();
        }
        
        return buffer;
    
    },
    
    /**
     * Reads characters that match either text or a regular expression and
     * returns those characters. If a match is found, the row and column
     * are adjusted; if no match is found, the reader's state is unchanged.
     * reading or false to stop.
     * @param {String|RegExp} matchter If a string, then the literal string
     *      value is searched for. If a regular expression, then any string
     *      matching the pattern is search for.
     * @return {String} The string made up of all characters that matched or
     *      null if there was no match.
     * @method readMatch
     */               
    readMatch: function(matcher){
    
        var source = this._input.substring(this._cursor),
            value = null;
        
        //if it's a string, just do a straight match
        if (typeof matcher == "string"){
            if (source.indexOf(matcher) === 0){
                value = this.readCount(matcher.length); 
            }
        } else if (matcher instanceof RegExp){
            if (matcher.test(source)){
                value = this.readCount(RegExp.lastMatch.length);
            }
        }
        
        return value;        
    },
    
    
    /**
     * Reads a given number of characters. If the end of the input is reached,
     * it reads only the remaining characters and does not throw an error.
     * @param {int} count The number of characters to read.
     * @return {String} The string made up the read characters.
     * @method readCount
     */                   
    readCount: function(count){
        var buffer = "";
        
        while(count--){
            buffer += this.read();
        }
        
        return buffer;
    }

};
/**
 * Type to use when a syntax error occurs.
 * @class SyntaxError
 * @namespace parserlib.util
 * @constructor
 * @param {String} message The error message.
 * @param {int} line The line at which the error occurred.
 * @param {int} col The column at which the error occurred.
 */
function SyntaxError(message, line, col){

    /**
     * The column at which the error occurred.
     * @type int
     * @property col
     */
    this.col = col;

    /**
     * The line at which the error occurred.
     * @type int
     * @property line
     */
    this.line = line;

    /**
     * The text representation of the unit.
     * @type String
     * @property text
     */
    this.message = message;

}

//inherit from Error
SyntaxError.prototype = new Error();
/**
 * Base type to represent a single syntactic unit.
 * @class SyntaxUnit
 * @namespace parserlib.util
 * @constructor
 * @param {String} text The text of the unit.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function SyntaxUnit(text, line, col){


    /**
     * The column of text on which the unit resides.
     * @type int
     * @property col
     */
    this.col = col;

    /**
     * The line of text on which the unit resides.
     * @type int
     * @property line
     */
    this.line = line;

    /**
     * The text representation of the unit.
     * @type String
     * @property text
     */
    this.text = text;

}

/**
 * Create a new syntax unit based solely on the given token.
 * Convenience method for creating a new syntax unit when
 * it represents a single token instead of multiple.
 * @param {Object} token The token object to represent.
 * @return {parserlib.util.SyntaxUnit} The object representing the token.
 * @static
 * @method fromToken
 */
SyntaxUnit.fromToken = function(token){
    return new SyntaxUnit(token.value, token.startLine, token.startCol);
};

SyntaxUnit.prototype = {

    //restore constructor
    constructor: SyntaxUnit,
    
    /**
     * Returns the text representation of the unit.
     * @return {String} The text representation of the unit.
     * @method valueOf
     */
    valueOf: function(){
        return this.toString();
    },
    
    /**
     * Returns the text representation of the unit.
     * @return {String} The text representation of the unit.
     * @method toString
     */
    toString: function(){
        return this.text;
    }

};
/**
 * Generic TokenStream providing base functionality.
 * @class TokenStreamBase
 * @namespace parserlib.util
 * @constructor
 * @param {String|StringReader} input The text to tokenize or a reader from 
 *      which to read the input.
 */
function TokenStreamBase(input, tokenData){

    /**
     * The string reader for easy access to the text.
     * @type StringReader
     * @property _reader
     * @private
     */
    //this._reader = (typeof input == "string") ? new StringReader(input) : input;
    this._reader = input ? new StringReader(input.toString()) : null;
    
    /**
     * Token object for the last consumed token.
     * @type Token
     * @property _token
     * @private
     */
    this._token = null;    
    
    /**
     * The array of token information.
     * @type Array
     * @property _tokenData
     * @private
     */
    this._tokenData = tokenData;
    
    /**
     * Lookahead token buffer.
     * @type Array
     * @property _lt
     * @private
     */
    this._lt = [];
    
    /**
     * Lookahead token buffer index.
     * @type int
     * @property _ltIndex
     * @private
     */
    this._ltIndex = 0;
    
    this._ltIndexCache = [];
}

/**
 * Accepts an array of token information and outputs
 * an array of token data containing key-value mappings
 * and matching functions that the TokenStream needs.
 * @param {Array} tokens An array of token descriptors.
 * @return {Array} An array of processed token data.
 * @method createTokenData
 * @static
 */
TokenStreamBase.createTokenData = function(tokens){

    var nameMap 	= [],
        typeMap 	= {},
		tokenData 	= tokens.concat([]),
		i			= 0,
		len			= tokenData.length+1;
    
    tokenData.UNKNOWN = -1;
	tokenData.unshift({name:"EOF"});

    for (; i < len; i++){
        nameMap.push(tokenData[i].name);
        tokenData[tokenData[i].name] = i;
        if (tokenData[i].text){
            typeMap[tokenData[i].text] = i;
        }
    }
    
    tokenData.name = function(tt){
        return nameMap[tt];
    };
    
    tokenData.type = function(c){
        return typeMap[c];
    };
	
	return tokenData;
};

TokenStreamBase.prototype = {

    //restore constructor
    constructor: TokenStreamBase,    
    
    //-------------------------------------------------------------------------
    // Matching methods
    //-------------------------------------------------------------------------
    
    /**
     * Determines if the next token matches the given token type.
     * If so, that token is consumed; if not, the token is placed
     * back onto the token stream. You can pass in any number of
     * token types and this will return true if any of the token
     * types is found.
     * @param {int|int[]} tokenTypes Either a single token type or an array of
     *      token types that the next token might be. If an array is passed,
     *      it's assumed that the token can be any of these.
     * @param {variant} channel (Optional) The channel to read from. If not
     *      provided, reads from the default (unnamed) channel.
     * @return {Boolean} True if the token type matches, false if not.
     * @method match
     */
    match: function(tokenTypes, channel){
    
        //always convert to an array, makes things easier
        if (!(tokenTypes instanceof Array)){
            tokenTypes = [tokenTypes];
        }
                
        var tt  = this.get(channel),
            i   = 0,
            len = tokenTypes.length;
            
        while(i < len){
            if (tt == tokenTypes[i++]){
                return true;
            }
        }
        
        //no match found, put the token back
        this.unget();
        return false;
    },    
    
    /**
     * Determines if the next token matches the given token type.
     * If so, that token is consumed; if not, an error is thrown.
     * @param {int|int[]} tokenTypes Either a single token type or an array of
     *      token types that the next token should be. If an array is passed,
     *      it's assumed that the token must be one of these.
     * @param {variant} channel (Optional) The channel to read from. If not
     *      provided, reads from the default (unnamed) channel.
     * @return {void}
     * @method mustMatch
     */    
    mustMatch: function(tokenTypes, channel){

        //always convert to an array, makes things easier
        if (!(tokenTypes instanceof Array)){
            tokenTypes = [tokenTypes];
        }

        if (!this.match.apply(this, arguments)){    
            token = this.LT(1);
            throw new SyntaxError("Expected " + this._tokenData[tokenTypes[0]].name + 
                " at line " + token.startLine + ", character " + token.startCol + ".", token.startLine, token.startCol);
        }
    },
    
    //-------------------------------------------------------------------------
    // Consuming methods
    //-------------------------------------------------------------------------
    
    /**
     * Keeps reading from the token stream until either one of the specified
     * token types is found or until the end of the input is reached.
     * @param {int|int[]} tokenTypes Either a single token type or an array of
     *      token types that the next token should be. If an array is passed,
     *      it's assumed that the token must be one of these.
     * @param {variant} channel (Optional) The channel to read from. If not
     *      provided, reads from the default (unnamed) channel.
     * @return {void}
     * @method advance
     */
    advance: function(tokenTypes, channel){
        
        while(this.LA(0) != 0 && !this.match(tokenTypes, channel)){
            this.get();
        }

        return this.LA(0);    
    },
    
    /**
     * Consumes the next token from the token stream. 
     * @return {int} The token type of the token that was just consumed.
     * @method get
     */      
    get: function(channel){
    
        var tokenInfo   = this._tokenData,
            reader      = this._reader,
            value,
            i           =0,
            len         = tokenInfo.length,
            found       = false,
            token,
            info;
            
        //check the lookahead buffer first
        if (this._lt.length && this._ltIndex >= 0 && this._ltIndex < this._lt.length){  
                           
            i++;
            this._token = this._lt[this._ltIndex++];
            info = tokenInfo[this._token.type];
            
            //obey channels logic
            while((info.channel !== undefined && channel !== info.channel) &&
                    this._ltIndex < this._lt.length){
                this._token = this._lt[this._ltIndex++];
                info = tokenInfo[this._token.type];
                i++;
            }
            
            //here be dragons
            if ((info.channel === undefined || channel === info.channel) &&
                    this._ltIndex <= this._lt.length){
                this._ltIndexCache.push(i);
                return this._token.type;
            }
        }
        
        //call token retriever method
		token = this._getToken();

        //if it should be hidden, don't save a token
        if (token.type > -1 && !tokenInfo[token.type].hide){
                     
            //apply token channel
            token.channel = tokenInfo[token.type].channel;
         
            //save for later
            this._token = token;
            this._lt.push(token);

            //save space that will be moved (must be done before array is truncated)
            this._ltIndexCache.push(this._lt.length - this._ltIndex + i);  
        
            //keep the buffer under 5 items
            if (this._lt.length > 5){
                this._lt.shift();                
            }
            
            //also keep the shift buffer under 5 items
            if (this._ltIndexCache.length > 5){
                this._ltIndexCache.shift();
            }
                
            //update lookahead index
            this._ltIndex = this._lt.length;
        }
            
        /*
         * Skip to the next token if:
         * 1. The token type is marked as hidden.
         * 2. The token type has a channel specified and it isn't the current channel.
         */
        info = tokenInfo[token.type];
        if (info && 
                (info.hide || 
                (info.channel !== undefined && channel !== info.channel))){
            return this.get(channel);
        } else {
            //return just the type
            return token.type;
        }
    },
    
    /**
     * Looks ahead a certain number of tokens and returns the token type at
     * that position. This will throw an error if you lookahead past the
     * end of input, past the size of the lookahead buffer, or back past
     * the first token in the lookahead buffer.
     * @param {int} The index of the token type to retrieve. 0 for the
     *      current token, 1 for the next, -1 for the previous, etc.
     * @return {int} The token type of the token in the given position.
     * @method LA
     */
    LA: function(index){
        var total = index,
            tt;
        if (index > 0){
            //TODO: Store 5 somewhere
            if (index > 5){
                throw new Error("Too much lookahead.");
            }
        
            //get all those tokens
            while(total){
                tt = this.get();   
                total--;                            
            }
            
            //unget all those tokens
            while(total < index){
                this.unget();
                total++;
            }
        } else if (index < 0){
        
            if(this._lt[this._ltIndex+index]){
                tt = this._lt[this._ltIndex+index].type;
            } else {
                throw new Error("Too much lookbehind.");
            }
        
        } else {
            tt = this._token.type;
        }
        
        return tt;
    
    },
    
    /**
     * Looks ahead a certain number of tokens and returns the token at
     * that position. This will throw an error if you lookahead past the
     * end of input, past the size of the lookahead buffer, or back past
     * the first token in the lookahead buffer.
     * @param {int} The index of the token type to retrieve. 0 for the
     *      current token, 1 for the next, -1 for the previous, etc.
     * @return {Object} The token of the token in the given position.
     * @method LA
     */    
    LT: function(index){
    
        //lookahead first to prime the token buffer
        this.LA(index);
        
        //now find the token, subtract one because _ltIndex is already at the next index
        return this._lt[this._ltIndex+index-1];    
    },
    
    /**
     * Returns the token type for the next token in the stream without 
     * consuming it.
     * @return {int} The token type of the next token in the stream.
     * @method peek
     */
    peek: function(){
        return this.LA(1);
    },
    
    /**
     * Returns the actual token object for the last consumed token.
     * @return {Token} The token object for the last consumed token.
     * @method token
     */
    token: function(){
        return this._token;
    },
    
    /**
     * Returns the name of the token for the given token type.
     * @param {int} tokenType The type of token to get the name of.
     * @return {String} The name of the token or "UNKNOWN_TOKEN" for any
     *      invalid token type.
     * @method tokenName
     */
    tokenName: function(tokenType){
        if (tokenType < 0 || tokenType > this._tokenData.length){
            return "UNKNOWN_TOKEN";
        } else {
            return this._tokenData[tokenType].name;
        }
    },
    
    /**
     * Returns the token type value for the given token name.
     * @param {String} tokenName The name of the token whose value should be returned.
     * @return {int} The token type value for the given token name or -1
     *      for an unknown token.
     * @method tokenName
     */    
    tokenType: function(tokenName){
        return this._tokenData[tokenName] || -1;
    },
    
    /**
     * Returns the last consumed token to the token stream.
     * @method unget
     */      
    unget: function(){
        //if (this._ltIndex > -1){
        if (this._ltIndexCache.length){
            this._ltIndex -= this._ltIndexCache.pop();//--;
            this._token = this._lt[this._ltIndex - 1];
        } else {
            throw new Error("Too much lookahead.");
        }
    }

};


parserlib.util = {
StringReader: StringReader,
SyntaxError : SyntaxError,
SyntaxUnit  : SyntaxUnit,
EventTarget : EventTarget,
TokenStreamBase : TokenStreamBase
};
})();
/* 
Parser-Lib
Copyright (c) 2009-2011 Nicholas C. Zakas. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
/* Build time: 5-July-2011 03:12:40 */
(function(){
var EventTarget = parserlib.util.EventTarget,
TokenStreamBase = parserlib.util.TokenStreamBase,
StringReader = parserlib.util.StringReader,
SyntaxError = parserlib.util.SyntaxError,
SyntaxUnit  = parserlib.util.SyntaxUnit;

var Colors = {
    aliceblue       :"#f0f8ff",
    antiquewhite    :"#faebd7",
    aqua            :"#00ffff",
    aquamarine      :"#7fffd4",
    azure           :"#f0ffff",
    beige           :"#f5f5dc",
    bisque          :"#ffe4c4",
    black           :"#000000",
    blanchedalmond  :"#ffebcd",
    blue            :"#0000ff",
    blueviolet      :"#8a2be2",
    brown           :"#a52a2a",
    burlywood       :"#deb887",
    cadetblue       :"#5f9ea0",
    chartreuse      :"#7fff00",
    chocolate       :"#d2691e",
    coral           :"#ff7f50",
    cornflowerblue  :"#6495ed",
    cornsilk        :"#fff8dc",
    crimson         :"#dc143c",
    cyan            :"#00ffff",
    darkblue        :"#00008b",
    darkcyan        :"#008b8b",
    darkgoldenrod   :"#b8860b",
    darkgray        :"#a9a9a9",
    darkgreen       :"#006400",
    darkkhaki       :"#bdb76b",
    darkmagenta     :"#8b008b",
    darkolivegreen  :"#556b2f",
    darkorange      :"#ff8c00",
    darkorchid      :"#9932cc",
    darkred         :"#8b0000",
    darksalmon      :"#e9967a",
    darkseagreen    :"#8fbc8f",
    darkslateblue   :"#483d8b",
    darkslategray   :"#2f4f4f",
    darkturquoise   :"#00ced1",
    darkviolet      :"#9400d3",
    deeppink        :"#ff1493",
    deepskyblue     :"#00bfff",
    dimgray         :"#696969",
    dodgerblue      :"#1e90ff",
    firebrick       :"#b22222",
    floralwhite     :"#fffaf0",
    forestgreen     :"#228b22",
    fuchsia         :"#ff00ff",
    gainsboro       :"#dcdcdc",
    ghostwhite      :"#f8f8ff",
    gold            :"#ffd700",
    goldenrod       :"#daa520",
    gray            :"#808080",
    green           :"#008000",
    greenyellow     :"#adff2f",
    honeydew        :"#f0fff0",
    hotpink         :"#ff69b4",
    indianred       :"#cd5c5c",
    indigo          :"#4b0082",
    ivory           :"#fffff0",
    khaki           :"#f0e68c",
    lavender        :"#e6e6fa",
    lavenderblush   :"#fff0f5",
    lawngreen       :"#7cfc00",
    lemonchiffon    :"#fffacd",
    lightblue       :"#add8e6",
    lightcoral      :"#f08080",
    lightcyan       :"#e0ffff",
    lightgoldenrodyellow  :"#fafad2",
    lightgrey       :"#d3d3d3",
    lightgreen      :"#90ee90",
    lightpink       :"#ffb6c1",
    lightsalmon     :"#ffa07a",
    lightseagreen   :"#20b2aa",
    lightskyblue    :"#87cefa",
    lightslategray  :"#778899",
    lightsteelblue  :"#b0c4de",
    lightyellow     :"#ffffe0",
    lime            :"#00ff00",
    limegreen       :"#32cd32",
    linen           :"#faf0e6",
    magenta         :"#ff00ff",
    maroon          :"#800000",
    mediumaquamarine:"#66cdaa",
    mediumblue      :"#0000cd",
    mediumorchid    :"#ba55d3",
    mediumpurple    :"#9370d8",
    mediumseagreen  :"#3cb371",
    mediumslateblue :"#7b68ee",
    mediumspringgreen   :"#00fa9a",
    mediumturquoise :"#48d1cc",
    mediumvioletred :"#c71585",
    midnightblue    :"#191970",
    mintcream       :"#f5fffa",
    mistyrose       :"#ffe4e1",
    moccasin        :"#ffe4b5",
    navajowhite     :"#ffdead",
    navy            :"#000080",
    oldlace         :"#fdf5e6",
    olive           :"#808000",
    olivedrab       :"#6b8e23",
    orange          :"#ffa500",
    orangered       :"#ff4500",
    orchid          :"#da70d6",
    palegoldenrod   :"#eee8aa",
    palegreen       :"#98fb98",
    paleturquoise   :"#afeeee",
    palevioletred   :"#d87093",
    papayawhip      :"#ffefd5",
    peachpuff       :"#ffdab9",
    peru            :"#cd853f",
    pink            :"#ffc0cb",
    plum            :"#dda0dd",
    powderblue      :"#b0e0e6",
    purple          :"#800080",
    red             :"#ff0000",
    rosybrown       :"#bc8f8f",
    royalblue       :"#4169e1",
    saddlebrown     :"#8b4513",
    salmon          :"#fa8072",
    sandybrown      :"#f4a460",
    seagreen        :"#2e8b57",
    seashell        :"#fff5ee",
    sienna          :"#a0522d",
    silver          :"#c0c0c0",
    skyblue         :"#87ceeb",
    slateblue       :"#6a5acd",
    slategray       :"#708090",
    snow            :"#fffafa",
    springgreen     :"#00ff7f",
    steelblue       :"#4682b4",
    tan             :"#d2b48c",
    teal            :"#008080",
    thistle         :"#d8bfd8",
    tomato          :"#ff6347",
    turquoise       :"#40e0d0",
    violet          :"#ee82ee",
    wheat           :"#f5deb3",
    white           :"#ffffff",
    whitesmoke      :"#f5f5f5",
    yellow          :"#ffff00",
    yellowgreen     :"#9acd32"
};
/**
 * Represents a selector combinator (whitespace, +, >).
 * @namespace parserlib.css
 * @class Combinator
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {String} text The text representation of the unit. 
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function Combinator(text, line, col){
    
    SyntaxUnit.call(this, text, line, col);

    /**
     * The type of modifier.
     * @type String
     * @property type
     */
    this.type = "unknown";
    
    //pretty simple
    if (/^\s+$/.test(text)){
        this.type = "descendant";
    } else if (text == ">"){
        this.type = "child";
    } else if (text == "+"){
        this.type = "adjacent-sibling";
    } else if (text == "~"){
        this.type = "sibling";
    }

}

Combinator.prototype = new SyntaxUnit();
Combinator.prototype.constructor = Combinator;


var Level1Properties = {

    "background": 1,
    "background-attachment": 1,
    "background-color": 1,
    "background-image": 1,
    "background-position": 1,
    "background-repeat": 1,
 
    "border": 1,
    "border-bottom": 1,
    "border-bottom-width": 1,
    "border-color": 1,
    "border-left": 1,
    "border-left-width": 1,
    "border-right": 1,
    "border-right-width": 1,
    "border-style": 1,
    "border-top": 1,
    "border-top-width": 1,
    "border-width": 1,
 
    "clear": 1,
    "color": 1,
    "display": 1,
    "float": 1,
 
    "font": 1,
    "font-family": 1,
    "font-size": 1,
    "font-style": 1,
    "font-variant": 1,
    "font-weight": 1,
 
    "height": 1,
    "letter-spacing": 1,
    "line-height": 1,
 
    "list-style": 1,
    "list-style-image": 1,
    "list-style-position": 1,
    "list-style-type": 1,
 
    "margin": 1,
    "margin-bottom": 1,
    "margin-left": 1,
    "margin-right": 1,
    "margin-top": 1,
 
    "padding": 1,
    "padding-bottom": 1,
    "padding-left": 1,
    "padding-right": 1,
    "padding-top": 1,
 
    "text-align": 1,
    "text-decoration": 1,
    "text-indent": 1,
    "text-transform": 1,
 
    "vertical-align": 1,
    "white-space": 1,
    "width": 1,
    "word-spacing": 1
    
};

var Level2Properties = {

    //Aural
    "azimuth": 1,
    "cue-after": 1,
    "cue-before": 1,
    "cue": 1,
    "elevation": 1,
    "pause-after": 1,
    "pause-before": 1,
    "pause": 1,
    "pitch-range": 1,
    "pitch": 1,
    "play-during": 1,
    "richness": 1,
    "speak-header": 1,
    "speak-numeral": 1,
    "speak-punctuation": 1,
    "speak": 1,
    "speech-rate": 1,
    "stress": 1,
    "voice-family": 1,
    "volume": 1,
    
    //Paged
    "orphans": 1,
    "page-break-after": 1,
    "page-break-before": 1,
    "page-break-inside": 1,
    "widows": 1,

    //Interactive
    "cursor": 1,
    "outline-color": 1,
    "outline-style": 1,
    "outline-width": 1,
    "outline": 1,    
    
    //Visual
    "background-attachment": 1,
    "background-color": 1,
    "background-image": 1,
    "background-position": 1,
    "background-repeat": 1,
    "background": 1,    
    "border-collapse": 1,
    "border-color": 1,
    "border-spacing": 1,
    "border-style": 1,
    "border-top": 1,
    "border-top-color": 1,
    "border-top-style": 1,
    "border-top-width": 1,
    "border-width": 1,
    "border": 1,
    "bottom": 1,    
    "caption-side": 1,
    "clear": 1,
    "clip": 1,
    "color": 1,
    "content": 1,
    "counter-increment": 1,
    "counter-reset": 1,
    "direction": 1,
    "display": 1,
    "empty-cells": 1,
    "float": 1,
    "font-family": 1,
    "font-size": 1,
    "font-style": 1,
    "font-variant": 1,
    "font-weight": 1,
    "font": 1,
    "height": 1,
    "left": 1,
    "letter-spacing": 1,
    "line-height": 1,
    "list-style-image": 1,
    "list-style-position": 1,
    "list-style-type": 1,
    "list-style": 1,
    "margin-right": 1,
    "margin-top": 1,
    "margin": 1,
    "max-height": 1,
    "max-width": 1,
    "min-height": 1,
    "min-width": 1,
    "overflow": 1,
    "padding-top": 1,
    "padding": 1,
    "position": 1,
    "quotes": 1,
    "right": 1,
    "table-layout": 1,
    "text-align": 1,
    "text-decoration": 1,
    "text-indent": 1,
    "text-transform": 1,
    "top": 1,
    "unicode-bidi": 1,
    "vertical-align": 1,
    "visibility": 1,
    "white-space": 1,
    "width": 1,
    "word-spacing": 1,
    "z-index": 1
};
/**
 * Represents a media feature, such as max-width:500.
 * @namespace parserlib.css
 * @class MediaFeature
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {SyntaxUnit} name The name of the feature.
 * @param {SyntaxUnit} value The value of the feature or null if none.
 */
function MediaFeature(name, value){
    
    SyntaxUnit.call(this, "(" + name + (value !== null ? ":" + value : "") + ")", name.startLine, name.startCol);

    /**
     * The name of the media feature
     * @type String
     * @property name
     */
    this.name = name;

    /**
     * The value for the feature or null if there is none.
     * @type SyntaxUnit
     * @property value
     */
    this.value = value;
}

MediaFeature.prototype = new SyntaxUnit();
MediaFeature.prototype.constructor = MediaFeature;

/**
 * Represents an individual media query.
 * @namespace parserlib.css
 * @class MediaQuery
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {String} modifier The modifier "not" or "only" (or null).
 * @param {String} mediaType The type of media (i.e., "print").
 * @param {Array} parts Array of selectors parts making up this selector.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function MediaQuery(modifier, mediaType, features, line, col){
    
    SyntaxUnit.call(this, (modifier ? modifier + " ": "") + (mediaType ? mediaType + " " : "") + features.join(" and "), line, col);

    /**
     * The media modifier ("not" or "only")
     * @type String
     * @property modifier
     */
    this.modifier = modifier;

    /**
     * The mediaType (i.e., "print")
     * @type String
     * @property mediaType
     */
    this.mediaType = mediaType;    
    
    /**
     * The parts that make up the selector.
     * @type Array
     * @property features
     */
    this.features = features;

}

MediaQuery.prototype = new SyntaxUnit();
MediaQuery.prototype.constructor = MediaQuery;

/**
 * A CSS3 parser.
 * @namespace parserlib.css
 * @class Parser
 * @constructor
 * @param {Object} options (Optional) Various options for the parser:
 *      starHack (true|false) to allow IE6 star hack as valid,
 *      underscoreHack (true|false) to interpret leading underscores
 *      as IE6-7 targeting for known properties, ieFilters (true|false)
 *      to indicate that IE < 8 filters should be accepted and not throw
 *      syntax errors.
 */
function Parser(options){

    //inherit event functionality
    EventTarget.call(this);


    this.options = options || {};

    this._tokenStream = null;
}

Parser.prototype = function(){

    var proto = new EventTarget(),  //new prototype
        prop,
        additions =  {
        
            //restore constructor
            constructor: Parser,
        
            //-----------------------------------------------------------------
            // Grammar
            //-----------------------------------------------------------------
        
            _stylesheet: function(){
            
                /*
                 * stylesheet
                 *  : [ CHARSET_SYM S* STRING S* ';' ]?
                 *    [S|CDO|CDC]* [ import [S|CDO|CDC]* ]*
                 *    [ namespace [S|CDO|CDC]* ]*
                 *    [ [ ruleset | media | page | font_face ] [S|CDO|CDC]* ]*
                 *  ;
                 */ 
               
                var tokenStream = this._tokenStream,
                    charset     = null,
                    token,
                    tt;
                    
                this.fire("startstylesheet");
            
                //try to read character set
                this._charset();
                
                this._skipCruft();

                //try to read imports - may be more than one
                while (tokenStream.peek() == Tokens.IMPORT_SYM){
                    this._import();
                    this._skipCruft();
                }
                
                //try to read namespaces - may be more than one
                while (tokenStream.peek() == Tokens.NAMESPACE_SYM){
                    this._namespace();
                    this._skipCruft();
                }
                
                //get the next token
                tt = tokenStream.peek();
                
                //try to read the rest
                while(tt > Tokens.EOF){
                
                    try {
                
                        switch(tt){
                            case Tokens.MEDIA_SYM:
                                this._media();
                                this._skipCruft();
                                break;
                            case Tokens.PAGE_SYM:
                                this._page(); 
                                this._skipCruft();
                                break;                   
                            case Tokens.FONT_FACE_SYM:
                                this._font_face(); 
                                this._skipCruft();
                                break;  
                            case Tokens.S:
                                this._readWhitespace();
                                break;
                            default:                            
                                if(!this._ruleset()){
                                
                                    //error handling for known issues
                                    switch(tt){
                                        case Tokens.CHARSET_SYM:
                                            token = tokenStream.LT(1);
                                            this._charset(false);
                                            throw new SyntaxError("@charset not allowed here.", token.startLine, token.startCol);
                                        case Tokens.IMPORT_SYM:
                                            token = tokenStream.LT(1);
                                            this._import(false);
                                            throw new SyntaxError("@import not allowed here.", token.startLine, token.startCol);
                                        case Tokens.NAMESPACE_SYM:
                                            token = tokenStream.LT(1);
                                            this._namespace(false);
                                            throw new SyntaxError("@namespace not allowed here.", token.startLine, token.startCol);
                                        default:
                                            tokenStream.get();  //get the last token
                                            this._unexpectedToken(tokenStream.token());
                                    }
                                
                                }
                        }
                    } catch(ex) {
                        if (ex instanceof SyntaxError && !this.options.strict){
                            this.fire({
                                type:       "error",
                                error:      ex,
                                message:    ex.message,
                                line:       ex.line,
                                col:        ex.col
                            });                     
                        } else {
                            throw ex;
                        }
                    }
                    
                    tt = tokenStream.peek();
                }
                
                if (tt != Tokens.EOF){
                    this._unexpectedToken(tokenStream.token());
                }
            
                this.fire("endstylesheet");
            },
            
            _charset: function(emit){
                var tokenStream = this._tokenStream,
                    charset,
                    token,
                    line,
                    col;
                    
                if (tokenStream.match(Tokens.CHARSET_SYM)){
                    line = tokenStream.token().startLine;
                    col = tokenStream.token().startCol;
                
                    this._readWhitespace();
                    tokenStream.mustMatch(Tokens.STRING);
                    
                    token = tokenStream.token();
                    charset = token.value;
                    
                    this._readWhitespace();
                    tokenStream.mustMatch(Tokens.SEMICOLON);
                    
                    if (emit !== false){
                        this.fire({ 
                            type:   "charset",
                            charset:charset,
                            line:   line,
                            col:    col
                        });
                    }
                }            
            },
            
            _import: function(emit){
                /*
                 * import
                 *   : IMPORT_SYM S*
                 *    [STRING|URI] S* media_query_list? ';' S*
                 */    
            
                var tokenStream = this._tokenStream,
                    tt,
                    uri,
                    importToken,
                    mediaList   = [];
                
                //read import symbol
                tokenStream.mustMatch(Tokens.IMPORT_SYM);
                importToken = tokenStream.token();
                this._readWhitespace();
                
                tokenStream.mustMatch([Tokens.STRING, Tokens.URI]);
                
                //grab the URI value
                uri = tokenStream.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1");                

                this._readWhitespace();
                
                mediaList = this._media_query_list();
                
                //must end with a semicolon
                tokenStream.mustMatch(Tokens.SEMICOLON);
                this._readWhitespace();
                
                if (emit !== false){
                    this.fire({
                        type:   "import",
                        uri:    uri,
                        media:  mediaList,
                        line:   importToken.startLine,
                        col:    importToken.startCol
                    });
                }
        
            },
            
            _namespace: function(emit){
                /*
                 * namespace
                 *   : NAMESPACE_SYM S* [namespace_prefix S*]? [STRING|URI] S* ';' S*
                 */    
            
                var tokenStream = this._tokenStream,
                    line,
                    col,
                    prefix,
                    uri;
                
                //read import symbol
                tokenStream.mustMatch(Tokens.NAMESPACE_SYM);
                line = tokenStream.token().startLine;
                col = tokenStream.token().startCol;
                this._readWhitespace();
                
                //it's a namespace prefix - no _namespace_prefix() method because it's just an IDENT
                if (tokenStream.match(Tokens.IDENT)){
                    prefix = tokenStream.token().value;
                    this._readWhitespace();
                }
                
                tokenStream.mustMatch([Tokens.STRING, Tokens.URI]);
                /*if (!tokenStream.match(Tokens.STRING)){
                    tokenStream.mustMatch(Tokens.URI);
                }*/
                
                //grab the URI value
                uri = tokenStream.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1");                

                this._readWhitespace();

                //must end with a semicolon
                tokenStream.mustMatch(Tokens.SEMICOLON);
                this._readWhitespace();
                
                if (emit !== false){
                    this.fire({
                        type:   "namespace",
                        prefix: prefix,
                        uri:    uri,
                        line:   line,
                        col:    col
                    });
                }
        
            },            
                       
            _media: function(){
                /*
                 * media
                 *   : MEDIA_SYM S* media_query_list S* '{' S* ruleset* '}' S*
                 *   ;
                 */
                var tokenStream     = this._tokenStream,
                    line,
                    col,
                    mediaList;//       = [];
                
                //look for @media
                tokenStream.mustMatch(Tokens.MEDIA_SYM);
                line = tokenStream.token().startLine;
                col = tokenStream.token().startCol;
                
                this._readWhitespace();               

                mediaList = this._media_query_list();

                tokenStream.mustMatch(Tokens.LBRACE);
                this._readWhitespace();
                
                this.fire({
                    type:   "startmedia",
                    media:  mediaList,
                    line:   line,
                    col:    col
                });
                
                while(true) {
                    if (tokenStream.peek() == Tokens.PAGE_SYM){
                        this._page();
                    } else if (!this._ruleset()){
                        break;
                    }                
                }
                
                tokenStream.mustMatch(Tokens.RBRACE);
                this._readWhitespace();
        
                this.fire({
                    type:   "endmedia",
                    media:  mediaList,
                    line:   line,
                    col:    col
                });
            },                           
        

            //CSS3 Media Queries
            _media_query_list: function(){
                /*
                 * media_query_list
                 *   : S* [media_query [ ',' S* media_query ]* ]?
                 *   ;
                 */
                var tokenStream = this._tokenStream,
                    mediaList   = [];
                
                
                this._readWhitespace();
                
                if (tokenStream.peek() == Tokens.IDENT || tokenStream.peek() == Tokens.LPAREN){
                    mediaList.push(this._media_query());
                }
                
                while(tokenStream.match(Tokens.COMMA)){
                    this._readWhitespace();
                    mediaList.push(this._media_query());
                }
                
                return mediaList;
            },
            
            /*
             * Note: "expression" in the grammar maps to the _media_expression
             * method.
             
             */
            _media_query: function(){
                /*
                 * media_query
                 *   : [ONLY | NOT]? S* media_type S* [ AND S* expression ]*
                 *   | expression [ AND S* expression ]*
                 *   ;
                 */
                var tokenStream = this._tokenStream,
                    type        = null,
                    ident       = null,
                    token       = null,
                    expressions = [];
                    
                if (tokenStream.match(Tokens.IDENT)){
                    ident = tokenStream.token().value.toLowerCase();
                    
                    //since there's no custom tokens for these, need to manually check
                    if (ident != "only" && ident != "not"){
                        tokenStream.unget();
                        ident = null;
                    } else {
                        token = tokenStream.token();
                    }
                }
                                
                this._readWhitespace();
                
                if (tokenStream.peek() == Tokens.IDENT){
                    type = this._media_type();
                    if (token === null){
                        token = tokenStream.token();
                    }
                } else if (tokenStream.peek() == Tokens.LPAREN){
                    if (token === null){
                        token = tokenStream.LT(1);
                    }
                    expressions.push(this._media_expression());
                }                               
                
                if (type === null && expressions.length === 0){
                    return null;
                } else {                
                    this._readWhitespace();
                    while (tokenStream.match(Tokens.IDENT)){
                        if (tokenStream.token().value.toLowerCase() != "and"){
                            this._unexpectedToken(tokenStream.token());
                        }
                        
                        this._readWhitespace();
                        expressions.push(this._media_expression());
                    }
                }

                return new MediaQuery(ident, type, expressions, token.startLine, token.startCol);
            },

            //CSS3 Media Queries
            _media_type: function(){
                /*
                 * media_type
                 *   : IDENT
                 *   ;
                 */
                return this._media_feature();           
            },

            /**
             * Note: in CSS3 Media Queries, this is called "expression".
             * Renamed here to avoid conflict with CSS3 Selectors
             * definition of "expression". Also note that "expr" in the
             * grammar now maps to "expression" from CSS3 selectors.
             * @method _media_expression
             * @private
             */
            _media_expression: function(){
                /*
                 * expression
                 *  : '(' S* media_feature S* [ ':' S* expr ]? ')' S*
                 *  ;
                 */
                var tokenStream = this._tokenStream,
                    feature     = null,
                    token,
                    expression  = null;
                
                tokenStream.mustMatch(Tokens.LPAREN);
                
                feature = this._media_feature();
                this._readWhitespace();
                
                if (tokenStream.match(Tokens.COLON)){
                    this._readWhitespace();
                    token = tokenStream.LT(1);
                    expression = this._expression();
                }
                
                tokenStream.mustMatch(Tokens.RPAREN);
                this._readWhitespace();

                return new MediaFeature(feature, (expression ? new SyntaxUnit(expression, token.startLine, token.startCol) : null));            
            },

            //CSS3 Media Queries
            _media_feature: function(){
                /*
                 * media_feature
                 *   : IDENT
                 *   ;
                 */
                var tokenStream = this._tokenStream;
                    
                tokenStream.mustMatch(Tokens.IDENT);
                
                return SyntaxUnit.fromToken(tokenStream.token());            
            },
            
            //CSS3 Paged Media
            _page: function(){
                /*
                 * page:
                 *    PAGE_SYM S* IDENT? pseudo_page? S* 
                 *    '{' S* [ declaration | margin ]? [ ';' S* [ declaration | margin ]? ]* '}' S*
                 *    ;
                 */            
                var tokenStream = this._tokenStream,
                    line,
                    col,
                    identifier  = null,
                    pseudoPage  = null;
                
                //look for @page
                tokenStream.mustMatch(Tokens.PAGE_SYM);
                line = tokenStream.token().startLine;
                col = tokenStream.token().startCol;
                
                this._readWhitespace();
                
                if (tokenStream.match(Tokens.IDENT)){
                    identifier = tokenStream.token().value;

                    //The value 'auto' may not be used as a page name and MUST be treated as a syntax error.
                    if (identifier.toLowerCase() === "auto"){
                        this._unexpectedToken(tokenStream.token());
                    }
                }                
                
                //see if there's a colon upcoming
                if (tokenStream.peek() == Tokens.COLON){
                    pseudoPage = this._pseudo_page();
                }
            
                this._readWhitespace();
                
                this.fire({
                    type:   "startpage",
                    id:     identifier,
                    pseudo: pseudoPage,
                    line:   line,
                    col:    col
                });                   

                this._readDeclarations(true, true);                
                
                this.fire({
                    type:   "endpage",
                    id:     identifier,
                    pseudo: pseudoPage,
                    line:   line,
                    col:    col
                });             
            
            },
            
            //CSS3 Paged Media
            _margin: function(){
                /*
                 * margin :
                 *    margin_sym S* '{' declaration [ ';' S* declaration? ]* '}' S*
                 *    ;
                 */
                var tokenStream = this._tokenStream,
                    line,
                    col,
                    marginSym   = this._margin_sym();

                if (marginSym){
                    line = tokenStream.token().startLine;
                    col = tokenStream.token().startCol;
                
                    this.fire({
                        type: "startpagemargin",
                        margin: marginSym,
                        line:   line,
                        col:    col
                    });    
                    
                    this._readDeclarations(true);

                    this.fire({
                        type: "endpagemargin",
                        margin: marginSym,
                        line:   line,
                        col:    col
                    });    
                    return true;
                } else {
                    return false;
                }
            },

            //CSS3 Paged Media
            _margin_sym: function(){
            
                /*
                 * margin_sym :
                 *    TOPLEFTCORNER_SYM | 
                 *    TOPLEFT_SYM | 
                 *    TOPCENTER_SYM | 
                 *    TOPRIGHT_SYM | 
                 *    TOPRIGHTCORNER_SYM |
                 *    BOTTOMLEFTCORNER_SYM | 
                 *    BOTTOMLEFT_SYM | 
                 *    BOTTOMCENTER_SYM | 
                 *    BOTTOMRIGHT_SYM |
                 *    BOTTOMRIGHTCORNER_SYM |
                 *    LEFTTOP_SYM |
                 *    LEFTMIDDLE_SYM |
                 *    LEFTBOTTOM_SYM |
                 *    RIGHTTOP_SYM |
                 *    RIGHTMIDDLE_SYM |
                 *    RIGHTBOTTOM_SYM 
                 *    ;
                 */
            
                var tokenStream = this._tokenStream;
            
                if(tokenStream.match([Tokens.TOPLEFTCORNER_SYM, Tokens.TOPLEFT_SYM,
                        Tokens.TOPCENTER_SYM, Tokens.TOPRIGHT_SYM, Tokens.TOPRIGHTCORNER_SYM,
                        Tokens.BOTTOMLEFTCORNER_SYM, Tokens.BOTTOMLEFT_SYM, 
                        Tokens.BOTTOMCENTER_SYM, Tokens.BOTTOMRIGHT_SYM,
                        Tokens.BOTTOMRIGHTCORNER_SYM, Tokens.LEFTTOP_SYM, 
                        Tokens.LEFTMIDDLE_SYM, Tokens.LEFTBOTTOM_SYM, Tokens.RIGHTTOP_SYM,
                        Tokens.RIGHTMIDDLE_SYM, Tokens.RIGHTBOTTOM_SYM]))
                {
                    return SyntaxUnit.fromToken(tokenStream.token());                
                } else {
                    return null;
                }
            
            },
            
            _pseudo_page: function(){
                /*
                 * pseudo_page
                 *   : ':' IDENT
                 *   ;    
                 */
        
                var tokenStream = this._tokenStream;
                
                tokenStream.mustMatch(Tokens.COLON);
                tokenStream.mustMatch(Tokens.IDENT);
                
                //TODO: CSS3 Paged Media says only "left", "center", and "right" are allowed
                
                return tokenStream.token().value;
            },
            
            _font_face: function(){
                /*
                 * font_face
                 *   : FONT_FACE_SYM S* 
                 *     '{' S* declaration [ ';' S* declaration ]* '}' S*
                 *   ;
                 */     
                var tokenStream = this._tokenStream,
                    line,
                    col;
                
                //look for @page
                tokenStream.mustMatch(Tokens.FONT_FACE_SYM);
                line = tokenStream.token().startLine;
                col = tokenStream.token().startCol;
                
                this._readWhitespace();

                this.fire({
                    type:   "startfontface",
                    line:   line,
                    col:    col
                });                    
                
                this._readDeclarations(true);
                
                this.fire({
                    type:   "endfontface",
                    line:   line,
                    col:    col
                });              
            },

            _operator: function(){
            
                /*
                 * operator
                 *  : '/' S* | ',' S* | /( empty )/
                 *  ;
                 */    
                 
                var tokenStream = this._tokenStream,
                    token       = null;
                
                if (tokenStream.match([Tokens.SLASH, Tokens.COMMA])){
                    token =  tokenStream.token();
                    this._readWhitespace();
                } 
                return token ? PropertyValuePart.fromToken(token) : null;
                
            },
            
            _combinator: function(){
            
                /*
                 * combinator
                 *  : PLUS S* | GREATER S* | TILDE S* | S+
                 *  ;
                 */    
                 
                var tokenStream = this._tokenStream,
                    value       = null,
                    token;
                
                if(tokenStream.match([Tokens.PLUS, Tokens.GREATER, Tokens.TILDE])){                
                    token = tokenStream.token();
                    value = new Combinator(token.value, token.startLine, token.startCol);
                    this._readWhitespace();
                }
                
                return value;
            },
            
            _unary_operator: function(){
            
                /*
                 * unary_operator
                 *  : '-' | '+'
                 *  ;
                 */
                 
                var tokenStream = this._tokenStream;
                
                if (tokenStream.match([Tokens.MINUS, Tokens.PLUS])){
                    return tokenStream.token().value;
                } else {
                    return null;
                }         
            },
            
            _property: function(){
            
                /*
                 * property
                 *   : IDENT S*
                 *   ;        
                 */
                 
                var tokenStream = this._tokenStream,
                    value       = null,
                    hack        = null,
                    tokenValue,
                    token,
                    line,
                    col;
                    
                //check for star hack - throws error if not allowed
                if (tokenStream.peek() == Tokens.STAR && this.options.starHack){
                    tokenStream.get();
                    token = tokenStream.token();
                    hack = token.value;
                    line = token.startLine;
                    col = token.startCol;
                }
                
                if(tokenStream.match(Tokens.IDENT)){
                    token = tokenStream.token();
                    tokenValue = token.value;
                    
                    //check for underscore hack - no error if not allowed because it's valid CSS syntax
                    if (tokenValue.charAt(0) == "_" && this.options.underscoreHack){
                        hack = "_";
                        tokenValue = tokenValue.substring(1);
                    }
                    
                    value = new PropertyName(tokenValue, hack, (line||token.startLine), (col||token.startCol));
                    this._readWhitespace();
                }
                
                return value;
            },
        
            //Augmented with CSS3 Selectors
            _ruleset: function(){
                /*
                 * ruleset
                 *   : selectors_group
                 *     '{' S* declaration? [ ';' S* declaration? ]* '}' S*
                 *   ;    
                 */    
                 
                var tokenStream = this._tokenStream,
                tt,
                    selectors;


                /*
                 * Error Recovery: If even a single selector fails to parse,
                 * then the entire ruleset should be thrown away.
                 */
                try {
                    selectors = this._selectors_group();
                } catch (ex){
                    if (ex instanceof SyntaxError && !this.options.strict){
                    
                        //fire error event
                        this.fire({
                            type:       "error",
                            error:      ex,
                            message:    ex.message,
                            line:       ex.line,
                            col:        ex.col
                        });                          
                        
                        //skip over everything until closing brace
                        tt = tokenStream.advance([Tokens.RBRACE]);
                        if (tt == Tokens.RBRACE){
                            //if there's a right brace, the rule is finished so don't do anything
                        } else {
                            //otherwise, rethrow the error because it wasn't handled properly
                            throw ex;
                        }                        
                        
                    } else {
                        //not a syntax error, rethrow it
                        throw ex;
                    }                
                
                    //trigger parser to continue
                    return true;
                }
                
                //if it got here, all selectors parsed
                if (selectors){ 
                                    
                    this.fire({
                        type:       "startrule",
                        selectors:  selectors,
                        line:       selectors[0].line,
                        col:        selectors[0].col
                    });                
                    
                    this._readDeclarations(true);                
                    
                    this.fire({
                        type:       "endrule",
                        selectors:  selectors,
                        line:       selectors[0].line,
                        col:        selectors[0].col
                    });  
                    
                }
                
                return selectors;
                
            },

            //CSS3 Selectors
            _selectors_group: function(){
            
                /*            
                 * selectors_group
                 *   : selector [ COMMA S* selector ]*
                 *   ;
                 */           
                var tokenStream = this._tokenStream,
                    selectors   = [],
                    selector;
                    
                selector = this._selector();
                if (selector !== null){
                
                    selectors.push(selector);
                    while(tokenStream.match(Tokens.COMMA)){
                        this._readWhitespace();
                        selector = this._selector();
                        if (selector !== null){
                            selectors.push(selector);
                        } else {
                            this._unexpectedToken(tokenStream.LT(1));
                        }
                    }
                }

                return selectors.length ? selectors : null;
            },
                
            //CSS3 Selectors
            _selector: function(){
                /*
                 * selector
                 *   : simple_selector_sequence [ combinator simple_selector_sequence ]*
                 *   ;    
                 */
                 
                var tokenStream = this._tokenStream,
                    selector    = [],
                    nextSelector = null,
                    combinator  = null,
                    ws          = null;
                
                //if there's no simple selector, then there's no selector
                nextSelector = this._simple_selector_sequence();
                if (nextSelector === null){
                    return null;
                }
                
                selector.push(nextSelector);
                
                do {
                    
                    //look for a combinator
                    combinator = this._combinator();
                    
                    if (combinator !== null){
                        selector.push(combinator);
                        nextSelector = this._simple_selector_sequence();
                        
                        //there must be a next selector
                        if (nextSelector === null){
                            this._unexpectedToken(this.LT(1));
                        } else {
                        
                            //nextSelector is an instance of SelectorPart
                            selector.push(nextSelector);
                        }
                    } else {
                        
                        //if there's not whitespace, we're done
                        if (this._readWhitespace()){           
        
                            //add whitespace separator
                            ws = new Combinator(tokenStream.token().value, tokenStream.token().startLine, tokenStream.token().startCol);
                            
                            //combinator is not required
                            combinator = this._combinator();
                            
                            //selector is required if there's a combinator
                            nextSelector = this._simple_selector_sequence();
                            if (nextSelector === null){                        
                                if (combinator !== null){
                                    this._unexpectedToken(tokenStream.LT(1));
                                }
                            } else {
                                
                                if (combinator !== null){
                                    selector.push(combinator);
                                } else {
                                    selector.push(ws);
                                }
                                
                                selector.push(nextSelector);
                            }     
                        } else {
                            break;
                        }               
                    
                    }
                } while(true);
                
                return new Selector(selector, selector[0].line, selector[0].col);
            },
            
            //CSS3 Selectors
            _simple_selector_sequence: function(){
                /*
                 * simple_selector_sequence
                 *   : [ type_selector | universal ]
                 *     [ HASH | class | attrib | pseudo | negation ]*
                 *   | [ HASH | class | attrib | pseudo | negation ]+
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                
                    //parts of a simple selector
                    elementName = null,
                    modifiers   = [],
                    
                    //complete selector text
                    selectorText= "",

                    //the different parts after the element name to search for
                    components  = [
                        //HASH
                        function(){
                            return tokenStream.match(Tokens.HASH) ?
                                    new SelectorSubPart(tokenStream.token().value, "id", tokenStream.token().startLine, tokenStream.token().startCol) :
                                    null;
                        },
                        this._class,
                        this._attrib,
                        this._pseudo,
                        this._negation
                    ],
                    i           = 0,
                    len         = components.length,
                    component   = null,
                    found       = false,
                    line,
                    col;
                    
                    
                //get starting line and column for the selector
                line = tokenStream.LT(1).startLine;
                col = tokenStream.LT(1).startCol;
                                        
                elementName = this._type_selector();
                if (!elementName){
                    elementName = this._universal();
                }
                
                if (elementName !== null){
                    selectorText += elementName;
                }                
                
                while(true){

                    //whitespace means we're done
                    if (tokenStream.peek() === Tokens.S){
                        break;
                    }
                
                    //check for each component
                    while(i < len && component === null){
                        component = components[i++].call(this);
                    }
        
                    if (component === null){
                    
                        //we don't have a selector
                        if (selectorText === ""){
                            return null;
                        } else {
                            break;
                        }
                    } else {
                        i = 0;
                        modifiers.push(component);
                        selectorText += component.toString(); 
                        component = null;
                    }
                }

                 
                return selectorText !== "" ?
                        new SelectorPart(elementName, modifiers, selectorText, line, col) :
                        null;
            },            
            
            //CSS3 Selectors
            _type_selector: function(){
                /*
                 * type_selector
                 *   : [ namespace_prefix ]? element_name
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                    ns          = this._namespace_prefix(),
                    elementName = this._element_name();
                    
                if (!elementName){                    
                    /*
                     * Need to back out the namespace that was read due to both
                     * type_selector and universal reading namespace_prefix
                     * first. Kind of hacky, but only way I can figure out
                     * right now how to not change the grammar.
                     */
                    if (ns){
                        tokenStream.unget();
                        if (ns.length > 1){
                            tokenStream.unget();
                        }
                    }
                
                    return null;
                } else {     
                    if (ns){
                        elementName.text = ns + elementName.text;
                        elementName.col -= ns.length;
                    }
                    return elementName;
                }
            },
            
            //CSS3 Selectors
            _class: function(){
                /*
                 * class
                 *   : '.' IDENT
                 *   ;
                 */    
                 
                var tokenStream = this._tokenStream,
                    token;
                
                if (tokenStream.match(Tokens.DOT)){
                    tokenStream.mustMatch(Tokens.IDENT);    
                    token = tokenStream.token();
                    return new SelectorSubPart("." + token.value, "class", token.startLine, token.startCol - 1);        
                } else {
                    return null;
                }
        
            },
            
            //CSS3 Selectors
            _element_name: function(){
                /*
                 * element_name
                 *   : IDENT
                 *   ;
                 */    
                
                var tokenStream = this._tokenStream,
                    token;
                
                if (tokenStream.match(Tokens.IDENT)){
                    token = tokenStream.token();
                    return new SelectorSubPart(token.value, "elementName", token.startLine, token.startCol);        
                
                } else {
                    return null;
                }
            },
            
            //CSS3 Selectors
            _namespace_prefix: function(){
                /*            
                 * namespace_prefix
                 *   : [ IDENT | '*' ]? '|'
                 *   ;
                 */
                var tokenStream = this._tokenStream,
                    value       = "";
                    
                //verify that this is a namespace prefix
                if (tokenStream.LA(1) === Tokens.PIPE || tokenStream.LA(2) === Tokens.PIPE){
                        
                    if(tokenStream.match([Tokens.IDENT, Tokens.STAR])){
                        value += tokenStream.token().value;
                    }
                    
                    tokenStream.mustMatch(Tokens.PIPE);
                    value += "|";
                    
                }
                
                return value.length ? value : null;                
            },
            
            //CSS3 Selectors
            _universal: function(){
                /*
                 * universal
                 *   : [ namespace_prefix ]? '*'
                 *   ;            
                 */
                var tokenStream = this._tokenStream,
                    value       = "",
                    ns;
                    
                ns = this._namespace_prefix();
                if(ns){
                    value += ns;
                }
                
                if(tokenStream.match(Tokens.STAR)){
                    value += "*";
                }
                
                return value.length ? value : null;
                
           },
            
            //CSS3 Selectors
            _attrib: function(){
                /*
                 * attrib
                 *   : '[' S* [ namespace_prefix ]? IDENT S*
                 *         [ [ PREFIXMATCH |
                 *             SUFFIXMATCH |
                 *             SUBSTRINGMATCH |
                 *             '=' |
                 *             INCLUDES |
                 *             DASHMATCH ] S* [ IDENT | STRING ] S*
                 *         ]? ']'
                 *   ;    
                 */
                 
                var tokenStream = this._tokenStream,
                    value       = null,
                    ns,
                    token;
                
                if (tokenStream.match(Tokens.LBRACKET)){
                    token = tokenStream.token();
                    value = token.value;
                    value += this._readWhitespace();
                    
                    ns = this._namespace_prefix();
                    
                    if (ns){
                        value += ns;
                    }
                                        
                    tokenStream.mustMatch(Tokens.IDENT);
                    value += tokenStream.token().value;                    
                    value += this._readWhitespace();
                    
                    if(tokenStream.match([Tokens.PREFIXMATCH, Tokens.SUFFIXMATCH, Tokens.SUBSTRINGMATCH,
                            Tokens.EQUALS, Tokens.INCLUDES, Tokens.DASHMATCH])){
                    
                        value += tokenStream.token().value;                    
                        value += this._readWhitespace();
                        
                        tokenStream.mustMatch([Tokens.IDENT, Tokens.STRING]);
                        value += tokenStream.token().value;                    
                        value += this._readWhitespace();
                    }
                    
                    tokenStream.mustMatch(Tokens.RBRACKET);
                                        
                    return new SelectorSubPart(value + "]", "attribute", token.startLine, token.startCol);
                } else {
                    return null;
                }
            },
            
            //CSS3 Selectors
            _pseudo: function(){
            
                /*
                 * pseudo
                 *   : ':' ':'? [ IDENT | functional_pseudo ]
                 *   ;    
                 */   
            
                var tokenStream = this._tokenStream,
                    pseudo      = null,
                    colons      = ":",
                    line,
                    col;
                
                if (tokenStream.match(Tokens.COLON)){
                
                    if (tokenStream.match(Tokens.COLON)){
                        colons += ":";
                    }
                
                    if (tokenStream.match(Tokens.IDENT)){
                        pseudo = tokenStream.token().value;
                        line = tokenStream.token().startLine;
                        col = tokenStream.token().startCol - colons.length;
                    } else if (tokenStream.peek() == Tokens.FUNCTION){
                        line = tokenStream.LT(1).startLine;
                        col = tokenStream.LT(1).startCol - colons.length;
                        pseudo = this._functional_pseudo();
                    }
                    
                    if (pseudo){
                        pseudo = new SelectorSubPart(colons + pseudo, "pseudo", line, col);
                    }
                }
        
                return pseudo;
            },
            
            //CSS3 Selectors
            _functional_pseudo: function(){
                /*
                 * functional_pseudo
                 *   : FUNCTION S* expression ')'
                 *   ;
                */            
                
                var tokenStream = this._tokenStream,
                    value = null;
                
                if(tokenStream.match(Tokens.FUNCTION)){
                    value = tokenStream.token().value;
                    value += this._readWhitespace();
                    value += this._expression();
                    tokenStream.mustMatch(Tokens.RPAREN);
                    value += ")";
                }
                
                return value;
            },
            
            //CSS3 Selectors
            _expression: function(){
                /*
                 * expression
                 *   : [ [ PLUS | '-' | DIMENSION | NUMBER | STRING | IDENT ] S* ]+
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                    value       = "";
                    
                while(tokenStream.match([Tokens.PLUS, Tokens.MINUS, Tokens.DIMENSION,
                        Tokens.NUMBER, Tokens.STRING, Tokens.IDENT, Tokens.LENGTH,
                        Tokens.FREQ, Tokens.EMS, Tokens.EXS, Tokens.ANGLE, Tokens.TIME,
                        Tokens.RESOLUTION])){
                    
                    value += tokenStream.token().value;
                    value += this._readWhitespace();                        
                }
                
                return value.length ? value : null;
                
            },

            //CSS3 Selectors
            _negation: function(){
                /*            
                 * negation
                 *   : NOT S* negation_arg S* ')'
                 *   ;
                 */

                var tokenStream = this._tokenStream,
                    line,
                    col,
                    value       = "",
                    arg,
                    subpart     = null;
                    
                if (tokenStream.match(Tokens.NOT)){
                    value = tokenStream.token().value;
                    line = tokenStream.token().startLine;
                    col = tokenStream.token().startCol;
                    value += this._readWhitespace();
                    arg = this._negation_arg();
                    value += arg;
                    value += this._readWhitespace();
                    tokenStream.match(Tokens.RPAREN);
                    value += tokenStream.token().value;
                    
                    subpart = new SelectorSubPart(value, "not", line, col);
                    subpart.args.push(arg);
                }
                
                return subpart;
            },
            
            //CSS3 Selectors
            _negation_arg: function(){            
                /*
                 * negation_arg
                 *   : type_selector | universal | HASH | class | attrib | pseudo
                 *   ;            
                 */           
                 
                var tokenStream = this._tokenStream,
                    args        = [
                        this._type_selector,
                        this._universal,
                        function(){
                            return tokenStream.match(Tokens.HASH) ?
                                    new SelectorSubPart(tokenStream.token().value, "id", tokenStream.token().startLine, tokenStream.token().startCol) :
                                    null;                        
                        },
                        this._class,
                        this._attrib,
                        this._pseudo                    
                    ],
                    arg         = null,
                    i           = 0,
                    len         = args.length,
                    elementName,
                    line,
                    col,
                    part;
                    
                line = tokenStream.LT(1).startLine;
                col = tokenStream.LT(1).startCol;
                
                while(i < len && arg === null){
                    
                    arg = args[i].call(this);
                    i++;
                }
                
                //must be a negation arg
                if (arg === null){
                    this._unexpectedToken(tokenStream.LT(1));
                }
 
                //it's an element name
                if (arg.type == "elementName"){
                    part = new SelectorPart(arg, [], arg.toString(), line, col);
                } else {
                    part = new SelectorPart(null, [arg], arg.toString(), line, col);
                }
                
                return part;                
            },
            
            _declaration: function(){
            
                /*
                 * declaration
                 *   : property ':' S* expr prio?
                 *   | /( empty )/
                 *   ;     
                 */    
            
                var tokenStream = this._tokenStream,
                    property    = null,
                    expr        = null,
                    prio        = null;
                
                property = this._property();
                if (property !== null){

                    tokenStream.mustMatch(Tokens.COLON);
                    this._readWhitespace();
                    
                    expr = this._expr();
                    
                    //if there's no parts for the value, it's an error
                    if (!expr || expr.length === 0){
                        this._unexpectedToken(tokenStream.LT(1));
                    }
                    
                    prio = this._prio();
                    
                    this.fire({
                        type:       "property",
                        property:   property,
                        value:      expr,
                        important:  prio,
                        line:       property.line,
                        col:        property.col
                    });                      
                    
                    return true;
                } else {
                    return false;
                }
            },
            
            _prio: function(){
                /*
                 * prio
                 *   : IMPORTANT_SYM S*
                 *   ;    
                 */
                 
                var tokenStream = this._tokenStream,
                    result      = tokenStream.match(Tokens.IMPORTANT_SYM);
                    
                this._readWhitespace();
                return result;
            },
            
            _expr: function(){
                /*
                 * expr
                 *   : term [ operator term ]*
                 *   ;
                 */
        
                var tokenStream = this._tokenStream,
                    values      = [],
					//valueParts	= [],
                    value       = null,
                    operator    = null;
                    
                value = this._term();
                if (value !== null){
                
                    values.push(value);
                    
                    do {
                        operator = this._operator();
        
                        //if there's an operator, keep building up the value parts
                        if (operator){
                            values.push(operator);
                        } /*else {
                            //if there's not an operator, you have a full value
							values.push(new PropertyValue(valueParts, valueParts[0].line, valueParts[0].col));
							valueParts = [];
						}*/
                        
                        value = this._term();
                        
                        if (value === null){
                            break;
                        } else {
                            values.push(value);
                        }
                    } while(true);
                }
				
				//cleanup
                /*if (valueParts.length){
                    values.push(new PropertyValue(valueParts, valueParts[0].line, valueParts[0].col));
                }*/
        
                return values.length > 0 ? new PropertyValue(values, values[0].startLine, values[0].startCol) : null;
            },
            
            _term: function(){                       
            
                /*
                 * term
                 *   : unary_operator?
                 *     [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
                 *       TIME S* | FREQ S* | function | ie_function ]
                 *   | STRING S* | IDENT S* | URI S* | UNICODERANGE S* | hexcolor
                 *   ;
                 */    
        
                var tokenStream = this._tokenStream,
                    unary       = null,
                    value       = null,
                    line,
                    col;
                    
                //returns the operator or null
                unary = this._unary_operator();
                if (unary !== null){
                    line = tokenStream.token().startLine;
                    col = tokenStream.token().startCol;
                }                
               
                //exception for IE filters
                if (tokenStream.peek() == Tokens.IE_FUNCTION && this.options.ieFilters){
                
                    value = this._ie_function();
                    if (unary === null){
                        line = tokenStream.token().startLine;
                        col = tokenStream.token().startCol;
                    }
                
                //see if there's a simple match
                } else if (tokenStream.match([Tokens.NUMBER, Tokens.PERCENTAGE, Tokens.LENGTH,
                        Tokens.EMS, Tokens.EXS, Tokens.ANGLE, Tokens.TIME,
                        Tokens.FREQ, Tokens.STRING, Tokens.IDENT, Tokens.URI, Tokens.UNICODE_RANGE])){
                 
                    value = tokenStream.token().value;
                    if (unary === null){
                        line = tokenStream.token().startLine;
                        col = tokenStream.token().startCol;
                    }
                    this._readWhitespace();
                } else {
                
                    //see if it's a color
                    value = this._hexcolor();
                    if (value === null){
                    
                        //if there's no unary, get the start of the next token for line/col info
                        if (unary === null){
                            line = tokenStream.LT(1).startLine;
                            col = tokenStream.LT(1).startCol;
                        }                    
                    
                        //has to be a function
                        if (value === null){
                            
                            /*
                             * This checks for alpha(opacity=0) style of IE
                             * functions. IE_FUNCTION only presents progid: style.
                             */
                            if (tokenStream.LA(3) == Tokens.EQUALS && this.options.ieFilters){
                                value = this._ie_function();
                            } else {
                                value = this._function();
                            }
                        }

                        /*if (value === null){
                            return null;
                            //throw new Error("Expected identifier at line " + tokenStream.token().startLine + ", character " +  tokenStream.token().startCol + ".");
                        }*/
                    
                    } else {
                        if (unary === null){
                            line = tokenStream.token().startLine;
                            col = tokenStream.token().startCol;
                        }                    
                    }
                
                }                
                
                return value !== null ?
                        new PropertyValuePart(unary !== null ? unary + value : value, line, col) :
                        null;
        
            },
            
            _function: function(){
            
                /*
                 * function
                 *   : FUNCTION S* expr ')' S*
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                    functionText = null,
                    expr        = null;
                    
                if (tokenStream.match(Tokens.FUNCTION)){
                    functionText = tokenStream.token().value;
                    this._readWhitespace();
                    expr = this._expr();
                    
                    tokenStream.match(Tokens.RPAREN);    
                    functionText += expr + ")";
                    this._readWhitespace();
                }                
                
                return functionText;
            }, 
            
            _ie_function: function(){
            
                /* (My own extension)
                 * ie_function
                 *   : IE_FUNCTION S* IDENT '=' term [S* ','? IDENT '=' term]+ ')' S*
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                    functionText = null,
                    expr        = null,
                    lt;
                    
                //IE function can begin like a regular function, too
                if (tokenStream.match([Tokens.IE_FUNCTION, Tokens.FUNCTION])){
                    functionText = tokenStream.token().value;
                    
                    do {
                    
                        if (this._readWhitespace()){
                            functionText += tokenStream.token().value;
                        }
                        
                        //might be second time in the loop
                        if (tokenStream.LA(0) == Tokens.COMMA){
                            functionText += tokenStream.token().value;
                        }
                    
                        tokenStream.match(Tokens.IDENT);
                        functionText += tokenStream.token().value;
                        
                        tokenStream.match(Tokens.EQUALS);
                        functionText += tokenStream.token().value;
                        
                        //functionText += this._term();
                        lt = tokenStream.peek();
                        while(lt != Tokens.COMMA && lt != Tokens.S && lt != Tokens.RPAREN){
                            tokenStream.get();
                            functionText += tokenStream.token().value;
                            lt = tokenStream.peek();
                        }
                    } while(tokenStream.match([Tokens.COMMA, Tokens.S]));                    
                    
                    tokenStream.match(Tokens.RPAREN);    
                    functionText += ")";
                    this._readWhitespace();
                }                
                
                return functionText;
            }, 
            
            _hexcolor: function(){
                /*
                 * There is a constraint on the color that it must
                 * have either 3 or 6 hex-digits (i.e., [0-9a-fA-F])
                 * after the "#"; e.g., "#000" is OK, but "#abcd" is not.
                 *
                 * hexcolor
                 *   : HASH S*
                 *   ;
                 */
                 
                var tokenStream = this._tokenStream,
                    token,
                    color = null;
                
                if(tokenStream.match(Tokens.HASH)){
                
                    //need to do some validation here
                    
                    token = tokenStream.token();
                    color = token.value;
                    if (!/#[a-f0-9]{3,6}/i.test(color)){
                        throw new SyntaxError("Expected a hex color but found '" + color + "' at line " + token.startLine + ", character " + token.startCol + ".", token.startLine, token.startCol);
                    }
                    this._readWhitespace();
                }
                
                return color;
            },
            
            //-----------------------------------------------------------------
            // Helper methods
            //-----------------------------------------------------------------
            
            /**
             * Not part of CSS grammar, but useful for skipping over
             * combination of white space and HTML-style comments.
             * @return {void}
             * @method _skipCruft
             * @private
             */
            _skipCruft: function(){
                while(this._tokenStream.match([Tokens.S, Tokens.CDO, Tokens.CDC])){
                    //noop
                }
            },

            /**
             * Not part of CSS grammar, but this pattern occurs frequently
             * in the official CSS grammar. Split out here to eliminate
             * duplicate code.
             * @param {Boolean} checkStart Indicates if the rule should check
             *      for the left brace at the beginning.
             * @param {Boolean} readMargins Indicates if the rule should check
             *      for margin patterns.
             * @return {void}
             * @method _readDeclarations
             * @private
             */
            _readDeclarations: function(checkStart, readMargins){
                /*
                 * Reads the pattern
                 * S* '{' S* declaration [ ';' S* declaration ]* '}' S*
                 * or
                 * S* '{' S* [ declaration | margin ]? [ ';' S* [ declaration | margin ]? ]* '}' S*
                 * Note that this is how it is described in CSS3 Paged Media, but is actually incorrect.
                 * A semicolon is only necessary following a delcaration is there's another declaration
                 * or margin afterwards. 
                 */
                var tokenStream = this._tokenStream,
                    tt;
                       

                this._readWhitespace();
                
                if (checkStart){
                    tokenStream.mustMatch(Tokens.LBRACE);            
                }
                
                this._readWhitespace();

                try {
                    
                    while(true){
                    
                        if (readMargins && this._margin()){
                            //noop
                        } else if (this._declaration()){
                            if (!tokenStream.match(Tokens.SEMICOLON)){
                                break;
                            }
                        } else {
                            break;
                        }
                    
                        //if ((!this._margin() && !this._declaration()) || !tokenStream.match(Tokens.SEMICOLON)){
                        //    break;
                        //}
                        this._readWhitespace();
                    }
                    
                    tokenStream.mustMatch(Tokens.RBRACE);
                    this._readWhitespace();
                    
                } catch (ex) {
                    if (ex instanceof SyntaxError && !this.options.strict){
                    
                        //fire error event
                        this.fire({
                            type:       "error",
                            error:      ex,
                            message:    ex.message,
                            line:       ex.line,
                            col:        ex.col
                        });                          
                        
                        //see if there's another declaration
                        tt = tokenStream.advance([Tokens.SEMICOLON, Tokens.RBRACE]);
                        if (tt == Tokens.SEMICOLON){
                            //if there's a semicolon, then there might be another declaration
                            this._readDeclarations(false, readMargins);
                        } else if (tt == Tokens.RBRACE){
                            //if there's a right brace, the rule is finished so don't do anything
                        } else {
                            //otherwise, rethrow the error because it wasn't handled properly
                            throw ex;
                        }                        
                        
                    } else {
                        //not a syntax error, rethrow it
                        throw ex;
                    }
                }    
            
            },      
            
            /**
             * In some cases, you can end up with two white space tokens in a
             * row. Instead of making a change in every function that looks for
             * white space, this function is used to match as much white space
             * as necessary.
             * @method _readWhitespace
             * @return {String} The white space if found, empty string if not.
             * @private
             */
            _readWhitespace: function(){
            
                var tokenStream = this._tokenStream,
                    ws = "";
                    
                while(tokenStream.match(Tokens.S)){
                    ws += tokenStream.token().value;
                }
                
                return ws;
            },
          

            /**
             * Throws an error when an unexpected token is found.
             * @param {Object} token The token that was found.
             * @method _unexpectedToken
             * @return {void}
             * @private
             */
            _unexpectedToken: function(token){
                throw new SyntaxError("Unexpected token '" + token.value + "' at line " + token.startLine + ", char " + token.startCol + ".", token.startLine, token.startCol);
            },
            
            /**
             * Helper method used for parsing subparts of a style sheet.
             * @return {void}
             * @method _verifyEnd
             * @private
             */
            _verifyEnd: function(){
                if (this._tokenStream.LA(1) != Tokens.EOF){
                    this._unexpectedToken(this._tokenStream.LT(1));
                }            
            },
            
            //-----------------------------------------------------------------
            // Parsing methods
            //-----------------------------------------------------------------
            
            parse: function(input){    
                this._tokenStream = new TokenStream(input, Tokens);
                this._stylesheet();
            },
            
            parseStyleSheet: function(input){
                //just passthrough
                return this.parse(input);
            },
            
            parseMediaQuery: function(input){
                this._tokenStream = new TokenStream(input, Tokens);
                var result = this._media_query();
                
                //if there's anything more, then it's an invalid selector
                this._verifyEnd();
                
                //otherwise return result
                return result;            
            },
            
            /**
             * Parses a property value (everything after the semicolon).
             * @return {parserlib.css.PropertyValue} The property value.
             * @throws parserlib.util.SyntaxError If an unexpected token is found.
             * @method parserPropertyValue
             */             
            parsePropertyValue: function(input){
            
                this._tokenStream = new TokenStream(input, Tokens);
                this._readWhitespace();
                
                var result = this._expr();
                
                //okay to have a trailing white space
                this._readWhitespace();
                
                //if there's anything more, then it's an invalid selector
                this._verifyEnd();
                
                //otherwise return result
                return result;
            },
            
            /**
             * Parses a complete CSS rule, including selectors and
             * properties.
             * @param {String} input The text to parser.
             * @return {Boolean} True if the parse completed successfully, false if not.
             * @method parseRule
             */
            parseRule: function(input){
                this._tokenStream = new TokenStream(input, Tokens);
                
                //skip any leading white space
                this._readWhitespace();
                
                var result = this._ruleset();
                
                //skip any trailing white space
                this._readWhitespace();

                //if there's anything more, then it's an invalid selector
                this._verifyEnd();
                
                //otherwise return result
                return result;            
            },
            
            /**
             * Parses a single CSS selector (no comma)
             * @param {String} input The text to parse as a CSS selector.
             * @return {Selector} An object representing the selector.
             * @throws parserlib.util.SyntaxError If an unexpected token is found.
             * @method parseSelector
             */
            parseSelector: function(input){
            
                this._tokenStream = new TokenStream(input, Tokens);
                
                //skip any leading white space
                this._readWhitespace();
                
                var result = this._selector();
                
                //skip any trailing white space
                this._readWhitespace();

                //if there's anything more, then it's an invalid selector
                this._verifyEnd();
                
                //otherwise return result
                return result;
            }
            
        };
        
    //copy over onto prototype
    for (prop in additions){
        proto[prop] = additions[prop];
    }   
    
    return proto;
}();


/*
nth
  : S* [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]? |
         ['-'|'+']? INTEGER | {O}{D}{D} | {E}{V}{E}{N} ] S*
  ;
*/
/**
 * Represents a selector combinator (whitespace, +, >).
 * @namespace parserlib.css
 * @class PropertyName
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {String} text The text representation of the unit. 
 * @param {String} hack The type of IE hack applied ("*", "_", or null).
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function PropertyName(text, hack, line, col){
    
    SyntaxUnit.call(this, (hack||"") + text, line, col);

    /**
     * The type of IE hack applied ("*", "_", or null).
     * @type String
     * @property hack
     */
    this.hack = hack;

}

PropertyName.prototype = new SyntaxUnit();
PropertyName.prototype.constructor = PropertyName;

/**
 * Represents a single part of a CSS property value, meaning that it represents
 * just everything single part between ":" and ";". If there are multiple values
 * separated by commas, this type represents just one of the values.
 * @param {String[]} parts An array of value parts making up this value.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 * @namespace parserlib.css
 * @class PropertyValue
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 */
function PropertyValue(parts, line, col){

    SyntaxUnit.call(this, parts.join(" "), line, col);
    
    /**
     * The parts that make up the selector.
     * @type Array
     * @property parts
     */
    this.parts = parts;
    
}

PropertyValue.prototype = new SyntaxUnit();
PropertyValue.prototype.constructor = PropertyValue;

/**
 * Represents a single part of a CSS property value, meaning that it represents
 * just one part of the data between ":" and ";".
 * @param {String} text The text representation of the unit.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 * @namespace parserlib.css
 * @class PropertyValuePart
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 */
function PropertyValuePart(text, line, col){

    SyntaxUnit.apply(this,arguments);
    
    /**
     * Indicates the type of value unit.
     * @type String
     * @property type
     */
    this.type = "unknown";

    //figure out what type of data it is
    
    var temp;
    
    //it is a measurement?
    if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)){  //dimension
        this.type = "dimension";
        this.value = +RegExp.$1;
        this.units = RegExp.$2;
        
        //try to narrow down
        switch(this.units.toLowerCase()){
        
            case "em":
            case "rem":
            case "ex":
            case "px":
            case "cm":
            case "mm":
            case "in":
            case "pt":
            case "pc":
                this.type = "length";
                break;
                
            case "deg":
            case "rad":
            case "grad":
                this.type = "angle";
                break;
            
            case "ms":
            case "s":
                this.type = "time";
                break;
            
            case "hz":
            case "khz":
                this.type = "frequency";
                break;
            
            case "dpi":
            case "dpcm":
                this.type = "resolution";
                break;
                
            //default
                
        }
        
    } else if (/^([+\-]?[\d\.]+)%$/i.test(text)){  //percentage
        this.type = "percentage";
        this.value = +RegExp.$1;
    } else if (/^([+\-]?[\d\.]+)%$/i.test(text)){  //percentage
        this.type = "percentage";
        this.value = +RegExp.$1;
    } else if (/^([+\-]?\d+)$/i.test(text)){  //integer
        this.type = "integer";
        this.value = +RegExp.$1;
    } else if (/^([+\-]?[\d\.]+)$/i.test(text)){  //number
        this.type = "number";
        this.value = +RegExp.$1;
    
    } else if (/^#([a-f0-9]{3,6})/i.test(text)){  //hexcolor
        this.type = "color";
        temp = RegExp.$1;
        if (temp.length == 3){
            this.red    = parseInt(temp.charAt(0)+temp.charAt(0),16);
            this.green  = parseInt(temp.charAt(1)+temp.charAt(1),16);
            this.blue   = parseInt(temp.charAt(2)+temp.charAt(2),16);            
        } else {
            this.red    = parseInt(temp.substring(0,2),16);
            this.green  = parseInt(temp.substring(2,4),16);
            this.blue   = parseInt(temp.substring(4,6),16);            
        }
    } else if (/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text)){ //rgb() color with absolute numbers
        this.type   = "color";
        this.red    = +RegExp.$1;
        this.green  = +RegExp.$2;
        this.blue   = +RegExp.$3;
    } else if (/^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)){ //rgb() color with percentages
        this.type   = "color";
        this.red    = +RegExp.$1 * 255 / 100;
        this.green  = +RegExp.$2 * 255 / 100;
        this.blue   = +RegExp.$3 * 255 / 100;
    } else if (/^url\(["']?([^\)"']+)["']?\)/i.test(text)){ //URI
        this.type   = "uri";
        this.uri    = RegExp.$1;
    } else if (/^["'][^"']*["']/.test(text)){    //string
        this.type   = "string";
        this.value  = eval(text);
    } else if (Colors[text.toLowerCase()]){  //named color
        this.type   = "color";
        temp        = Colors[text.toLowerCase()].substring(1);
        this.red    = parseInt(temp.substring(0,2),16);
        this.green  = parseInt(temp.substring(2,4),16);
        this.blue   = parseInt(temp.substring(4,6),16);         
    } else if (/^[\,\/]$/.test(text)){
        this.type   = "operator";
        this.value  = text;
    } else if (/^[a-z\-\u0080-\uFFFF][a-z0-9\-\u0080-\uFFFF]*$/i.test(text)){
        this.type   = "identifier";
        this.value  = text;
    }

}

PropertyValuePart.prototype = new SyntaxUnit();
PropertyValuePart.prototype.constructor = PropertyValue;

/**
 * Create a new syntax unit based solely on the given token.
 * Convenience method for creating a new syntax unit when
 * it represents a single token instead of multiple.
 * @param {Object} token The token object to represent.
 * @return {parserlib.css.PropertyValuePart} The object representing the token.
 * @static
 * @method fromToken
 */
PropertyValuePart.fromToken = function(token){
    return new PropertyValuePart(token.value, token.startLine, token.startCol);
};
/**
 * Represents an entire single selector, including all parts but not
 * including multiple selectors (those separated by commas).
 * @namespace parserlib.css
 * @class Selector
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {Array} parts Array of selectors parts making up this selector.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function Selector(parts, line, col){
    
    SyntaxUnit.call(this, parts.join(" "), line, col);
    
    /**
     * The parts that make up the selector.
     * @type Array
     * @property parts
     */
    this.parts = parts;

}

Selector.prototype = new SyntaxUnit();
Selector.prototype.constructor = Selector;

/**
 * Represents a single part of a selector string, meaning a single set of
 * element name and modifiers. This does not include combinators such as
 * spaces, +, >, etc.
 * @namespace parserlib.css
 * @class SelectorPart
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {String} elementName The element name in the selector or null
 *      if there is no element name.
 * @param {Array} modifiers Array of individual modifiers for the element.
 *      May be empty if there are none.
 * @param {String} text The text representation of the unit. 
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function SelectorPart(elementName, modifiers, text, line, col){
    
    SyntaxUnit.call(this, text, line, col);

    /**
     * The tag name of the element to which this part
     * of the selector affects.
     * @type String
     * @property elementName
     */
    this.elementName = elementName;
    
    /**
     * The parts that come after the element name, such as class names, IDs,
     * pseudo classes/elements, etc.
     * @type Array
     * @property modifiers
     */
    this.modifiers = modifiers;

}

SelectorPart.prototype = new SyntaxUnit();
SelectorPart.prototype.constructor = SelectorPart;

/**
 * Represents a selector modifier string, meaning a class name, element name,
 * element ID, pseudo rule, etc.
 * @namespace parserlib.css
 * @class SelectorSubPart
 * @extends parserlib.util.SyntaxUnit
 * @constructor
 * @param {String} text The text representation of the unit. 
 * @param {String} type The type of selector modifier.
 * @param {int} line The line of text on which the unit resides.
 * @param {int} col The column of text on which the unit resides.
 */
function SelectorSubPart(text, type, line, col){
    
    SyntaxUnit.call(this, text, line, col);

    /**
     * The type of modifier.
     * @type String
     * @property type
     */
    this.type = type;
    
    /**
     * Some subparts have arguments, this represents them.
     * @type Array
     * @property args
     */
    this.args = [];

}

SelectorSubPart.prototype = new SyntaxUnit();
SelectorSubPart.prototype.constructor = SelectorSubPart;


 
var h = /^[0-9a-fA-F]$/,
    nonascii = /^[\u0080-\uFFFF]$/,
    nl = /\n|\r\n|\r|\f/;

//-----------------------------------------------------------------------------
// Helper functions
//-----------------------------------------------------------------------------
    
 
function isHexDigit(c){
    return c != null && h.test(c);
}

function isDigit(c){
    return c != null && /\d/.test(c);
}

function isWhitespace(c){
    return c != null && /\s/.test(c);
}

function isNewLine(c){
    return c != null && nl.test(c);
}

function isNameStart(c){
    return c != null && (/[a-z_\u0080-\uFFFF\\]/i.test(c));
}

function isNameChar(c){
    return c != null && (isNameStart(c) || /[0-9\-]/.test(c));
}

function isIdentStart(c){
    return c != null && (isNameStart(c) || c == "-");
}

function mix(receiver, supplier){
	for (var prop in supplier){
		if (supplier.hasOwnProperty(prop)){
			receiver[prop] = supplier[prop];
		}
	}
	return receiver;
}

//-----------------------------------------------------------------------------
// CSS Token Stream
//-----------------------------------------------------------------------------


/**
 * A token stream that produces CSS tokens.
 * @param {String|Reader} input The source of text to tokenize.
 * @constructor
 * @class TokenStream
 * @namespace parserlib.css
 */
function TokenStream(input){
	TokenStreamBase.call(this, input, Tokens);
}

TokenStream.prototype = mix(new TokenStreamBase(), {

    /**
     * Overrides the TokenStreamBase method of the same name
     * to produce CSS tokens.
     * @param {variant} channel The name of the channel to use
     *      for the next token.
     * @return {Object} A token object representing the next token.
     * @method _getToken
     * @private
     */
    _getToken: function(channel){
    
        var c,
            reader = this._reader,
            token   = null,
            startLine   = reader.getLine(),
            startCol    = reader.getCol();
        
        c = reader.read();
        

        while(c){
            switch(c){
            
                /*
                 * Potential tokens:
                 * - COMMENT
                 * - SLASH
                 * - CHAR
                 */
                case "/":

                    if(reader.peek() == "*"){
                        token = this.commentToken(c, startLine, startCol);
                    } else {
                        token = this.charToken(c, startLine, startCol);
                    }
                    break;                    
                
                /*
                 * Potential tokens:
                 * - DASHMATCH
                 * - INCLUDES
                 * - PREFIXMATCH
                 * - SUFFIXMATCH
                 * - SUBSTRINGMATCH
                 * - CHAR
                 */
                case "|":
                case "~":
                case "^":
                case "$":
                case "*":
                    if(reader.peek() == "="){
                        token = this.comparisonToken(c, startLine, startCol);
                    } else {
                        token = this.charToken(c, startLine, startCol);
                    }
                    break;                    
                
                /*
                 * Potential tokens:
                 * - STRING
                 * - INVALID
                 */
                case "\"":
                case "'":
                    token = this.stringToken(c, startLine, startCol);                
                    break;
                    
                /*
                 * Potential tokens:
                 * - HASH
                 * - CHAR
                 */
                case "#":
                    if (isNameChar(reader.peek())){
                        token = this.hashToken(c, startLine, startCol);                        
                    } else {
                        token = this.charToken(c, startLine, startCol);
                    }                
                    break;
                    
                /*
                 * Potential tokens:
                 * - DOT
                 * - NUMBER
                 * - DIMENSION
                 * - PERCENTAGE
                 */
                case ".":
                    if (isDigit(reader.peek())){
                        token = this.numberToken(c, startLine, startCol);                        
                    } else {
                        token = this.charToken(c, startLine, startCol);
                    }
                    break;                    
                    
                /*
                 * Potential tokens:
                 * - CDC
                 * - MINUS
                 * - NUMBER
                 * - DIMENSION
                 * - PERCENTAGE
                 */
                case "-":
                    if (reader.peek() == "-"){  //could be closing HTML-style comment
                        token = this.htmlCommentEndToken(c, startLine, startCol);
                    } else if (isNameStart(reader.peek())){
                        token = this.identOrFunctionToken(c, startLine, startCol);
                    } else {
                        token = this.charToken(c, startLine, startCol);
                    }
                    break;
                
                /*
                 * Potential tokens:
                 * - IMPORTANT_SYM
                 * - CHAR
                 */
                case "!":
                    token = this.importantToken(c, startLine, startCol);
                    break;
                    
                /*
                 * Any at-keyword or CHAR
                 */
                case "@":
                    token = this.atRuleToken(c, startLine, startCol);
                    break;
                    
                /*
                 * Potential tokens:
                 * - NOT
                 * - CHAR
                 */
                case ":":
                    token = this.notToken(c, startLine, startCol);
                    break;         
           
                /*
                 * Potential tokens:
                 * - CDO
                 * - CHAR
                 */
                case "<":
                    token = this.htmlCommentStartToken(c, startLine, startCol);
                    break;     

                /*
                 * Potential tokens:
                 * - UNICODE_RANGE
                 * - URL
                 * - CHAR
                 */
                case "U":
                case "u":
                    if (reader.peek() == "+"){
                        token = this.unicodeRangeToken(c, startLine, startCol);
                        break;
                    } 
                    /*falls through*/
                    
                default:
                    
                    /*
                     * Potential tokens:
                     * - NUMBER
                     * - DIMENSION
                     * - LENGTH
                     * - FREQ
                     * - TIME
                     * - EMS
                     * - EXS
                     * - ANGLE
                     */
                    if (isDigit(c)){
                        token = this.numberToken(c, startLine, startCol);
                    } else 
                
                    /*
                     * Potential tokens:
                     * - S
                     */
                    if (isWhitespace(c)){
                        token = this.whitespaceToken(c, startLine, startCol);
                    } else 
                    
                    /*
                     * Potential tokens:
                     * - IDENT
                     */                    
                    if (isIdentStart(c)){
                        token = this.identOrFunctionToken(c, startLine, startCol);
                    } else 
                    
                    /*
                     * Potential tokens:
                     * - CHAR
                     * - PLUS
                     */
                    {
                        token = this.charToken(c, startLine, startCol);                    
                    }
        
        
        
        
        
        
            }
            
            //make sure this token is wanted
            //TODO: check channel
            break;
            
            c = reader.read();
        }
        
        if (!token && c == null){
            token = this.createToken(Tokens.EOF,null,startLine,startCol);
        }
        
        return token;
    },
    
    //-------------------------------------------------------------------------
    // Methods to create tokens
    //-------------------------------------------------------------------------
    
    /**
     * Produces a token based on available data and the current
     * reader position information. This method is called by other
     * private methods to create tokens and is never called directly.
     * @param {int} tt The token type.
     * @param {String} value The text value of the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @param {Object} options (Optional) Specifies a channel property
     *      to indicate that a different channel should be scanned
     *      and/or a hide property indicating that the token should
     *      be hidden.
     * @return {Object} A token object.
     * @method createToken
     */    
    createToken: function(tt, value, startLine, startCol, options){
        var reader = this._reader;
        options = options || {};
        
        return {
            value:      value,
            type:       tt,
            channel:    options.channel,
            hide:       options.hide || false,
            startLine:  startLine,
            startCol:   startCol,
            endLine:    reader.getLine(),
            endCol:     reader.getCol()            
        };    
    }, 
    
    //-------------------------------------------------------------------------
    // Methods to create specific tokens
    //-------------------------------------------------------------------------    
    
    /**
     * Produces a token for any at-rule. If the at-rule is unknown, then
     * the token is for a single "@" character.
     * @param {String} first The first character for the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method atRuleToken
     */    
    atRuleToken: function(first, startLine, startCol){
        var rule    = first,
            reader  = this._reader,
            tt      = Tokens.CHAR,
            valid   = false,
            ident,
            c;            
                    
        /*
         * First, mark where we are. There are only four @ rules,
         * so anything else is really just an invalid token.
         * Basically, if this doesn't match one of the known @
         * rules, just return '@' as an unknown token and allow
         * parsing to continue after that point.
         */
        reader.mark();
        
        //try to find the at-keyword        
        ident = this.readName();
        rule = first + ident;
        tt = Tokens.type(rule.toLowerCase());
        
        //if it's not valid, use the first character only and reset the reader
        if (tt == Tokens.CHAR || tt == Tokens.UNKNOWN){
            tt = Tokens.CHAR;
            rule = first;
            reader.reset();
        }            
            
        return this.createToken(tt, rule, startLine, startCol);        
    },         
    
    /**
     * Produces a character token based on the given character
     * and location in the stream. If there's a special (non-standard)
     * token name, this is used; otherwise CHAR is used.
     * @param {String} c The character for the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method charToken
     */
    charToken: function(c, startLine, startCol){
        var tt = Tokens.type(c);

        if (tt == -1){
            tt = Tokens.CHAR;
        }
        
        return this.createToken(tt, c, startLine, startCol);
    },    
    
    /**
     * Produces a character token based on the given character
     * and location in the stream. If there's a special (non-standard)
     * token name, this is used; otherwise CHAR is used.
     * @param {String} first The first character for the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method commentToken
     */    
    commentToken: function(first, startLine, startCol){
        var reader  = this._reader,
            comment = this.readComment(first);

        return this.createToken(Tokens.COMMENT, comment, startLine, startCol);    
    },    
    
    /**
     * Produces a comparison token based on the given character
     * and location in the stream. The next character must be
     * read and is already known to be an equals sign.
     * @param {String} c The character for the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method comparisonToken
     */
    comparisonToken: function(c, startLine, startCol){
        var reader  = this._reader,
            comparison  = c + reader.read(),
            tt      = Tokens.type(comparison) || Tokens.CHAR;
            
        return this.createToken(tt, comparison, startLine, startCol);
    },
    
    /**
     * Produces a hash token based on the specified information. The
     * first character provided is the pound sign (#) and then this
     * method reads a name afterward.
     * @param {String} first The first character (#) in the hash name.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method hashToken
     */
    hashToken: function(first, startLine, startCol){
        var reader  = this._reader,
            name    = this.readName(first);

        return this.createToken(Tokens.HASH, name, startLine, startCol);    
    },
    
    /**
     * Produces a CDO or CHAR token based on the specified information. The
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {String} first The first character in the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method htmlCommentStartToken
     */      
    htmlCommentStartToken: function(first, startLine, startCol){
        var reader      = this._reader,
            text        = first;

        reader.mark();        
        text += reader.readCount(3);
            
        if (text == "<!--"){
            return this.createToken(Tokens.CDO, text, startLine, startCol);
        } else {
            reader.reset();
            return this.charToken(first, startLine, startCol);
        }        
    },    
    
    /**
     * Produces a CDC or CHAR token based on the specified information. The
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {String} first The first character in the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method htmlCommentEndToken
     */      
    htmlCommentEndToken: function(first, startLine, startCol){
        var reader      = this._reader,
            text        = first;

        reader.mark();        
        text += reader.readCount(2);
            
        if (text == "-->"){
            return this.createToken(Tokens.CDC, text, startLine, startCol);
        } else {
            reader.reset();
            return this.charToken(first, startLine, startCol);
        }        
    },    
    
    /**
     * Produces an IDENT or FUNCTION token based on the specified information. The
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {String} first The first character in the identifier.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method identOrFunctionToken
     */    
    identOrFunctionToken: function(first, startLine, startCol){
        var reader  = this._reader,
            ident   = this.readName(first),
            tt      = Tokens.IDENT;

        //if there's a left paren immediately after, it's a URI or function
        if (reader.peek() == "("){
            ident += reader.read();
            if (ident.toLowerCase() == "url("){
                tt = Tokens.URI;
                ident = this.readURI(ident);
                
                //didn't find a valid URL or there's no closing paren
                if (ident.toLowerCase() == "url("){
                    tt = Tokens.FUNCTION;
                }
            } else {
                tt = Tokens.FUNCTION;
            }
        } else if (reader.peek() == ":"){  //might be an IE function
            
            //IE-specific functions always being with progid:
            if (ident.toLowerCase() == "progid"){
                ident += reader.readTo("(");
                tt = Tokens.IE_FUNCTION;
            }
        }

        return this.createToken(tt, ident, startLine, startCol);    
    },
    
    /**
     * Produces an IMPORTANT_SYM or CHAR token based on the specified information. The
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {String} first The first character in the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method importantToken
     */      
    importantToken: function(first, startLine, startCol){
        var reader      = this._reader,
            important   = first,
            tt          = Tokens.CHAR,
            temp,
            c;

        reader.mark();
        c = reader.read();
            
        while(c){
        
            //there can be a comment in here
            if (c == "/"){
            
                //if the next character isn't a star, then this isn't a valid !important token
                if (reader.peek() != "*"){
                    break;
                } else {
                    temp = this.readComment(c);
                    if (temp == ""){    //broken!
                        break;
                    }
                }
            } else if (isWhitespace(c)){
                important += c + this.readWhitespace();
            } else if (/i/i.test(c)){
                temp = reader.readCount(8);
                if (/mportant/i.test(temp)){
                    important += c + temp;
                    tt = Tokens.IMPORTANT_SYM;
                    
                }
                break;  //we're done
            } else {
                break;
            }
        
            c = reader.read();
        }
        
        if (tt == Tokens.CHAR){
            reader.reset();
            return this.charToken(first, startLine, startCol);
        } else {
            return this.createToken(tt, important, startLine, startCol);
        }
        
        
    },

    /**
     * Produces a NOT or CHAR token based on the specified information. The
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {String} first The first character in the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method notToken
     */      
    notToken: function(first, startLine, startCol){
        var reader      = this._reader,
            text        = first;

        reader.mark();        
        text += reader.readCount(4);
            
        if (text.toLowerCase() == ":not("){
            return this.createToken(Tokens.NOT, text, startLine, startCol);
        } else {
            reader.reset();
            return this.charToken(first, startLine, startCol);
        }
    },

    /**
     * Produces a number token based on the given character
     * and location in the stream. This may return a token of
     * NUMBER, EMS, EXS, LENGTH, ANGLE, TIME, FREQ, DIMENSION,
     * or PERCENTAGE.
     * @param {String} first The first character for the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method numberToken
     */    
    numberToken: function(first, startLine, startCol){
        var reader  = this._reader,
            value   = this.readNumber(first),
            ident,
            tt      = Tokens.NUMBER,
            c       = reader.peek();
            
        if (isIdentStart(c)){
            ident = this.readName(reader.read());
            value += ident;            

            if (/em|ex|px|gd|rem|vw|vh|vm|ch|cm|mm|in|pt|pc/i.test(ident)){
                tt = Tokens.LENGTH;
            } else if (/deg|rad|grad/i.test(ident)){
                tt = Tokens.ANGLE;
            } else if (/ms|s/i.test(ident)){
                tt = Tokens.TIME;
            } else if (/hz|khz/i.test(ident)){
                tt = Tokens.FREQ;
            } else if (/dpi|dpcm/i.test(ident)){
                tt = Tokens.RESOLUTION;
            } else {
                tt = Tokens.DIMENSION;
            }

        } else if (c == "%"){
            value += reader.read();
            tt = Tokens.PERCENTAGE;
        }
            
        return this.createToken(tt, value, startLine, startCol);            
    },    
    
    /**
     * Produces a string token based on the given character
     * and location in the stream. Since strings may be indicated
     * by single or double quotes, a failure to match starting
     * and ending quotes results in an INVALID token being generated.
     * The first character in the string is passed in and then
     * the rest are read up to and including the final quotation mark.
     * @param {String} first The first character in the string.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method stringToken
     */    
    stringToken: function(first, startLine, startCol){
        var delim   = first,
            string  = first,
            reader  = this._reader,
            prev    = first,
            tt      = Tokens.STRING,
            c       = reader.read();
            
        while(c){
            string += c;
            
            //if the delimiter is found with an escapement, we're done.
            if (c == delim && prev != "\\"){
                break;
            }

            //if there's a newline without an escapement, it's an invalid string
            if (isNewLine(reader.peek()) && c != "\\"){
                tt = Tokens.INVALID;
                break;
            }
        
            //save previous and get next
            prev = c;
            c = reader.read();
        }
        
        //if c is null, that means we're out of input and the string was never closed
        if (c == null){
            tt = Tokens.INVALID;
        }
            
        return this.createToken(tt, string, startLine, startCol);        
    },    
    
    unicodeRangeToken: function(first, startLine, startCol){
        var reader  = this._reader,
            value   = first,
            temp,
            tt      = Tokens.CHAR;
         
        //then it should be a unicode range
        if (reader.peek() == "+"){
            reader.mark();
            value += reader.read();
            value += this.readUnicodeRangePart(true);
            
            //ensure there's an actual unicode range here
            if (value.length == 2){
                reader.reset();
            } else {
                
                tt = Tokens.UNICODE_RANGE;
            
                //if there's a ? in the first part, there can't be a second part
                if (value.indexOf("?") == -1){
                            
                    if (reader.peek() == "-"){
                        reader.mark();
                        temp = reader.read();
                        temp += this.readUnicodeRangePart(false);
                        
                        //if there's not another value, back up and just take the first
                        if (temp.length == 1){
                            reader.reset();
                        } else {
                            value += temp;
                        }
                    }

                }
            }
        }
    
        return this.createToken(tt, value, startLine, startCol);
    },
    
    /**
     * Produces a S token based on the specified information. Since whitespace
     * may have multiple characters, this consumes all whitespace characters
     * into a single token.
     * @param {String} first The first character in the token.
     * @param {int} startLine The beginning line for the character.
     * @param {int} startCol The beginning column for the character.
     * @return {Object} A token object.
     * @method whitespaceToken
     */          
    whitespaceToken: function(first, startLine, startCol){
        var reader  = this._reader,
            value   = first + this.readWhitespace();
        return this.createToken(Tokens.S, value, startLine, startCol);            
    },    
   



    //-------------------------------------------------------------------------
    // Methods to read values from the string stream
    //-------------------------------------------------------------------------
    
    readUnicodeRangePart: function(allowQuestionMark){
        var reader  = this._reader,
            part = "",            
            c       = reader.peek();
        
        //first read hex digits
        while(isHexDigit(c) && part.length < 6){
            reader.read();
            part += c;
            c = reader.peek();            
        }
        
        //then read question marks if allowed
        if (allowQuestionMark){
            while(c == "?" && part.length < 6){
                reader.read();
                part += c;
                c = reader.peek();            
            }
        }

        //there can't be any other characters after this point
        
        return part;    
    },
    
    readWhitespace: function(){
        var reader  = this._reader,
            whitespace = "",
            c       = reader.peek();
        
        while(isWhitespace(c)){
            reader.read();
            whitespace += c;
            c = reader.peek();            
        }
        
        return whitespace;
    },
    readNumber: function(first){
        var reader  = this._reader,
            number  = first,
            hasDot  = (first == "."),
            c       = reader.peek();
        

        while(c){
            if (isDigit(c)){
                number += reader.read();
            } else if (c == "."){
                if (hasDot){
                    break;
                } else {
                    hasDot = true;
                    number += reader.read();
                }
            } else {
                break;
            }
            
            c = reader.peek();
        }        
        
        return number;
    },
    readString: function(){
        var reader  = this._reader,
            delim   = reader.read(),
            string  = delim,            
            prev    = delim,
            c       = reader.peek();
            
        while(c){
            c = reader.read();
            string += c;
            
            //if the delimiter is found with an escapement, we're done.
            if (c == delim && prev != "\\"){
                break;
            }

            //if there's a newline without an escapement, it's an invalid string
            if (isNewLine(reader.peek()) && c != "\\"){
                string = "";
                break;
            }
        
            //save previous and get next
            prev = c;
            c = reader.peek();
        }
        
        //if c is null, that means we're out of input and the string was never closed
        if (c == null){
            string = "";
        }
                
        return string;
    },
    readURI: function(first){
        var reader  = this._reader,
            uri     = first,
            inner   = "",
            c       = reader.peek();
            
        reader.mark();
        
        //skip whitespace before
        while(c && isWhitespace(c)){
            reader.read();
            c = reader.peek();
        }
            
        //it's a string
        if (c == "'" || c == "\""){
            inner = this.readString();
        } else {
            inner = this.readURL();
        }
        
        c = reader.peek();

        //skip whitespace after
        while(c && isWhitespace(c)){
            reader.read();
            c = reader.peek();
        }
            
        //if there was no inner value or the next character isn't closing paren, it's not a URI
        if (inner == "" || c != ")"){
            uri = first;
            reader.reset();
        } else {
            uri += inner + reader.read();
        }
                
        return uri;
    },
    readURL: function(){
        var reader  = this._reader,
            url     = "",
            c       = reader.peek();
    
        //TODO: Check for escape and nonascii
        while (/^[!#$%&\\*-~]$/.test(c)){
            url += reader.read();
            c = reader.peek();
        }
    
        return url;
    
    },
    readName: function(first){
        var reader  = this._reader,
            ident   = first || "",
            c       = reader.peek();
        

        while(c && isNameChar(c)){
            ident += reader.read();
            c = reader.peek();
        }
        
        return ident;
    },    
    readComment: function(first){
        var reader  = this._reader,
            comment = first || "",
            c       = reader.read();
        
        if (c == "*"){
            while(c){
                comment += c;
                
                //look for end of comment
                if (c == "*" && reader.peek() == "/"){
                    comment += reader.read();
                    break;
                }
                
                c = reader.read();
            }
            
            return comment;
        } else {
            return "";
        }
    
    },
    



});

var Tokens  = [

    /*
     * The following token names are defined in CSS3 Grammar: http://www.w3.org/TR/css3-syntax/#lexical
     */
     
    //HTML-style comments
    { name: "CDO"},
    { name: "CDC"},

    //ignorables
    { name: "S", whitespace: true/*, channel: "ws"*/},
    { name: "COMMENT", comment: true, hide: true, channel: "comment" },
        
    //attribute equality
    { name: "INCLUDES", text: "~="},
    { name: "DASHMATCH", text: "|="},
    { name: "PREFIXMATCH", text: "^="},
    { name: "SUFFIXMATCH", text: "$="},
    { name: "SUBSTRINGMATCH", text: "*="},
        
    //identifier types
    { name: "STRING"},     
    { name: "IDENT"},
    { name: "HASH"},

    //at-keywords
    { name: "IMPORT_SYM", text: "@import"},
    { name: "PAGE_SYM", text: "@page"},
    { name: "MEDIA_SYM", text: "@media"},
    { name: "FONT_FACE_SYM", text: "@font-face"},
    { name: "CHARSET_SYM", text: "@charset"},
    { name: "NAMESPACE_SYM", text: "@namespace"},
    //{ name: "ATKEYWORD"},

    //important symbol
    { name: "IMPORTANT_SYM"},

    //measurements
    { name: "EMS"},
    { name: "EXS"},
    { name: "LENGTH"},
    { name: "ANGLE"},
    { name: "TIME"},
    { name: "FREQ"},
    { name: "DIMENSION"},
    { name: "PERCENTAGE"},
    { name: "NUMBER"},
    
    //functions
    { name: "URI"},
    { name: "FUNCTION"},
    
    //Unicode ranges
    { name: "UNICODE_RANGE"},
    
    /*
     * The following token names are defined in CSS3 Selectors: http://www.w3.org/TR/css3-selectors/#selector-syntax
     */    
    
    //invalid string
    { name: "INVALID"},
    
    //combinators
    { name: "PLUS", text: "+" },
    { name: "GREATER", text: ">"},
    { name: "COMMA", text: ","},
    { name: "TILDE", text: "~"},
    
    //modifier
    { name: "NOT"},        
    
    /*
     * Defined in CSS3 Paged Media
     */
    { name: "TOPLEFTCORNER_SYM", text: "@top-left-corner"},
    { name: "TOPLEFT_SYM", text: "@top-left"},
    { name: "TOPCENTER_SYM", text: "@top-center"},
    { name: "TOPRIGHT_SYM", text: "@top-right"},
    { name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner"},
    { name: "BOTTOMLEFTCORNER_SYM", text: "@bottom-left-corner"},
    { name: "BOTTOMLEFT_SYM", text: "@bottom-left"},
    { name: "BOTTOMCENTER_SYM", text: "@bottom-center"},
    { name: "BOTTOMRIGHT_SYM", text: "@bottom-right"},
    { name: "BOTTOMRIGHTCORNER_SYM", text: "@bottom-right-corner"},
    { name: "LEFTTOP_SYM", text: "@left-top"},
    { name: "LEFTMIDDLE_SYM", text: "@left-middle"},
    { name: "LEFTBOTTOM_SYM", text: "@left-bottom"},
    { name: "RIGHTTOP_SYM", text: "@right-top"},
    { name: "RIGHTMIDDLE_SYM", text: "@right-middle"},
    { name: "RIGHTBOTTOM_SYM", text: "@right-bottom"},

    /*
     * The following token names are defined in CSS3 Media Queries: http://www.w3.org/TR/css3-mediaqueries/#syntax
     */
    /*{ name: "MEDIA_ONLY", state: "media"},
    { name: "MEDIA_NOT", state: "media"},
    { name: "MEDIA_AND", state: "media"},*/
    { name: "RESOLUTION", state: "media"},

    /*
     * The following token names are not defined in any CSS specification but are used by the lexer.
     */
    
    //not a real token, but useful for stupid IE filters
    { name: "IE_FUNCTION" },

    //part of CSS3 grammar but not the Flex code
    { name: "CHAR" },
    
    //TODO: Needed?
    //Not defined as tokens, but might as well be
    {
        name: "PIPE",
        text: "|"
    },
    {
        name: "SLASH",
        text: "/"
    },
    {
        name: "MINUS",
        text: "-"
    },
    {
        name: "STAR",
        text: "*"
    },

    {
        name: "LBRACE",
        text: "{"
    },   
    {
        name: "RBRACE",
        text: "}"
    },      
    {
        name: "LBRACKET",
        text: "["
    },   
    {
        name: "RBRACKET",
        text: "]"
    },    
    {
        name: "EQUALS",
        text: "="
    },
    {
        name: "COLON",
        text: ":"
    },    
    {
        name: "SEMICOLON",
        text: ";"
    },    
 
    {
        name: "LPAREN",
        text: "("
    },   
    {
        name: "RPAREN",
        text: ")"
    },     
    {
        name: "DOT",
        text: "."
    }
];

(function(){

    var nameMap = [],
        typeMap = {};
    
    Tokens.UNKNOWN = -1;
    Tokens.unshift({name:"EOF"});
    for (var i=0, len = Tokens.length; i < len; i++){
        nameMap.push(Tokens[i].name);
        Tokens[Tokens[i].name] = i;
        if (Tokens[i].text){
            typeMap[Tokens[i].text] = i;
        }
    }
    
    Tokens.name = function(tt){
        return nameMap[tt];
    };
    
    Tokens.type = function(c){
        return typeMap[c] || -1;
    };

})();




parserlib.css = {
Colors              :Colors,    
Combinator          :Combinator,                
Parser              :Parser,
PropertyName        :PropertyName,
PropertyValue       :PropertyValue,
PropertyValuePart   :PropertyValuePart,
MediaFeature        :MediaFeature,
MediaQuery          :MediaQuery,
Selector            :Selector,
SelectorPart        :SelectorPart,
SelectorSubPart     :SelectorSubPart,
TokenStream         :TokenStream,
Tokens              :Tokens
};
})();
/**
 * YUI Test Framework
 * @module yuitest
 */

/**
 * The root namespace for YUI Test.
 * @class YUITest
 * @static
 */

var YUITest = {
    version: "@VERSION@"
};


/**
 * Simple custom event implementation.
 * @namespace YUITest
 * @class EventTarget
 * @constructor
 */
YUITest.EventTarget = function(){

    /**
     * Event handlers for the various events.
     * @type Object
     * @private
     * @property _handlers
     * @static
     */
    this._handlers = {};

};

YUITest.EventTarget.prototype = {

    //restore prototype
    constructor: YUITest.EventTarget,

    //-------------------------------------------------------------------------
    // Event Handling
    //-------------------------------------------------------------------------

    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method attach
     */
    attach: function(type, listener){
        if (typeof this._handlers[type] == "undefined"){
            this._handlers[type] = [];
        }

        this._handlers[type].push(listener);
    },

    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method subscribe
     * @deprecated
     */
    subscribe: function(type, listener){
        this.attach.apply(this, arguments);
    },

    /**
     * Fires an event based on the passed-in object.
     * @param {Object|String} event An object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @return {void}
     * @method fire
     */
    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){
            throw new Error("Event object missing 'type' property.");
        }

        if (this._handlers[event.type] instanceof Array){
            var handlers = this._handlers[event.type];
            for (var i=0, len=handlers.length; i < len; i++){
                handlers[i].call(this, event);
            }
        }
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method detach
     */
    detach: function(type, listener){
        if (this._handlers[type] instanceof Array){
            var handlers = this._handlers[type];
            for (var i=0, len=handlers.length; i < len; i++){
                if (handlers[i] === listener){
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method unsubscribe
     * @deprecated
     */
    unsubscribe: function(type, listener){
        this.detach.apply(this, arguments);
    }

};


/**
 * Object containing helper methods.
 * @namespace YUITest
 * @class Util
 * @static
 */
YUITest.Util = {

    /**
     * Mixes the own properties from the supplier onto the
     * receiver.
     * @param {Object} receiver The object to receive the properties.
     * @param {Object} supplier The object to supply the properties.
     * @return {Object} The receiver that was passed in.
     * @method mix
     * @static
     */
    mix: function(receiver, supplier){

        for (var prop in supplier){
            if (supplier.hasOwnProperty(prop)){
                receiver[prop] = supplier[prop];
            }
        }

        return receiver;
    },

    /**
     * Stub for JSON functionality. When the native JSON utility
     * is available, it will be used. Otherwise, a stub object
     * is created. Developers should override YUITest.Util.JSON
     * when attempting to use it in environments where a native
     * JSON utility is unavailable.
     * @property JSON
     * @type JSON
     * @static
     */
    JSON: typeof JSON != "undefined" ? JSON : {
        stringify: function(){
            //TODO: Should include code to do this?
            throw new Error("No JSON utility specified.");
        }
    }

};


/**
 * Error is thrown whenever an assertion fails. It provides methods
 * to more easily get at error information and also provides a base class
 * from which more specific assertion errors can be derived.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest
 * @class AssertionError
 * @constructor
 */
YUITest.AssertionError = function (message){

    /**
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    this.message = message;

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "Assert Error";
};

YUITest.AssertionError.prototype = {

    //restore constructor
    constructor: YUITest.AssertionError,

    /**
     * Returns a fully formatted error for an assertion failure. This should
     * be overridden by all subclasses to provide specific information.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () {
        return this.message;
    },

    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () {
        return this.name + ": " + this.getMessage();
    }

};

/**
 * ComparisonFailure is subclass of Error that is thrown whenever
 * a comparison between two values fails. It provides mechanisms to retrieve
 * both the expected and actual value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} expected The expected value.
 * @param {Object} actual The actual value that caused the assertion to fail.
 * @namespace YUITest
 * @extends AssertionError
 * @class ComparisonFailure
 * @constructor
 */
YUITest.ComparisonFailure = function (message, expected, actual){

    //call superclass
    YUITest.AssertionError.call(this, message);

    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    this.expected = expected;

    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    this.actual = actual;

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ComparisonFailure";

};

//inherit from YUITest.AssertionError
YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;

//restore constructor
YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
YUITest.ComparisonFailure.prototype.getMessage = function(){
    return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
            "\nActual: " + this.actual + " (" + (typeof this.actual) + ")";
};

/**
 * ShouldError is subclass of Error that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest
 * @extends AssertionError
 * @class ShouldError
 * @constructor
 */
YUITest.ShouldError = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should have thrown an error but didn't.");

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldError";

};

//inherit from YUITest.AssertionError
YUITest.ShouldError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;

/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest
 * @extends YUITest.AssertionError
 * @class ShouldFail
 * @constructor
 */
YUITest.ShouldFail = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should fail but didn't.");

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldFail";

};

//inherit from YUITest.AssertionError
YUITest.ShouldFail.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;

/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be
 *                      thrown.
 * @namespace YUITest
 * @extends YUITest.AssertionError
 * @class UnexpectedError
 * @constructor
 */
YUITest.UnexpectedError = function (cause){

    //call superclass
    YUITest.AssertionError.call(this, "Unexpected error: " + cause.message);

    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    this.cause = cause;

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedError";

    /**
     * Stack information for the error (if provided).
     * @type String
     * @property stack
     */
    this.stack = cause.stack;

};

//inherit from YUITest.AssertionError
YUITest.UnexpectedError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;

/**
 * UnexpectedValue is subclass of Error that is thrown whenever
 * a value was unexpected in its scope. This typically means that a test
 * was performed to determine that a value was *not* equal to a certain
 * value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} unexpected The unexpected value.
 * @namespace YUITest
 * @extends AssertionError
 * @class UnexpectedValue
 * @constructor
 */
YUITest.UnexpectedValue = function (message, unexpected){

    //call superclass
    YUITest.AssertionError.call(this, message);

    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    this.unexpected = unexpected;

    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedValue";

};

//inherit from YUITest.AssertionError
YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
YUITest.UnexpectedValue.prototype.getMessage = function(){
    return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
};


/**
 * Represents a stoppage in test execution to wait for an amount of time before
 * continuing.
 * @param {Function} segment A function to run when the wait is over.
 * @param {int} delay The number of milliseconds to wait before running the code.
 * @class Wait
 * @namespace Test
 * @constructor
 *
 */
YUITest.Wait = function (segment, delay) {

    /**
     * The segment of code to run when the wait is over.
     * @type Function
     * @property segment
     */
    this.segment = (typeof segment == "function" ? segment : null);

    /**
     * The delay before running the segment of code.
     * @type int
     * @property delay
     */
    this.delay = (typeof delay == "number" ? delay : 0);
};


/**
 * The Assert object provides functions to test JavaScript values against
 * known and expected results. Whenever a comparison (assertion) fails,
 * an error is thrown.
 * @namespace YUITest
 * @class Assert
 * @static
 */
YUITest.Assert = {

    /**
     * The number of assertions performed.
     * @property _asserts
     * @type int
     * @private
     */
    _asserts: 0,

    //-------------------------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------------------------

    /**
     * Formats a message so that it can contain the original assertion message
     * in addition to the custom message.
     * @param {String} customMessage The message passed in by the developer.
     * @param {String} defaultMessage The message created by the error by default.
     * @return {String} The final error message, containing either or both.
     * @protected
     * @static
     * @method _formatMessage
     */
    _formatMessage : function (customMessage, defaultMessage) {
        if (typeof customMessage == "string" && customMessage.length > 0){
            return customMessage.replace("{message}", defaultMessage);
        } else {
            return defaultMessage;
        }
    },

    /**
     * Returns the number of assertions that have been performed.
     * @method _getCount
     * @protected
     * @static
     */
    _getCount: function(){
        return this._asserts;
    },

    /**
     * Increments the number of assertions that have been performed.
     * @method _increment
     * @protected
     * @static
     */
    _increment: function(){
        this._asserts++;
    },

    /**
     * Resets the number of assertions that have been performed to 0.
     * @method _reset
     * @protected
     * @static
     */
    _reset: function(){
        this._asserts = 0;
    },

    //-------------------------------------------------------------------------
    // Generic Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Forces an assertion error to occur.
     * @param {String} message (Optional) The message to display with the failure.
     * @method fail
     * @static
     */
    fail : function (message) {
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Test force-failed."));
    },

    //-------------------------------------------------------------------------
    // Equality Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    areEqual : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected != actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal."), expected, actual);
        }
    },

    /**
     * Asserts that a value is not equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotEqual
     * @static
     */
    areNotEqual : function (unexpected, actual,
                         message) {
        YUITest.Assert._increment();
        if (unexpected == actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be equal."), unexpected);
        }
    },

    /**
     * Asserts that a value is not the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotSame
     * @static
     */
    areNotSame : function (unexpected, actual, message) {
        YUITest.Assert._increment();
        if (unexpected === actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be the same."), unexpected);
        }
    },

    /**
     * Asserts that a value is the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areSame
     * @static
     */
    areSame : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be the same."), expected, actual);
        }
    },

    //-------------------------------------------------------------------------
    // Boolean Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is false. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFalse
     * @static
     */
    isFalse : function (actual, message) {
        YUITest.Assert._increment();
        if (false !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be false."), false, actual);
        }
    },

    /**
     * Asserts that a value is true. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTrue
     * @static
     */
    isTrue : function (actual, message) {
        YUITest.Assert._increment();
        if (true !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be true."), true, actual);
        }

    },

    //-------------------------------------------------------------------------
    // Special Value Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a value is not a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNaN
     * @static
     */
    isNaN : function (actual, message){
        YUITest.Assert._increment();
        if (!isNaN(actual)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be NaN."), NaN, actual);
        }
    },

    /**
     * Asserts that a value is not the special NaN value.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNaN
     * @static
     */
    isNotNaN : function (actual, message){
        YUITest.Assert._increment();
        if (isNaN(actual)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be NaN."), NaN);
        }
    },

    /**
     * Asserts that a value is not null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNull
     * @static
     */
    isNotNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual === null) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be null."), null);
        }
    },

    /**
     * Asserts that a value is not undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotUndefined
     * @static
     */
    isNotUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual == "undefined") {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should not be undefined."), undefined);
        }
    },

    /**
     * Asserts that a value is null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNull
     * @static
     */
    isNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual !== null) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be null."), null, actual);
        }
    },

    /**
     * Asserts that a value is undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isUndefined
     * @static
     */
    isUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "undefined") {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be undefined."), undefined, actual);
        }
    },

    //--------------------------------------------------------------------------
    // Instance Assertion Methods
    //--------------------------------------------------------------------------

    /**
     * Asserts that a value is an array.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isArray
     * @static
     */
    isArray : function (actual, message) {
        YUITest.Assert._increment();
        var shouldFail = false;
        if (Array.isArray){
            shouldFail = !Array.isArray(actual);
        } else {
            shouldFail = Object.prototype.toString.call(actual) != "[object Array]";
        }
        if (shouldFail){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an array."), actual);
        }
    },

    /**
     * Asserts that a value is a Boolean.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isBoolean
     * @static
     */
    isBoolean : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "boolean"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a Boolean."), actual);
        }
    },

    /**
     * Asserts that a value is a function.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFunction
     * @static
     */
    isFunction : function (actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof Function)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a function."), actual);
        }
    },

    /**
     * Asserts that a value is an instance of a particular object. This may return
     * incorrect results when comparing objects from one frame to constructors in
     * another frame. For best results, don't use in a cross-frame manner.
     * @param {Function} expected The function that the object should be an instance of.
     * @param {Object} actual The object to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isInstanceOf
     * @static
     */
    isInstanceOf : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof expected)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value isn't an instance of expected type."), expected, actual);
        }
    },

    /**
     * Asserts that a value is a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNumber
     * @static
     */
    isNumber : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "number"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a number."), actual);
        }
    },

    /**
     * Asserts that a value is an object.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isObject
     * @static
     */
    isObject : function (actual, message) {
        YUITest.Assert._increment();
        if (!actual || (typeof actual != "object" && typeof actual != "function")){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an object."), actual);
        }
    },

    /**
     * Asserts that a value is a string.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isString
     * @static
     */
    isString : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "string"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a string."), actual);
        }
    },

    /**
     * Asserts that a value is of a particular type.
     * @param {String} expectedType The expected type of the variable.
     * @param {Object} actualValue The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTypeOf
     * @static
     */
    isTypeOf : function (expectedType, actualValue, message){
        YUITest.Assert._increment();
        if (typeof actualValue != expectedType){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be of type " + expectedType + "."), expectedType, typeof actualValue);
        }
    },

    //--------------------------------------------------------------------------
    // Error Detection Methods
    //--------------------------------------------------------------------------

    /**
     * Asserts that executing a particular method should throw an error of
     * a specific type. This is a replacement for _should.error.
     * @param {String|Function|Object} expectedError If a string, this
     *      is the error message that the error must have; if a function, this
     *      is the constructor that should have been used to create the thrown
     *      error; if an object, this is an instance of a particular error type
     *      with a specific error message (both must match).
     * @param {Function} method The method to execute that should throw the error.
     * @param {String} message (Optional) The message to display if the assertion
     *      fails.
     * @method throwsError
     * @return {void}
     * @static
     */
    throwsError: function(expectedError, method, message){
        YUITest.Assert._increment();
        var error = false;

        try {
            method();
        } catch (thrown) {

            //check to see what type of data we have
            if (typeof expectedError == "string"){

                //if it's a string, check the error message
                if (thrown.message != expectedError){
                    error = true;
                }
            } else if (typeof expectedError == "function"){

                //if it's a function, see if the error is an instance of it
                if (!(thrown instanceof expectedError)){
                    error = true;
                }

            } else if (typeof expectedError == "object" && expectedError !== null){

                //if it's an object, check the instance and message
                if (!(thrown instanceof expectedError.constructor) ||
                        thrown.message != expectedError.message){
                    error = true;
                }

            } else { //if it gets here, the argument could be wrong
                error = true;
            }

            if (error){
                throw new YUITest.UnexpectedError(thrown);
            } else {
                return;
            }
        }

        //if it reaches here, the error wasn't thrown, which is a bad thing
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Error should have been thrown."));
    }

};


/**
 * The ArrayAssert object provides functions to test JavaScript array objects
 * for a variety of cases.
 * @namespace YUITest
 * @class ArrayAssert
 * @static
 */

YUITest.ArrayAssert = {

    //=========================================================================
    // Private methods
    //=========================================================================

    /**
     * Simple indexOf() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Variant} needle The value to locate.
     * @return {int} The index of the needle if found or -1 if not.
     * @method _indexOf
     * @private
     */
    _indexOf: function(haystack, needle){
        if (haystack.indexOf){
            return haystack.indexOf(needle);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (haystack[i] === needle){
                    return i;
                }
            }
            return -1;
        }
    },

    /**
     * Simple some() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Function} matcher The function to run on each value.
     * @return {Boolean} True if any value, when run through the matcher,
     *      returns true.
     * @method _some
     * @private
     */
    _some: function(haystack, matcher){
        if (haystack.some){
            return haystack.some(matcher);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (matcher(haystack[i])){
                    return true;
                }
            }
            return false;
        }
    },

    /**
     * Asserts that a value is present in an array. This uses the triple equals
     * sign so no type cohersion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains : function (needle, haystack,
                           message) {

        YUITest.Assert._increment();

        if (this._indexOf(haystack, needle) == -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are present in an array. This uses the triple equals
     * sign so no type cohersion may occur. For this assertion to pass, all values must
     * be found.
     * @param {Object[]} needles An array of values that are expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsItems
     * @static
     */
    containsItems : function (needles, haystack,
                           message) {
        YUITest.Assert._increment();

        //begin checking values
        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) == -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needles[i] + " (" + (typeof needles[i]) + ") not found in array [" + haystack + "]."));
            }
        }
    },

    /**
     * Asserts that a value matching some condition is present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the items matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsMatch
     * @static
     */
    containsMatch : function (matcher, haystack,
                           message) {

        YUITest.Assert._increment();
        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
        }

        if (!this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a value is not present in an array. This uses the triple equals
     * Asserts that a value is not present in an array. This uses the triple equals
     * sign so no type cohersion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContain
     * @static
     */
    doesNotContain : function (needle, haystack,
                           message) {

        YUITest.Assert._increment();

        if (this._indexOf(haystack, needle) > -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are not present in an array. This uses the triple equals
     * sign so no type cohersion may occur. For this assertion to pass, all values must
     * not be found.
     * @param {Object[]} needles An array of values that are not expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainItems
     * @static
     */
    doesNotContainItems : function (needles, haystack,
                           message) {

        YUITest.Assert._increment();

        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) > -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        }

    },

    /**
     * Asserts that no values matching a condition are present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the item matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainMatch
     * @static
     */
    doesNotContainMatch : function (matcher, haystack,
                           message) {

        YUITest.Assert._increment();

        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
        }

        if (this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that the given value is contained in an array at the specified index.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method indexOf
     * @static
     */
    indexOf : function (needle, haystack, index, message) {

        YUITest.Assert._increment();

        //try to find the value in the array
        for (var i=0; i < haystack.length; i++){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                }
                return;
            }
        }

        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
    },

    /**
     * Asserts that the values in an array are equal, and in the same position,
     * as values in another array. This uses the double equals sign
     * so type cohersion may occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEqual
     * @static
     */
    itemsAreEqual : function (expected, actual,
                           message) {

        YUITest.Assert._increment();

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] != actual[i]){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equal."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that the values in an array are equivalent, and in the same position,
     * as values in another array. This uses a function to determine if the values
     * are equivalent. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {Function} comparator A function that returns true if the values are equivalent
     *      or false if not.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @return {Void}
     * @method itemsAreEquivalent
     * @static
     */
    itemsAreEquivalent : function (expected, actual,
                           comparator, message) {

        YUITest.Assert._increment();

        //make sure the comparator is valid
        if (typeof comparator != "function"){
            throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
        }

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (!comparator(expected[i], actual[i])){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that an array is empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isEmpty
     * @static
     */
    isEmpty : function (actual, message) {
        YUITest.Assert._increment();
        if (actual.length > 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should be empty."));
        }
    },

    /**
     * Asserts that an array is not empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty : function (actual, message) {
        YUITest.Assert._increment();
        if (actual.length === 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should not be empty."));
        }
    },

    /**
     * Asserts that the values in an array are the same, and in the same position,
     * as values in another array. This uses the triple equals sign
     * so no type cohersion will occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreSame
     * @static
     */
    itemsAreSame : function (expected, actual,
                          message) {

        YUITest.Assert._increment();

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }

        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] !== actual[i]){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not the same."), expected[i], actual[i]);
            }
        }
    },

    /**
     * Asserts that the given value is contained in an array at the specified index,
     * starting from the back of the array.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method lastIndexOf
     * @static
     */
    lastIndexOf : function (needle, haystack, index, message) {

        //try to find the value in the array
        for (var i=haystack.length; i >= 0; i--){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));
                }
                return;
            }
        }

        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array."));
    }

};


/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 * @namespace YUITest
 * @class ObjectAssert
 * @static
 */
YUITest.ObjectAssert = {

    /**
     * Asserts that an object has all of the same properties
     * and property values as the other.
     * @param {Object} expected The object with all expected properties and values.
     * @param {Object} actual The object to inspect.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     * @deprecated
     */
    areEqual: function(expected, actual, message) {
        YUITest.Assert._increment();

        for (var name in expected){
            if (expected.hasOwnProperty(name)){
                if (expected[name] != actual[name]){
                    throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal for property " + name), expected[name], actual[name]);
                }
            }
        }
    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKey
     * @static
     * @deprecated Use ownsOrInheritsKey() instead
     */
    hasKey: function (propertyName, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);
    },

    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKeys
     * @static
     * @deprecated Use ownsOrInheritsKeys() instead
     */
    hasKeys: function (properties, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKeys(properties, objects, message);
    },

    /**
     * Asserts that a property with the given name exists on an object's prototype.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKey
     * @static
     */
    inheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!(propertyName in object && !object.hasOwnProperty(propertyName))){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }
    },

    /**
     * Asserts that all properties exist on an object prototype.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKeys
     * @static
     */
    inheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }
        }
    },

    /**
     * Asserts that a property with the given name exists on an object instance (not on its prototype).
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKey
     * @static
     */
    ownsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!object.hasOwnProperty(propertyName)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }
    },

    /**
     * Asserts that all properties exist on an object instance (not on its prototype).
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKeys
     * @static
     */
    ownsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!object.hasOwnProperty(properties[i])){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }
        }
    },

    /**
     * Asserts that an object owns no properties.
     * @param {Object} object The object to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsNoKeys
     * @static
     */
    ownsNoKeys : function (object, message) {
        YUITest.Assert._increment();
        var count = 0,
            name;
        for (name in object){
            if (object.hasOwnProperty(name)){
                count++;
            }
        }

        if (count !== 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object owns " + count + " properties but should own none."));
        }

    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKey
     * @static
     */
    ownsOrInheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();
        if (!(propertyName in object)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
        }
    },

    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKeys
     * @static
     */
    ownsOrInheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();
        for (var i=0; i < properties.length; i++){
            if (!(properties[i] in object)){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object."));
            }
        }
    }
};



/**
 * The DateAssert object provides functions to test JavaScript Date objects
 * for a variety of cases.
 * @namespace  YUITest
 * @class DateAssert
 * @static
 */

YUITest.DateAssert = {

    /**
     * Asserts that a date's month, day, and year are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method datesAreEqual
     * @static
     */
    datesAreEqual : function (expected, actual, message){
        YUITest.Assert._increment();
        if (expected instanceof Date && actual instanceof Date){
            var msg = "";

            //check years first
            if (expected.getFullYear() != actual.getFullYear()){
                msg = "Years should be equal.";
            }

            //now check months
            if (expected.getMonth() != actual.getMonth()){
                msg = "Months should be equal.";
            }

            //last, check the day of the month
            if (expected.getDate() != actual.getDate()){
                msg = "Days of month should be equal.";
            }

            if (msg.length){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            throw new TypeError("YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
        }
    },

    /**
     * Asserts that a date's hour, minutes, and seconds are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method timesAreEqual
     * @static
     */
    timesAreEqual : function (expected, actual, message){
        YUITest.Assert._increment();
        if (expected instanceof Date && actual instanceof Date){
            var msg = "";

            //check hours first
            if (expected.getHours() != actual.getHours()){
                msg = "Hours should be equal.";
            }

            //now check minutes
            if (expected.getMinutes() != actual.getMinutes()){
                msg = "Minutes should be equal.";
            }

            //last, check the seconds
            if (expected.getSeconds() != actual.getSeconds()){
                msg = "Seconds should be equal.";
            }

            if (msg.length){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
        }
    }

};

/**
 * Creates a new mock object.
 * @namespace YUITest
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object.
 */
YUITest.Mock = function(template){

    //use blank object is nothing is passed in
    template = template || {};

    var mock,
        name;

    //try to create mock that keeps prototype chain intact
    //fails in the case of ActiveX objects
    try {
        function f(){}
        f.prototype = template;
        mock = new f();
    } catch (ex) {
        mock = {};
    }

    //create stubs for all methods
    for (name in template){
        if (template.hasOwnProperty(name)){
            if (typeof template[name] == "function"){
                mock[name] = function(name){
                    return function(){
                        YUITest.Assert.fail("Method " + name + "() was called but was not expected to be.");
                    };
                }(name);
            }
        }
    }

    //return it
    return mock;
};

/**
 * Assigns an expectation to a mock object. This is used to create
 * methods and properties on the mock object that are monitored for
 * calls and changes, respectively.
 * @param {Object} mock The object to add the expectation to.
 * @param {Object} expectation An object defining the expectation. For
 *      a method, the keys "method" and "args" are required with
 *      an optional "returns" key available. For properties, the keys
 *      "property" and "value" are required.
 * @return {void}
 * @method expect
 * @static
 */
YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

    //make sure there's a place to store the expectations
    if (!mock.__expectations) {
        mock.__expectations = {};
    }

    //method expectation
    if (expectation.method){
        var name = expectation.method,
            args = expectation.args || [],
            result = expectation.returns,
            callCount = (typeof expectation.callCount == "number") ? expectation.callCount : 1,
            error = expectation.error,
            run = expectation.run || function(){},
            i;

        //save expectations
        mock.__expectations[name] = expectation;
        expectation.callCount = callCount;
        expectation.actualCallCount = 0;

        //process arguments
        for (i=0; i < args.length; i++){
             if (!(args[i] instanceof YUITest.Mock.Value)){
                args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
            }
        }

        //if the method is expected to be called
        if (callCount > 0){
            mock[name] = function(){
                try {
                    expectation.actualCallCount++;
                    YUITest.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                    for (var i=0, len=args.length; i < len; i++){
                        args[i].verify(arguments[i]);
                    }

                    run.apply(this, arguments);

                    if (error){
                        throw error;
                    }
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }

                return result;
            };
        } else {

            //method should fail if called when not expected
            mock[name] = function(){
                try {
                    YUITest.Assert.fail("Method " + name + "() should not have been called.");
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }
            };
        }
    } else if (expectation.property){
        //save expectations
        mock.__expectations[name] = expectation;
    }
};

/**
 * Verifies that all expectations of a mock object have been met and
 * throws an assertion error if not.
 * @param {Object} mock The object to verify..
 * @return {void}
 * @method verify
 * @static
 */
YUITest.Mock.verify = function(mock){
    try {

        for (var name in mock.__expectations){
            if (mock.__expectations.hasOwnProperty(name)){
                var expectation = mock.__expectations[name];
                if (expectation.method) {
                    YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else if (expectation.property){
                    YUITest.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value.");
                }
            }
        }

    } catch (ex){
        //route through TestRunner for proper handling
        YUITest.TestRunner._handleError(ex);
    }
};

/**
 * Creates a new value matcher.
 * @param {Function} method The function to call on the value.
 * @param {Array} originalArgs (Optional) Array of arguments to pass to the method.
 * @param {String} message (Optional) Message to display in case of failure.
 * @namespace YUITest.Mock
 * @class Value
 * @constructor
 */
YUITest.Mock.Value = function(method, originalArgs, message){
    if (this instanceof YUITest.Mock.Value){
        this.verify = function(value){
            var args = [].concat(originalArgs || []);
            args.push(value);
            args.push(message);
            method.apply(null, args);
        };
    } else {
        return new YUITest.Mock.Value(method, originalArgs, message);
    }
};

/**
 * Predefined matcher to match any value.
 * @property Any
 * @static
 * @type Function
 */
YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});

/**
 * Predefined matcher to match boolean values.
 * @property Boolean
 * @static
 * @type Function
 */
YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);

/**
 * Predefined matcher to match number values.
 * @property Number
 * @static
 * @type Function
 */
YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);

/**
 * Predefined matcher to match string values.
 * @property String
 * @static
 * @type Function
 */
YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);

/**
 * Predefined matcher to match object values.
 * @property Object
 * @static
 * @type Function
 */
YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);

/**
 * Predefined matcher to match function values.
 * @property Function
 * @static
 * @type Function
 */
YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);

/**
 * Convenience type for storing and aggregating
 * test result information.
 * @private
 * @namespace YUITest
 * @class Results
 * @constructor
 * @param {String} name The name of the test.
 */
YUITest.Results = function(name){

    /**
     * Name of the test, test case, or test suite.
     * @type String
     * @property name
     */
    this.name = name;

    /**
     * Number of passed tests.
     * @type int
     * @property passed
     */
    this.passed = 0;

    /**
     * Number of failed tests.
     * @type int
     * @property failed
     */
    this.failed = 0;

    /**
     * Number of errors that occur in non-test methods.
     * @type int
     * @property errors
     */
    this.errors = 0;

    /**
     * Number of ignored tests.
     * @type int
     * @property ignored
     */
    this.ignored = 0;

    /**
     * Number of total tests.
     * @type int
     * @property total
     */
    this.total = 0;

    /**
     * Amount of time (ms) it took to complete testing.
     * @type int
     * @property duration
     */
    this.duration = 0;
};

/**
 * Includes results from another results object into this one.
 * @param {YUITest.Results} result The results object to include.
 * @method include
 * @return {void}
 */
YUITest.Results.prototype.include = function(results){
    this.passed += results.passed;
    this.failed += results.failed;
    this.ignored += results.ignored;
    this.total += results.total;
    this.errors += results.errors;
};

/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @class TestCase
 * @namespace YUITest
 * @constructor
 */
YUITest.TestCase = function (template) {

    /**
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    this._should = {};

    //copy over all properties from the template to this object
    for (var prop in template) {
        this[prop] = template[prop];
    }

    //check for a valid name
    if (typeof this.name != "string"){
        this.name = "testCase" + (+new Date());
    }

};

YUITest.TestCase.prototype = {

    //restore constructor
    constructor: YUITest.TestCase,

    /**
     * Method to call from an async init method to
     * restart the test case. When called, returns a function
     * that should be called when tests are ready to continue.
     * @method callback
     * @return {Function} The function to call as a callback.
     */
    callback: function(){
        return YUITest.TestRunner.callback.apply(YUITest.TestRunner,arguments);
    },

    /**
     * Resumes a paused test and runs the given function.
     * @param {Function} segment (Optional) The function to run.
     *      If omitted, the test automatically passes.
     * @return {Void}
     * @method resume
     */
    resume : function (segment) {
        YUITest.TestRunner.resume(segment);
    },

    /**
     * Causes the test case to wait a specified amount of time and then
     * continue executing the given code.
     * @param {Function} segment (Optional) The function to run after the delay.
     *      If omitted, the TestRunner will wait until resume() is called.
     * @param {int} delay (Optional) The number of milliseconds to wait before running
     *      the function. If omitted, defaults to zero.
     * @return {Void}
     * @method wait
     */
    wait : function (segment, delay){

        var actualDelay = (typeof segment == "number" ? segment : delay);
        actualDelay = (typeof actualDelay == "number" ? actualDelay : 10000);

		if (typeof segment == "function"){
            throw new YUITest.Wait(segment, actualDelay);
        } else {
            throw new YUITest.Wait(function(){
                YUITest.Assert.fail("Timeout: wait() called but resume() never called.");
            }, actualDelay);
        }
    },

    //-------------------------------------------------------------------------
    // Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a given condition is true. If not, then a YUITest.AssertionError object is thrown
     * and the test fails.
     * @method assert
     * @param {Boolean} condition The condition to test.
     * @param {String} message The message to display if the assertion fails.
     */
    assert : function (condition, message){
        YUITest.Assert._increment();
        if (!condition){
            throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Assertion failed."));
        }
    },

    /**
     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {
        YUITest.Assert.fail(message);
    },

    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run once before tests start to run.
     * This executes before the first call to setUp().
     */
    init: function(){
        //noop
    },

    /**
     * Function to run once after tests finish running.
     * This executes after the last call to tearDown().
     */
    destroy: function(){
        //noop
    },

    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
        //noop
    },

    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {
        //noop
    }
};



/**
 * A test suite that can contain a collection of TestCase and TestSuite objects.
 * @param {String||Object} data The name of the test suite or an object containing
 *      a name property as well as setUp and tearDown methods.
 * @namespace YUITest
 * @class TestSuite
 * @constructor
 */
YUITest.TestSuite = function (data) {

    /**
     * The name of the test suite.
     * @type String
     * @property name
     */
    this.name = "";

    /**
     * Array of test suites and test cases.
     * @type Array
     * @property items
     * @private
     */
    this.items = [];

    //initialize the properties
    if (typeof data == "string"){
        this.name = data;
    } else if (data instanceof Object){
        for (var prop in data){
            if (data.hasOwnProperty(prop)){
                this[prop] = data[prop];
            }
        }
    }

    //double-check name
    if (this.name === ""){
        this.name = "testSuite" + (+new Date());
    }

};

YUITest.TestSuite.prototype = {

    //restore constructor
    constructor: YUITest.TestSuite,

    /**
     * Adds a test suite or test case to the test suite.
     * @param {YUITest.TestSuite||YUITest.TestCase} testObject The test suite or test case to add.
     * @return {Void}
     * @method add
     */
    add : function (testObject) {
        if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {
            this.items.push(testObject);
        }
        return this;
    },

    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
    },

    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {
    }

};

/**
 * An object object containing test result formatting methods.
 * @namespace YUITest
 * @class TestFormat
 * @static
 */
YUITest.TestFormat = function(){

    /* (intentionally not documented)
     * Basic XML escaping method. Replaces quotes, less-than, greater-than,
     * apostrophe, and ampersand characters with their corresponding entities.
     * @param {String} text The text to encode.
     * @return {String} The XML-escaped text.
     */
    function xmlEscape(text){

        return text.replace(/[<>"'&]/g, function(value){
            switch(value){
                case "<":   return "&lt;";
                case ">":   return "&gt;";
                case "\"":  return "&quot;";
                case "'":   return "&apos;";
                case "&":   return "&amp;";
            }
        });

    }


    return {

        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method JSON
         * @static
         */
        JSON: function(results) {
            return YUITest.Util.JSON.stringify(results);
        },

        /**
         * Returns test results formatted as an XML string.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method XML
         * @static
         */
        XML: function(results) {

            function serializeToXML(results){
                var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";

                if (typeof(results.duration)=="number"){
                    xml += " duration=\"" + results.duration + "\"";
                }

                if (results.type == "test"){
                    xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
                } else {
                    xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                    for (var prop in results){
                        if (results.hasOwnProperty(prop)){
                            if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                xml += serializeToXML(results[prop]);
                            }
                        }
                    }
                }

                xml += "</" + results.type + ">";

                return xml;
            }

            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToXML(results);

        },


        /**
         * Returns test results formatted in JUnit XML format.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method JUnitXML
         * @static
         */
        JUnitXML: function(results) {

            function serializeToJUnitXML(results){
                var xml = "";

                switch (results.type){
                    //equivalent to testcase in JUnit
                    case "test":
                        if (results.result != "ignore"){
                            xml = "<testcase name=\"" + xmlEscape(results.name) + "\" time=\"" + (results.duration/1000) + "\">";
                            if (results.result == "fail"){
                                xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                            }
                            xml+= "</testcase>";
                        }
                        break;

                    //equivalent to testsuite in JUnit
                    case "testcase":

                        xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\" time=\"" + (results.duration/1000) + "\">";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }

                        xml += "</testsuite>";
                        break;

                    //no JUnit equivalent, don't output anything
                    case "testsuite":
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }
                        break;

                    //top-level, equivalent to testsuites in JUnit
                    case "report":

                        xml = "<testsuites>";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }

                        xml += "</testsuites>";

                    //no default
                }

                return xml;

            }

            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToJUnitXML(results);
        },

        /**
         * Returns test results formatted in TAP format.
         * For more information, see <a href="http://testanything.org/">Test Anything Protocol</a>.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A TAP-formatted string of results.
         * @method TAP
         * @static
         */
        TAP: function(results) {

            var currentTestNum = 1;

            function serializeToTAP(results){
                var text = "";

                switch (results.type){

                    case "test":
                        if (results.result != "ignore"){

                            text = "ok " + (currentTestNum++) + " - " + results.name;

                            if (results.result == "fail"){
                                text = "not " + text + " - " + results.message;
                            }

                            text += "\n";
                        } else {
                            text = "#Ignored test " + results.name + "\n";
                        }
                        break;

                    case "testcase":

                        text = "#Begin testcase " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                        text += "#End testcase " + results.name + "\n";


                        break;

                    case "testsuite":

                        text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                        text += "#End testsuite " + results.name + "\n";
                        break;

                    case "report":

                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }

                    //no default
                }

                return text;

            }

            return "1.." + results.total + "\n" + serializeToTAP(results);
        }

    };
}();

/**
 * An object object containing coverage result formatting methods.
 * @namespace YUITest
 * @class CoverageFormat
 * @static
 */
YUITest.CoverageFormat = {

    /**
     * Returns the coverage report in JSON format. This is the straight
     * JSON representation of the native coverage report.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method JSON
     * @namespace YUITest.CoverageFormat
     */
    JSON: function(coverage){
        return YUITest.Util.JSON.stringify(coverage);
    },

    /**
     * Returns the coverage report in a JSON format compatible with
     * Xdebug. See <a href="http://www.xdebug.com/docs/code_coverage">Xdebug Documentation</a>
     * for more information. Note: function coverage is not available
     * in this format.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method XdebugJSON
     * @namespace YUITest.CoverageFormat
     */
    XdebugJSON: function(coverage){

        var report = {};
        for (var prop in coverage){
            if (coverage.hasOwnProperty(prop)){
                report[prop] = coverage[prop].lines;
            }
        }

        return YUITest.Util.JSON.stringify(coverage);
    }

};


/**
 * An object object containing methods to simulate browser events.
 * @namespace YUITest
 * @class Event
 * @static
 */
YUITest.Event = (function() {

    var

    //mouse events supported
    mouseEvents = {
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1
    },

    //key events supported
    keyEvents   = {
        keydown:    1,
        keyup:      1,
        keypress:   1
    },

    //HTML events supported
    uiEvents  = {
        blur:       1,
        change:     1,
        focus:      1,
        resize:     1,
        scroll:     1,
        select:     1
    },

    //events that bubble by default
    bubbleEvents = {
        scroll:     1,
        resize:     1,
        reset:      1,
        submit:     1,
        change:     1,
        select:     1,
        error:      1,
        abort:      1,

        //also mouse events
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1,

        //and keyboard events
        keydown:    1,
        keyup:      1,
        keypress:   1

    },

    //the object to return
    object,

    //used for property name iteration
    prop;

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a key event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks. Note: keydown causes Safari 2.x to
     * crash.
     * @method simulateKeyEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: keyup, keydown, and keypress.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 3 specifies that all key events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 3 specifies that all
     *      key events can be cancelled. The default
     *      is true.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} keyCode (Optional) The code for the key that is in use.
     *      The default is 0.
     * @param {int} charCode (Optional) The Unicode code for the character
     *      associated with the key being used. The default is 0.
     */
    function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/,
                                 bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                                 view /*:Window*/,
                                 ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                                 shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                                 keyCode /*:int*/,        charCode /*:int*/) /*:Void*/
    {
        //check target
        if (!target){
            throw new Error("simulateKeyEvent(): Invalid target.");
        }

        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();
            switch(type){
                case "textevent": //DOM Level 3
                    type = "keypress";
                    break;
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                default:
                    throw new Error("simulateKeyEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateKeyEvent(): Event type must be a string.");
        }

        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = true; //all key events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = true; //all key events can be cancelled
        }
        if (typeof view != "object" || view == null){
            view = window; //view is typically window
        }
        if (typeof ctrlKey != "boolean"){
            ctrlKey = false;
        }
        if (typeof altKey != "boolean"){
            altKey = false;
        }
        if (typeof shiftKey != "boolean"){
            shiftKey = false;
        }
        if (typeof metaKey != "boolean"){
            metaKey = false;
        }
        if (typeof keyCode != "number"){
            keyCode = 0;
        }
        if (typeof charCode != "number"){
            charCode = 0;
        }

        //try to create a mouse event
        var customEvent = null;

        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){

            try {

                //try to create key event
                customEvent = document.createEvent("KeyEvents");

                /*
                 * Interesting problem: Firefox implemented a non-standard
                 * version of initKeyEvent() based on DOM Level 2 specs.
                 * Key event was removed from DOM Level 2 and re-introduced
                 * in DOM Level 3 with a different interface. Firefox is the
                 * only browser with any implementation of Key Events, so for
                 * now, assume it's Firefox if the above line doesn't error.
                 */
                // @TODO: Decipher between Firefox's implementation and a correct one.
                customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                    altKey, shiftKey, metaKey, keyCode, charCode);

            } catch (ex){

                /*
                 * If it got here, that means key events aren't officially supported.
                 * Safari/WebKit is a real problem now. WebKit 522 won't let you
                 * set keyCode, charCode, or other properties if you use a
                 * UIEvent, so we first must try to create a generic event. The
                 * fun part is that this will throw an error on Safari 2.x. The
                 * end result is that we need another try...catch statement just to
                 * deal with this mess.
                 */
                try {

                    //try to create generic event - will fail in Safari 2.x
                    customEvent = document.createEvent("Events");

                } catch (uierror /*:Error*/){

                    //the above failed, so create a UIEvent for Safari 2.x
                    customEvent = document.createEvent("UIEvents");

                } finally {

                    customEvent.initEvent(type, bubbles, cancelable);

                    //initialize
                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;

                }

            }

            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE

            //create an IE event object
            customEvent = document.createEventObject();

            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;

            /*
             * IE doesn't support charCode explicitly. CharCode should
             * take precedence over any keyCode value for accurate
             * representation.
             */
            customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

            //fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            throw new Error("simulateKeyEvent(): No event simulation framework present.");
        }
    }

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a mouse event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateMouseEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default
     *      is true for all events except mousemove, for which the default
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     * @param {int} screenX (Optional) The x-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} screenY (Optional) The y-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} clientX (Optional) The x-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {int} clientY (Optional) The y-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} button (Optional) The button being pressed while the event
     *      is executing. The value should be 0 for the primary mouse button
     *      (typically the left button), 1 for the terciary mouse button
     *      (typically the middle button), and 2 for the secondary mouse button
     *      (typically the right button). The default is 0.
     * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
     *      this is the element that the mouse has moved to. For mouseover
     *      events, this is the element that the mouse has moved from. This
     *      argument is ignored for all other events. The default is null.
     */
    function simulateMouseEvent(target /*:HTMLElement*/, type /*:String*/,
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                                   view /*:Window*/,        detail /*:int*/,
                                   screenX /*:int*/,        screenY /*:int*/,
                                   clientX /*:int*/,        clientY /*:int*/,
                                   ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                                   shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                                   button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
    {

        //check target
        if (!target){
            throw new Error("simulateMouseEvent(): Invalid target.");
        }

        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();

            //make sure it's a supported mouse event
            if (!mouseEvents[type]){
                throw new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateMouseEvent(): Event type must be a string.");
        }

        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = true; //all mouse events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
        }
        if (typeof view != "object" || view != null){
            view = window; //view is typically window
        }
        if (typeof detail != "number"){
            detail = 1;  //number of mouse clicks must be at least one
        }
        if (typeof screenX != "number"){
            screenX = 0;
        }
        if (typeof screenY != "number"){
            screenY = 0;
        }
        if (typeof clientX != "number"){
            clientX = 0;
        }
        if (typeof clientY != "number"){
            clientY = 0;
        }
        if (typeof ctrlKey != "boolean"){
            ctrlKey = false;
        }
        if (typeof altKey != "boolean"){
            altKey = false;
        }
        if (typeof shiftKey != "boolean"){
            shiftKey = false;
        }
        if (typeof metaKey != "boolean"){
            metaKey = false;
        }
        if (typeof button != "number"){
            button = 0;
        }

        if (!relatedTarget){
            relatedTarget = null;
        }

        //try to create a mouse event
        var customEvent /*:MouseEvent*/ = null;

        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){

            customEvent = document.createEvent("MouseEvents");

            //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (customEvent.initMouseEvent){
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                     screenX, screenY, clientX, clientY,
                                     ctrlKey, altKey, shiftKey, metaKey,
                                     button, relatedTarget);
            } else { //Safari

                //the closest thing available in Safari 2.x is UIEvents
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }

            /*
             * Check to see if relatedTarget has been assigned. Firefox
             * versions less than 2.0 don't allow it to be assigned via
             * initMouseEvent() and the property is readonly after event
             * creation, so in order to keep YAHOO.util.getRelatedTarget()
             * working, assign to the IE proprietary toElement property
             * for mouseout event and fromElement property for mouseover
             * event.
             */
            if (relatedTarget && !customEvent.relatedTarget){
                if (type == "mouseout"){
                    customEvent.toElement = relatedTarget;
                } else if (type == "mouseover"){
                    customEvent.fromElement = relatedTarget;
                }
            }

            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE

            //create an IE event object
            customEvent = document.createEventObject();

            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;

            //fix button property for IE's wacky implementation
            switch(button){
                case 0:
                    customEvent.button = 1;
                    break;
                case 1:
                    customEvent.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    customEvent.button = 0;
            }

            /*
             * Have to use relatedTarget because IE won't allow assignment
             * to toElement or fromElement on generic events. This keeps
             * YAHOO.util.customEvent.getRelatedTarget() functional.
             */
            customEvent.relatedTarget = relatedTarget;

            //fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            throw new Error("simulateMouseEvent(): No event simulation framework present.");
        }
    }

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a UI event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateHTMLEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default
     *      is true for all events except mousemove, for which the default
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     */
    function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/,
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                                   view /*:Window*/,        detail /*:int*/) /*:Void*/
    {

        //check target
        if (!target){
            throw new Error("simulateUIEvent(): Invalid target.");
        }

        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();

            //make sure it's a supported mouse event
            if (!uiEvents[type]){
                throw new Error("simulateUIEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateUIEvent(): Event type must be a string.");
        }

        //try to create a mouse event
        var customEvent = null;


        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = (type in bubbleEvents);  //not all events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = (type == "submit"); //submit is the only one that can be cancelled
        }
        if (typeof view != "object" || view != null){
            view = window; //view is typically window
        }
        if (typeof detail != "number"){
            detail = 1;  //usually not used but defaulted to this
        }

        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){

            //just a generic UI Event object is needed
            customEvent = document.createEvent("UIEvents");
            customEvent.initUIEvent(type, bubbles, cancelable, view, detail);

            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE

            //create an IE event object
            customEvent = document.createEventObject();

            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;

            //fire the event
            target.fireEvent("on" + type, customEvent);

        } else {
            throw new Error("simulateUIEvent(): No event simulation framework present.");
        }
    }


    /**
     * Allows event simulation for browser-based events.
     * @namespace YUITest
     * @class Event
     * @static
     */
    object = {

        /**
         * Simulates the event with the given name on a target.
         * @param {HTMLElement} target The DOM element that's the target of the event.
         * @param {String} type The type of event to simulate (i.e., "click").
         * @param {Object} options (Optional) Extra options to copy onto the event object.
         * @return {void}
         * @method simulate
         * @static
         * @deprecated
         */
        simulate: function(target, type, options){

            options = options || {};

            if (mouseEvents[type]){
                simulateMouseEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail, options.screenX,
                    options.screenY, options.clientX, options.clientY, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, options.button,
                    options.relatedTarget);
            } else if (keyEvents[type]){
                simulateKeyEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey,
                    options.keyCode, options.charCode);
            } else if (uiEvents[type]){
                simulateUIEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail);
             } else {
                throw new Error("simulate(): Event '" + type + "' can't be simulated.");
            }
        }
    };

    //create the convenience methods for mouse events
    for (prop in mouseEvents){
        if (mouseEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateMouseEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.detail, options.screenX,
                        options.screenY, options.clientX, options.clientY, options.ctrlKey,
                        options.altKey, options.shiftKey, options.metaKey, options.button,
                        options.relatedTarget);
                };
            })(prop);
        }
    }

    //create the convenience methods for key events
    for (prop in keyEvents){
        if (keyEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateKeyEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.ctrlKey,
                        options.altKey, options.shiftKey, options.metaKey,
                        options.keyCode, options.charCode);
                };
            })(prop);
        }
    }

    //create the convenience methods for key events
    for (prop in uiEvents){
        if (uiEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateUIEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.detail);
                };
            })(prop);
        }
    }

    return object;

})();


    /**
     * An object capable of sending test results to a server.
     * @param {String} url The URL to submit the results to.
     * @param {Function} format (Optiona) A function that outputs the results in a specific format.
     *      Default is YUITest.TestFormat.XML.
     * @constructor
     * @namespace YUITest
     * @class Reporter
     */
    YUITest.Reporter = function(url, format) {

        /**
         * The URL to submit the data to.
         * @type String
         * @property url
         */
        this.url = url;

        /**
         * The formatting function to call when submitting the data.
         * @type Function
         * @property format
         */
        this.format = format || YUITest.TestFormat.XML;

        /**
         * Extra fields to submit with the request.
         * @type Object
         * @property _fields
         * @private
         */
        this._fields = new Object();

        /**
         * The form element used to submit the results.
         * @type HTMLFormElement
         * @property _form
         * @private
         */
        this._form = null;

        /**
         * Iframe used as a target for form submission.
         * @type HTMLIFrameElement
         * @property _iframe
         * @private
         */
        this._iframe = null;
    };

    YUITest.Reporter.prototype = {

        //restore missing constructor
        constructor: YUITest.Reporter,

        /**
         * Adds a field to the form that submits the results.
         * @param {String} name The name of the field.
         * @param {Variant} value The value of the field.
         * @return {Void}
         * @method addField
         */
        addField : function (name, value){
            this._fields[name] = value;
        },

        /**
         * Removes all previous defined fields.
         * @return {Void}
         * @method addField
         */
        clearFields : function(){
            this._fields = new Object();
        },

        /**
         * Cleans up the memory associated with the TestReporter, removing DOM elements
         * that were created.
         * @return {Void}
         * @method destroy
         */
        destroy : function() {
            if (this._form){
                this._form.parentNode.removeChild(this._form);
                this._form = null;
            }
            if (this._iframe){
                this._iframe.parentNode.removeChild(this._iframe);
                this._iframe = null;
            }
            this._fields = null;
        },

        /**
         * Sends the report to the server.
         * @param {Object} results The results object created by TestRunner.
         * @return {Void}
         * @method report
         */
        report : function(results){

            //if the form hasn't been created yet, create it
            if (!this._form){
                this._form = document.createElement("form");
                this._form.method = "post";
                this._form.style.visibility = "hidden";
                this._form.style.position = "absolute";
                this._form.style.top = 0;
                document.body.appendChild(this._form);

                //IE won't let you assign a name using the DOM, must do it the hacky way
                try {
                    this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                } catch (ex){
                    this._iframe = document.createElement("iframe");
                    this._iframe.name = "yuiTestTarget";
                }

                this._iframe.src = "javascript:false";
                this._iframe.style.visibility = "hidden";
                this._iframe.style.position = "absolute";
                this._iframe.style.top = 0;
                document.body.appendChild(this._iframe);

                this._form.target = "yuiTestTarget";
            }

            //set the form's action
            this._form.action = this.url;

            //remove any existing fields
            while(this._form.hasChildNodes()){
                this._form.removeChild(this._form.lastChild);
            }

            //create default fields
            this._fields.results = this.format(results);
            this._fields.useragent = navigator.userAgent;
            this._fields.timestamp = (new Date()).toLocaleString();

            //add fields to the form
            for (var prop in this._fields){
                var value = this._fields[prop];
                if (this._fields.hasOwnProperty(prop) && (typeof value != "function")){
                    var input = document.createElement("input");
                    input.type = "hidden";
                    input.name = prop;
                    input.value = value;
                    this._form.appendChild(input);
                }
            }

            //remove default fields
            delete this._fields.results;
            delete this._fields.useragent;
            delete this._fields.timestamp;

            if (arguments[1] !== false){
                this._form.submit();
            }

        }

    };


/**
 * Runs pages containing test suite definitions.
 * @namespace YUITest
 * @class PageManager
 * @static
 */
YUITest.PageManager = YUITest.Util.mix(new YUITest.EventTarget(), {

    /**
     * Constant for the testpagebegin custom event
     * @property TEST_PAGE_BEGIN_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_PAGE_BEGIN_EVENT /*:String*/ : "testpagebegin",

    /**
     * Constant for the testpagecomplete custom event
     * @property TEST_PAGE_COMPLETE_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_PAGE_COMPLETE_EVENT /*:String*/ : "testpagecomplete",

    /**
     * Constant for the testmanagerbegin custom event
     * @property TEST_MANAGER_BEGIN_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_MANAGER_BEGIN_EVENT /*:String*/ : "testmanagerbegin",

    /**
     * Constant for the testmanagercomplete custom event
     * @property TEST_MANAGER_COMPLETE_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_MANAGER_COMPLETE_EVENT /*:String*/ : "testmanagercomplete",

    //-------------------------------------------------------------------------
    // Private Properties
    //-------------------------------------------------------------------------


    /**
     * The URL of the page currently being executed.
     * @type String
     * @private
     * @property _curPage
     * @static
     */
    _curPage: null,

    /**
     * The frame used to load and run tests.
     * @type Window
     * @private
     * @property _frame
     * @static
     */
    _frame: null,

    /**
     * The timeout ID for the next iteration through the tests.
     * @type int
     * @private
     * @property _timeoutId
     * @static
     */
    _timeoutId: 0,

    /**
     * Array of pages to load.
     * @type String[]
     * @private
     * @property _pages
     * @static
     */
    _pages: [],

    /**
     * Aggregated results
     * @type Object
     * @private
     * @property _results
     * @static
     */
    _results: null,

    //-------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------

    /**
     * Handles TestRunner.COMPLETE_EVENT, storing the results and beginning
     * the loop again.
     * @param {Object} data Data about the event.
     * @return {Void}
     * @method _handleTestRunnerComplete
     * @private
     * @static
     */
    _handleTestRunnerComplete : function (data /*:Object*/) /*:Void*/ {

        this.fire(this.TEST_PAGE_COMPLETE_EVENT, {
            page: this._curPage,
            results: data.results
        });

        //save results
        //this._results[this.curPage] = data.results;

        //process 'em
        this._processResults(this._curPage, data.results);


        //if there's more to do, set a timeout to begin again
        if (this._pages.length){
            this._timeoutId = setTimeout(function(){
                YUITest.TestManager._run();
            }, 1000);
        } else {
            this.fire(this.TEST_MANAGER_COMPLETE_EVENT, this._results);
        }
    },

    /**
     * Processes the results of a test page run, outputting log messages
     * for failed tests.
     * @return {Void}
     * @method _processResults
     * @private
     * @static
     */
    _processResults : function (page, results){

        var r = this._results;

        r.passed += results.passed;
        r.failed += results.failed;
        r.ignored += results.ignored;
        r.total += results.total;
        r.duration += results.duration;

        if (results.failed){
            r.failedPages.push(page);
        } else {
            r.passedPages.push(page);
        }

        results.name = page;
        results.type = "page";

        r[page] = results;
    },

    /**
     * Loads the next test page into the iframe.
     * @return {Void}
     * @method _run
     * @static
     * @private
     */
    _run : function () /*:Void*/ {

        //set the current page
        this._curPage = this._pages.shift();

        this.fire(this.TEST_PAGE_BEGIN_EVENT, this._curPage);

        //load the frame - destroy history in case there are other iframes that
        //need testing
        this._frame.location.replace(this._curPage);

    },

    //-------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------

    /**
     * Signals that a test page has been loaded. This should be called from
     * within the test page itself to notify the TestManager that it is ready.
     * @return {Void}
     * @method load
     * @static
     */
    load : function () /*:Void*/ {
        if (parent.YUITest.PageManager !== this){
            parent.YUITest.PageManager.load();
        } else {

            if (this._frame) {
                //assign event handling
                var TestRunner = this._frame.YUITest.TestRunner;

                TestRunner.subscribe(TestRunner.COMPLETE_EVENT, this._handleTestRunnerComplete, this, true);

                //run it
                TestRunner.run();
            }
        }
    },

    /**
     * Sets the pages to be loaded.
     * @param {String[]} pages An array of URLs to load.
     * @return {Void}
     * @method setPages
     * @static
     */
    setPages : function (pages /*:String[]*/) /*:Void*/ {
        this._pages = pages;
    },

    /**
     * Begins the process of running the tests.
     * @return {Void}
     * @method start
     * @static
     */
    start : function () /*:Void*/ {

        if (!this._initialized) {

            /**
             * Fires when loading a test page
             * @event testpagebegin
             * @param curPage {string} the page being loaded
             * @static
             */

            /**
             * Fires when a test page is complete
             * @event testpagecomplete
             * @param obj {page: string, results: object} the name of the
             * page that was loaded, and the test suite results
             * @static
             */

            /**
             * Fires when the test manager starts running all test pages
             * @event testmanagerbegin
             * @static
             */

            /**
             * Fires when the test manager finishes running all test pages.  External
             * test runners should subscribe to this event in order to get the
             * aggregated test results.
             * @event testmanagercomplete
             * @param obj { pages_passed: int, pages_failed: int, tests_passed: int
             *              tests_failed: int, passed: string[], failed: string[],
             *              page_results: {} }
             * @static
             */

            //create iframe if not already available
            if (!this._frame){
                var frame /*:HTMLElement*/ = document.createElement("iframe");
                frame.style.visibility = "hidden";
                frame.style.position = "absolute";
                document.body.appendChild(frame);
                this._frame = frame.contentWindow || frame.contentDocument.parentWindow;
            }

            this._initialized = true;
        }


        // reset the results cache
        this._results = {

            passed: 0,
            failed: 0,
            ignored: 0,
            total: 0,
            type: "report",
            name: "YUI Test Results",
            duration: 0,
            failedPages:[],
            passedPages:[]
            /*
            // number of pages that pass
            pages_passed: 0,
            // number of pages that fail
            pages_failed: 0,
            // total number of tests passed
            tests_passed: 0,
            // total number of tests failed
            tests_failed: 0,
            // array of pages that passed
            passed: [],
            // array of pages that failed
            failed: [],
            // map of full results for each page
            page_results: {}*/
        };

        this.fire(this.TEST_MANAGER_BEGIN_EVENT, null);
        this._run();

    },

    /**
     * Stops the execution of tests.
     * @return {Void}
     * @method stop
     * @static
     */
    stop : function () /*:Void*/ {
        clearTimeout(this._timeoutId);
    }

});


    /**
     * Runs test suites and test cases, providing events to allowing for the
     * interpretation of test results.
     * @namespace YUITest
     * @class TestRunner
     * @static
     */
    YUITest.TestRunner = function(){

        /*(intentionally not documented)
         * Determines if any of the array of test groups appears
         * in the given TestRunner filter.
         * @param {Array} testGroups The array of test groups to
         *      search for.
         * @param {String} filter The TestRunner groups filter.
         */
        function inGroups(testGroups, filter){
            if (!filter.length){
                return true;
            } else {
                if (testGroups){
                    for (var i=0, len=testGroups.length; i < len; i++){
                        if (filter.indexOf("," + testGroups[i] + ",") > -1){
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        /**
         * A node in the test tree structure. May represent a TestSuite, TestCase, or
         * test function.
         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
         * @class TestNode
         * @constructor
         * @private
         */
        function TestNode(testObject){

            /**
             * The TestSuite, TestCase, or test function represented by this node.
             * @type Variant
             * @property testObject
             */
            this.testObject = testObject;

            /**
             * Pointer to this node's first child.
             * @type TestNode
             * @property firstChild
             */
            this.firstChild = null;

            /**
             * Pointer to this node's last child.
             * @type TestNode
             * @property lastChild
             */
            this.lastChild = null;

            /**
             * Pointer to this node's parent.
             * @type TestNode
             * @property parent
             */
            this.parent = null;

            /**
             * Pointer to this node's next sibling.
             * @type TestNode
             * @property next
             */
            this.next = null;

            /**
             * Test results for this test object.
             * @type object
             * @property results
             */
            this.results = new YUITest.Results();

            //initialize results
            if (testObject instanceof YUITest.TestSuite){
                this.results.type = "testsuite";
                this.results.name = testObject.name;
            } else if (testObject instanceof YUITest.TestCase){
                this.results.type = "testcase";
                this.results.name = testObject.name;
            }

        }

        TestNode.prototype = {

            /**
             * Appends a new test object (TestSuite, TestCase, or test function name) as a child
             * of this node.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @return {Void}
             */
            appendChild : function (testObject){
                var node = new TestNode(testObject);
                if (this.firstChild === null){
                    this.firstChild = this.lastChild = node;
                } else {
                    this.lastChild.next = node;
                    this.lastChild = node;
                }
                node.parent = this;
                return node;
            }
        };

        /**
         * Runs test suites and test cases, providing events to allowing for the
         * interpretation of test results.
         * @namespace Test
         * @class Runner
         * @static
         */
        function TestRunner(){

            //inherit from EventTarget
            YUITest.EventTarget.call(this);

            /**
             * Suite on which to attach all TestSuites and TestCases to be run.
             * @type YUITest.TestSuite
             * @property masterSuite
             * @static
             * @private
             */
            this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());

            /**
             * Pointer to the current node in the test tree.
             * @type TestNode
             * @private
             * @property _cur
             * @static
             */
            this._cur = null;

            /**
             * Pointer to the root node in the test tree.
             * @type TestNode
             * @private
             * @property _root
             * @static
             */
            this._root = null;

            /**
             * Indicates if the TestRunner will log events or not.
             * @type Boolean
             * @property _log
             * @private
             * @static
             */
            this._log = true;

            /**
             * Indicates if the TestRunner is waiting as a result of
             * wait() being called.
             * @type Boolean
             * @property _waiting
             * @private
             * @static
             */
            this._waiting = false;

            /**
             * Indicates if the TestRunner is currently running tests.
             * @type Boolean
             * @private
             * @property _running
             * @static
             */
            this._running = false;

            /**
             * Holds copy of the results object generated when all tests are
             * complete.
             * @type Object
             * @private
             * @property _lastResults
             * @static
             */
            this._lastResults = null;

            /**
             * Data object that is passed around from method to method.
             * @type Object
             * @private
             * @property _data
             * @static
             */
            this._context = null;

            /**
             * The list of test groups to run. The list is represented
             * by a comma delimited string with commas at the start and
             * end.
             * @type String
             * @private
             * @property _groups
             * @static
             */
            this._groups = "";
        }

        TestRunner.prototype = YUITest.Util.mix(new YUITest.EventTarget(), {

            //restore prototype
            constructor: YUITest.TestRunner,

            //-------------------------------------------------------------------------
            // Constants
            //-------------------------------------------------------------------------

            /**
             * Fires when a test case is opened but before the first
             * test is executed.
             * @event testcasebegin
             * @static
             */
            TEST_CASE_BEGIN_EVENT : "testcasebegin",

            /**
             * Fires when all tests in a test case have been executed.
             * @event testcasecomplete
             * @static
             */
            TEST_CASE_COMPLETE_EVENT : "testcasecomplete",

            /**
             * Fires when a test suite is opened but before the first
             * test is executed.
             * @event testsuitebegin
             * @static
             */
            TEST_SUITE_BEGIN_EVENT : "testsuitebegin",

            /**
             * Fires when all test cases in a test suite have been
             * completed.
             * @event testsuitecomplete
             * @static
             */
            TEST_SUITE_COMPLETE_EVENT : "testsuitecomplete",

            /**
             * Fires when a test has passed.
             * @event pass
             * @static
             */
            TEST_PASS_EVENT : "pass",

            /**
             * Fires when a test has failed.
             * @event fail
             * @static
             */
            TEST_FAIL_EVENT : "fail",

            /**
             * Fires when a non-test method has an error.
             * @event error
             * @static
             */
            ERROR_EVENT : "error",

            /**
             * Fires when a test has been ignored.
             * @event ignore
             * @static
             */
            TEST_IGNORE_EVENT : "ignore",

            /**
             * Fires when all test suites and test cases have been completed.
             * @event complete
             * @static
             */
            COMPLETE_EVENT : "complete",

            /**
             * Fires when the run() method is called.
             * @event begin
             * @static
             */
            BEGIN_EVENT : "begin",

            //-------------------------------------------------------------------------
            // Test Tree-Related Methods
            //-------------------------------------------------------------------------

            /**
             * Adds a test case to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test case to as a child.
             * @param {YUITest.TestCase} testCase The test case to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestCaseToTestTree
             */
           _addTestCaseToTestTree : function (parentNode, testCase){

                //add the test suite
                var node = parentNode.appendChild(testCase),
                    prop,
                    testName;

                //iterate over the items in the test case
                for (prop in testCase){
                    if ((prop.indexOf("test") === 0 || prop.indexOf(" ") > -1) && typeof testCase[prop] == "function"){
                        node.appendChild(prop);
                    }
                }

            },

            /**
             * Adds a test suite to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test suite to as a child.
             * @param {YUITest.TestSuite} testSuite The test suite to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestSuiteToTestTree
             */
            _addTestSuiteToTestTree : function (parentNode, testSuite) {

                //add the test suite
                var node = parentNode.appendChild(testSuite);

                //iterate over the items in the master suite
                for (var i=0; i < testSuite.items.length; i++){
                    if (testSuite.items[i] instanceof YUITest.TestSuite) {
                        this._addTestSuiteToTestTree(node, testSuite.items[i]);
                    } else if (testSuite.items[i] instanceof YUITest.TestCase) {
                        this._addTestCaseToTestTree(node, testSuite.items[i]);
                    }
                }
            },

            /**
             * Builds the test tree based on items in the master suite. The tree is a hierarchical
             * representation of the test suites, test cases, and test functions. The resulting tree
             * is stored in _root and the pointer _cur is set to the root initially.
             * @return {Void}
             * @static
             * @private
             * @method _buildTestTree
             */
            _buildTestTree : function () {

                this._root = new TestNode(this.masterSuite);
                //this._cur = this._root;

                //iterate over the items in the master suite
                for (var i=0; i < this.masterSuite.items.length; i++){
                    if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {
                        this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);
                    } else if (this.masterSuite.items[i] instanceof YUITest.TestCase) {
                        this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);
                    }
                }

            },

            //-------------------------------------------------------------------------
            // Private Methods
            //-------------------------------------------------------------------------

            /**
             * Handles the completion of a test object's tests. Tallies test results
             * from one level up to the next.
             * @param {TestNode} node The TestNode representing the test object.
             * @return {Void}
             * @method _handleTestObjectComplete
             * @private
             */
            _handleTestObjectComplete : function (node) {
                var parentNode;

                if (typeof node.testObject == "object" && node !== null){
                    parentNode = node.parent;

                    if (parentNode){
                        parentNode.results.include(node.results);
                        parentNode.results[node.testObject.name] = node.results;
                    }

                    if (node.testObject instanceof YUITest.TestSuite){
                        this._execNonTestMethod(node, "tearDown", false);
                        node.results.duration = (new Date()) - node._start;
                        this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});
                    } else if (node.testObject instanceof YUITest.TestCase){
                        this._execNonTestMethod(node, "destroy", false);
                        node.results.duration = (new Date()) - node._start;
                        this.fire({ type: this.TEST_CASE_COMPLETE_EVENT, testCase: node.testObject, results: node.results});
                    }
                }
            },

            //-------------------------------------------------------------------------
            // Navigation Methods
            //-------------------------------------------------------------------------

            /**
             * Retrieves the next node in the test tree.
             * @return {TestNode} The next node in the test tree or null if the end is reached.
             * @private
             * @static
             * @method _next
             */
            _next : function () {

                if (this._cur === null){
                    this._cur = this._root;
                } else if (this._cur.firstChild) {
                    this._cur = this._cur.firstChild;
                } else if (this._cur.next) {
                    this._cur = this._cur.next;
                } else {
                    while (this._cur && !this._cur.next && this._cur !== this._root){
                        this._handleTestObjectComplete(this._cur);
                        this._cur = this._cur.parent;
                    }

                    this._handleTestObjectComplete(this._cur);

                    if (this._cur == this._root){
                        this._cur.results.type = "report";
                        this._cur.results.timestamp = (new Date()).toLocaleString();
                        this._cur.results.duration = (new Date()) - this._cur._start;
                        this._lastResults = this._cur.results;
                        this._running = false;
                        this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});
                        this._cur = null;
                    } else {
                        this._cur = this._cur.next;
                    }
                }

                return this._cur;
            },

            /**
             * Executes a non-test method (init, setUp, tearDown, destroy)
             * and traps an errors. If an error occurs, an error event is
             * fired.
             * @param {Object} node The test node in the testing tree.
             * @param {String} methodName The name of the method to execute.
             * @param {Boolean} allowAsync Determines if the method can be called asynchronously.
             * @return {Boolean} True if an async method was called, false if not.
             * @method _execNonTestMethod
             * @private
             */
            _execNonTestMethod: function(node, methodName, allowAsync){
                var testObject = node.testObject,
                    event = { type: this.ERROR_EVENT };
                try {
                    if (allowAsync && testObject["async:" + methodName]){
                        testObject["async:" + methodName](this._context);
                        return true;
                    } else {
                        testObject[methodName](this._context);
                    }
                } catch (ex){
                    node.results.errors++;
                    event.error = ex;
                    event.methodName = methodName;
                    if (testObject instanceof YUITest.TestCase){
                        event.testCase = testObject;
                    } else {
                        event.testSuite = testSuite;
                    }

                    this.fire(event);
                }

                return false;
            },

            /**
             * Runs a test case or test suite, returning the results.
             * @param {YUITest.TestCase|YUITest.TestSuite} testObject The test case or test suite to run.
             * @return {Object} Results of the execution with properties passed, failed, and total.
             * @private
             * @method _run
             * @static
             */
            _run : function () {

                //flag to indicate if the TestRunner should wait before continuing
                var shouldWait = false;

                //get the next test node
                var node = this._next();

                if (node !== null) {

                    //set flag to say the testrunner is running
                    this._running = true;

                    //eliminate last results
                    this._lastResult = null;

                    var testObject = node.testObject;

                    //figure out what to do
                    if (typeof testObject == "object" && testObject !== null){
                        if (testObject instanceof YUITest.TestSuite){
                            this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });
                            node._start = new Date();
                            this._execNonTestMethod(node, "setUp" ,false);
                        } else if (testObject instanceof YUITest.TestCase){
                            this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });
                            node._start = new Date();

                            //regular or async init
                            /*try {
                                if (testObject["async:init"]){
                                    testObject["async:init"](this._context);
                                    return;
                                } else {
                                    testObject.init(this._context);
                                }
                            } catch (ex){
                                node.results.errors++;
                                this.fire({ type: this.ERROR_EVENT, error: ex, testCase: testObject, methodName: "init" });
                            }*/
                            if(this._execNonTestMethod(node, "init", true)){
                                return;
                            }
                        }

                        //some environments don't support setTimeout
                        if (typeof setTimeout != "undefined"){
                            setTimeout(function(){
                                YUITest.TestRunner._run();
                            }, 0);
                        } else {
                            this._run();
                        }
                    } else {
                        this._runTest(node);
                    }

                }
            },

            _resumeTest : function (segment) {

                //get relevant information
                var node = this._cur;

                //we know there's no more waiting now
                this._waiting = false;

                //if there's no node, it probably means a wait() was called after resume()
                if (!node){
                    //TODO: Handle in some way?
                    //console.log("wait() called after resume()");
                    //this.fire("error", { testCase: "(unknown)", test: "(unknown)", error: new Error("wait() called after resume()")} );
                    return;
                }

                var testName = node.testObject;
                var testCase = node.parent.testObject;

                //cancel other waits if available
                if (testCase.__yui_wait){
                    clearTimeout(testCase.__yui_wait);
                    delete testCase.__yui_wait;
                }

                //get the "should" test cases
                var shouldFail = testName.indexOf("fail:") === 0 ||
                                    (testCase._should.fail || {})[testName];
                var shouldError = (testCase._should.error || {})[testName];

                //variable to hold whether or not the test failed
                var failed = false;
                var error = null;

                //try the test
                try {

                    //run the test
                    segment.call(testCase, this._context);

                    //if the test hasn't already failed and doesn't have any asserts...
                    if(YUITest.Assert._getCount() == 0){
                        throw new YUITest.AssertionError("Test has no asserts.");
                    }
                    //if it should fail, and it got here, then it's a fail because it didn't
                     else if (shouldFail){
                        error = new YUITest.ShouldFail();
                        failed = true;
                    } else if (shouldError){
                        error = new YUITest.ShouldError();
                        failed = true;
                    }

                } catch (thrown){

                    //cancel any pending waits, the test already failed
                    if (testCase.__yui_wait){
                        clearTimeout(testCase.__yui_wait);
                        delete testCase.__yui_wait;
                    }

                    //figure out what type of error it was
                    if (thrown instanceof YUITest.AssertionError) {
                        if (!shouldFail){
                            error = thrown;
                            failed = true;
                        }
                    } else if (thrown instanceof YUITest.Wait){

                        if (typeof thrown.segment == "function"){
                            if (typeof thrown.delay == "number"){

                                //some environments don't support setTimeout
                                if (typeof setTimeout != "undefined"){
                                    testCase.__yui_wait = setTimeout(function(){
                                        YUITest.TestRunner._resumeTest(thrown.segment);
                                    }, thrown.delay);
                                    this._waiting = true;
                                } else {
                                    throw new Error("Asynchronous tests not supported in this environment.");
                                }
                            }
                        }

                        return;

                    } else {
                        //first check to see if it should error
                        if (!shouldError) {
                            error = new YUITest.UnexpectedError(thrown);
                            failed = true;
                        } else {
                            //check to see what type of data we have
                            if (typeof shouldError == "string"){

                                //if it's a string, check the error message
                                if (thrown.message != shouldError){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;
                                }
                            } else if (typeof shouldError == "function"){

                                //if it's a function, see if the error is an instance of it
                                if (!(thrown instanceof shouldError)){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;
                                }

                            } else if (typeof shouldError == "object" && shouldError !== null){

                                //if it's an object, check the instance and message
                                if (!(thrown instanceof shouldError.constructor) ||
                                        thrown.message != shouldError.message){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;
                                }

                            }

                        }
                    }

                }

                //fire appropriate event
                if (failed) {
                    this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });
                } else {
                    this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });
                }

                //run the tear down
                this._execNonTestMethod(node.parent, "tearDown", false);

                //reset the assert count
                YUITest.Assert._reset();

                //calculate duration
                var duration = (new Date()) - node._start;

                //update results
                node.parent.results[testName] = {
                    result: failed ? "fail" : "pass",
                    message: error ? error.getMessage() : "Test passed",
                    type: "test",
                    name: testName,
                    duration: duration
                };

                if (failed){
                    node.parent.results.failed++;
                } else {
                    node.parent.results.passed++;
                }
                node.parent.results.total++;

                //set timeout not supported in all environments
                if (typeof setTimeout != "undefined"){
                    setTimeout(function(){
                        YUITest.TestRunner._run();
                    }, 0);
                } else {
                    this._run();
                }

            },

            /**
             * Handles an error as if it occurred within the currently executing
             * test. This is for mock methods that may be called asynchronously
             * and therefore out of the scope of the TestRunner. Previously, this
             * error would bubble up to the browser. Now, this method is used
             * to tell TestRunner about the error. This should never be called
             * by anyplace other than the Mock object.
             * @param {Error} error The error object.
             * @return {Void}
             * @method _handleError
             * @private
             * @static
             */
            _handleError: function(error){

                if (this._waiting){
                    this._resumeTest(function(){
                        throw error;
                    });
                } else {
                    throw error;
                }

            },

            /**
             * Runs a single test based on the data provided in the node.
             * @param {TestNode} node The TestNode representing the test to run.
             * @return {Void}
             * @static
             * @private
             * @name _runTest
             */
            _runTest : function (node) {

                //get relevant information
                var testName = node.testObject,
                    testCase = node.parent.testObject,
                    test = testCase[testName],

                    //get the "should" test cases
                    shouldIgnore = testName.indexOf("ignore:") === 0 ||
                                    !inGroups(testCase.groups, this._groups) ||
                                    (testCase._should.ignore || {})[testName];   //deprecated

                //figure out if the test should be ignored or not
                if (shouldIgnore){

                    //update results
                    node.parent.results[testName] = {
                        result: "ignore",
                        message: "Test ignored",
                        type: "test",
                        name: testName.indexOf("ignore:") === 0 ? testName.substring(7) : testName
                    };

                    node.parent.results.ignored++;
                    node.parent.results.total++;

                    this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });

                    //some environments don't support setTimeout
                    if (typeof setTimeout != "undefined"){
                        setTimeout(function(){
                            YUITest.TestRunner._run();
                        }, 0);
                    } else {
                        this._run();
                    }

                } else {

                    //mark the start time
                    node._start = new Date();

                    //run the setup
                    this._execNonTestMethod(node.parent, "setUp", false);

                    //now call the body of the test
                    this._resumeTest(test);
                }

            },

            //-------------------------------------------------------------------------
            // Misc Methods
            //-------------------------------------------------------------------------

            /**
             * Retrieves the name of the current result set.
             * @return {String} The name of the result set.
             * @method getName
             */
            getName: function(){
                return this.masterSuite.name;
            },

            /**
             * The name assigned to the master suite of the TestRunner. This is the name
             * that is output as the root's name when results are retrieved.
             * @param {String} name The name of the result set.
             * @return {Void}
             * @method setName
             */
            setName: function(name){
                this.masterSuite.name = name;
            },

            //-------------------------------------------------------------------------
            // Public Methods
            //-------------------------------------------------------------------------

            /**
             * Adds a test suite or test case to the list of test objects to run.
             * @param testObject Either a TestCase or a TestSuite that should be run.
             * @return {Void}
             * @method add
             * @static
             */
            add : function (testObject) {
                this.masterSuite.add(testObject);
                return this;
            },

            /**
             * Removes all test objects from the runner.
             * @return {Void}
             * @method clear
             * @static
             */
            clear : function () {
                this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());
            },

            /**
             * Indicates if the TestRunner is waiting for a test to resume
             * @return {Boolean} True if the TestRunner is waiting, false if not.
             * @method isWaiting
             * @static
             */
            isWaiting: function() {
                return this._waiting;
            },

            /**
             * Indicates that the TestRunner is busy running tests and therefore can't
             * be stopped and results cannot be gathered.
             * @return {Boolean} True if the TestRunner is running, false if not.
             * @method isRunning
             */
            isRunning: function(){
                return this._running;
            },

            /**
             * Returns the last complete results set from the TestRunner. Null is returned
             * if the TestRunner is running or no tests have been run.
             * @param {Function} format (Optional) A test format to return the results in.
             * @return {Object|String} Either the results object or, if a test format is
             *      passed as the argument, a string representing the results in a specific
             *      format.
             * @method getResults
             */
            getResults: function(format){
                if (!this._running && this._lastResults){
                    if (typeof format == "function"){
                        return format(this._lastResults);
                    } else {
                        return this._lastResults;
                    }
                } else {
                    return null;
                }
            },

            /**
             * Returns the coverage report for the files that have been executed.
             * This returns only coverage information for files that have been
             * instrumented using YUI Test Coverage and only those that were run
             * in the same pass.
             * @param {Function} format (Optional) A coverage format to return results in.
             * @return {Object|String} Either the coverage object or, if a coverage
             *      format is specified, a string representing the results in that format.
             * @method getCoverage
             */
            getCoverage: function(format){
                if (!this._running && typeof _yuitest_coverage == "object"){
                    if (typeof format == "function"){
                        return format(_yuitest_coverage);
                    } else {
                        return _yuitest_coverage;
                    }
                } else {
                    return null;
                }
            },

            /**
             * Used to continue processing when a method marked with
             * "async:" is executed. This should not be used in test
             * methods, only in init(). Each argument is a string, and
             * when the returned function is executed, the arguments
             * are assigned to the context data object using the string
             * as the key name (value is the argument itself).
             * @private
             * @return {Function} A callback function.
             */
            callback: function(){
                var names   = arguments,
                    data    = this._context,
                    that    = this;

                return function(){
                    for (var i=0; i < arguments.length; i++){
                        data[names[i]] = arguments[i];
                    }
                    that._run();
                };
            },

            /**
             * Resumes the TestRunner after wait() was called.
             * @param {Function} segment The function to run as the rest
             *      of the haulted test.
             * @return {Void}
             * @method resume
             * @static
             */
            resume : function (segment) {
                if (this._waiting){
                    this._resumeTest(segment || function(){});
                } else {
                    throw new Error("resume() called without wait().");
                }
            },

            /**
             * Runs the test suite.
             * @param {Object|Boolean} options (Optional) Options for the runner:
             *      <code>oldMode</code> indicates the TestRunner should work in the YUI <= 2.8 way
             *      of internally managing test suites. <code>groups</code> is an array
             *      of test groups indicating which tests to run.
             * @return {Void}
             * @method run
             * @static
             */
            run : function (options) {

                options = options || {};

                //pointer to runner to avoid scope issues
                var runner  = YUITest.TestRunner,
                    oldMode = options.oldMode;


                //if there's only one suite on the masterSuite, move it up
                if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){
                    this.masterSuite = this.masterSuite.items[0];
                }

                //determine if there are any groups to filter on
                runner._groups = (options.groups instanceof Array) ? "," + options.groups.join(",") + "," : "";

                //initialize the runner
                runner._buildTestTree();
                runner._context = {};
                runner._root._start = new Date();

                //fire the begin event
                runner.fire(runner.BEGIN_EVENT);

                //begin the testing
                runner._run();
            }
        });

        return new TestRunner();

    }();
/**
 * Main CSSLint object.
 * @class CSSLint
 * @static
 * @extends parserlib.util.EventTarget
 */
var CSSLint = (function(){

    var rules      = [],
        formatters = [],
        api        = new parserlib.util.EventTarget();
        
    api.version = "@VERSION@";

    //-------------------------------------------------------------------------
    // Rule Management
    //-------------------------------------------------------------------------

    /**
     * Adds a new rule to the engine.
     * @param {Object} rule The rule to add.
     * @method addRule
     */
    api.addRule = function(rule){
        rules.push(rule);
        rules[rule.id] = rule;
    };

    /**
     * Clears all rule from the engine.
     * @method clearRules
     */
    api.clearRules = function(){
        rules = [];
    };

    //-------------------------------------------------------------------------
    // Formatters
    //-------------------------------------------------------------------------

    /**
     * Adds a new formatter to the engine.
     * @param {Object} formatter The formatter to add.
     * @method addFormatter
     */
    api.addFormatter = function(formatter) {
        // formatters.push(formatter);
        formatters[formatter.id] = formatter;
    };
    
    /**
     * Retrieves a formatter for use.
     * @param {String} formatId The name of the format to retrieve.
     * @return {Object} The formatter or undefined.
     * @method getFormatter
     */
    api.getFormatter = function(formatId){
        return formatters[formatId];
    };
    
    /**
     * Formats the results in a particular format for a single file.
     * @param {Object} result The results returned from CSSLint.verify().
     * @param {String} filename The filename for which the results apply.
     * @param {String} formatId The name of the formatter to use.
     * @return {String} A formatted string for the results.
     * @method format
     */
    api.format = function(results, filename, formatId) {
        var formatter = this.getFormatter(formatId),
            result = null;
            
        if (formatter){
            result = formatter.startFormat();
            result += formatter.formatResults(results, filename);
            result += formatter.endFormat();
        }
        
        return result;
    }    
    
    /**
     * Indicates if the given format is supported.
     * @param {String} formatId The ID of the format to check.
     * @return {Boolean} True if the format exists, false if not.
     * @method hasFormat
     */
    api.hasFormat = function(formatId){
        return formatters.hasOwnProperty(formatId);
    };

    //-------------------------------------------------------------------------
    // Verification
    //-------------------------------------------------------------------------

    /**
     * Starts the verification process for the given CSS text.
     * @param {String} text The CSS text to verify.
     * @param {Object} ruleset (Optional) List of rules to apply. If null, then
     *      all rules are used.
     * @return {Object} Results of the verification.
     * @method verify
     */
    api.verify = function(text, ruleset){

        var i       = 0,
            len     = rules.length,
            reporter,
            lines,
            parser = new parserlib.css.Parser({ starHack: true, ieFilters: true,
                                                underscoreHack: true, strict: false });

        lines = text.split(/\n\r?/g);
        reporter = new Reporter(lines);

        if (!ruleset){
            while (i < len){
                rules[i++].init(parser, reporter);
            }
        } else {
            ruleset.errors = 1;       //always report parsing errors
            for (i in ruleset){
                if(ruleset.hasOwnProperty(i)){
                    if (rules[i]){
                        rules[i].init(parser, reporter);
                    }
                }
            }
        }

        //capture most horrible error type
        try {
            parser.parse(text);
        } catch (ex) {
            reporter.error("Fatal error, cannot continue: " + ex.message, ex.line, ex.col);
        }

        return {
            messages    : reporter.messages,
            stats       : reporter.stats
        };
    };

    //-------------------------------------------------------------------------
    // Publish the API
    //-------------------------------------------------------------------------

    return api;

})();
/**
 * An instance of Report is used to report results of the
 * verification back to the main API.
 * @class Reporter
 * @constructor
 * @param {String[]} lines The text lines of the source.
 */
function Reporter(lines){

    /**
     * List of messages being reported.
     * @property messages
     * @type String[]
     */
    this.messages = [];

    /**
     * List of statistics being reported.
     * @property stats
     * @type String[]
     */
    this.stats = [];

    /**
     * Lines of code being reported on. Used to provide contextual information
     * for messages.
     * @property lines
     * @type String[]
     */
    this.lines = lines;
}

Reporter.prototype = {

    //restore constructor
    constructor: Reporter,

    /**
     * Report an error.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method error
     */
    error: function(message, line, col, rule){
        this.messages.push({
            type    : "error",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report an warning.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method warn
     */
    warn: function(message, line, col, rule){
        this.messages.push({
            type    : "warning",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some informational text.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method info
     */
    info: function(message, line, col, rule){
        this.messages.push({
            type    : "info",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some rollup error information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupError
     */
    rollupError: function(message, rule){
        this.messages.push({
            type    : "error",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report some rollup warning information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupWarn
     */
    rollupWarn: function(message, rule){
        this.messages.push({
            type    : "warning",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report a statistic.
     * @param {String} name The name of the stat to store.
     * @param {Variant} value The value of the stat.
     * @method stat
     */
    stat: function(name, value){
        this.stats[name] = value;
    }
};
/*
 * Utility functions that make life easier.
 */

/*
 * Adds all properties from supplier onto receiver,
 * overwriting if the same name already exists on
 * reciever.
 * @param {Object} The object to receive the properties.
 * @param {Object} The object to provide the properties.
 * @return {Object} The receiver
 */
function mix(reciever, supplier){
    var prop;

    for (prop in supplier){
        if (supplier.hasOwnProperty(prop)){
            receiver[prop] = supplier[prop];
        }
    }

    return prop;
}

/*
 * Polyfill for array indexOf() method.
 * @param {Array} values The array to search.
 * @param {Variant} value The value to search for.
 * @return {int} The index of the value if found, -1 if not.
 */
function indexOf(values, value){
    if (values.indexOf){
        return values.indexOf(value);
    } else {
        for (var i=0, len=values.length; i < len; i++){
            if (values[i] === value){
                return i;
            }
        }
        return -1;
    }
}
/*
 * Rule: Don't use adjoining classes (.foo.bar).
 */
CSSLint.addRule({

    //rule information
    id: "adjoining-classes",
    name: "Adjoining Classes",
    desc: "Don't use adjoining classes.",
    browsers: "IE6",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                classCount,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        classCount = 0;
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (modifier.type == "class"){
                                classCount++;
                            }
                            if (classCount > 1){
                                reporter.warn("Don't use adjoining classes.", part.line, part.col, rule);
                            }
                        }
                    }
                }
            }
        });
    }

});
/*
 * Rule: Don't use width or height when using padding or border. 
 */
CSSLint.addRule({

    //rule information
    id: "box-model",
    name: "Box Model",
    desc: "Don't use width or height when using padding or border.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            widthProperties = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            },
            heightProperties = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            },
            properties;

        parser.addListener("startrule", function(){
            properties = {
            };
        });

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase();
            
            if (heightProperties[name] || widthProperties[name]){
                if (!/^0\S*$/.test(event.value) && !(name == "border" && event.value == "none")){
                    properties[name] = { line: event.property.line, col: event.property.col };
                }
            } else {
                if (name == "width" || name == "height"){
                    properties[name] = 1;
                }
            }
            
        });

        parser.addListener("endrule", function(){
            var prop;
            if (properties["height"]){
                for (prop in heightProperties){
                    if (heightProperties.hasOwnProperty(prop) && properties[prop]){
                        reporter.warn("Broken box model: using height with " + prop + ".", properties[prop].line, properties[prop].col, rule);
                    }
                }
            }

            if (properties["width"]){
                for (prop in widthProperties){
                    if (widthProperties.hasOwnProperty(prop) && properties[prop]){
                        reporter.warn("Broken box model: using width with " + prop + ".", properties[prop].line, properties[prop].col, rule);
                    }
                }
            }

        });
    }

});
/*
 * Rule: Include all compatible vendor prefixes to reach a wider
 * range of users.
 */
/*global CSSLint*/ 
CSSLint.addRule({

    //rule information
    id: "compatible-vendor-prefixes",
    name: "Compatible Vendor Prefixes",
    desc: "Include all compatible vendor prefixes to reach a wider range of users.",
    browsers: "All",

    //initialization
    init: function (parser, reporter) {
        var rule = this,
            compatiblePrefixes,
            properties,
            prop,
            variations,
            prefixed,
            i,
            len,
            arrayPush = Array.prototype.push,
            applyTo = [];

        // See http://peter.sh/experiments/vendor-prefixed-css-property-overview/ for details
        compatiblePrefixes = {
            "animation"                  : "webkit moz",
            "animation-delay"            : "webkit moz",
            "animation-direction"        : "webkit moz",
            "animation-duration"         : "webkit moz",
            "animation-fill-mode"        : "webkit moz",
            "animation-iteration-count"  : "webkit moz",
            "animation-name"             : "webkit moz",
            "animation-play-state"       : "webkit moz",
            "animation-timing-function"  : "webkit moz",
            "appearance"                 : "webkit moz",
            "border-end"                 : "webkit moz",
            "border-end-color"           : "webkit moz",
            "border-end-style"           : "webkit moz",
            "border-end-width"           : "webkit moz",
            "border-image"               : "webkit moz o",
            "border-radius"              : "webkit moz",
            "border-start"               : "webkit moz",
            "border-start-color"         : "webkit moz",
            "border-start-style"         : "webkit moz",
            "border-start-width"         : "webkit moz",
            "box-align"                  : "webkit moz ms",
            "box-direction"              : "webkit moz ms",
            "box-flex"                   : "webkit moz ms",
            "box-lines"                  : "webkit ms",
            "box-ordinal-group"          : "webkit moz ms",
            "box-orient"                 : "webkit moz ms",
            "box-pack"                   : "webkit moz ms",
            "box-sizing"                 : "webkit moz",
            "box-shadow"                 : "webkit moz",
            "column-count"               : "webkit moz",
            "column-gap"                 : "webkit moz",
            "column-rule"                : "webkit moz",
            "column-rule-color"          : "webkit moz",
            "column-rule-style"          : "webkit moz",
            "column-rule-width"          : "webkit moz",
            "column-width"               : "webkit moz",
            "hyphens"                    : "epub moz",
            "line-break"                 : "webkit ms",
            "margin-end"                 : "webkit moz",
            "margin-start"               : "webkit moz",
            "marquee-speed"              : "webkit wap",
            "marquee-style"              : "webkit wap",
            "padding-end"                : "webkit moz",
            "padding-start"              : "webkit moz",
            "tab-size"                   : "moz o",
            "text-size-adjust"           : "webkit ms",
            "transform"                  : "webkit moz ms o",
            "transform-origin"           : "webkit moz ms o",
            "transition"                 : "webkit moz o",
            "transition-delay"           : "webkit moz o",
            "transition-duration"        : "webkit moz o",
            "transition-property"        : "webkit moz o",
            "transition-timing-function" : "webkit moz o",
            "user-modify"                : "webkit moz",
            "user-select"                : "webkit moz",
            "word-break"                 : "epub ms",
            "writing-mode"               : "epub ms"
        };

        for (prop in compatiblePrefixes) {
            if (compatiblePrefixes.hasOwnProperty(prop)) {
                variations = [];
                prefixed = compatiblePrefixes[prop].split(' ');
                for (i = 0, len = prefixed.length; i < len; i++) {
                    variations.push('-' + prefixed[i] + '-' + prop);
                }
                compatiblePrefixes[prop] = variations;
                arrayPush.apply(applyTo, variations);
            }
        }
        parser.addListener("startrule", function () {
            properties = [];
        });

        parser.addListener("property", function (event) {
            var name = event.property.text;
            if (applyTo.indexOf(name) > -1) {
                properties.push(name);
            }
        });

        parser.addListener("endrule", function (event) {
            if (!properties.length) {
                return;
            }

            var propertyGroups = {},
                i,
                len,
                name,
                prop,
                variations,
                value,
                full,
                actual,
                item,
                propertiesSpecified;

            for (i = 0, len = properties.length; i < len; i++) {
                name = properties[i];

                for (prop in compatiblePrefixes) {
                    if (compatiblePrefixes.hasOwnProperty(prop)) {
                        variations = compatiblePrefixes[prop];
                        if (variations.indexOf(name) > -1) {
                            if (propertyGroups[prop] === undefined) {
                                propertyGroups[prop] = {
                                    full : variations.slice(0),
                                    actual : []
                                };
                            }
                            if (propertyGroups[prop].actual.indexOf(name) === -1) {
                                propertyGroups[prop].actual.push(name);
                            }
                        }
                    }
                }
            }

            for (prop in propertyGroups) {
                if (propertyGroups.hasOwnProperty(prop)) {
                    value = propertyGroups[prop];
                    full = value.full;
                    actual = value.actual;

                    if (full.length > actual.length) {
                        for (i = 0, len = full.length; i < len; i++) {
                            item = full[i];
                            if (actual.indexOf(item) === -1) {
                                propertiesSpecified = (actual.length === 1) ? actual[0] : (actual.length == 2) ? actual.join(" and ") : actual.join(", ");
                                reporter.warn("The property " + item + " is compatible with " + propertiesSpecified + " and should be included as well.", event.selectors[0].line, event.selectors[0].col, rule); 
                            }
                        }

                    }
                }
            }
        });
    }
});
/*
 * Rule: Certain properties don't play well with certain display values. 
 * - float should not be used with inline-block
 * - height, width, margin-top, margin-bottom, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
 */
CSSLint.addRule({

    //rule information
    id: "display-property-grouping",
    name: "Display Property Grouping",
    desc: "Certain properties shouldn't be used with certain display property values.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        var propertiesToCheck = {
                display: 1,
                "float": "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1
            },
            properties;

        parser.addListener("startrule", function(){
            properties = {};
        });

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase();

            if (propertiesToCheck[name]){
                properties[name] = { value: event.value.text, line: event.property.line, col: event.property.col };                    
            }
        });

        parser.addListener("endrule", function(){

            var display = properties.display ? properties.display.value : null;
            if (display){
                switch(display){

                    case "inline":
                        //height, width, margin-top, margin-bottom, float should not be used with inline
                        reportProperty("height", display);
                        reportProperty("width", display);
                        reportProperty("margin", display);
                        reportProperty("margin-top", display);
                        reportProperty("margin-bottom", display);              
                        reportProperty("float", display, "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).");
                        break;

                    case "block":
                        //vertical-align should not be used with block
                        reportProperty("vertical-align", display);
                        break;

                    case "inline-block":
                        //float should not be used with inline-block
                        reportProperty("float", display);
                        break;

                    default:
                        //margin, float should not be used with table
                        if (display.indexOf("table-") == 0){
                            reportProperty("margin", display);
                            reportProperty("margin-left", display);
                            reportProperty("margin-right", display);
                            reportProperty("margin-top", display);
                            reportProperty("margin-bottom", display);
                            reportProperty("float", display);
                        }

                        //otherwise do nothing
                }
            }
          
        });


        function reportProperty(name, display, msg){
            if (properties[name]){
                if (!(typeof propertiesToCheck[name] == "string") || properties[name].value.toLowerCase() != propertiesToCheck[name]){
                    reporter.warn(msg || name + " can't be used with display: " + display + ".", properties[name].line, properties[name].col, rule);
                }
            }
        }
    }

});
/*
 * Rule: Duplicate properties must appear one after the other. If an already-defined
 * property appears somewhere else in the rule, then it's likely an error.
 */
CSSLint.addRule({

    //rule information
    id: "duplicate-properties",
    name: "Duplicate Properties",
    desc: "Duplicate properties must appear one after the other.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            properties,
            lastProperty;            
            
        function startRule(event){
            properties = {};        
        }
        
        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        
        parser.addListener("property", function(event){
            var property = event.property,
                name = property.text.toLowerCase();
            
            if (properties[name] && (lastProperty != name || properties[name] == event.value.text)){
                reporter.warn("Duplicate property '" + event.property + "' found.", event.line, event.col, rule);
            }
            
            properties[name] = event.value.text;
            lastProperty = name;
                        
        });
            
        
    }

});
/*
 * Rule: Style rules without any properties defined should be removed.
 */
CSSLint.addRule({

    //rule information
    id: "empty-rules",
    name: "Empty Rules",
    desc: "Rules without any properties specified should be removed.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;

        parser.addListener("startrule", function(){
            count=0;
        });

        parser.addListener("property", function(){
            count++;
        });

        parser.addListener("endrule", function(event){
            var selectors = event.selectors;
            if (count == 0){
                reporter.warn("Rule is empty.", selectors[0].line, selectors[0].col, rule);
            }
        });
    }

});
/*
 * Rule: There should be no syntax errors. (Duh.)
 */
CSSLint.addRule({

    //rule information
    id: "errors",
    name: "Parsing Errors",
    desc: "This rule looks for recoverable syntax errors.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        parser.addListener("error", function(event){
            reporter.error(event.message, event.line, event.col, rule);
        });

    }

});
/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */
CSSLint.addRule({

    //rule information
    id: "floats",
    name: "Floats",
    desc: "This rule tests if the float property is used too many times",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        var count = 0;

        //count how many times "float" is used
        parser.addListener("property", function(event){
            if (event.property.text.toLowerCase() == "float" &&
                    event.value.text.toLowerCase() != "none"){
                count++;
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(){
            reporter.stat("floats", count);
            if (count >= 10){
                reporter.rollupWarn("Too many floats (" + count + "), you're probably using them for layout. Consider using a grid system instead.", rule);
            }
        });
    }

});
/*
 * Rule: Avoid too many @font-face declarations in the same stylesheet.
 */
CSSLint.addRule({

    //rule information
    id: "font-faces",
    name: "Font Faces",
    desc: "Too many different web fonts in the same stylesheet.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;


        parser.addListener("startfontface", function(){
            count++;
        });

        parser.addListener("endstylesheet", function(){
            if (count > 5){
                reporter.rollupWarn("Too many @font-face declarations (" + count + ").", rule);
            }
        });
    }

});
/*
 * Rule: You shouldn't need more than 9 font-size declarations.
 */

CSSLint.addRule({

    //rule information
    id: "font-sizes",
    name: "Font Sizes",
    desc: "Checks the number of font-size declarations.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;

        //check for use of "font-size"
        parser.addListener("property", function(event){
            if (event.property == "font-size"){
                count++;
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(){
            reporter.stat("font-sizes", count);
            if (count >= 10){
                reporter.rollupWarn("Too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        });
    }

});
/*
 * Rule: When using a vendor-prefixed gradient, make sure to use them all.
 */
CSSLint.addRule({

    //rule information
    id: "gradients",
    name: "Gradients",
    desc: "When using a vendor-prefixed gradient, make sure to use them all.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            gradients;

        parser.addListener("startrule", function(){
            gradients = {
                moz: 0,
                webkit: 0,
                ms: 0,
                o: 0
            };
        });

        parser.addListener("property", function(event){

            if (/\-(moz|ms|o|webkit)(?:\-(?:linear|radial))\-gradient/.test(event.value)){
                gradients[RegExp.$1] = 1;
            }

        });

        parser.addListener("endrule", function(event){
            var missing = [];

            if (!gradients.moz){
                missing.push("Firefox 3.6+");
            }

            if (!gradients.webkit){
                missing.push("Webkit (Safari, Chrome)");
            }

            if (!gradients.ms){
                missing.push("Internet Explorer 10+");
            }

            if (!gradients.o){
                missing.push("Opera 11.1+");
            }

            if (missing.length && missing.length < 4){            
                reporter.warn("Missing vendor-prefixed CSS gradients for " + missing.join(", ") + ".", event.selectors[0].line, event.selectors[0].col, rule); 
            }

        });

    }

});
/*
 * Rule: Don't use IDs for selectors.
 */
CSSLint.addRule({

    //rule information
    id: "ids",
    name: "IDs",
    desc: "Selectors should not contain IDs.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                idCount,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                idCount = 0;

                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (modifier.type == "id"){
                                idCount++;
                            }
                        }
                    }
                }

                if (idCount == 1){
                    reporter.warn("Don't use IDs in selectors.", selector.line, selector.col, rule);
                } else if (idCount > 1){
                    reporter.warn(idCount + " IDs in the selector, really?", selector.line, selector.col, rule);
                }
            }

        });
    }

});
/*
 * Rule: Don't use @import, use <link> instead.
 */
CSSLint.addRule({

    //rule information
    id: "import",
    name: "@import",
    desc: "Don't use @import, use <link> instead.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        
        parser.addListener("import", function(event){        
            reporter.warn("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});
/*
 * Rule: Make sure !important is not overused, this could lead to specificity
 * war. Display a warning on !important declarations, an error if it's
 * used more at least 10 times.
 */
CSSLint.addRule({

    //rule information
    id: "important",
    name: "Important",
    desc: "Be careful when using !important declaration",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        var count = 0;

        //warn that important is used and increment the declaration counter
        parser.addListener("property", function(event){
            var name = event.property;
            if (event.important === true){
                count++;
                reporter.warn("Use of !important", name.line, name.col, rule);
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(){
            reporter.stat("important", count);
            if (count >= 10){
                reporter.rollupError("Too many !important declarations (" + count + "), be careful with rule specificity", rule);
            }
        });
    }

});
/*
 * Rule: Don't use classes or IDs with elements (a.foo or a#foo).
 */
CSSLint.addRule({

    //rule information
    id: "overqualified-elements",
    name: "Overqualified Elements",
    desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            classes = {};
            
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (part.elementName && modifier.type == "id"){
                                reporter.warn("Element (" + part + ") is overqualified, just use " + modifier + " without element name.", part.line, part.col, rule);
                            } else if (modifier.type == "class"){
                                
                                if (!classes[modifier]){
                                    classes[modifier] = [];
                                }
                                classes[modifier].push({ modifier: modifier, part: part });
                            }
                        }
                    }
                }
            }
        });
        
        parser.addListener("endstylesheet", function(){
        
            var prop;
            for (prop in classes){
                if (classes.hasOwnProperty(prop)){
                
                    //one use means that this is overqualified
                    if (classes[prop].length == 1 && classes[prop][0].part.elementName){
                        reporter.warn("Element (" + classes[prop][0].part + ") is overqualified, just use " + classes[prop][0].modifier + " without element name.", classes[prop][0].part.line, classes[prop][0].part.col, rule);
                    }
                }
            }        
        });
    }

});
/*
 * Rule: Headings (h1-h6) should not be qualified (namespaced).
 */
CSSLint.addRule({

    //rule information
    id: "qualified-headings",
    name: "Qualified Headings",
    desc: "Headings should not be qualified (namespaced).",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                i, j;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        if (part.elementName && /h[1-6]/.test(part.elementName.toString()) && j > 0){
                            reporter.warn("Heading (" + part.elementName + ") should not be qualified.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });
    }

});
/*
 * Rule: Selectors that look like regular expressions are slow and should be avoided.
 */
CSSLint.addRule({

    //rule information
    id: "regex-selectors",
    name: "Regex Selectors",
    desc: "Selectors that look like regular expressions are slow and should be avoided.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++){
                    part = selector.parts[j];
                    if (part instanceof parserlib.css.SelectorPart){
                        for (k=0; k < part.modifiers.length; k++){
                            modifier = part.modifiers[k];
                            if (modifier.type == "attribute"){
                                if (/([\~\|\^\$\*]=)/.test(modifier)){
                                    reporter.warn("Attribute selectors with " + RegExp.$1 + " are slow!", modifier.line, modifier.col, rule);
                                }
                            }

                        }
                    }
                }
            }
        });
    }

});
/*
 * Rule: Total number of rules should not exceed x.
 */
CSSLint.addRule({

    //rule information
    id: "rules-count",
    name: "Rules Count",
    desc: "Track how many rules there are.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;

        //count each rule
        parser.addListener("startrule", function(){
            count++;
        });

        parser.addListener("endstylesheet", function(){
            reporter.stat("rule-count", count);
        });
    }

});
/*
 * Rule: Don't use text-indent for image replacement if you need to support rtl. 
 * 
 */
/*
 * Should we be checking for rtl/ltr?
 */
//Commented out due to lack of tests
/*CSSLint.addRule({

    //rule information
    id: "text-indent",
    name: "Text Indent",
    desc: "Checks for text indent less than -99px",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;
    
        //check for use of "font-size"
        parser.addListener("property", function(event){
            var name = event.property,
                value = event.value;

            if (name == "text-indent" && value < -99){
                reporter.warn("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set text-direction for that item to ltr.", name.line, name.col, rule);
            }
        });
    }

});*/
/*
 * Rule: Headings (h1-h6) should be defined only once.
 */
CSSLint.addRule({

    //rule information
    id: "unique-headings",
    name: "Unique Headings",
    desc: "Headings should be defined only once.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        var headings =  {
                h1: 0,
                h2: 0,
                h3: 0,
                h4: 0,
                h5: 0,
                h6: 0
            };

        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                part,
                i;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                part = selector.parts[selector.parts.length-1];

                if (part.elementName && /(h[1-6])/.test(part.elementName.toString())){
                    headings[RegExp.$1]++;
                    if (headings[RegExp.$1] > 1) {
                        reporter.warn("Heading (" + part.elementName + ") has already been defined.", part.line, part.col, rule);
                    }
                }
            }
        });
    }

});
/*
 * Rule: When using a vendor-prefixed property, make sure to
 * include the standard one.
 */
CSSLint.addRule({

    //rule information
    id: "vendor-prefix",
    name: "Vendor Prefix",
    desc: "When using a vendor-prefixed property, make sure to include the standard one.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            properties,
            num,
            propertiesToCheck = {
                "-moz-border-radius": "border-radius",
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius": "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius": "border-bottom-right-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",
                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",
                "-moz-transform" : "transform",
                "-webkit-transform" : "transform",
                "-o-transform" : "transform",
                "-ms-transform" : "transform",
                "-moz-box-sizing" : "box-sizing",
                "-webkit-box-sizing" : "box-sizing"
            };

        //event handler for beginning of rules
        function startRule(){
            properties = {};
            num=1;        
        }
        
        //event handler for end of rules
        function endRule(event){
            var prop,
                i, len,
                standard,
                needed,
                actual,
                needsStandard = [];

            for (prop in properties){
                if (propertiesToCheck[prop]){
                    needsStandard.push({ actual: prop, needed: propertiesToCheck[prop]});
                }
            }

            for (i=0, len=needsStandard.length; i < len; i++){
                needed = needsStandard[i].needed;
                actual = needsStandard[i].actual;

                if (!properties[needed]){               
                    reporter.warn("Missing standard property '" + needed + "' to go along with '" + actual + "'.", event.line, event.col, rule);
                } else {
                    //make sure standard property is last
                    if (properties[needed][0].pos < properties[actual][0].pos){
                        reporter.warn("Standard property '" + needed + "' should come after vendor-prefixed property '" + actual + "'.", event.line, event.col, rule);
                    }
                }
            }

        }        
        
        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase();

            if (!properties[name]){
                properties[name] = [];
            }

            properties[name].push({ name: event.property, value : event.value, pos:num++ });
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
    }

});
/*
 * Rule: If an element has a width of 100%, be careful when placing within
 * an element that has padding. It may look strange.
 */
//Commented out pending further review.
/*CSSLint.addRule({

    //rule information
    id: "width-100",
    name: "Width 100%",
    desc: "Be careful when using width: 100% on elements.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            width100,
            boxsizing;

        parser.addListener("startrule", function(){
            width100 = null;
            boxsizing = false;
        });

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase(),
                value = event.value;

            if (name == "width" && value == "100%"){
                width100 = event.property;
            } else if (name == "box-sizing" || /\-(?:webkit|ms|moz)\-box-sizing/.test(name)){  //means you know what you're doing
                boxsizing = true;
            }
        });
        
        parser.addListener("endrule", function(){
            if (width100 && !boxsizing){
                reporter.warn("Elements with a width of 100% may not appear as you expect inside of other elements.", width100.line, width100.col, rule);
            }
        });
    }

});*/
/*
 * Rule: You don't need to specify units when a value is 0.
 */
CSSLint.addRule({

    //rule information
    id: "zero-units",
    name: "Zero Units",
    desc: "You don't need to specify units when a value is 0.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        //count how many times "float" is used
        parser.addListener("property", function(event){
            var parts = event.value.parts,
                i = 0, 
                len = parts.length;

            while(i < len){
                if ((parts[i].units || parts[i].type == "percentage") && parts[i].value === 0){
                    reporter.warn("Values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }

        });

    }

});
CSSLint.addFormatter({
    //format information
    id: "lint-xml",
    name: "Lint XML format",
    
    startFormat: function(){
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>";
    },

    endFormat: function(){
        return "</lint>";
    },
    
    formatResults: function(results, filename) {
        var messages = results.messages,
            output = [];

        var replaceDoubleQuotes = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/\"/g, "'");
        };

        if (messages.length > 0) {
            //rollups at the bottom
            messages.sort(function (a, b) {
                if (a.rollup && !b.rollup) {
                    return 1;
                } else if (!a.rollup && b.rollup) {
                    return -1;
                } else {
                    return 0;
                }
            });
        
            output.push("<file name=\""+filename+"\">");
            messages.forEach(function (message, i) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + replaceDoubleQuotes(message.message) + "\" evidence=\"" + replaceDoubleQuotes(message.evidence) + "\"/>");
                } else {
                    output.push("<issue line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + replaceDoubleQuotes(message.message) + "\" evidence=\"" + replaceDoubleQuotes(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});
CSSLint.addFormatter({
    //format information
    id: "text",
    name: "Plain Text",
    
    startFormat: function(){
        return "";
    },
    
    endFormat: function(){
        return "";
    },

    formatResults: function(results, filename) {
        var messages = results.messages;
        if (messages.length === 0) {
            return "\n\ncsslint: No errors in " + filename + ".";
        }
        
        output = "\n\ncsslint: There are " + messages.length  +  " problems in " + filename + ".";
        var pos = filename.lastIndexOf("/"),
            shortFilename = filename;

        if (pos == -1){
            pos = filename.lastIndexOf("\\");       
        }
        if (pos > -1){
            shortFilename = filename.substring(pos+1);
        }

        //rollups at the bottom
        messages.sort(function (a, b){
            if (a.rollup && !b.rollup){
                return 1;
            } else if (!a.rollup && b.rollup){
                return -1;
            } else {
                return 0;
            }
        });

        messages.forEach(function (message, i) {
            output = output + "\n\n" + shortFilename;
            if (message.rollup) {
                output += "\n" + (i+1) + ": " + message.type;
                output += "\n" + message.message;
            } else {
                output += "\n" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col;
                output += "\n" + message.message;
                output += "\n" + message.evidence;
            }
        });
    
        return output;
    }
});

return CSSLint;
})();
//print for rhino and nodejs
if(typeof print == "undefined") {
    var print = console.log;
}

//readFile for rhino and nodejs
if(typeof readFile == "undefined") {
    var readFile = function(filepath) {
        var fs = require("fs");
        return fs.readFileSync(filepath, "utf-8");
    }
}

//filter messages by type
var pluckByType = function(messages, type){
    return messages.filter(function(message) {
        return message.type === type;
    });
};

function gatherRules(options){
    var ruleset;
    
    if (options.rules){
        ruleset = {};
        options.rules.split(",").forEach(function(value){
            ruleset[value] = 1;
        });
    }
    
    return ruleset;
}

//process a list of files, return 1 if one or more error occurred
var processFile = function(filename, options) {
    var input = readFile(filename),
        result = CSSLint.verify(input, gatherRules(options)),
        formatId = options.format || "text",
        messages = result.messages || [],
        exitCode = 0;

    if (!input) {
        print("csslint: Could not read file data in " + filename + ". Is the file empty?");
        exitCode = 1;
    } else {
        print(CSSLint.getFormatter(formatId).formatResults(result, filename, formatId));

        if (messages.length > 0 && pluckByType(messages, 'error').length > 0) {
            exitCode = 1;
        }
    }
    
    return exitCode;
};

//output CLI help screen
function outputHelp(){
    print([
        "\nUsage: csslint-rhino.js [options]* [file|dir]*",
        " ",
        "Global Options",
        "  --help                 Displays this information.",
        "  --rules=<rule[,rule]+> Indicate which rules to include.",
        "  --format=<format>      Indicate which format to use for output.",
        "  --version              Outputs the current version number."
    ].join("\n") + "\n\n");
}

function processFiles(files, options){
    var exitCode = 0,
        formatId = options.format || "text",
        formatter;
    if (!files.length) {
        print("No files specified.");
        exitCode = 1;
    } else {
        if (!CSSLint.hasFormat(formatId)){
            print("csslint: Unknown format '" + formatId + "'. Cannot proceed.");
            exitCode = 1; 
        } else {
            formatter = CSSLint.getFormatter(formatId);
            print(formatter.startFormat());
            exitCode = files.some(function(file){
                processFile(file,options);
            });
            print(formatter.endFormat());
        }
    }
    return exitCode;
}
/*
 * CSSLint Rhino Command Line Interface
 */

importPackage(java.io);

//-----------------------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------------------

function getFiles(dir) {
    var files = [];

    var traverse = function (dir) {
        var dirList = dir.listFiles();
        dirList.forEach(function (file) {
            if (/\.css$/.test(file)) {
                files.push(file);
            } else if (file.isDirectory()) {
                traverse(file);
            }
        });
    };

    traverse(dir);

    return files;
};

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args     = Array.prototype.slice.call(arguments),
    argName,
    arg      = args.shift(),
    options  = {},
    files    = [];

while(arg){
    if (arg.indexOf("--") == 0){
        argName = arg.substring(2);
        options[argName] = true;
        
        if (argName.indexOf("rules=") > -1){
            options.rules = argName.substring(argName.indexOf("=") + 1);
        } else if (argName.indexOf("format=") > -1) {
            options.format = argName.substring(argName.indexOf("=") + 1);
        }
    } else {
        var curFile = new File(arg);
        
        //see if it's a directory or a file
        if (curFile.isDirectory()){
            files = files.concat(getFiles(arg));
        } else {
            files.push(arg);
        }
    }
    arg = args.shift();
}

if (options.help || arguments.length == 0){
    outputHelp();
    quit(0);
}

if (options.version){
    print("v" + CSSLint.version);
    quit(0);
}



quit(processFiles(files,options));
