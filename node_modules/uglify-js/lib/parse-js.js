/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file contains the tokenizer/parser.  It is a port to JavaScript
  of parse-js [1], a JavaScript parser library written in Common Lisp
  by Marijn Haverbeke.  Thank you Marijn!

  [1] http://marijn.haverbeke.nl/parse-js/

  Exported functions:

    - tokenizer(code) -- returns a function.  Call the returned
      function to fetch the next token.

    - parse(code) -- returns an AST of the given JavaScript code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/

/* -----[ Tokenizer (constants) ]----- */

var KEYWORDS = array_to_hash([
    "break",
    "case",
    "catch",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "new",
    "return",
    "switch",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
]);

var RESERVED_WORDS = array_to_hash([
    "abstract",
    "boolean",
    "byte",
    "char",
    "class",
    "double",
    "enum",
    "export",
    "extends",
    "final",
    "float",
    "goto",
    "implements",
    "import",
    "int",
    "interface",
    "long",
    "native",
    "package",
    "private",
    "protected",
    "public",
    "short",
    "static",
    "super",
    "synchronized",
    "throws",
    "transient",
    "volatile"
]);

var KEYWORDS_BEFORE_EXPRESSION = array_to_hash([
    "return",
    "new",
    "delete",
    "throw",
    "else",
    "case"
]);

var KEYWORDS_ATOM = array_to_hash([
    "false",
    "null",
    "true",
    "undefined"
]);

var OPERATOR_CHARS = array_to_hash(characters("+-*&%=<>!?|~^"));

var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
var RE_OCT_NUMBER = /^0[0-7]+$/;
var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;

var OPERATORS = array_to_hash([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    "+",
    "-",
    "!",
    "~",
    "&",
    "|",
    "^",
    "*",
    "/",
    "%",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "/=",
    "*=",
    "%=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    "&&",
    "||"
]);

var WHITESPACE_CHARS = array_to_hash(characters(" \u00a0\n\r\t\f\u000b\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\uFEFF"));

var PUNC_BEFORE_EXPRESSION = array_to_hash(characters("[{(,.;:"));

var PUNC_CHARS = array_to_hash(characters("[]{}(),;:"));

var REGEXP_MODIFIERS = array_to_hash(characters("gmsiy"));

/* -----[ Tokenizer ]----- */

var UNICODE = {  // Unicode 6.1
    letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
    combining_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
    connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),
    digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]")
};

function is_letter(ch) {
    return UNICODE.letter.test(ch);
};

function is_digit(ch) {
    ch = ch.charCodeAt(0);
    return ch >= 48 && ch <= 57;
};

function is_unicode_digit(ch) {
    return UNICODE.digit.test(ch);
}

function is_alphanumeric_char(ch) {
    return is_digit(ch) || is_letter(ch);
};

function is_unicode_combining_mark(ch) {
    return UNICODE.combining_mark.test(ch);
};

function is_unicode_connector_punctuation(ch) {
    return UNICODE.connector_punctuation.test(ch);
};

function is_identifier_start(ch) {
    return ch == "$" || ch == "_" || is_letter(ch);
};

function is_identifier_char(ch) {
    return is_identifier_start(ch)
        || is_unicode_combining_mark(ch)
        || is_unicode_digit(ch)
        || is_unicode_connector_punctuation(ch)
        || ch == "\u200c" // zero-width non-joiner <ZWNJ>
        || ch == "\u200d" // zero-width joiner <ZWJ> (in my ECMA-262 PDF, this is also 200c)
    ;
};

function parse_js_number(num) {
    if (RE_HEX_NUMBER.test(num)) {
        return parseInt(num.substr(2), 16);
    } else if (RE_OCT_NUMBER.test(num)) {
        return parseInt(num.substr(1), 8);
    } else if (RE_DEC_NUMBER.test(num)) {
        return parseFloat(num);
    }
};

function JS_Parse_Error(message, line, col, pos) {
    this.message = message;
    this.line = line + 1;
    this.col = col + 1;
    this.pos = pos + 1;
    this.stack = new Error().stack;
};

JS_Parse_Error.prototype.toString = function() {
    return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
};

function js_error(message, line, col, pos) {
    throw new JS_Parse_Error(message, line, col, pos);
};

function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
};

var EX_EOF = {};

function tokenizer($TEXT) {

    var S = {
        text            : $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, ''),
        pos             : 0,
        tokpos          : 0,
        line            : 0,
        tokline         : 0,
        col             : 0,
        tokcol          : 0,
        newline_before  : false,
        regex_allowed   : false,
        comments_before : []
    };

    function peek() { return S.text.charAt(S.pos); };

    function next(signal_eof, in_string) {
        var ch = S.text.charAt(S.pos++);
        if (signal_eof && !ch)
            throw EX_EOF;
        if (ch == "\n") {
            S.newline_before = S.newline_before || !in_string;
            ++S.line;
            S.col = 0;
        } else {
            ++S.col;
        }
        return ch;
    };

    function eof() {
        return !S.peek();
    };

    function find(what, signal_eof) {
        var pos = S.text.indexOf(what, S.pos);
        if (signal_eof && pos == -1) throw EX_EOF;
        return pos;
    };

    function start_token() {
        S.tokline = S.line;
        S.tokcol = S.col;
        S.tokpos = S.pos;
    };

    function token(type, value, is_comment) {
        S.regex_allowed = ((type == "operator" && !HOP(UNARY_POSTFIX, value)) ||
                           (type == "keyword" && HOP(KEYWORDS_BEFORE_EXPRESSION, value)) ||
                           (type == "punc" && HOP(PUNC_BEFORE_EXPRESSION, value)));
        var ret = {
            type   : type,
            value  : value,
            line   : S.tokline,
            col    : S.tokcol,
            pos    : S.tokpos,
            endpos : S.pos,
            nlb    : S.newline_before
        };
        if (!is_comment) {
            ret.comments_before = S.comments_before;
            S.comments_before = [];
            // make note of any newlines in the comments that came before
            for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                ret.nlb = ret.nlb || ret.comments_before[i].nlb;
            }
        }
        S.newline_before = false;
        return ret;
    };

    function skip_whitespace() {
        while (HOP(WHITESPACE_CHARS, peek()))
            next();
    };

    function read_while(pred) {
        var ret = "", ch = peek(), i = 0;
        while (ch && pred(ch, i++)) {
            ret += next();
            ch = peek();
        }
        return ret;
    };

    function parse_error(err) {
        js_error(err, S.tokline, S.tokcol, S.tokpos);
    };

    function read_num(prefix) {
        var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
        var num = read_while(function(ch, i){
            if (ch == "x" || ch == "X") {
                if (has_x) return false;
                return has_x = true;
            }
            if (!has_x && (ch == "E" || ch == "e")) {
                if (has_e) return false;
                return has_e = after_e = true;
            }
            if (ch == "-") {
                if (after_e || (i == 0 && !prefix)) return true;
                return false;
            }
            if (ch == "+") return after_e;
            after_e = false;
            if (ch == ".") {
                if (!has_dot && !has_x && !has_e)
                    return has_dot = true;
                return false;
            }
            return is_alphanumeric_char(ch);
        });
        if (prefix)
            num = prefix + num;
        var valid = parse_js_number(num);
        if (!isNaN(valid)) {
            return token("num", valid);
        } else {
            parse_error("Invalid syntax: " + num);
        }
    };

    function read_escaped_char(in_string) {
        var ch = next(true, in_string);
        switch (ch) {
          case "n" : return "\n";
          case "r" : return "\r";
          case "t" : return "\t";
          case "b" : return "\b";
          case "v" : return "\u000b";
          case "f" : return "\f";
          case "0" : return "\0";
          case "x" : return String.fromCharCode(hex_bytes(2));
          case "u" : return String.fromCharCode(hex_bytes(4));
          case "\n": return "";
          default  : return ch;
        }
    };

    function hex_bytes(n) {
        var num = 0;
        for (; n > 0; --n) {
            var digit = parseInt(next(true), 16);
            if (isNaN(digit))
                parse_error("Invalid hex-character pattern in string");
            num = (num << 4) | digit;
        }
        return num;
    };

    function read_string() {
        return with_eof_error("Unterminated string constant", function(){
            var quote = next(), ret = "";
            for (;;) {
                var ch = next(true);
                if (ch == "\\") {
                    // read OctalEscapeSequence (XXX: deprecated if "strict mode")
                    // https://github.com/mishoo/UglifyJS/issues/178
                    var octal_len = 0, first = null;
                    ch = read_while(function(ch){
                        if (ch >= "0" && ch <= "7") {
                            if (!first) {
                                first = ch;
                                return ++octal_len;
                            }
                            else if (first <= "3" && octal_len <= 2) return ++octal_len;
                            else if (first >= "4" && octal_len <= 1) return ++octal_len;
                        }
                        return false;
                    });
                    if (octal_len > 0) ch = String.fromCharCode(parseInt(ch, 8));
                    else ch = read_escaped_char(true);
                }
                else if (ch == quote) break;
                else if (ch == "\n") throw EX_EOF;
                ret += ch;
            }
            return token("string", ret);
        });
    };

    function read_line_comment() {
        next();
        var i = find("\n"), ret;
        if (i == -1) {
            ret = S.text.substr(S.pos);
            S.pos = S.text.length;
        } else {
            ret = S.text.substring(S.pos, i);
            S.pos = i;
        }
        return token("comment1", ret, true);
    };

    function read_multiline_comment() {
        next();
        return with_eof_error("Unterminated multiline comment", function(){
            var i = find("*/", true),
            text = S.text.substring(S.pos, i);
            S.pos = i + 2;
            S.line += text.split("\n").length - 1;
            S.newline_before = S.newline_before || text.indexOf("\n") >= 0;

            // https://github.com/mishoo/UglifyJS/issues/#issue/100
            if (/^@cc_on/i.test(text)) {
                warn("WARNING: at line " + S.line);
                warn("*** Found \"conditional comment\": " + text);
                warn("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer.");
            }

            return token("comment2", text, true);
        });
    };

    function read_name() {
        var backslash = false, name = "", ch, escaped = false, hex;
        while ((ch = peek()) != null) {
            if (!backslash) {
                if (ch == "\\") escaped = backslash = true, next();
                else if (is_identifier_char(ch)) name += next();
                else break;
            }
            else {
                if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                ch = read_escaped_char();
                if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                name += ch;
                backslash = false;
            }
        }
        if (HOP(KEYWORDS, name) && escaped) {
            hex = name.charCodeAt(0).toString(16).toUpperCase();
            name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
        }
        return name;
    };

    function read_regexp(regexp) {
        return with_eof_error("Unterminated regular expression", function(){
            var prev_backslash = false, ch, in_class = false;
            while ((ch = next(true))) if (prev_backslash) {
                regexp += "\\" + ch;
                prev_backslash = false;
            } else if (ch == "[") {
                in_class = true;
                regexp += ch;
            } else if (ch == "]" && in_class) {
                in_class = false;
                regexp += ch;
            } else if (ch == "/" && !in_class) {
                break;
            } else if (ch == "\\") {
                prev_backslash = true;
            } else {
                regexp += ch;
            }
            var mods = read_name();
            return token("regexp", [ regexp, mods ]);
        });
    };

    function read_operator(prefix) {
        function grow(op) {
            if (!peek()) return op;
            var bigger = op + peek();
            if (HOP(OPERATORS, bigger)) {
                next();
                return grow(bigger);
            } else {
                return op;
            }
        };
        return token("operator", grow(prefix || next()));
    };

    function handle_slash() {
        next();
        var regex_allowed = S.regex_allowed;
        switch (peek()) {
          case "/":
            S.comments_before.push(read_line_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
          case "*":
            S.comments_before.push(read_multiline_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
        }
        return S.regex_allowed ? read_regexp("") : read_operator("/");
    };

    function handle_dot() {
        next();
        return is_digit(peek())
            ? read_num(".")
            : token("punc", ".");
    };

    function read_word() {
        var word = read_name();
        return !HOP(KEYWORDS, word)
            ? token("name", word)
            : HOP(OPERATORS, word)
            ? token("operator", word)
            : HOP(KEYWORDS_ATOM, word)
            ? token("atom", word)
            : token("keyword", word);
    };

    function with_eof_error(eof_error, cont) {
        try {
            return cont();
        } catch(ex) {
            if (ex === EX_EOF) parse_error(eof_error);
            else throw ex;
        }
    };

    function next_token(force_regexp) {
        if (force_regexp != null)
            return read_regexp(force_regexp);
        skip_whitespace();
        start_token();
        var ch = peek();
        if (!ch) return token("eof");
        if (is_digit(ch)) return read_num();
        if (ch == '"' || ch == "'") return read_string();
        if (HOP(PUNC_CHARS, ch)) return token("punc", next());
        if (ch == ".") return handle_dot();
        if (ch == "/") return handle_slash();
        if (HOP(OPERATOR_CHARS, ch)) return read_operator();
        if (ch == "\\" || is_identifier_start(ch)) return read_word();
        parse_error("Unexpected character '" + ch + "'");
    };

    next_token.context = function(nc) {
        if (nc) S = nc;
        return S;
    };

    return next_token;

};

/* -----[ Parser (constants) ]----- */

var UNARY_PREFIX = array_to_hash([
    "typeof",
    "void",
    "delete",
    "--",
    "++",
    "!",
    "~",
    "-",
    "+"
]);

var UNARY_POSTFIX = array_to_hash([ "--", "++" ]);

var ASSIGNMENT = (function(a, ret, i){
    while (i < a.length) {
        ret[a[i]] = a[i].substr(0, a[i].length - 1);
        i++;
    }
    return ret;
})(
    ["+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="],
    { "=": true },
    0
);

var PRECEDENCE = (function(a, ret){
    for (var i = 0, n = 1; i < a.length; ++i, ++n) {
        var b = a[i];
        for (var j = 0; j < b.length; ++j) {
            ret[b[j]] = n;
        }
    }
    return ret;
})(
    [
        ["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ],
    {}
);

var STATEMENTS_WITH_LABELS = array_to_hash([ "for", "do", "while", "switch" ]);

var ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);

/* -----[ Parser ]----- */

function NodeWithToken(str, start, end) {
    this.name = str;
    this.start = start;
    this.end = end;
};

NodeWithToken.prototype.toString = function() { return this.name; };

function parse($TEXT, exigent_mode, embed_tokens) {

    var S = {
        input         : typeof $TEXT == "string" ? tokenizer($TEXT, true) : $TEXT,
        token         : null,
        prev          : null,
        peeked        : null,
        in_function   : 0,
        in_directives : true,
        in_loop       : 0,
        labels        : []
    };

    S.token = next();

    function is(type, value) {
        return is_token(S.token, type, value);
    };

    function peek() { return S.peeked || (S.peeked = S.input()); };

    function next() {
        S.prev = S.token;
        if (S.peeked) {
            S.token = S.peeked;
            S.peeked = null;
        } else {
            S.token = S.input();
        }
        S.in_directives = S.in_directives && (
            S.token.type == "string" || is("punc", ";")
        );
        return S.token;
    };

    function prev() {
        return S.prev;
    };

    function croak(msg, line, col, pos) {
        var ctx = S.input.context();
        js_error(msg,
                 line != null ? line : ctx.tokline,
                 col != null ? col : ctx.tokcol,
                 pos != null ? pos : ctx.tokpos);
    };

    function token_error(token, msg) {
        croak(msg, token.line, token.col);
    };

    function unexpected(token) {
        if (token == null)
            token = S.token;
        token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
    };

    function expect_token(type, val) {
        if (is(type, val)) {
            return next();
        }
        token_error(S.token, "Unexpected token " + S.token.type + ", expected " + type);
    };

    function expect(punc) { return expect_token("punc", punc); };

    function can_insert_semicolon() {
        return !exigent_mode && (
            S.token.nlb || is("eof") || is("punc", "}")
        );
    };

    function semicolon() {
        if (is("punc", ";")) next();
        else if (!can_insert_semicolon()) unexpected();
    };

    function as() {
        return slice(arguments);
    };

    function parenthesised() {
        expect("(");
        var ex = expression();
        expect(")");
        return ex;
    };

    function add_tokens(str, start, end) {
        return str instanceof NodeWithToken ? str : new NodeWithToken(str, start, end);
    };

    function maybe_embed_tokens(parser) {
        if (embed_tokens) return function() {
            var start = S.token;
            var ast = parser.apply(this, arguments);
            ast[0] = add_tokens(ast[0], start, prev());
            return ast;
        };
        else return parser;
    };

    var statement = maybe_embed_tokens(function() {
        if (is("operator", "/") || is("operator", "/=")) {
            S.peeked = null;
            S.token = S.input(S.token.value.substr(1)); // force regexp
        }
        switch (S.token.type) {
          case "string":
            var dir = S.in_directives, stat = simple_statement();
            if (dir && stat[1][0] == "string" && !is("punc", ","))
                return as("directive", stat[1][1]);
            return stat;
          case "num":
          case "regexp":
          case "operator":
          case "atom":
            return simple_statement();

          case "name":
            return is_token(peek(), "punc", ":")
                ? labeled_statement(prog1(S.token.value, next, next))
                : simple_statement();

          case "punc":
            switch (S.token.value) {
              case "{":
                return as("block", block_());
              case "[":
              case "(":
                return simple_statement();
              case ";":
                next();
                return as("block");
              default:
                unexpected();
            }

          case "keyword":
            switch (prog1(S.token.value, next)) {
              case "break":
                return break_cont("break");

              case "continue":
                return break_cont("continue");

              case "debugger":
                semicolon();
                return as("debugger");

              case "do":
                return (function(body){
                    expect_token("keyword", "while");
                    return as("do", prog1(parenthesised, semicolon), body);
                })(in_loop(statement));

              case "for":
                return for_();

              case "function":
                return function_(true);

              case "if":
                return if_();

              case "return":
                if (S.in_function == 0)
                    croak("'return' outside of function");
                return as("return",
                          is("punc", ";")
                          ? (next(), null)
                          : can_insert_semicolon()
                          ? null
                          : prog1(expression, semicolon));

              case "switch":
                return as("switch", parenthesised(), switch_block_());

              case "throw":
                if (S.token.nlb)
                    croak("Illegal newline after 'throw'");
                return as("throw", prog1(expression, semicolon));

              case "try":
                return try_();

              case "var":
                return prog1(var_, semicolon);

              case "const":
                return prog1(const_, semicolon);

              case "while":
                return as("while", parenthesised(), in_loop(statement));

              case "with":
                return as("with", parenthesised(), statement());

              default:
                unexpected();
            }
        }
    });

    function labeled_statement(label) {
        S.labels.push(label);
        var start = S.token, stat = statement();
        if (exigent_mode && !HOP(STATEMENTS_WITH_LABELS, stat[0]))
            unexpected(start);
        S.labels.pop();
        return as("label", label, stat);
    };

    function simple_statement() {
        return as("stat", prog1(expression, semicolon));
    };

    function break_cont(type) {
        var name;
        if (!can_insert_semicolon()) {
            name = is("name") ? S.token.value : null;
        }
        if (name != null) {
            next();
            if (!member(name, S.labels))
                croak("Label " + name + " without matching loop or statement");
        }
        else if (S.in_loop == 0)
            croak(type + " not inside a loop or switch");
        semicolon();
        return as(type, name);
    };

    function for_() {
        expect("(");
        var init = null;
        if (!is("punc", ";")) {
            init = is("keyword", "var")
                ? (next(), var_(true))
                : expression(true, true);
            if (is("operator", "in")) {
                if (init[0] == "var" && init[1].length > 1)
                    croak("Only one variable declaration allowed in for..in loop");
                return for_in(init);
            }
        }
        return regular_for(init);
    };

    function regular_for(init) {
        expect(";");
        var test = is("punc", ";") ? null : expression();
        expect(";");
        var step = is("punc", ")") ? null : expression();
        expect(")");
        return as("for", init, test, step, in_loop(statement));
    };

    function for_in(init) {
        var lhs = init[0] == "var" ? as("name", init[1][0]) : init;
        next();
        var obj = expression();
        expect(")");
        return as("for-in", init, lhs, obj, in_loop(statement));
    };

    var function_ = function(in_statement) {
        var name = is("name") ? prog1(S.token.value, next) : null;
        if (in_statement && !name)
            unexpected();
        expect("(");
        return as(in_statement ? "defun" : "function",
                  name,
                  // arguments
                  (function(first, a){
                      while (!is("punc", ")")) {
                          if (first) first = false; else expect(",");
                          if (!is("name")) unexpected();
                          a.push(S.token.value);
                          next();
                      }
                      next();
                      return a;
                  })(true, []),
                  // body
                  (function(){
                      ++S.in_function;
                      var loop = S.in_loop;
                      S.in_directives = true;
                      S.in_loop = 0;
                      var a = block_();
                      --S.in_function;
                      S.in_loop = loop;
                      return a;
                  })());
    };

    function if_() {
        var cond = parenthesised(), body = statement(), belse;
        if (is("keyword", "else")) {
            next();
            belse = statement();
        }
        return as("if", cond, body, belse);
    };

    function block_() {
        expect("{");
        var a = [];
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            a.push(statement());
        }
        next();
        return a;
    };

    var switch_block_ = curry(in_loop, function(){
        expect("{");
        var a = [], cur = null;
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            if (is("keyword", "case")) {
                next();
                cur = [];
                a.push([ expression(), cur ]);
                expect(":");
            }
            else if (is("keyword", "default")) {
                next();
                expect(":");
                cur = [];
                a.push([ null, cur ]);
            }
            else {
                if (!cur) unexpected();
                cur.push(statement());
            }
        }
        next();
        return a;
    });

    function try_() {
        var body = block_(), bcatch, bfinally;
        if (is("keyword", "catch")) {
            next();
            expect("(");
            if (!is("name"))
                croak("Name expected");
            var name = S.token.value;
            next();
            expect(")");
            bcatch = [ name, block_() ];
        }
        if (is("keyword", "finally")) {
            next();
            bfinally = block_();
        }
        if (!bcatch && !bfinally)
            croak("Missing catch/finally blocks");
        return as("try", body, bcatch, bfinally);
    };

    function vardefs(no_in) {
        var a = [];
        for (;;) {
            if (!is("name"))
                unexpected();
            var name = S.token.value;
            next();
            if (is("operator", "=")) {
                next();
                a.push([ name, expression(false, no_in) ]);
            } else {
                a.push([ name ]);
            }
            if (!is("punc", ","))
                break;
            next();
        }
        return a;
    };

    function var_(no_in) {
        return as("var", vardefs(no_in));
    };

    function const_() {
        return as("const", vardefs());
    };

    function new_() {
        var newexp = expr_atom(false), args;
        if (is("punc", "(")) {
            next();
            args = expr_list(")");
        } else {
            args = [];
        }
        return subscripts(as("new", newexp, args), true);
    };

    var expr_atom = maybe_embed_tokens(function(allow_calls) {
        if (is("operator", "new")) {
            next();
            return new_();
        }
        if (is("punc")) {
            switch (S.token.value) {
              case "(":
                next();
                return subscripts(prog1(expression, curry(expect, ")")), allow_calls);
              case "[":
                next();
                return subscripts(array_(), allow_calls);
              case "{":
                next();
                return subscripts(object_(), allow_calls);
            }
            unexpected();
        }
        if (is("keyword", "function")) {
            next();
            return subscripts(function_(false), allow_calls);
        }
        if (HOP(ATOMIC_START_TOKEN, S.token.type)) {
            var atom = S.token.type == "regexp"
                ? as("regexp", S.token.value[0], S.token.value[1])
                : as(S.token.type, S.token.value);
            return subscripts(prog1(atom, next), allow_calls);
        }
        unexpected();
    });

    function expr_list(closing, allow_trailing_comma, allow_empty) {
        var first = true, a = [];
        while (!is("punc", closing)) {
            if (first) first = false; else expect(",");
            if (allow_trailing_comma && is("punc", closing)) break;
            if (is("punc", ",") && allow_empty) {
                a.push([ "atom", "undefined" ]);
            } else {
                a.push(expression(false));
            }
        }
        next();
        return a;
    };

    function array_() {
        return as("array", expr_list("]", !exigent_mode, true));
    };

    function object_() {
        var first = true, a = [];
        while (!is("punc", "}")) {
            if (first) first = false; else expect(",");
            if (!exigent_mode && is("punc", "}"))
                // allow trailing comma
                break;
            var type = S.token.type;
            var name = as_property_name();
            if (type == "name" && (name == "get" || name == "set") && !is("punc", ":")) {
                a.push([ as_name(), function_(false), name ]);
            } else {
                expect(":");
                a.push([ name, expression(false) ]);
            }
        }
        next();
        return as("object", a);
    };

    function as_property_name() {
        switch (S.token.type) {
          case "num":
          case "string":
            return prog1(S.token.value, next);
        }
        return as_name();
    };

    function as_name() {
        switch (S.token.type) {
          case "name":
          case "operator":
          case "keyword":
          case "atom":
            return prog1(S.token.value, next);
          default:
            unexpected();
        }
    };

    function subscripts(expr, allow_calls) {
        if (is("punc", ".")) {
            next();
            return subscripts(as("dot", expr, as_name()), allow_calls);
        }
        if (is("punc", "[")) {
            next();
            return subscripts(as("sub", expr, prog1(expression, curry(expect, "]"))), allow_calls);
        }
        if (allow_calls && is("punc", "(")) {
            next();
            return subscripts(as("call", expr, expr_list(")")), true);
        }
        return expr;
    };

    function maybe_unary(allow_calls) {
        if (is("operator") && HOP(UNARY_PREFIX, S.token.value)) {
            return make_unary("unary-prefix",
                              prog1(S.token.value, next),
                              maybe_unary(allow_calls));
        }
        var val = expr_atom(allow_calls);
        while (is("operator") && HOP(UNARY_POSTFIX, S.token.value) && !S.token.nlb) {
            val = make_unary("unary-postfix", S.token.value, val);
            next();
        }
        return val;
    };

    function make_unary(tag, op, expr) {
        if ((op == "++" || op == "--") && !is_assignable(expr))
            croak("Invalid use of " + op + " operator");
        return as(tag, op, expr);
    };

    function expr_op(left, min_prec, no_in) {
        var op = is("operator") ? S.token.value : null;
        if (op && op == "in" && no_in) op = null;
        var prec = op != null ? PRECEDENCE[op] : null;
        if (prec != null && prec > min_prec) {
            next();
            var right = expr_op(maybe_unary(true), prec, no_in);
            return expr_op(as("binary", op, left, right), min_prec, no_in);
        }
        return left;
    };

    function expr_ops(no_in) {
        return expr_op(maybe_unary(true), 0, no_in);
    };

    function maybe_conditional(no_in) {
        var expr = expr_ops(no_in);
        if (is("operator", "?")) {
            next();
            var yes = expression(false);
            expect(":");
            return as("conditional", expr, yes, expression(false, no_in));
        }
        return expr;
    };

    function is_assignable(expr) {
        if (!exigent_mode) return true;
        switch (expr[0]+"") {
          case "dot":
          case "sub":
          case "new":
          case "call":
            return true;
          case "name":
            return expr[1] != "this";
        }
    };

    function maybe_assign(no_in) {
        var left = maybe_conditional(no_in), val = S.token.value;
        if (is("operator") && HOP(ASSIGNMENT, val)) {
            if (is_assignable(left)) {
                next();
                return as("assign", ASSIGNMENT[val], left, maybe_assign(no_in));
            }
            croak("Invalid assignment");
        }
        return left;
    };

    var expression = maybe_embed_tokens(function(commas, no_in) {
        if (arguments.length == 0)
            commas = true;
        var expr = maybe_assign(no_in);
        if (commas && is("punc", ",")) {
            next();
            return as("seq", expr, expression(true, no_in));
        }
        return expr;
    });

    function in_loop(cont) {
        try {
            ++S.in_loop;
            return cont();
        } finally {
            --S.in_loop;
        }
    };

    return as("toplevel", (function(a){
        while (!is("eof"))
            a.push(statement());
        return a;
    })([]));

};

/* -----[ Utilities ]----- */

function curry(f) {
    var args = slice(arguments, 1);
    return function() { return f.apply(this, args.concat(slice(arguments))); };
};

function prog1(ret) {
    if (ret instanceof Function)
        ret = ret();
    for (var i = 1, n = arguments.length; --n > 0; ++i)
        arguments[i]();
    return ret;
};

function array_to_hash(a) {
    var ret = {};
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
};

function slice(a, start) {
    return Array.prototype.slice.call(a, start || 0);
};

function characters(str) {
    return str.split("");
};

function member(name, array) {
    for (var i = array.length; --i >= 0;)
        if (array[i] == name)
            return true;
    return false;
};

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

var warn = function() {};

/* -----[ Exports ]----- */

exports.tokenizer = tokenizer;
exports.parse = parse;
exports.slice = slice;
exports.curry = curry;
exports.member = member;
exports.array_to_hash = array_to_hash;
exports.PRECEDENCE = PRECEDENCE;
exports.KEYWORDS_ATOM = KEYWORDS_ATOM;
exports.RESERVED_WORDS = RESERVED_WORDS;
exports.KEYWORDS = KEYWORDS;
exports.ATOMIC_START_TOKEN = ATOMIC_START_TOKEN;
exports.OPERATORS = OPERATORS;
exports.is_alphanumeric_char = is_alphanumeric_char;
exports.is_identifier_start = is_identifier_start;
exports.is_identifier_char = is_identifier_char;
exports.set_logger = function(logger) {
    warn = logger;
};

// Local variables:
// js-indent-level: 4
// End:
