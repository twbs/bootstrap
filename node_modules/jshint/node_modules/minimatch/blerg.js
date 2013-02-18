
// Turn something like {a,b{c,d},}x{e,f} into
// ["axe", "axf", "bcxe", "bcxf", "bdxe", "bdxf", "xe", "xf"]
// Only {,} groups are expanded.  While in many cases {x,y} is
// functionally equivalent to @(x|y), for the purpose of globbing
// files, only {x,y} gets expanded as multiple patterns.
minimatch.patternSet = patternSet
function patternSet (pattern) {
  if (!pattern.match(/{/) || !pattern.match(/}/)) {
    // shortcut - no sets.
    return [pattern]
  }

  // a{b,c{d,e},{f,g}h}x{y,z}
  //
  // t=[before set, set, after set]
  // t=["a", ["b", "c{d,e}", "{f,g}h"], "x{y,z}"]

  // start walking, and note the position of the first {
  // and the corresponding }
  var p = pattern.indexOf("{")
    , l = pattern.length
    , d = 0
    , escaping = false
    , inClass = false
  while (++ p < l) {
    switch (pattern.charAt(p)) {
      case "{":
        d ++
        continue
      case "}":
        


  // t[2] = patternSet(t[2])
  // t = [t[0]].concat([t[1].map(patternSet)]).concat([t[2]])
  //
  // t=["a",[["b"],[["cd","ce"]],[["fh","gh"]]],["xy","xz"]]
  //
  // // first turn into
  // // [["ab"], ["acd", "ace"], ["afh", "agh"]]
  // return t[1].map(function (p) {
  //   return p.map(function (p) {
  //     return t[0] + p
  //   })
  // })
  // // flatten into ["ab", "acd", "ace", "afh", "agh"]
  // .reduce(function (l, r) {
  //   return l.concat(r)
  // }, [])
  // // tack all the endings onto each one
  // .map(function (p) {
  //   return t[2].map(function (e) {
  //     return p + e
  //   })
  // })
  // // flatten again
  // .reduce(function (l, r) {
  //   return l.concat(r)
  // }, [])
}

