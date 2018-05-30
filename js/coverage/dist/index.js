var cov_5jzhofnwk = function () {
  var path = "/Users/asonnenholzner/Downloads/bootstrap/js/src/index.js",
      hash = "5c077fae119b2d4c5e1602a4526ee6d48f50df90",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/Users/asonnenholzner/Downloads/bootstrap/js/src/index.js",
    statementMap: {
      "0": {
        start: {
          line: 21,
          column: 0
        },
        end: {
          line: 36,
          column: 5
        }
      },
      "1": {
        start: {
          line: 22,
          column: 2
        },
        end: {
          line: 24,
          column: 3
        }
      },
      "2": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 23,
          column: 123
        }
      },
      "3": {
        start: {
          line: 26,
          column: 18
        },
        end: {
          line: 26,
          column: 54
        }
      },
      "4": {
        start: {
          line: 27,
          column: 19
        },
        end: {
          line: 27,
          column: 20
        }
      },
      "5": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 19
        }
      },
      "6": {
        start: {
          line: 29,
          column: 19
        },
        end: {
          line: 29,
          column: 20
        }
      },
      "7": {
        start: {
          line: 30,
          column: 19
        },
        end: {
          line: 30,
          column: 20
        }
      },
      "8": {
        start: {
          line: 31,
          column: 19
        },
        end: {
          line: 31,
          column: 20
        }
      },
      "9": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 35,
          column: 3
        }
      },
      "10": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 99
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 21,
            column: 1
          },
          end: {
            line: 21,
            column: 2
          }
        },
        loc: {
          start: {
            line: 21,
            column: 8
          },
          end: {
            line: 36,
            column: 1
          }
        },
        line: 21
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 22,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 22,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        }, {
          start: {
            line: 22,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        }],
        line: 22
      },
      "1": {
        loc: {
          start: {
            line: 33,
            column: 2
          },
          end: {
            line: 35,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 2
          },
          end: {
            line: 35,
            column: 3
          }
        }, {
          start: {
            line: 33,
            column: 2
          },
          end: {
            line: 35,
            column: 3
          }
        }],
        line: 33
      },
      "2": {
        loc: {
          start: {
            line: 33,
            column: 6
          },
          end: {
            line: 33,
            column: 156
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 33,
            column: 6
          },
          end: {
            line: 33,
            column: 26
          }
        }, {
          start: {
            line: 33,
            column: 30
          },
          end: {
            line: 33,
            column: 51
          }
        }, {
          start: {
            line: 33,
            column: 55
          },
          end: {
            line: 33,
            column: 78
          }
        }, {
          start: {
            line: 33,
            column: 82
          },
          end: {
            line: 33,
            column: 105
          }
        }, {
          start: {
            line: 33,
            column: 109
          },
          end: {
            line: 33,
            column: 130
          }
        }, {
          start: {
            line: 33,
            column: 134
          },
          end: {
            line: 33,
            column: 156
          }
        }],
        line: 33
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0, 0, 0, 0, 0]
    },
    _coverageSchema: "332fd63041d2c1bcb487cc26dd0d5f7d97098a6c"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_5jzhofnwk.s[0]++;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.1): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
  cov_5jzhofnwk.f[0]++;
  cov_5jzhofnwk.s[1]++;

  if (typeof $ === 'undefined') {
    cov_5jzhofnwk.b[0][0]++;
    cov_5jzhofnwk.s[2]++;
    throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
  } else {
    cov_5jzhofnwk.b[0][1]++;
  }

  var version = (cov_5jzhofnwk.s[3]++, $.fn.jquery.split(' ')[0].split('.'));
  var minMajor = (cov_5jzhofnwk.s[4]++, 1);
  var ltMajor = (cov_5jzhofnwk.s[5]++, 2);
  var minMinor = (cov_5jzhofnwk.s[6]++, 9);
  var minPatch = (cov_5jzhofnwk.s[7]++, 1);
  var maxMajor = (cov_5jzhofnwk.s[8]++, 4);
  cov_5jzhofnwk.s[9]++;

  if ((cov_5jzhofnwk.b[2][0]++, version[0] < ltMajor) && (cov_5jzhofnwk.b[2][1]++, version[1] < minMinor) || (cov_5jzhofnwk.b[2][2]++, version[0] === minMajor) && (cov_5jzhofnwk.b[2][3]++, version[1] === minMinor) && (cov_5jzhofnwk.b[2][4]++, version[2] < minPatch) || (cov_5jzhofnwk.b[2][5]++, version[0] >= maxMajor)) {
    cov_5jzhofnwk.b[1][0]++;
    cov_5jzhofnwk.s[10]++;
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  } else {
    cov_5jzhofnwk.b[1][1]++;
  }
})($);
//# sourceMappingURL=index.js.map