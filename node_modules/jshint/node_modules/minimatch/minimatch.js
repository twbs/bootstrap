// This is a JavaScript implementation of the fnmatch-like
// stuff that git uses in its .gitignore files.
// See `man 5 gitignore`.

module.exports = minimatch

var path = require("path")
  , LRU = require("lru-cache")

minimatch.filter = function (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

minimatch.match = function (list, pattern, options) {
  if (!options) options = {}
  var ret = list.filter(minimatch.filter(pattern, options))
  if (options.debug) console.error("\nmatch: %s %j %j", pattern, list, ret)

  // set the null flag to allow empty match sets
  // Note that minimatch itself, and filter(), do not
  // respect this flag, only minimatch.match(list, pattern) does.
  if (!options.null && !ret.length) {
    return [pattern]
  }

  return ret
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  options = options || {}

  // to set the cache, just replace with a different obj
  // supporting set(k,v) and v=get(k) methods.
  var cache = options.cache || minimatch.cache
  if (!cache) cache = minimatch.cache = new LRU(1000)

  // "" only matches ""
  if (!pattern) return p === ""

  // comments.
  if (pattern.trim().charAt(0) === "#") return false

  // check the cache
  var re = cache.get(pattern + "\n" + JSON.stringify(options))
  if (!re && re !== false) {
    cache.set(pattern, re = minimatch.makeRe(pattern, options))
  }

  if (options.debug) {
    console.error(pattern + "\t" + re, JSON.stringify(p))
  }

  // some kind of invalid thing
  if (!re) return false


  // patterns that end in / can only match dirs
  // however, dirs also match the same thing that *doesn't*
  // end in a slash.
  var match =
    // a/ should not match a/*, but will match */
    // accomplish this by not applying the regexp
    // directly, unless the pattern would match
    // trailing slash'ed things, or the thing isn't
    // a trailing slash, or slashes are opted-in
    ( ( options.slash ||
        p.substr(-1) !== "/" ||
        pattern.substr(-1) === "/" )
      && !!p.match(re) )

    // a/ should match * or a
    || ( p.substr(-1) === "/" &&
         !!p.slice(0, -1).match(re) )

    // a pattern with *no* slashes will match against
    // either the full path, or just the basename.
    || ( options.matchBase &&
         pattern.indexOf("/") === -1 &&
         path.basename(p).match(re) )

  //console.error("  MINIMATCH: %j %j %j %j",
  //            re.toString(), pattern, p, match)
  return match
}

minimatch.makeRe = makeRe
function makeRe (pattern, options) {
  options = options || {}

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += oneStar
          break
        case "?":
          re += "."
          break
        default:
          re += "\\"+stateChar
          break
      }
      stateChar = false
    }
  }

  var braceDepth = 0
    , re = ""
    , escaping = false
    , oneStar = options.dot ? "[^\\/]*?"
      : "(?:(?!(?:\\\/|^)\\.)[^\\/])*?"
    , twoStar = options.dot ? ".*?"
      // not a ^ or / followed by a dot,
      // followed by anything, any number of times.
      : "(?:(?!(?:\\\/|^)\\.).)*?"
    , reSpecials = "().*{}+?[]^$/\\"
    , patternListStack = []
    , stateChar
    , negate = false
    , negating = false
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    , classStartPattern = options.dot ? ""
      : "(?:(?!(?:\\\/|^)\\.)"
    , classEndPattern = options.dot ? "" : ")"

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    if (options.debug) {
      console.error("%s\t%s %s %j", pattern, i, re, c)
    }

    switch (c) {
      case "\\":
        if (stateChar) {
          if (stateChar === "*") re += oneStar
          else re += "\\" + stateChar
          stateChar = false
        }
        if (escaping) {
          re += "\\\\" // must match literal \
          escaping = false
        } else {
          escaping = true
        }
        continue

      // the various stateChar values
      case "!":
        if (i === 0 || negating) {
          negate = !negate
          negating = true
          break
        } else {
          negating = false
        }
        // fallthrough
      case "+":
      case "@":
      case "*":
      case "?":
       if (options.debug) {
         console.error("%s\t%s %s %j <-- stateChar", pattern, i, re, c)
       }

        negating = false
        if (escaping) {
          re += "\\" + c
          escaping = false
        } else if (inClass) {
          re += c
        } else if (c === "*" && stateChar === "*") { // **
          re += twoStar
          stateChar = false
        } else {
          if (stateChar) {
            if (stateChar === "*") re += oneStar
            else if (stateChar === "?") re += "."
            else re += "\\" + stateChar
          }
          stateChar = c
        }
        continue

      case "(":
        if (escaping) {
          re += "\\("
          escaping = false
        } else if (inClass) {
          re += "("
        } else if (stateChar) {
          plType = stateChar
          patternListStack.push(plType)
          re += stateChar === "!" ? "(?!" : "(?:"
          stateChar = false
        } else {
          re += "\\("
        }
        continue

      case ")":
        if (escaping || inClass) {
          re += "\\)"
          escaping = false
        } else if (patternListStack.length) {
          re += ")"
          plType = patternListStack.pop()
          switch (plType) {
            case "?":
            case "+":
            case "*": re += plType
            case "!":
            case "@": break
          }
        } else {
          re += "\\)"
        }
        continue

      case "|":
        if (escaping || inClass) {
          re += "\\|"
          escaping = false
        } else if (patternListStack.length) {
          re += "|"
        } else {
          re += "\\|"
        }
        continue

      // these are mostly the same in regexp and glob :)
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (escaping || inClass) {
          re += "\\" + c
          escaping = false
        } else {
          inClass = true
          classStart = i
          reClassStart = re.length
          re += classStartPattern
          re += c
        }
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1) escaping = true

        if (escaping || !inClass) {
          re += "\\" + c
          escaping = false
        } else {
          inClass = false
          re += c + classEndPattern
        }
        continue

      case "{":
        if (escaping || inClass) {
          re += "\\{"
          escaping = false
        } else {
          re += "(?:"
          braceDepth ++
        }
        continue

      case "}":
        if (escaping || inClass || braceDepth === 0) {
          re += "\\}"
          escaping = false
        } else {
          // swallow any state char that wasn't consumed
          clearStateChar()
          re += ")"
          braceDepth --
        }
        continue

      case ",":
        if (escaping || inClass || braceDepth === 0) {
          re += ","
          escaping = false
        } else {
          // swallow any state char that wasn't consumed
          clearStateChar()
          re += "|"
        }
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials.indexOf(c) !== -1
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch

    if (negating && c !== "!") negating = false

  } // for

  // handle trailing things that only matter at the very end.
  if (stateChar) {
    clearStateChar()
  } else if (escaping) {
    re += "\\\\"
  }

  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = re.substr(reClassStart + classStartPattern.length + 1)
      , csOpts = Object.create(options)
    csOpts.partial = true

    re = re.substr(0, reClassStart) + "\\["
       + makeRe(cs, csOpts)
  }

  if (options.partial) return re

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^" + re + "$"

  // fail on the pattern, but allow anything otherwise.
  if (negate) re = "^(?!" + re + ").*$"

  // really insane glob patterns can cause bad things.
  var flags = ""
  if (options.nocase) flags += "i"

  if (options.debug) {
    console.error("/%s/%s", re, flags)
  }

  try {
    return new RegExp(re, flags)
  } catch(ex) {
    return false
  }
}
