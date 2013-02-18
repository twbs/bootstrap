// remove the fixtures
var tap = require("tap")
, rimraf = require("rimraf")
, path = require("path")

tap.test("cleanup fixtures", function (t) {
  rimraf(path.resolve(__dirname, "a"), function (er) {
    t.ifError(er, "removed")
    t.end()
  })
})
