
module.exports = exports = abbrev.abbrev = abbrev

abbrev.monkeyPatch = monkeyPatch

function monkeyPatch () {
  Object.defineProperty(Array.prototype, 'abbrev', {
    value: function () { return abbrev(this) },
    enumerable: false, configurable: true, writable: true
  })

  Object.defineProperty(Object.prototype, 'abbrev', {
    value: function () { return abbrev(Object.keys(this)) },
    enumerable: false, configurable: true, writable: true
  })
}

function abbrev (list) {
  if (arguments.length !== 1 || !Array.isArray(list)) {
    list = Array.prototype.slice.call(arguments, 0)
  }
  for (var i = 0, l = list.length, args = [] ; i < l ; i ++) {
    args[i] = typeof list[i] === "string" ? list[i] : String(list[i])
  }

  // sort them lexicographically, so that they're next to their nearest kin
  args = args.sort(lexSort)

  // walk through each, seeing how much it has in common with the next and previous
  var abbrevs = {}
    , prev = ""
  for (var i = 0, l = args.length ; i < l ; i ++) {
    var current = args[i]
      , next = args[i + 1] || ""
      , nextMatches = true
      , prevMatches = true
    if (current === next) continue
    for (var j = 0, cl = current.length ; j < cl ; j ++) {
      var curChar = current.charAt(j)
      nextMatches = nextMatches && curChar === next.charAt(j)
      prevMatches = prevMatches && curChar === prev.charAt(j)
      if (!nextMatches && !prevMatches) {
        j ++
        break
      }
    }
    prev = current
    if (j === cl) {
      abbrevs[current] = current
      continue
    }
    for (var a = current.substr(0, j) ; j <= cl ; j ++) {
      abbrevs[a] = current
      a += current.charAt(j)
    }
  }
  return abbrevs
}

function lexSort (a, b) {
  return a === b ? 0 : a > b ? 1 : -1
}


// tests
if (module === require.main) {

var assert = require("assert")
var util = require("util")

console.log("running tests")
function test (list, expect) {
  var actual = abbrev(list)
  assert.deepEqual(actual, expect,
    "abbrev("+util.inspect(list)+") === " + util.inspect(expect) + "\n"+
    "actual: "+util.inspect(actual))
  actual = abbrev.apply(exports, list)
  assert.deepEqual(abbrev.apply(exports, list), expect,
    "abbrev("+list.map(JSON.stringify).join(",")+") === " + util.inspect(expect) + "\n"+
    "actual: "+util.inspect(actual))
}

test([ "ruby", "ruby", "rules", "rules", "rules" ],
{ rub: 'ruby'
, ruby: 'ruby'
, rul: 'rules'
, rule: 'rules'
, rules: 'rules'
})
test(["fool", "foom", "pool", "pope"],
{ fool: 'fool'
, foom: 'foom'
, poo: 'pool'
, pool: 'pool'
, pop: 'pope'
, pope: 'pope'
})
test(["a", "ab", "abc", "abcd", "abcde", "acde"],
{ a: 'a'
, ab: 'ab'
, abc: 'abc'
, abcd: 'abcd'
, abcde: 'abcde'
, ac: 'acde'
, acd: 'acde'
, acde: 'acde'
})

console.log("pass")

}
