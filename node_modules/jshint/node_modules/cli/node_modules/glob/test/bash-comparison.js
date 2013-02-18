// basic test
// show that it does the same thing by default as the shell.
var tap = require("tap")
, child_process = require("child_process")
, bashResults = require("./bash-results.json")
, globs = Object.keys(bashResults)
, glob = require("../")
, path = require("path")

// run from the root of the project
// this is usually where you're at anyway, but be sure.
process.chdir(path.resolve(__dirname, ".."))

function alphasort (a, b) {
  a = a.toLowerCase()
  b = b.toLowerCase()
  return a > b ? 1 : a < b ? -1 : 0
}

globs.forEach(function (pattern) {
  var expect = bashResults[pattern]
  // anything regarding the symlink thing will fail on windows, so just skip it
  if (process.platform === "win32" &&
      expect.some(function (m) {
        return /\/symlink\//.test(m)
      }))
    return

  tap.test(pattern, function (t) {
    glob(pattern, function (er, matches) {
      if (er)
        throw er

      // sort and unmark, just to match the shell results
      matches = cleanResults(matches)

      t.deepEqual(matches, expect, pattern)
      t.end()
    })
  })

  tap.test(pattern + " sync", function (t) {
    var matches = cleanResults(glob.sync(pattern))

    t.deepEqual(matches, expect, "should match shell")
    t.end()
  })
})

function cleanResults (m) {
  // normalize discrepancies in ordering, duplication,
  // and ending slashes.
  return m.map(function (m) {
    return m.replace(/\/+/g, "/").replace(/\/$/, "")
  }).sort(alphasort).reduce(function (set, f) {
    if (f !== set[set.length - 1]) set.push(f)
    return set
  }, []).sort(alphasort).map(function (f) {
    // de-windows
    return (process.platform !== 'win32') ? f
           : f.replace(/^[a-zA-Z]:[\/\\]+/, '/').replace(/[\\\/]+/g, '/')
  })
}
