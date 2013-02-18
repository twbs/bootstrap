#! /usr/bin/env node
global.DIGITS_OVERRIDE_FOR_TESTING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

'use strict';
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:true,
     latedef:true, newcap:true, noarge:true, noempty:true, nonew:true,
     onevar:true, plusplus:true, regexp:true, undef:true, strict:true,
     sub:false, trailing:true */

var _,
    /**
     * NodeJS module for unit testing.
     * @namespace
     * @type {!TAssert}
     * @see http://nodejs.org/docs/v0.6.10/api/all.html#assert
     */
    oAssert = (/** @type {!TAssert} */ require('assert')),
    /**
     * Consolidates null, Boolean, and String values found inside an
     * <abbr title="abstract syntax tree">AST</abbr>. The object under test.
     * @namespace
     * @type {!TConsolidator}
     */
    oConsolidator = (/** @type {!TConsolidator} */ require('../lib/consolidator')),
    /**
     * The parser of ECMA-262 found in UglifyJS.
     * @namespace
     * @type {!TParser}
     */
    oParser = (/** @type {!TParser} */ require('../lib/parse-js')),
    /**
     * The processor of <abbr title="abstract syntax tree">AST</abbr>s
     * found in UglifyJS.
     * @namespace
     * @type {!TProcessor}
     */
    oProcessor = (/** @type {!TProcessor} */ require('../lib/process')),
    /**
     * An instance of an object that allows the traversal of an <abbr
     * title="abstract syntax tree">AST</abbr>.
     * @type {!TWalker}
     */
    oWalker,
    /**
     * A collection of functions for the removal of the scope information
     * during the traversal of an <abbr title="abstract syntax tree"
     * >AST</abbr>.
     * @namespace
     * @type {!Object.<string, function(...[*])>}
     */
    oWalkersPurifiers = {
      /**#nocode+*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
      /**
       * Deletes the scope information from the branch of the abstract
       * syntax tree representing the encountered function declaration.
       * @param {string} sIdentifier The identifier of the function.
       * @param {!Array.<string>} aFormalParameterList Formal parameters.
       * @param {!TSyntacticCodeUnit} oFunctionBody Function code.
       */
      'defun': function(
          sIdentifier,
          aFormalParameterList,
          oFunctionBody) {
        delete oFunctionBody.scope;
      },
      /**
       * Deletes the scope information from the branch of the abstract
       * syntax tree representing the encountered function expression.
       * @param {?string} sIdentifier The optional identifier of the
       *     function.
       * @param {!Array.<string>} aFormalParameterList Formal parameters.
       * @param {!TSyntacticCodeUnit} oFunctionBody Function code.
       */
      'function': function(
          sIdentifier,
          aFormalParameterList,
          oFunctionBody) {
        delete oFunctionBody.scope;
      }
      /**#nocode-*/  // JsDoc Toolkit 2.4.0 hides some of the keys.
    },
    /**
     * Initiates the traversal of a source element.
     * @param {!TWalker} oWalker An instance of an object that allows the
     *     traversal of an abstract syntax tree.
     * @param {!TSyntacticCodeUnit} oSourceElement A source element from
     *     which the traversal should commence.
     * @return {function(): !TSyntacticCodeUnit} A function that is able to
     *     initiate the traversal from a given source element.
     */
    cContext = function(oWalker, oSourceElement) {
      /**
       * @return {!TSyntacticCodeUnit} A function that is able to
       *     initiate the traversal from a given source element.
       */
      var fLambda = function() {
        return oWalker.walk(oSourceElement);
      };

      return fLambda;
    },
    /**
     * A record consisting of configuration for the code generation phase.
     * @type {!Object}
     */
    oCodeGenerationOptions = {
      beautify: true
    },
    /**
     * A boolean to track whether all tests have passed.
     * @type {boolean}
     */
    bTestsPassed = true,
    /**
     * Tests whether consolidation of an ECMAScript program yields expected
     * results.
     * @param {{
     *       sTitle: string,
     *       sInput: string,
     *       sOutput: string
     *     }} oUnitTest A record consisting of data about a unit test: its
     *     name, an ECMAScript program, and, if consolidation is to take
     *     place, the resulting ECMAScript program.
     */
    cAssert = function(oUnitTest) {
      var _,
          /**
           * An array-like object representing the <abbr title=
           * "abstract syntax tree">AST</abbr> obtained after consolidation.
           * @type {!TSyntacticCodeUnit}
           */
          oSyntacticCodeUnitActual =
              oConsolidator.ast_consolidate(oParser.parse(oUnitTest.sInput)),
          /**
           * An array-like object representing the expected <abbr title=
           * "abstract syntax tree">AST</abbr>.
           * @type {!TSyntacticCodeUnit}
           */
          oSyntacticCodeUnitExpected = oParser.parse(
              oUnitTest.hasOwnProperty('sOutput') ?
              oUnitTest.sOutput : oUnitTest.sInput);

      delete oSyntacticCodeUnitActual.scope;
      oWalker = oProcessor.ast_walker();
      oWalker.with_walkers(
          oWalkersPurifiers,
          cContext(oWalker, oSyntacticCodeUnitActual));
      try {
        oAssert.deepEqual(
            oSyntacticCodeUnitActual,
            oSyntacticCodeUnitExpected);
      } catch (oException) {
        console.error(
            '########## A unit test has failed.\n' +
            oUnitTest.sTitle + '\n' +
            '#####  actual code  (' +
            oProcessor.gen_code(oSyntacticCodeUnitActual).length +
            ' bytes)\n' +
            oProcessor.gen_code(
                oSyntacticCodeUnitActual,
                oCodeGenerationOptions) + '\n' +
            '##### expected code (' +
            oProcessor.gen_code(oSyntacticCodeUnitExpected).length +
            ' bytes)\n' +
            oProcessor.gen_code(
                oSyntacticCodeUnitExpected,
                oCodeGenerationOptions));
        bTestsPassed = false;
      }
    };

[
  // 7.6.1 Reserved Words.
  {
    sTitle:
        'Omission of keywords while choosing an identifier name.',
    sInput:
        '(function() {' +
        '  var a, b, c, d, e, f, g, h, i, j, k, l, m,' +
        '      n, o, p, q, r, s, t, u, v, w, x, y, z,' +
        '      A, B, C, D, E, F, G, H, I, J, K, L, M,' +
        '      N, O, P, Q, R, S, T, U, V, W, X, Y, Z,' +
        '      $, _,' +
        '      aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am,' +
        '      an, ao, ap, aq, ar, as, at, au, av, aw, ax, ay, az,' +
        '      aA, aB, aC, aD, aE, aF, aG, aH, aI, aJ, aK, aL, aM,' +
        '      aN, aO, aP, aQ, aR, aS, aT, aU, aV, aW, aX, aY, aZ,' +
        '      a$, a_,' +
        '      ba, bb, bc, bd, be, bf, bg, bh, bi, bj, bk, bl, bm,' +
        '      bn, bo, bp, bq, br, bs, bt, bu, bv, bw, bx, by, bz,' +
        '      bA, bB, bC, bD, bE, bF, bG, bH, bI, bJ, bK, bL, bM,' +
        '      bN, bO, bP, bQ, bR, bS, bT, bU, bV, bW, bX, bY, bZ,' +
        '      b$, b_,' +
        '      ca, cb, cc, cd, ce, cf, cg, ch, ci, cj, ck, cl, cm,' +
        '      cn, co, cp, cq, cr, cs, ct, cu, cv, cw, cx, cy, cz,' +
        '      cA, cB, cC, cD, cE, cF, cG, cH, cI, cJ, cK, cL, cM,' +
        '      cN, cO, cP, cQ, cR, cS, cT, cU, cV, cW, cX, cY, cZ,' +
        '      c$, c_,' +
        '      da, db, dc, dd, de, df, dg, dh, di, dj, dk, dl, dm,' +
        '      dn, dq, dr, ds, dt, du, dv, dw, dx, dy, dz,' +
        '      dA, dB, dC, dD, dE, dF, dG, dH, dI, dJ, dK, dL, dM,' +
        '      dN, dO, dP, dQ, dR, dS, dT, dU, dV, dW, dX, dY, dZ,' +
        '      d$, d_;' +
        '  void ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",' +
        '        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var eb =' +
        '      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",' +
        '      a, b, c, d, e, f, g, h, i, j, k, l, m,' +
        '      n, o, p, q, r, s, t, u, v, w, x, y, z,' +
        '      A, B, C, D, E, F, G, H, I, J, K, L, M,' +
        '      N, O, P, Q, R, S, T, U, V, W, X, Y, Z,' +
        '      $, _,' +
        '      aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am,' +
        '      an, ao, ap, aq, ar, as, at, au, av, aw, ax, ay, az,' +
        '      aA, aB, aC, aD, aE, aF, aG, aH, aI, aJ, aK, aL, aM,' +
        '      aN, aO, aP, aQ, aR, aS, aT, aU, aV, aW, aX, aY, aZ,' +
        '      a$, a_,' +
        '      ba, bb, bc, bd, be, bf, bg, bh, bi, bj, bk, bl, bm,' +
        '      bn, bo, bp, bq, br, bs, bt, bu, bv, bw, bx, by, bz,' +
        '      bA, bB, bC, bD, bE, bF, bG, bH, bI, bJ, bK, bL, bM,' +
        '      bN, bO, bP, bQ, bR, bS, bT, bU, bV, bW, bX, bY, bZ,' +
        '      b$, b_,' +
        '      ca, cb, cc, cd, ce, cf, cg, ch, ci, cj, ck, cl, cm,' +
        '      cn, co, cp, cq, cr, cs, ct, cu, cv, cw, cx, cy, cz,' +
        '      cA, cB, cC, cD, cE, cF, cG, cH, cI, cJ, cK, cL, cM,' +
        '      cN, cO, cP, cQ, cR, cS, cT, cU, cV, cW, cX, cY, cZ,' +
        '      c$, c_,' +
        '      da, db, dc, dd, de, df, dg, dh, di, dj, dk, dl, dm,' +
        '      dn, dq, dr, ds, dt, du, dv, dw, dx, dy, dz,' +
        '      dA, dB, dC, dD, dE, dF, dG, dH, dI, dJ, dK, dL, dM,' +
        '      dN, dO, dP, dQ, dR, dS, dT, dU, dV, dW, dX, dY, dZ,' +
        '      d$, d_;' +
        '  void [eb, eb];' +
        '}());'
  },
  // 7.8.1 Null Literals.
  {
    sTitle:
        'Evaluation with regard to the null value.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var foo;' +
        '  void [null, null, null];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [null, null];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var a = null, foo;' +
        '  void [a, a, a];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [null, null];' +
        '}());'
  },
  // 7.8.2 Boolean Literals.
  {
    sTitle:
        'Evaluation with regard to the false value.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var foo;' +
        '  void [false, false, false];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [false, false];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var a = false, foo;' +
        '  void [a, a, a];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [false, false];' +
        '}());'
  },
  {
    sTitle:
        'Evaluation with regard to the true value.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var foo;' +
        '  void [true, true, true];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [true, true];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var a = true, foo;' +
        '  void [a, a, a];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void [true, true];' +
        '}());'
  },
  // 7.8.4 String Literals.
  {
    sTitle:
        'Evaluation with regard to the String value of a string literal.',
    sInput:
        '(function() {' +
        '  var foo;' +
        '  void ["abcd", "abcd", "abc", "abc"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "abcd", foo;' +
        '  void [a, a, "abc", "abc"];' +
        '}());'
  },
  // 7.8.5 Regular Expression Literals.
  {
    sTitle:
        'Preservation of the pattern of a regular expression literal.',
    sInput:
        'void [/abcdefghijklmnopqrstuvwxyz/, /abcdefghijklmnopqrstuvwxyz/];'
  },
  {
    sTitle:
        'Preservation of the flags of a regular expression literal.',
    sInput:
        'void [/(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim,' +
        '      /(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim,' +
        '      /(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim, /(?:)/gim];'
  },
  // 10.2 Lexical Environments.
  {
    sTitle:
        'Preservation of identifier names in the same scope.',
    sInput:
        '/*jshint shadow:true */' +
        'var a;' +
        'function b(i) {' +
        '}' +
        'for (var c; 0 === Math.random(););' +
        'for (var d in {});' +
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        'void [b(a), b(c), b(d)];' +
        'void [typeof e];' +
        'i: for (; 0 === Math.random();) {' +
        '  if (42 === (new Date()).getMinutes()) {' +
        '    continue i;' +
        '  } else {' +
        '    break i;' +
        '  }' +
        '}' +
        'try {' +
        '} catch (f) {' +
        '} finally {' +
        '}' +
        '(function g(h) {' +
        '}());' +
        'void [{' +
        '  i: 42,' +
        '  "j": 42,' +
        '  \'k\': 42' +
        '}];' +
        'void ["abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        '/*jshint shadow:true */' +
        'var a;' +
        'function b(i) {' +
        '}' +
        'for (var c; 0 === Math.random(););' +
        'for (var d in {});' +
        '(function() {' +
        '  var i = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [i];' +
        '  void [b(a), b(c), b(d)];' +
        '  void [typeof e];' +
        '  i: for (; 0 === Math.random();) {' +
        '    if (42 === (new Date()).getMinutes()) {' +
        '      continue i;' +
        '    } else {' +
        '      break i;' +
        '    }' +
        '  }' +
        '  try {' +
        '  } catch (f) {' +
        '  } finally {' +
        '  }' +
        '  (function g(h) {' +
        '  }());' +
        '  void [{' +
        '    i: 42,' +
        '    "j": 42,' +
        '    \'k\': 42' +
        '  }];' +
        '  void [i];' +
        '}());'
  },
  {
    sTitle:
        'Preservation of identifier names in nested function code.',
    sInput:
        '(function() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  (function() {' +
        '    var a;' +
        '    for (var b; 0 === Math.random(););' +
        '    for (var c in {});' +
        '    void [typeof d];' +
        '    h: for (; 0 === Math.random();) {' +
        '      if (42 === (new Date()).getMinutes()) {' +
        '        continue h;' +
        '      } else {' +
        '        break h;' +
        '      }' +
        '    }' +
        '    try {' +
        '    } catch (e) {' +
        '    } finally {' +
        '    }' +
        '    (function f(g) {' +
        '    }());' +
        '    void [{' +
        '      h: 42,' +
        '      "i": 42,' +
        '      \'j\': 42' +
        '    }];' +
        '  }());' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var h = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [h];' +
        '  (function() {' +
        '    var a;' +
        '    for (var b; 0 === Math.random(););' +
        '    for (var c in {});' +
        '    void [typeof d];' +
        '    h: for (; 0 === Math.random();) {' +
        '      if (42 === (new Date()).getMinutes()) {' +
        '        continue h;' +
        '      } else {' +
        '        break h;' +
        '      }' +
        '    }' +
        '    try {' +
        '    } catch (e) {' +
        '    } finally {' +
        '    }' +
        '    (function f(g) {' +
        '    }());' +
        '    void [{' +
        '      h: 42,' +
        '      "i": 42,' +
        '      \'j\': 42' +
        '    }];' +
        '  }());' +
        '  void [h];' +
        '}());'
  },
  {
    sTitle:
        'Consolidation of a closure with other source elements.',
    sInput:
        '(function(foo) {' +
        '}("abcdefghijklmnopqrstuvwxyz"));' +
        'void ["abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  (function(foo) {' +
        '  })(a);' +
        '  void [a];' +
        '}());'
  },
  {
    sTitle:
        'Consolidation of function code instead of a sole closure.',
    sInput:
        '(function(foo, bar) {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}("abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"));',
    sOutput:
        '(function(foo, bar) {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}("abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"));'
  },
  // 11.1.5 Object Initialiser.
  {
    sTitle:
        'Preservation of property names of an object initialiser.',
    sInput:
        'var foo = {' +
        '  abcdefghijklmnopqrstuvwxyz: 42,' +
        '  "zyxwvutsrqponmlkjihgfedcba": 42,' +
        '  \'mlkjihgfedcbanopqrstuvwxyz\': 42' +
        '};' +
        'void [' +
        '  foo.abcdefghijklmnopqrstuvwxyz,' +
        '  "zyxwvutsrqponmlkjihgfedcba",' +
        '  \'mlkjihgfedcbanopqrstuvwxyz\'' +
        '];'
  },
  {
    sTitle:
        'Evaluation with regard to String values derived from identifier ' +
        'names used as property accessors.',
    sInput:
        '(function() {' +
        '  var foo;' +
        '  void [' +
        '    Math.abcdefghij,' +
        '    Math.abcdefghij,' +
        '    Math.abcdefghi,' +
        '    Math.abcdefghi' +
        '  ];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "abcdefghij", foo;' +
        '  void [' +
        '    Math[a],' +
        '    Math[a],' +
        '    Math.abcdefghi,' +
        '    Math.abcdefghi' +
        '  ];' +
        '}());'
  },
  // 11.2.1 Property Accessors.
  {
    sTitle:
        'Preservation of identifiers in the nonterminal MemberExpression.',
    sInput:
        'void [' +
        '  Math.E,' +
        '  Math.LN10,' +
        '  Math.LN2,' +
        '  Math.LOG2E,' +
        '  Math.LOG10E,' +
        '  Math.PI,' +
        '  Math.SQRT1_2,' +
        '  Math.SQRT2,' +
        '  Math.abs,' +
        '  Math.acos' +
        '];'
  },
  // 12.2 Variable Statement.
  {
    sTitle:
        'Preservation of the identifier of a variable that is being ' +
        'declared in a variable statement.',
    sInput:
        '(function() {' +
        '  var abcdefghijklmnopqrstuvwxyz;' +
        '  void [abcdefghijklmnopqrstuvwxyz];' +
        '}());'
  },
  {
    sTitle:
        'Exclusion of a variable statement in global code.',
    sInput:
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        'var foo = "abcdefghijklmnopqrstuvwxyz",' +
        '    bar = "abcdefghijklmnopqrstuvwxyz";' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  {
    sTitle:
        'Exclusion of a variable statement in function code that ' +
        'contains a with statement.',
    sInput:
        '(function() {' +
        '  with ({});' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  var foo;' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());'
  },
  {
    sTitle:
        'Exclusion of a variable statement in function code that ' +
        'contains a direct call to the eval function.',
    sInput:
        '/*jshint evil:true */' +
        'void [' +
        '  function() {' +
        '    eval("");' +
        '    void ["abcdefghijklmnopqrstuvwxyz"];' +
        '    var foo;' +
        '    void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  }' +
        '];'
  },
  {
    sTitle:
        'Consolidation within a variable statement in global code.',
    sInput:
        'var foo = function() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '};',
    sOutput:
        'var foo = function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '};'
  },
  {
    sTitle:
        'Consolidation within a variable statement excluded in function ' +
        'code due to the presence of a with statement.',
    sInput:
        '(function() {' +
        '  with ({});' +
        '  var foo = function() {' +
        '    void ["abcdefghijklmnopqrstuvwxyz",' +
        '          "abcdefghijklmnopqrstuvwxyz"];' +
        '  };' +
        '}());',
    sOutput:
        '(function() {' +
        '  with ({});' +
        '  var foo = function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  };' +
        '}());'
  },
  {
    sTitle:
        'Consolidation within a variable statement excluded in function ' +
        'code due to the presence of a direct call to the eval function.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  eval("");' +
        '  var foo = function() {' +
        '    void ["abcdefghijklmnopqrstuvwxyz",' +
        '          "abcdefghijklmnopqrstuvwxyz"];' +
        '  };' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  eval("");' +
        '  var foo = function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  };' +
        '}());'
  },
  {
    sTitle:
        'Inclusion of a variable statement in function code that ' +
        'contains no with statement and no direct call to the eval ' +
        'function.',
    sInput:
        '(function() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  var foo;' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a];' +
        '  var foo;' +
        '  void [a];' +
        '}());'
  },
  {
    sTitle:
        'Ignorance with regard to a variable statement in global code.',
    sInput:
        'var foo = "abcdefghijklmnopqrstuvwxyz";' +
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        'var foo = "abcdefghijklmnopqrstuvwxyz";' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  // 12.4 Expression Statement.
  {
    sTitle:
        'Preservation of identifiers in an expression statement.',
    sInput:
        'void [typeof abcdefghijklmnopqrstuvwxyz,' +
        '      typeof abcdefghijklmnopqrstuvwxyz];'
  },
  // 12.6.3 The {@code for} Statement.
  {
    sTitle:
        'Preservation of identifiers in the variable declaration list of ' +
        'a for statement.',
    sInput:
        'for (var abcdefghijklmnopqrstuvwxyz; 0 === Math.random(););' +
        'for (var abcdefghijklmnopqrstuvwxyz; 0 === Math.random(););'
  },
  // 12.6.4 The {@code for-in} Statement.
  {
    sTitle:
        'Preservation of identifiers in the variable declaration list of ' +
        'a for-in statement.',
    sInput:
        'for (var abcdefghijklmnopqrstuvwxyz in {});' +
        'for (var abcdefghijklmnopqrstuvwxyz in {});'
  },
  // 12.7 The {@code continue} Statement.
  {
    sTitle:
        'Preservation of the identifier in a continue statement.',
    sInput:
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random();) {' +
        '  continue abcdefghijklmnopqrstuvwxyz;' +
        '}' +
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random();) {' +
        '  continue abcdefghijklmnopqrstuvwxyz;' +
        '}'
  },
  // 12.8 The {@code break} Statement.
  {
    sTitle:
        'Preservation of the identifier in a break statement.',
    sInput:
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random();) {' +
        '  break abcdefghijklmnopqrstuvwxyz;' +
        '}' +
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random();) {' +
        '  break abcdefghijklmnopqrstuvwxyz;' +
        '}'
  },
  // 12.9 The {@code return} Statement.
  {
    sTitle:
        'Exclusion of a return statement in function code that contains ' +
        'a with statement.',
    sInput:
        '(function() {' +
        '  with ({});' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  if (0 === Math.random()) {' +
        '    return;' +
        '  } else {' +
        '  }' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());'
  },
  {
    sTitle:
        'Exclusion of a return statement in function code that contains ' +
        'a direct call to the eval function.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  eval("");' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  if (0 === Math.random()) {' +
        '    return;' +
        '  } else {' +
        '  }' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());'
  },
  {
    sTitle:
        'Consolidation within a return statement excluded in function ' +
        'code due to the presence of a with statement.',
    sInput:
        '(function() {' +
        '  with ({});' +
        '  return function() {' +
        '    void ["abcdefghijklmnopqrstuvwxyz",' +
        '          "abcdefghijklmnopqrstuvwxyz"];' +
        '  };' +
        '}());',
    sOutput:
        '(function() {' +
        '  with ({});' +
        '  return function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  };' +
        '}());'
  },
  {
    sTitle:
        'Consolidation within a return statement excluded in function ' +
        'code due to the presence of a direct call to the eval function.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  eval("");' +
        '  return function() {' +
        '    void ["abcdefghijklmnopqrstuvwxyz",' +
        '          "abcdefghijklmnopqrstuvwxyz"];' +
        '  };' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  eval("");' +
        '  return function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  };' +
        '}());'
  },
  {
    sTitle:
        'Inclusion of a return statement in function code that contains ' +
        'no with statement and no direct call to the eval function.',
    sInput:
        '(function() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '  if (0 === Math.random()) {' +
        '    return;' +
        '  } else {' +
        '  }' +
        '  void ["abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a];' +
        '  if (0 === Math.random()) {' +
        '    return;' +
        '  } else {' +
        '  }' +
        '  void [a];' +
        '}());'
  },
  // 12.10 The {@code with} Statement.
  {
    sTitle:
        'Preservation of the statement in a with statement.',
    sInput:
        'with ({}) {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}'
  },
  {
    sTitle:
        'Exclusion of a with statement in the same syntactic code unit.',
    sInput:
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        'with ({' +
        '  foo: "abcdefghijklmnopqrstuvwxyz",' +
        '  bar: "abcdefghijklmnopqrstuvwxyz"' +
        '}) {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  {
    sTitle:
        'Exclusion of a with statement in nested function code.',
    sInput:
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        '(function() {' +
        '  with ({' +
        '    foo: "abcdefghijklmnopqrstuvwxyz",' +
        '    bar: "abcdefghijklmnopqrstuvwxyz"' +
        '  }) {' +
        '    void ["abcdefghijklmnopqrstuvwxyz",' +
        '          "abcdefghijklmnopqrstuvwxyz"];' +
        '  }' +
        '}());' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  // 12.12 Labelled Statements.
  {
    sTitle:
        'Preservation of the label of a labelled statement.',
    sInput:
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random(););' +
        'abcdefghijklmnopqrstuvwxyz: for (; 0 === Math.random(););'
  },
  // 12.14 The {@code try} Statement.
  {
    sTitle:
        'Preservation of the identifier in the catch clause of a try' +
        'statement.',
    sInput:
        'try {' +
        '} catch (abcdefghijklmnopqrstuvwxyz) {' +
        '} finally {' +
        '}' +
        'try {' +
        '} catch (abcdefghijklmnopqrstuvwxyz) {' +
        '} finally {' +
        '}'
  },
  // 13 Function Definition.
  {
    sTitle:
        'Preservation of the identifier of a function declaration.',
    sInput:
        'function abcdefghijklmnopqrstuvwxyz() {' +
        '}' +
        'void [abcdefghijklmnopqrstuvwxyz];'
  },
  {
    sTitle:
        'Preservation of the identifier of a function expression.',
    sInput:
        'void [' +
        '  function abcdefghijklmnopqrstuvwxyz() {' +
        '  },' +
        '  function abcdefghijklmnopqrstuvwxyz() {' +
        '  }' +
        '];'
  },
  {
    sTitle:
        'Preservation of a formal parameter of a function declaration.',
    sInput:
        'function foo(abcdefghijklmnopqrstuvwxyz) {' +
        '}' +
        'function bar(abcdefghijklmnopqrstuvwxyz) {' +
        '}'
  },
  {
    sTitle:
        'Preservation of a formal parameter in a function expression.',
    sInput:
        'void [' +
        '  function(abcdefghijklmnopqrstuvwxyz) {' +
        '  },' +
        '  function(abcdefghijklmnopqrstuvwxyz) {' +
        '  }' +
        '];'
  },
  {
    sTitle:
        'Exclusion of a function declaration.',
    sInput:
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        'function foo() {' +
        '}' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  {
    sTitle:
        'Consolidation within a function declaration.',
    sInput:
        'function foo() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}',
    sOutput:
        'function foo() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}'
  },
  // 14 Program.
  {
    sTitle:
        'Preservation of a program without source elements.',
    sInput:
        ''
  },
  // 14.1 Directive Prologues and the Use Strict Directive.
  {
    sTitle:
        'Preservation of a Directive Prologue in global code.',
    sInput:
        '"abcdefghijklmnopqrstuvwxyz";' +
        '\'zyxwvutsrqponmlkjihgfedcba\';'
  },
  {
    sTitle:
        'Preservation of a Directive Prologue in a function declaration.',
    sInput:
        'function foo() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  \'zyxwvutsrqponmlkjihgfedcba\';' +
        '}'
  },
  {
    sTitle:
        'Preservation of a Directive Prologue in a function expression.',
    sInput:
        'void [' +
        '  function() {' +
        '    "abcdefghijklmnopqrstuvwxyz";' +
        '    \'zyxwvutsrqponmlkjihgfedcba\';' +
        '  }' +
        '];'
  },
  {
    sTitle:
        'Ignorance with regard to a Directive Prologue in global code.',
    sInput:
        '"abcdefghijklmnopqrstuvwxyz";' +
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        '"abcdefghijklmnopqrstuvwxyz";' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  {
    sTitle:
        'Ignorance with regard to a Directive Prologue in a function' +
        'declaration.',
    sInput:
        'function foo() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}',
    sOutput:
        'function foo() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}'
  },
  {
    sTitle:
        'Ignorance with regard to a Directive Prologue in a function' +
        'expression.',
    sInput:
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  // 15.1 The Global Object.
  {
    sTitle:
        'Preservation of a property of the global object.',
    sInput:
        'void [undefined, undefined, undefined, undefined, undefined];'
  },
  // 15.1.2.1.1 Direct Call to Eval.
  {
    sTitle:
        'Exclusion of a direct call to the eval function in the same ' +
        'syntactic code unit.',
    sInput:
        '/*jshint evil:true */' +
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        'eval("");' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  {
    sTitle:
        'Exclusion of a direct call to the eval function in nested ' +
        'function code.',
    sInput:
        '/*jshint evil:true */' +
        'void ["abcdefghijklmnopqrstuvwxyz"];' +
        '(function() {' +
        '  eval("");' +
        '}());' +
        'void ["abcdefghijklmnopqrstuvwxyz"];'
  },
  {
    sTitle:
        'Consolidation within a direct call to the eval function.',
    sInput:
        '/*jshint evil:true */' +
        'eval(function() {' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        'eval(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  // Consolidation proper.
  {
    sTitle:
        'No consolidation if it does not result in a reduction of the ' +
        'number of source characters.',
    sInput:
        '(function() {' +
        '  var foo;' +
        '  void ["ab", "ab", "abc", "abc"];' +
        '}());'
  },
  {
    sTitle:
        'Identification of a range of source elements at the beginning ' +
        'of global code.',
    sInput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];' +
        'eval("");',
    sOutput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());' +
        'eval("");'
  },
  {
    sTitle:
        'Identification of a range of source elements in the middle of ' +
        'global code.',
    sInput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        'eval("");' +
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];' +
        'eval("");',
    sOutput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        'eval("");' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());' +
        'eval("");'
  },
  {
    sTitle:
        'Identification of a range of source elements at the end of ' +
        'global code.',
    sInput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        'eval("");' +
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        '/*jshint evil:true */' +
        '"abcdefghijklmnopqrstuvwxyz";' +
        'eval("");' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  {
    sTitle:
        'Identification of a range of source elements at the beginning ' +
        'of function code.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '  eval("");' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  (function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  }());' +
        '  eval("");' +
        '}());'
  },
  {
    sTitle:
        'Identification of a range of source elements in the middle of ' +
        'function code.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  eval("");' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '  eval("");' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  eval("");' +
        '  (function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  }());' +
        '  eval("");' +
        '}());'
  },
  {
    sTitle:
        'Identification of a range of source elements at the end of ' +
        'function code.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  eval("");' +
        '  void ["abcdefghijklmnopqrstuvwxyz",' +
        '        "abcdefghijklmnopqrstuvwxyz"];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  "abcdefghijklmnopqrstuvwxyz";' +
        '  eval("");' +
        '  (function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxyz";' +
        '    void [a, a];' +
        '  }());' +
        '}());'
  },
  {
    sTitle:
        'Evaluation with regard to String values of String literals and ' +
        'String values derived from identifier names used as property' +
        'accessors.',
    sInput:
        '(function() {' +
        '  var foo;' +
        '  void ["abcdefg", Math.abcdefg, "abcdef", Math.abcdef];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "abcdefg", foo;' +
        '  void [a, Math[a], "abcdef", Math.abcdef];' +
        '}());'
  },
  {
    sTitle:
        'Evaluation with regard to the necessity of adding a variable ' +
        'statement.',
    sInput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  void ["abcdefgh", "abcdefgh"];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  void ["abcdefg", "abcdefg"];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var foo;' +
        '  void ["abcd", "abcd"];' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var a = "abcdefgh";' +
        '  void [a, a];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  void ["abcdefg", "abcdefg"];' +
        '}());' +
        'eval("");' +
        '(function() {' +
        '  var a = "abcd", foo;' +
        '  void [a, a];' +
        '}());'
  },
  {
    sTitle:
        'Evaluation with regard to the necessity of enclosing source ' +
        'elements.',
    sInput:
        '/*jshint evil:true */' +
        'void ["abcdefghijklmnopqrstuvwxy", "abcdefghijklmnopqrstuvwxy"];' +
        'eval("");' +
        'void ["abcdefghijklmnopqrstuvwx", "abcdefghijklmnopqrstuvwx"];' +
        'eval("");' +
        '(function() {' +
        '  void ["abcdefgh", "abcdefgh"];' +
        '}());' +
        '(function() {' +
        '  void ["abcdefghijklmnopqrstuvwxy",' +
        '        "abcdefghijklmnopqrstuvwxy"];' +
        '  eval("");' +
        '  void ["abcdefghijklmnopqrstuvwx",' +
        '        "abcdefghijklmnopqrstuvwx"];' +
        '  eval("");' +
        '  (function() {' +
        '    void ["abcdefgh", "abcdefgh"];' +
        '  }());' +
        '}());',
    sOutput:
        '/*jshint evil:true */' +
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxy";' +
        '  void [a, a];' +
        '}());' +
        'eval("");' +
        'void ["abcdefghijklmnopqrstuvwx", "abcdefghijklmnopqrstuvwx"];' +
        'eval("");' +
        '(function() {' +
        '  var a = "abcdefgh";' +
        '  void [a, a];' +
        '}());' +
        '(function() {' +
        '  (function() {' +
        '    var a = "abcdefghijklmnopqrstuvwxy";' +
        '    void [a, a];' +
        '  }());' +
        '  eval("");' +
        '  void ["abcdefghijklmnopqrstuvwx", "abcdefghijklmnopqrstuvwx"];' +
        '  eval("");' +
        '  (function() {' +
        '    var a = "abcdefgh";' +
        '    void [a, a];' +
        '  }());' +
        '}());'
  },
  {
    sTitle:
        'Employment of a closure while consolidating in global code.',
    sInput:
        'void ["abcdefghijklmnopqrstuvwxyz",' +
        '      "abcdefghijklmnopqrstuvwxyz"];',
    sOutput:
        '(function() {' +
        '  var a = "abcdefghijklmnopqrstuvwxyz";' +
        '  void [a, a];' +
        '}());'
  },
  {
    sTitle:
        'Assignment of a shorter identifier to a value whose ' +
        'consolidation results in a greater reduction of the number of ' +
        'source characters.',
    sInput:
        '(function() {' +
        '  var b, c, d, e, f, g, h, i, j, k, l, m,' +
        '      n, o, p, q, r, s, t, u, v, w, x, y, z,' +
        '      A, B, C, D, E, F, G, H, I, J, K, L, M,' +
        '      N, O, P, Q, R, S, T, U, V, W, X, Y, Z,' +
        '      $, _;' +
        '  void ["abcde", "abcde", "edcba", "edcba", "edcba"];' +
        '}());',
    sOutput:
        '(function() {' +
        '  var a = "edcba",' +
        '      b, c, d, e, f, g, h, i, j, k, l, m,' +
        '      n, o, p, q, r, s, t, u, v, w, x, y, z,' +
        '      A, B, C, D, E, F, G, H, I, J, K, L, M,' +
        '      N, O, P, Q, R, S, T, U, V, W, X, Y, Z,' +
        '      $, _;' +
        '  void ["abcde", "abcde", a, a, a];' +
        '}());'
  }
].forEach(cAssert);

process.exit(bTestsPassed ? 0 : 1);

