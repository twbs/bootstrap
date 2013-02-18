/**
 * cssmin.js
 * Author: Stoyan Stefanov - http://phpied.com/
 * This is a JavaScript port of the CSS minification tool
 * distributed with YUICompressor, itself a port
 * of the cssmin utility by Isaac Schlueter - http://foohack.com/
 * Permission is hereby granted to use the JavaScript version under the same
 * conditions as the YUICompressor (original YUICompressor note below).
 */

/*
* YUI Compressor
* http://developer.yahoo.com/yui/compressor/
* Author: Julien Lecomte - http://www.julienlecomte.net/
* Copyright (c) 2011 Yahoo! Inc. All rights reserved.
* The copyrights embodied in the content of this file are licensed
* by Yahoo! Inc. under the BSD (revised) open source license.
*/
var YAHOO = YAHOO || {};
YAHOO.compressor = YAHOO.compressor || {};

/**
 * Utility method to replace all data urls with tokens before we start
 * compressing, to avoid performance issues running some of the subsequent
 * regexes against large strings chunks.
 *
 * @private
 * @method _extractDataUrls
 * @param {String} css The input css
 * @param {Array} The global array of tokens to preserve
 * @returns String The processed css
 */
YAHOO.compressor._extractDataUrls = function (css, preservedTokens) {

    // Leave data urls alone to increase parse performance.
    var maxIndex = css.length - 1,
        appendIndex = 0,
        startIndex,
        endIndex,
        terminator,
        foundTerminator,
        sb = [],
        m,
        preserver,
        token,
        pattern = /url\(\s*(["']?)data\:/g;

    // Since we need to account for non-base64 data urls, we need to handle
    // ' and ) being part of the data string. Hence switching to indexOf,
    // to determine whether or not we have matching string terminators and
    // handling sb appends directly, instead of using matcher.append* methods.

    while ((m = pattern.exec(css)) !== null) {

        startIndex = m.index + 4;  // "url(".length()
        terminator = m[1];         // ', " or empty (not quoted)

        if (terminator.length === 0) {
            terminator = ")";
        }

        foundTerminator = false;

        endIndex = pattern.lastIndex - 1;

        while(foundTerminator === false && endIndex+1 <= maxIndex) {
            endIndex = css.indexOf(terminator, endIndex + 1);

            // endIndex == 0 doesn't really apply here
            if ((endIndex > 0) && (css.charAt(endIndex - 1) !== '\\')) {
                foundTerminator = true;
                if (")" != terminator) {
                    endIndex = css.indexOf(")", endIndex);
                }
            }
        }

        // Enough searching, start moving stuff over to the buffer
        sb.push(css.substring(appendIndex, m.index));

        if (foundTerminator) {
            token = css.substring(startIndex, endIndex);
            token = token.replace(/\s+/g, "");
            preservedTokens.push(token);

            preserver = "url(___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___)";
            sb.push(preserver);

            appendIndex = endIndex + 1;
        } else {
            // No end terminator found, re-add the whole match. Should we throw/warn here?
            sb.push(css.substring(m.index, pattern.lastIndex));
            appendIndex = pattern.lastIndex;
        }
    }

    sb.push(css.substring(appendIndex));

    return sb.join("");
};

/**
 * Utility method to compress hex color values of the form #AABBCC to #ABC.
 *
 * DOES NOT compress CSS ID selectors which match the above pattern (which would break things).
 * e.g. #AddressForm { ... }
 *
 * DOES NOT compress IE filters, which have hex color values (which would break things).
 * e.g. filter: chroma(color="#FFFFFF");
 *
 * DOES NOT compress invalid hex values.
 * e.g. background-color: #aabbccdd
 *
 * @private
 * @method _compressHexColors
 * @param {String} css The input css
 * @returns String The processed css
 */
YAHOO.compressor._compressHexColors = function(css) {

    // Look for hex colors inside { ... } (to avoid IDs) and which don't have a =, or a " in front of them (to avoid filters)
    var pattern = /(\=\s*?["']?)?#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])(\}|[^0-9a-f{][^{]*?\})/gi,
        m,
        index = 0,
        isFilter,
        sb = [];

    while ((m = pattern.exec(css)) !== null) {

        sb.push(css.substring(index, m.index));

        isFilter = m[1];

        if (isFilter) {
            // Restore, maintain case, otherwise filter will break
            sb.push(m[1] + "#" + (m[2] + m[3] + m[4] + m[5] + m[6] + m[7]));
        } else {
            if (m[2].toLowerCase() == m[3].toLowerCase() &&
                m[4].toLowerCase() == m[5].toLowerCase() &&
                m[6].toLowerCase() == m[7].toLowerCase()) {

                // Compress.
                sb.push("#" + (m[3] + m[5] + m[7]).toLowerCase());
            } else {
                // Non compressible color, restore but lower case.
                sb.push("#" + (m[2] + m[3] + m[4] + m[5] + m[6] + m[7]).toLowerCase());
            }
        }

        index = pattern.lastIndex = pattern.lastIndex - m[8].length;
    }

    sb.push(css.substring(index));

    return sb.join("");
};

YAHOO.compressor.cssmin = function (css, linebreakpos) {

    var startIndex = 0,
        endIndex = 0,
        i = 0, max = 0,
        preservedTokens = [],
        comments = [],
        token = '',
        totallen = css.length,
        placeholder = '';

    css = this._extractDataUrls(css, preservedTokens);

    // collect all comment blocks...
    while ((startIndex = css.indexOf("/*", startIndex)) >= 0) {
        endIndex = css.indexOf("*/", startIndex + 2);
        if (endIndex < 0) {
            endIndex = totallen;
        }
        token = css.slice(startIndex + 2, endIndex);
        comments.push(token);
        css = css.slice(0, startIndex + 2) + "___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + (comments.length - 1) + "___" + css.slice(endIndex);
        startIndex += 2;
    }

    // preserve strings so their content doesn't get accidentally minified
    css = css.replace(/("([^\\"]|\\.|\\)*")|('([^\\']|\\.|\\)*')/g, function (match) {
        var i, max, quote = match.substring(0, 1);

        match = match.slice(1, -1);

        // maybe the string contains a comment-like substring?
        // one, maybe more? put'em back then
        if (match.indexOf("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_") >= 0) {
            for (i = 0, max = comments.length; i < max; i = i + 1) {
                match = match.replace("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___", comments[i]);
            }
        }

        // minify alpha opacity in filter strings
        match = match.replace(/progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=/gi, "alpha(opacity=");

        preservedTokens.push(match);
        return quote + "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___" + quote;
    });

    // strings are safe, now wrestle the comments
    for (i = 0, max = comments.length; i < max; i = i + 1) {

        token = comments[i];
        placeholder = "___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___";

        // ! in the first position of the comment means preserve
        // so push to the preserved tokens keeping the !
        if (token.charAt(0) === "!") {
            preservedTokens.push(token);
            css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
            continue;
        }

        // \ in the last position looks like hack for Mac/IE5
        // shorten that to /*\*/ and the next one to /**/
        if (token.charAt(token.length - 1) === "\\") {
            preservedTokens.push("\\");
            css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
            i = i + 1; // attn: advancing the loop
            preservedTokens.push("");
            css = css.replace("___YUICSSMIN_PRESERVE_CANDIDATE_COMMENT_" + i + "___",  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
            continue;
        }

        // keep empty comments after child selectors (IE7 hack)
        // e.g. html >/**/ body
        if (token.length === 0) {
            startIndex = css.indexOf(placeholder);
            if (startIndex > 2) {
                if (css.charAt(startIndex - 3) === '>') {
                    preservedTokens.push("");
                    css = css.replace(placeholder,  "___YUICSSMIN_PRESERVED_TOKEN_" + (preservedTokens.length - 1) + "___");
                }
            }
        }

        // in all other cases kill the comment
        css = css.replace("/*" + placeholder + "*/", "");
    }


    // Normalize all whitespace strings to single spaces. Easier to work with that way.
    css = css.replace(/\s+/g, " ");

    // Remove the spaces before the things that should not have spaces before them.
    // But, be careful not to turn "p :link {...}" into "p:link{...}"
    // Swap out any pseudo-class colons with the token, and then swap back.
    css = css.replace(/(^|\})(([^\{:])+:)+([^\{]*\{)/g, function (m) {
        return m.replace(":", "___YUICSSMIN_PSEUDOCLASSCOLON___");
    });
    css = css.replace(/\s+([!{};:>+\(\)\],])/g, '$1');
    css = css.replace(/___YUICSSMIN_PSEUDOCLASSCOLON___/g, ":");

    // retain space for special IE6 cases
    css = css.replace(/:first-(line|letter)(\{|,)/g, ":first-$1 $2");

    // no space after the end of a preserved comment
    css = css.replace(/\*\/ /g, '*/');


    // If there is a @charset, then only allow one, and push to the top of the file.
    css = css.replace(/^(.*)(@charset "[^"]*";)/gi, '$2$1');
    css = css.replace(/^(\s*@charset [^;]+;\s*)+/gi, '$1');

    // Put the space back in some cases, to support stuff like
    // @media screen and (-webkit-min-device-pixel-ratio:0){
    css = css.replace(/\band\(/gi, "and (");


    // Remove the spaces after the things that should not have spaces after them.
    css = css.replace(/([!{}:;>+\(\[,])\s+/g, '$1');

    // remove unnecessary semicolons
    css = css.replace(/;+\}/g, "}");

    // Replace 0(px,em,%) with 0.
    css = css.replace(/([\s:])(0)(px|em|%|in|cm|mm|pc|pt|ex)/gi, "$1$2");

    // Replace 0 0 0 0; with 0.
    css = css.replace(/:0 0 0 0(;|\})/g, ":0$1");
    css = css.replace(/:0 0 0(;|\})/g, ":0$1");
    css = css.replace(/:0 0(;|\})/g, ":0$1");

    // Replace background-position:0; with background-position:0 0;
    // same for transform-origin
    css = css.replace(/(background-position|transform-origin|webkit-transform-origin|moz-transform-origin|o-transform-origin|ms-transform-origin):0(;|\})/gi, function(all, prop, tail) {
        return prop.toLowerCase() + ":0 0" + tail;
    });

    // Replace 0.6 to .6, but only when preceded by : or a white-space
    css = css.replace(/(:|\s)0+\.(\d+)/g, "$1.$2");

    // Shorten colors from rgb(51,102,153) to #336699
    // This makes it more likely that it'll get further compressed in the next step.
    css = css.replace(/rgb\s*\(\s*([0-9,\s]+)\s*\)/gi, function () {
        var i, rgbcolors = arguments[1].split(',');
        for (i = 0; i < rgbcolors.length; i = i + 1) {
            rgbcolors[i] = parseInt(rgbcolors[i], 10).toString(16);
            if (rgbcolors[i].length === 1) {
                rgbcolors[i] = '0' + rgbcolors[i];
            }
        }
        return '#' + rgbcolors.join('');
    });

    // Shorten colors from #AABBCC to #ABC.
    css = this._compressHexColors(css);

    // border: none -> border:0
    css = css.replace(/(border|border-top|border-right|border-bottom|border-right|outline|background):none(;|\})/gi, function(all, prop, tail) {
        return prop.toLowerCase() + ":0" + tail;
    });

    // shorter opacity IE filter
    css = css.replace(/progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=/gi, "alpha(opacity=");

    // Remove empty rules.
    css = css.replace(/[^\};\{\/]+\{\}/g, "");

    if (linebreakpos >= 0) {
        // Some source control tools don't like it when files containing lines longer
        // than, say 8000 characters, are checked in. The linebreak option is used in
        // that case to split long lines after a specific column.
        startIndex = 0;
        i = 0;
        while (i < css.length) {
            i = i + 1;
            if (css[i - 1] === '}' && i - startIndex > linebreakpos) {
                css = css.slice(0, i) + '\n' + css.slice(i);
                startIndex = i;
            }
        }
    }

    // Replace multiple semi-colons in a row by a single one
    // See SF bug #1980989
    css = css.replace(/;;+/g, ";");

    // restore preserved comments and strings
    for (i = 0, max = preservedTokens.length; i < max; i = i + 1) {
        css = css.replace("___YUICSSMIN_PRESERVED_TOKEN_" + i + "___", preservedTokens[i]);
    }

    // Trim the final string (for any leading or trailing white spaces)
    css = css.replace(/^\s+|\s+$/g, "");

    return css;

};

exports.compressor = YAHOO.compressor;