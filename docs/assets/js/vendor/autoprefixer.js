!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.autoprefixer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Autoprefixer, Browsers, Prefixes, autoprefixer, infoCache, isPlainObject, postcss,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  postcss = require('postcss');

  Browsers = require('./browsers');

  Prefixes = require('./prefixes');

  infoCache = null;

  isPlainObject = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object Object]';
  };

  autoprefixer = function() {
    var browsers, options, prefixes, reqs;
    reqs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (reqs.length === 1 && isPlainObject(reqs[0])) {
      options = reqs[0];
      reqs = void 0;
    } else if (reqs.length === 0 || (reqs.length === 1 && (reqs[0] == null))) {
      reqs = void 0;
    } else if (reqs.length <= 2 && (reqs[0] instanceof Array || (reqs[0] == null))) {
      options = reqs[1];
      reqs = reqs[0];
    } else if (typeof reqs[reqs.length - 1] === 'object') {
      options = reqs.pop();
    }
    if ((options != null ? options.browsers : void 0) != null) {
      reqs = options.browsers;
    } else if (reqs) {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('autoprefixer: autoprefixer(browsers) is deprecated ' + 'and will be removed in 3.1. ' + 'Use autoprefixer({ browsers: browsers }).');
      }
    }
    if (reqs == null) {
      reqs = autoprefixer["default"];
    }
    browsers = new Browsers(autoprefixer.data.browsers, reqs);
    prefixes = new Prefixes(autoprefixer.data.prefixes, browsers, options);
    return new Autoprefixer(prefixes, autoprefixer.data, options);
  };

  autoprefixer.data = {
    browsers: require('../data/browsers'),
    prefixes: require('../data/prefixes')
  };

  Autoprefixer = (function() {
    function Autoprefixer(prefixes, data, options) {
      this.prefixes = prefixes;
      this.data = data;
      this.options = options != null ? options : {};
      this.postcss = __bind(this.postcss, this);
      this.browsers = this.prefixes.browsers.selected;
    }

    Autoprefixer.prototype.process = function(str, options) {
      if (options == null) {
        options = {};
      }
      return this.processor().process(str, options);
    };

    Autoprefixer.prototype.postcss = function(css) {
      if (this.options.remove !== false) {
        this.prefixes.processor.remove(css);
      }
      return this.prefixes.processor.add(css);
    };

    Autoprefixer.prototype.info = function() {
      infoCache || (infoCache = require('./info'));
      return infoCache(this.prefixes);
    };

    Autoprefixer.prototype.processor = function() {
      return this.processorCache || (this.processorCache = postcss(this.postcss));
    };

    return Autoprefixer;

  })();

  autoprefixer["default"] = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'];

  autoprefixer.loadDefault = function() {
    return this.defaultCache || (this.defaultCache = autoprefixer({
      browsers: this["default"]
    }));
  };

  autoprefixer.process = function(str, options) {
    if (options == null) {
      options = {};
    }
    return this.loadDefault().process(str, options);
  };

  autoprefixer.postcss = function(css) {
    return autoprefixer.loadDefault().postcss(css);
  };

  autoprefixer.info = function() {
    return this.loadDefault().info();
  };

  module.exports = autoprefixer;

}).call(this);

},{"../data/browsers":2,"../data/prefixes":3,"./browsers":4,"./info":33,"./prefixes":38,"postcss":92}],2:[function(require,module,exports){
(function() {
  var convert, data, intervals, major, name, names, normalize, _ref;

  names = ['firefox', 'chrome', 'safari', 'ios_saf', 'opera', 'ie', 'bb', 'android'];

  major = ['firefox', 'chrome', 'safari', 'ios_saf', 'opera', 'android', 'ie', 'ie_mob'];

  normalize = function(array) {
    return array.reverse().filter(function(i) {
      return i;
    });
  };

  intervals = function(array) {
    var i, interval, result, splited, sub, _i, _len;
    result = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      interval = array[_i];
      splited = interval.split('-');
      splited = splited.sort().reverse();
      sub = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = splited.length; _j < _len1; _j++) {
          i = splited[_j];
          _results.push([i, interval, splited.length]);
        }
        return _results;
      })();
      result = result.concat(sub);
    }
    return result;
  };

  convert = function(name, data) {
    var future, result, versions;
    future = normalize(data.versions.slice(-3));
    versions = intervals(normalize(data.versions.slice(0, -3)));
    result = {};
    result.prefix = name === 'opera' ? '-o-' : "-" + data.prefix + "-";
    if (major.indexOf(name) === -1) {
      result.minor = true;
    }
    if (future.length) {
      result.future = future;
    }
    result.versions = versions.map(function(i) {
      return i[0];
    });
    result.popularity = versions.map(function(i) {
      return data.usage_global[i[1]] / i[2];
    });
    return result;
  };

  module.exports = {};

  _ref = require('caniuse-db/data').agents;
  for (name in _ref) {
    data = _ref[name];
    module.exports[name] = convert(name, data);
  }

}).call(this);

},{"caniuse-db/data":51}],3:[function(require,module,exports){
(function() {
  var browsers, feature, map, prefix, textDecoration,
    __slice = [].slice;

  browsers = require('./browsers');

  feature = function(data, opts, callback) {
    var browser, interval, match, need, sorted, support, version, versions, _i, _len, _ref, _ref1, _ref2;
    if (!callback) {
      _ref = [opts, {}], callback = _ref[0], opts = _ref[1];
    }
    match = opts.full ? /y\sx($|\s)/ : /\sx($|\s)/;
    need = [];
    _ref1 = data.stats;
    for (browser in _ref1) {
      versions = _ref1[browser];
      for (interval in versions) {
        support = versions[interval];
        _ref2 = interval.split('-');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          version = _ref2[_i];
          if (browsers[browser] && support.match(match)) {
            version = version.replace(/\.0$/, '');
            need.push(browser + ' ' + version);
          }
        }
      }
    }
    sorted = need.sort(function(a, b) {
      a = a.split(' ');
      b = b.split(' ');
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return parseFloat(a[1]) - parseFloat(b[1]);
      }
    });
    return callback(sorted);
  };

  map = function(browsers, callback) {
    var browser, name, version, _i, _len, _ref, _results;
    _results = [];
    for (_i = 0, _len = browsers.length; _i < _len; _i++) {
      browser = browsers[_i];
      _ref = browser.split(' '), name = _ref[0], version = _ref[1];
      version = parseFloat(version);
      _results.push(callback(browser, name, version));
    }
    return _results;
  };

  prefix = function() {
    var data, name, names, _i, _j, _len, _results;
    names = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), data = arguments[_i++];
    _results = [];
    for (_j = 0, _len = names.length; _j < _len; _j++) {
      name = names[_j];
      _results.push(module.exports[name] = data);
    }
    return _results;
  };

  module.exports = {};

  feature(require('caniuse-db/features-json/border-radius'), function(browsers) {
    return prefix('border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius', {
      mistakes: ['-ms-'],
      browsers: browsers,
      transition: true
    });
  });

  feature(require('caniuse-db/features-json/css-boxshadow'), function(browsers) {
    return prefix('box-shadow', {
      browsers: browsers,
      transition: true
    });
  });

  feature(require('caniuse-db/features-json/css-animation'), function(browsers) {
    return prefix('animation', 'animation-name', 'animation-duration', 'animation-delay', 'animation-direction', 'animation-fill-mode', 'animation-iteration-count', 'animation-play-state', 'animation-timing-function', '@keyframes', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-transitions'), function(browsers) {
    return prefix('transition', 'transition-property', 'transition-duration', 'transition-delay', 'transition-timing-function', {
      mistakes: ['-ms-'],
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/transforms2d'), function(browsers) {
    return prefix('transform', 'transform-origin', {
      browsers: browsers,
      transition: true
    });
  });

  feature(require('caniuse-db/features-json/transforms3d'), function(browsers) {
    prefix('perspective', 'perspective-origin', {
      browsers: browsers,
      transition: true
    });
    return prefix('transform-style', 'backface-visibility', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-gradients'), function(browsers) {
    browsers = map(browsers, function(browser, name, version) {
      if (name === 'android' && version < 4 || name === 'ios_saf' && version < 5 || name === 'safari' && version < 5.1) {
        return browser + ' old';
      } else {
        return browser;
      }
    });
    return prefix('linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient', {
      props: ['background', 'background-image', 'border-image'],
      mistakes: ['-ms-'],
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css3-boxsizing'), function(browsers) {
    return prefix('box-sizing', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-filters'), function(browsers) {
    return prefix('filter', {
      browsers: browsers,
      transition: true
    });
  });

  feature(require('caniuse-db/features-json/multicolumn'), function(browsers) {
    prefix('columns', 'column-width', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-width', {
      browsers: browsers,
      transition: true
    });
    return prefix('column-count', 'column-rule-style', 'column-span', 'column-fill', 'break-before', 'break-after', 'break-inside', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/user-select-none'), function(browsers) {
    return prefix('user-select', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/flexbox'), function(browsers) {
    browsers = map(browsers, function(browser, name, version) {
      if (name === 'safari' && version < 6.1) {
        return browser + ' 2009';
      } else if (name === 'ios_saf' && version < 7) {
        return browser + ' 2009';
      } else if (name === 'chrome' && version < 21) {
        return browser + ' 2009';
      } else if (name === 'android' && version < 4.4) {
        return browser + ' 2009';
      } else {
        return browser;
      }
    });
    prefix('display-flex', 'inline-flex', {
      props: ['display'],
      browsers: browsers
    });
    prefix('flex', 'flex-grow', 'flex-shrink', 'flex-basis', {
      transition: true,
      browsers: browsers
    });
    return prefix('flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'order', 'align-items', 'align-self', 'align-content', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/calc'), function(browsers) {
    return prefix('calc', {
      props: ['*'],
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/background-img-opts'), function(browsers) {
    return prefix('background-clip', 'background-origin', 'background-size', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/font-feature'), function(browsers) {
    return prefix('font-feature-settings', 'font-variant-ligatures', 'font-language-override', 'font-kerning', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/border-image'), function(browsers) {
    return prefix('border-image', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-selection'), function(browsers) {
    return prefix('::selection', {
      selector: true,
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-placeholder'), function(browsers) {
    browsers = map(browsers, function(browser, name, version) {
      if (name === 'firefox' && version <= 18) {
        return browser + ' old';
      } else {
        return browser;
      }
    });
    return prefix('::placeholder', {
      selector: true,
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-hyphens'), function(browsers) {
    return prefix('hyphens', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/fullscreen'), function(browsers) {
    return prefix(':fullscreen', {
      selector: true,
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css3-tabsize'), function(browsers) {
    return prefix('tab-size', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/intrinsic-width'), function(browsers) {
    return prefix('max-content', 'min-content', 'fit-content', 'fill-available', {
      props: ['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height'],
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css3-cursors-newer'), function(browsers) {
    prefix('zoom-in', 'zoom-out', {
      props: ['cursor'],
      browsers: browsers.concat(['chrome 3'])
    });
    return prefix('grab', 'grabbing', {
      props: ['cursor'],
      browsers: browsers.concat(['firefox 24', 'firefox 25', 'firefox 26'])
    });
  });

  feature(require('caniuse-db/features-json/css-sticky'), function(browsers) {
    return prefix('sticky', {
      props: ['position'],
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/pointer'), function(browsers) {
    return prefix('touch-action', {
      browsers: browsers
    });
  });

  textDecoration = require('caniuse-db/features-json/text-decoration');

  feature(textDecoration, function(browsers) {
    return prefix('text-decoration-style', {
      browsers: browsers
    });
  });

  feature(textDecoration, {
    full: true
  }, function(browsers) {
    return prefix('text-decoration-line', 'text-decoration-color', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/text-size-adjust'), function(browsers) {
    return prefix('text-size-adjust', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-masks'), function(browsers) {
    return prefix('clip-path', 'mask', 'mask-clip', 'mask-composite', 'mask-image', 'mask-origin', 'mask-position', 'mask-repeat', 'mask-size', {
      browsers: browsers
    });
  });

  feature(require('caniuse-db/features-json/css-boxdecorationbreak'), function(brwsrs) {
    return prefix('box-decoration-break', {
      browsers: brwsrs
    });
  });

}).call(this);

},{"./browsers":2,"caniuse-db/features-json/background-img-opts":52,"caniuse-db/features-json/border-image":53,"caniuse-db/features-json/border-radius":54,"caniuse-db/features-json/calc":55,"caniuse-db/features-json/css-animation":56,"caniuse-db/features-json/css-boxdecorationbreak":57,"caniuse-db/features-json/css-boxshadow":58,"caniuse-db/features-json/css-filters":59,"caniuse-db/features-json/css-gradients":60,"caniuse-db/features-json/css-hyphens":61,"caniuse-db/features-json/css-masks":62,"caniuse-db/features-json/css-placeholder":63,"caniuse-db/features-json/css-selection":64,"caniuse-db/features-json/css-sticky":65,"caniuse-db/features-json/css-transitions":66,"caniuse-db/features-json/css3-boxsizing":67,"caniuse-db/features-json/css3-cursors-newer":68,"caniuse-db/features-json/css3-tabsize":69,"caniuse-db/features-json/flexbox":70,"caniuse-db/features-json/font-feature":71,"caniuse-db/features-json/fullscreen":72,"caniuse-db/features-json/intrinsic-width":73,"caniuse-db/features-json/multicolumn":74,"caniuse-db/features-json/pointer":75,"caniuse-db/features-json/text-decoration":76,"caniuse-db/features-json/text-size-adjust":77,"caniuse-db/features-json/transforms2d":78,"caniuse-db/features-json/transforms3d":79,"caniuse-db/features-json/user-select-none":80}],4:[function(require,module,exports){
(function() {
  var Browsers, utils;

  utils = require('./utils');

  Browsers = (function() {
    Browsers.prefixes = function() {
      var data, i, name;
      if (this.prefixesCache) {
        return this.prefixesCache;
      }
      data = require('../data/browsers');
      return this.prefixesCache = utils.uniq((function() {
        var _results;
        _results = [];
        for (name in data) {
          i = data[name];
          _results.push(i.prefix);
        }
        return _results;
      })()).sort(function(a, b) {
        return b.length - a.length;
      });
    };

    Browsers.withPrefix = function(value) {
      if (!this.prefixesRegexp) {
        this.prefixesRegexp = RegExp("" + (this.prefixes().join('|')));
      }
      return this.prefixesRegexp.test(value);
    };

    function Browsers(data, requirements) {
      this.data = data;
      this.selected = this.parse(requirements);
    }

    Browsers.prototype.parse = function(requirements) {
      var selected;
      if (!(requirements instanceof Array)) {
        requirements = [requirements];
      }
      selected = [];
      requirements.map((function(_this) {
        return function(req) {
          var i, match, name, _ref;
          _ref = _this.requirements;
          for (name in _ref) {
            i = _ref[name];
            if (match = req.match(i.regexp)) {
              selected = selected.concat(i.select.apply(_this, match.slice(1)));
              return;
            }
          }
          return utils.error("Unknown browser requirement `" + req + "`");
        };
      })(this));
      return utils.uniq(selected);
    };

    Browsers.prototype.aliases = {
      fx: 'firefox',
      ff: 'firefox',
      ios: 'ios_saf',
      explorer: 'ie',
      blackberry: 'bb',
      explorermobile: 'ie_mob',
      operamini: 'op_mini',
      operamobile: 'op_mob',
      chromeandroid: 'and_chr',
      firefoxandroid: 'and_ff'
    };

    Browsers.prototype.requirements = {
      none: {
        regexp: /^none$/i,
        select: function() {
          if (typeof console !== "undefined" && console !== null) {
            console.warn("autoprefixer(\'none\') is deprecated and will be " + 'removed in 3.1. ' + 'Use autoprefixer({ browsers: [] })');
          }
          return [];
        }
      },
      lastVersions: {
        regexp: /^last (\d+) versions?$/i,
        select: function(versions) {
          return this.browsers(function(data) {
            if (data.minor) {
              return [];
            } else {
              return data.versions.slice(0, versions);
            }
          });
        }
      },
      lastByBrowser: {
        regexp: /^last (\d+) (\w+) versions?$/i,
        select: function(versions, browser) {
          var data;
          data = this.byName(browser);
          return data.versions.slice(0, versions).map(function(v) {
            return "" + data.name + " " + v;
          });
        }
      },
      globalStatistics: {
        regexp: /^> (\d+(\.\d+)?)%$/,
        select: function(popularity) {
          return this.browsers(function(data) {
            if (data.minor) {
              return [];
            } else {
              return data.versions.filter(function(version, i) {
                return data.popularity[i] > popularity;
              });
            }
          });
        }
      },
      newerThan: {
        regexp: /^(\w+) (>=?)\s*([\d\.]+)/,
        select: function(browser, sign, version) {
          var data, filter;
          data = this.byName(browser);
          version = parseFloat(version);
          if (sign === '>') {
            filter = function(v) {
              return v > version;
            };
          } else if (sign === '>=') {
            filter = function(v) {
              return v >= version;
            };
          }
          return data.versions.filter(filter).map(function(v) {
            return "" + data.name + " " + v;
          });
        }
      },
      olderThan: {
        regexp: /^(\w+) (<=?)\s*([\d\.]+)/,
        select: function(browser, sign, version) {
          var data, filter;
          data = this.byName(browser);
          version = parseFloat(version);
          if (sign === '<') {
            filter = function(v) {
              return v < version;
            };
          } else if (sign === '<=') {
            filter = function(v) {
              return v <= version;
            };
          }
          return data.versions.filter(filter).map(function(v) {
            return "" + data.name + " " + v;
          });
        }
      },
      esr: {
        regexp: /^(firefox|ff|fx) esr$/i,
        select: function() {
          return ['firefox 31'];
        }
      },
      direct: {
        regexp: /^(\w+) ([\d\.]+)$/,
        select: function(browser, version) {
          var data, first, last;
          data = this.byName(browser);
          version = parseFloat(version);
          last = data.future ? data.future[0] : data.versions[0];
          first = data.versions[data.versions.length - 1];
          if (version > last) {
            version = last;
          } else if (version < first) {
            version = first;
          }
          return ["" + data.name + " " + version];
        }
      }
    };

    Browsers.prototype.browsers = function(criteria) {
      var browser, data, selected, versions, _ref;
      selected = [];
      _ref = this.data;
      for (browser in _ref) {
        data = _ref[browser];
        versions = criteria(data).map(function(version) {
          return "" + browser + " " + version;
        });
        selected = selected.concat(versions);
      }
      return selected;
    };

    Browsers.prototype.prefix = function(browser) {
      var name, version, _ref;
      _ref = browser.split(' '), name = _ref[0], version = _ref[1];
      if (name === 'opera' && parseFloat(version) >= 15) {
        return '-webkit-';
      } else {
        return this.data[name].prefix;
      }
    };

    Browsers.prototype.isSelected = function(browser) {
      return this.selected.indexOf(browser) !== -1;
    };

    Browsers.prototype.byName = function(name) {
      var data;
      name = name.toLowerCase();
      name = this.aliases[name] || name;
      data = this.data[name];
      if (!data) {
        utils.error("Unknown browser " + browser);
      }
      data.name = name;
      return data;
    };

    return Browsers;

  })();

  module.exports = Browsers;

}).call(this);

},{"../data/browsers":2,"./utils":42}],5:[function(require,module,exports){
(function() {
  var Browsers, Declaration, Prefixer, utils, vendor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefixer = require('./prefixer');

  Browsers = require('./browsers');

  vendor = require('postcss/lib/vendor');

  utils = require('./utils');

  Declaration = (function(_super) {
    __extends(Declaration, _super);

    function Declaration() {
      return Declaration.__super__.constructor.apply(this, arguments);
    }

    Declaration.prototype.check = function(decl) {
      return true;
    };

    Declaration.prototype.prefixed = function(prop, prefix) {
      return prefix + prop;
    };

    Declaration.prototype.normalize = function(prop) {
      return prop;
    };

    Declaration.prototype.otherPrefixes = function(value, prefix) {
      var other, _i, _len, _ref;
      _ref = Browsers.prefixes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        other = _ref[_i];
        if (other === prefix) {
          continue;
        }
        if (value.indexOf(other) !== -1) {
          return true;
        }
      }
      return false;
    };

    Declaration.prototype.set = function(decl, prefix) {
      decl.prop = this.prefixed(decl.prop, prefix);
      return decl;
    };

    Declaration.prototype.needCascade = function(decl) {
      return decl._autoprefixerCascade || (decl._autoprefixerCascade = this.all.options.cascade !== false && decl.before.indexOf("\n") !== -1);
    };

    Declaration.prototype.maxPrefixed = function(prefixes, decl) {
      var max, prefix, _i, _len;
      if (decl._autoprefixerMax) {
        return decl._autoprefixerMax;
      }
      max = 0;
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        prefix = utils.removeNote(prefix);
        if (prefix.length > max) {
          max = prefix.length;
        }
      }
      return decl._autoprefixerMax = max;
    };

    Declaration.prototype.calcBefore = function(prefixes, decl, prefix) {
      var before, diff, i, max, _i;
      if (prefix == null) {
        prefix = '';
      }
      before = decl.before;
      max = this.maxPrefixed(prefixes, decl);
      diff = max - utils.removeNote(prefix).length;
      for (i = _i = 0; 0 <= diff ? _i < diff : _i > diff; i = 0 <= diff ? ++_i : --_i) {
        before += ' ';
      }
      return before;
    };

    Declaration.prototype.restoreBefore = function(decl) {
      var lines, min;
      lines = decl.before.split("\n");
      min = lines[lines.length - 1];
      this.all.group(decl).up(function(prefixed) {
        var array, last;
        array = prefixed.before.split("\n");
        last = array[array.length - 1];
        if (last.length < min.length) {
          return min = last;
        }
      });
      lines[lines.length - 1] = min;
      return decl.before = lines.join("\n");
    };

    Declaration.prototype.insert = function(decl, prefix, prefixes) {
      var cloned;
      cloned = this.set(this.clone(decl), prefix);
      if (!cloned) {
        return;
      }
      if (this.needCascade(decl)) {
        cloned.before = this.calcBefore(prefixes, decl, prefix);
      }
      return decl.parent.insertBefore(decl, cloned);
    };

    Declaration.prototype.add = function(decl, prefix, prefixes) {
      var already, prefixed;
      prefixed = this.prefixed(decl.prop, prefix);
      already = this.all.group(decl).up(function(i) {
        return i.prop === prefixed;
      });
      already || (already = this.all.group(decl).down(function(i) {
        return i.prop === prefixed;
      }));
      if (already || this.otherPrefixes(decl.value, prefix)) {
        return;
      }
      return this.insert(decl, prefix, prefixes);
    };

    Declaration.prototype.process = function(decl) {
      var prefixes;
      if (this.needCascade(decl)) {
        prefixes = Declaration.__super__.process.apply(this, arguments);
        if (prefixes != null ? prefixes.length : void 0) {
          this.restoreBefore(decl);
          return decl.before = this.calcBefore(prefixes, decl);
        }
      } else {
        return Declaration.__super__.process.apply(this, arguments);
      }
    };

    Declaration.prototype.old = function(prop, prefix) {
      return [this.prefixed(prop, prefix)];
    };

    return Declaration;

  })(Prefixer);

  module.exports = Declaration;

}).call(this);

},{"./browsers":4,"./prefixer":37,"./utils":42,"postcss/lib/vendor":98}],6:[function(require,module,exports){
(function() {
  var AlignContent, Declaration, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  AlignContent = (function(_super) {
    __extends(AlignContent, _super);

    function AlignContent() {
      return AlignContent.__super__.constructor.apply(this, arguments);
    }

    AlignContent.names = ['align-content', 'flex-line-pack'];

    AlignContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    AlignContent.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return prefix + 'flex-line-pack';
      } else {
        return AlignContent.__super__.prefixed.apply(this, arguments);
      }
    };

    AlignContent.prototype.normalize = function(prop) {
      return 'align-content';
    };

    AlignContent.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec === 2012) {
        decl.value = AlignContent.oldValues[decl.value] || decl.value;
        return AlignContent.__super__.set.call(this, decl, prefix);
      } else if (spec === 'final') {
        return AlignContent.__super__.set.apply(this, arguments);
      }
    };

    return AlignContent;

  })(Declaration);

  module.exports = AlignContent;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],7:[function(require,module,exports){
(function() {
  var AlignItems, Declaration, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  AlignItems = (function(_super) {
    __extends(AlignItems, _super);

    function AlignItems() {
      return AlignItems.__super__.constructor.apply(this, arguments);
    }

    AlignItems.names = ['align-items', 'flex-align', 'box-align'];

    AlignItems.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    AlignItems.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return prefix + 'box-align';
      } else if (spec === 2012) {
        return prefix + 'flex-align';
      } else {
        return AlignItems.__super__.prefixed.apply(this, arguments);
      }
    };

    AlignItems.prototype.normalize = function(prop) {
      return 'align-items';
    };

    AlignItems.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec === 2009 || spec === 2012) {
        decl.value = AlignItems.oldValues[decl.value] || decl.value;
        return AlignItems.__super__.set.call(this, decl, prefix);
      } else {
        return AlignItems.__super__.set.apply(this, arguments);
      }
    };

    return AlignItems;

  })(Declaration);

  module.exports = AlignItems;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],8:[function(require,module,exports){
(function() {
  var AlignSelf, Declaration, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  AlignSelf = (function(_super) {
    __extends(AlignSelf, _super);

    function AlignSelf() {
      return AlignSelf.__super__.constructor.apply(this, arguments);
    }

    AlignSelf.names = ['align-self', 'flex-item-align'];

    AlignSelf.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    AlignSelf.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return prefix + 'flex-item-align';
      } else {
        return AlignSelf.__super__.prefixed.apply(this, arguments);
      }
    };

    AlignSelf.prototype.normalize = function(prop) {
      return 'align-self';
    };

    AlignSelf.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec === 2012) {
        decl.value = AlignSelf.oldValues[decl.value] || decl.value;
        return AlignSelf.__super__.set.call(this, decl, prefix);
      } else if (spec === 'final') {
        return AlignSelf.__super__.set.apply(this, arguments);
      }
    };

    return AlignSelf;

  })(Declaration);

  module.exports = AlignSelf;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],9:[function(require,module,exports){
(function() {
  var BackgroundSize, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BackgroundSize = (function(_super) {
    __extends(BackgroundSize, _super);

    function BackgroundSize() {
      return BackgroundSize.__super__.constructor.apply(this, arguments);
    }

    BackgroundSize.names = ['background-size'];

    BackgroundSize.prototype.set = function(decl, prefix) {
      var value;
      value = decl.value.toLowerCase();
      if (prefix === '-webkit-' && value.indexOf(' ') === -1 && value !== 'contain' && value !== 'cover') {
        decl.value = decl.value + ' ' + decl.value;
      }
      return BackgroundSize.__super__.set.call(this, decl, prefix);
    };

    return BackgroundSize;

  })(Declaration);

  module.exports = BackgroundSize;

}).call(this);

},{"../declaration":5}],10:[function(require,module,exports){
(function() {
  var BorderImage, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BorderImage = (function(_super) {
    __extends(BorderImage, _super);

    function BorderImage() {
      return BorderImage.__super__.constructor.apply(this, arguments);
    }

    BorderImage.names = ['border-image'];

    BorderImage.prototype.set = function(decl, prefix) {
      decl.value = decl.value.replace(/\s+fill(\s)/, '$1');
      return BorderImage.__super__.set.call(this, decl, prefix);
    };

    return BorderImage;

  })(Declaration);

  module.exports = BorderImage;

}).call(this);

},{"../declaration":5}],11:[function(require,module,exports){
(function() {
  var BorderRadius, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BorderRadius = (function(_super) {
    var hor, mozilla, normal, ver, _i, _j, _len, _len1, _ref, _ref1;

    __extends(BorderRadius, _super);

    function BorderRadius() {
      return BorderRadius.__super__.constructor.apply(this, arguments);
    }

    BorderRadius.names = ['border-radius'];

    BorderRadius.toMozilla = {};

    BorderRadius.toNormal = {};

    _ref = ['top', 'bottom'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ver = _ref[_i];
      _ref1 = ['left', 'right'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        hor = _ref1[_j];
        normal = "border-" + ver + "-" + hor + "-radius";
        mozilla = "border-radius-" + ver + hor;
        BorderRadius.names.push(normal);
        BorderRadius.names.push(mozilla);
        BorderRadius.toMozilla[normal] = mozilla;
        BorderRadius.toNormal[mozilla] = normal;
      }
    }

    BorderRadius.prototype.prefixed = function(prop, prefix) {
      if (prefix === '-moz-') {
        return prefix + (BorderRadius.toMozilla[prop] || prop);
      } else {
        return BorderRadius.__super__.prefixed.apply(this, arguments);
      }
    };

    BorderRadius.prototype.normalize = function(prop) {
      return BorderRadius.toNormal[prop] || prop;
    };

    return BorderRadius;

  })(Declaration);

  module.exports = BorderRadius;

}).call(this);

},{"../declaration":5}],12:[function(require,module,exports){
(function() {
  var BreakInside, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BreakInside = (function(_super) {
    __extends(BreakInside, _super);

    function BreakInside() {
      return BreakInside.__super__.constructor.apply(this, arguments);
    }

    BreakInside.names = ['break-inside', 'page-break-inside', 'column-break-inside'];

    BreakInside.prototype.prefixed = function(prop, prefix) {
      if (prefix === '-webkit-') {
        return prefix + 'column-break-inside';
      } else if (prefix === '-moz-') {
        return 'page-break-inside';
      } else {
        return BreakInside.__super__.prefixed.apply(this, arguments);
      }
    };

    BreakInside.prototype.normalize = function() {
      return 'break-inside';
    };

    BreakInside.prototype.set = function(decl, prefix) {
      if (decl.value === 'avoid-column' || decl.value === 'avoid-page') {
        decl.value = 'avoid';
      }
      return BreakInside.__super__.set.apply(this, arguments);
    };

    BreakInside.prototype.insert = function(decl, prefix, prefixes) {
      if (decl.value === 'avoid-region') {

      } else if (decl.value === 'avoid-page' && prefix === '-webkit-') {

      } else {
        return BreakInside.__super__.insert.apply(this, arguments);
      }
    };

    return BreakInside;

  })(Declaration);

  module.exports = BreakInside;

}).call(this);

},{"../declaration":5}],13:[function(require,module,exports){
(function() {
  var DisplayFlex, OldDisplayFlex, OldValue, Value, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  OldValue = require('../old-value');

  Value = require('../value');

  OldDisplayFlex = (function(_super) {
    __extends(OldDisplayFlex, _super);

    function OldDisplayFlex(name) {
      this.name = name;
    }

    OldDisplayFlex.prototype.check = function(value) {
      return value === this.name;
    };

    return OldDisplayFlex;

  })(OldValue);

  DisplayFlex = (function(_super) {
    __extends(DisplayFlex, _super);

    DisplayFlex.names = ['display-flex', 'inline-flex'];

    function DisplayFlex(name, prefixes) {
      DisplayFlex.__super__.constructor.apply(this, arguments);
      if (name === 'display-flex') {
        this.name = 'flex';
      }
    }

    DisplayFlex.prototype.check = function(decl) {
      return decl.value === this.name;
    };

    DisplayFlex.prototype.prefixed = function(prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      return prefix + (spec === 2009 ? this.name === 'flex' ? 'box' : 'inline-box' : spec === 2012 ? this.name === 'flex' ? 'flexbox' : 'inline-flexbox' : spec === 'final' ? this.name : void 0);
    };

    DisplayFlex.prototype.replace = function(string, prefix) {
      return this.prefixed(prefix);
    };

    DisplayFlex.prototype.old = function(prefix) {
      var prefixed;
      prefixed = this.prefixed(prefix);
      if (prefixed) {
        return new OldValue(prefixed);
      }
    };

    return DisplayFlex;

  })(Value);

  module.exports = DisplayFlex;

}).call(this);

},{"../old-value":36,"../value":43,"./flex-spec":22}],14:[function(require,module,exports){
(function() {
  var FillAvailable, OldValue, Value,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  FillAvailable = (function(_super) {
    __extends(FillAvailable, _super);

    function FillAvailable() {
      return FillAvailable.__super__.constructor.apply(this, arguments);
    }

    FillAvailable.names = ['fill-available'];

    FillAvailable.prototype.replace = function(string, prefix) {
      if (prefix === '-moz-') {
        return string.replace(this.regexp(), '$1-moz-available$3');
      } else {
        return FillAvailable.__super__.replace.apply(this, arguments);
      }
    };

    FillAvailable.prototype.old = function(prefix) {
      if (prefix === '-moz-') {
        return new OldValue('-moz-available');
      } else {
        return FillAvailable.__super__.old.apply(this, arguments);
      }
    };

    return FillAvailable;

  })(Value);

  module.exports = FillAvailable;

}).call(this);

},{"../old-value":36,"../value":43}],15:[function(require,module,exports){
(function() {
  var FilterValue, Value,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Value = require('../value');

  FilterValue = (function(_super) {
    __extends(FilterValue, _super);

    function FilterValue() {
      return FilterValue.__super__.constructor.apply(this, arguments);
    }

    FilterValue.names = ['filter'];

    FilterValue.prototype.replace = function(value, prefix) {
      if (prefix === '-webkit-') {
        if (value.indexOf('-webkit-filter') === -1) {
          return FilterValue.__super__.replace.apply(this, arguments) + ', ' + value;
        } else {
          return value;
        }
      } else {
        return FilterValue.__super__.replace.apply(this, arguments);
      }
    };

    return FilterValue;

  })(Value);

  module.exports = FilterValue;

}).call(this);

},{"../value":43}],16:[function(require,module,exports){
(function() {
  var Declaration, Filter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  Filter = (function(_super) {
    __extends(Filter, _super);

    function Filter() {
      return Filter.__super__.constructor.apply(this, arguments);
    }

    Filter.names = ['filter'];

    Filter.prototype.check = function(decl) {
      var v;
      v = decl.value;
      return v.toLowerCase().indexOf('alpha(') === -1 && v.indexOf('DXImageTransform.Microsoft') === -1 && v.indexOf('data:image/svg+xml') === -1;
    };

    return Filter;

  })(Declaration);

  module.exports = Filter;

}).call(this);

},{"../declaration":5}],17:[function(require,module,exports){
(function() {
  var Declaration, FlexBasis, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexBasis = (function(_super) {
    __extends(FlexBasis, _super);

    function FlexBasis() {
      return FlexBasis.__super__.constructor.apply(this, arguments);
    }

    FlexBasis.names = ['flex-basis', 'flex-preferred-size'];

    FlexBasis.prototype.normalize = function() {
      return 'flex-basis';
    };

    FlexBasis.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return prefix + 'flex-preferred-size';
      } else {
        return FlexBasis.__super__.prefixed.apply(this, arguments);
      }
    };

    FlexBasis.prototype.set = function(decl, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012 || spec === 'final') {
        return FlexBasis.__super__.set.apply(this, arguments);
      }
    };

    return FlexBasis;

  })(Declaration);

  module.exports = FlexBasis;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],18:[function(require,module,exports){
(function() {
  var Declaration, FlexDirection, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexDirection = (function(_super) {
    __extends(FlexDirection, _super);

    function FlexDirection() {
      return FlexDirection.__super__.constructor.apply(this, arguments);
    }

    FlexDirection.names = ['flex-direction', 'box-direction', 'box-orient'];

    FlexDirection.prototype.normalize = function(prop) {
      return 'flex-direction';
    };

    FlexDirection.prototype.insert = function(decl, prefix, prefixes) {
      var already, cloned, dir, orient, spec, value, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        already = decl.parent.some(function(i) {
          return i.prop === prefix + 'box-orient' || i.prop === prefix + 'box-direction';
        });
        if (already) {
          return;
        }
        value = decl.value;
        orient = value.indexOf('row') !== -1 ? 'horizontal' : 'vertical';
        dir = value.indexOf('reverse') !== -1 ? 'reverse' : 'normal';
        cloned = this.clone(decl);
        cloned.prop = prefix + 'box-orient';
        cloned.value = orient;
        if (this.needCascade(decl)) {
          cloned.before = this.calcBefore(prefixes, decl, prefix);
        }
        decl.parent.insertBefore(decl, cloned);
        cloned = this.clone(decl);
        cloned.prop = prefix + 'box-direction';
        cloned.value = dir;
        if (this.needCascade(decl)) {
          cloned.before = this.calcBefore(prefixes, decl, prefix);
        }
        return decl.parent.insertBefore(decl, cloned);
      } else {
        return FlexDirection.__super__.insert.apply(this, arguments);
      }
    };

    FlexDirection.prototype.old = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return [prefix + 'box-orient', prefix + 'box-direction'];
      } else {
        return FlexDirection.__super__.old.apply(this, arguments);
      }
    };

    return FlexDirection;

  })(Declaration);

  module.exports = FlexDirection;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],19:[function(require,module,exports){
(function() {
  var Declaration, FlexFlow, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexFlow = (function(_super) {
    __extends(FlexFlow, _super);

    function FlexFlow() {
      return FlexFlow.__super__.constructor.apply(this, arguments);
    }

    FlexFlow.names = ['flex-flow'];

    FlexFlow.prototype.set = function(decl, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return FlexFlow.__super__.set.apply(this, arguments);
      } else if (spec === 'final') {
        return FlexFlow.__super__.set.apply(this, arguments);
      }
    };

    return FlexFlow;

  })(Declaration);

  module.exports = FlexFlow;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],20:[function(require,module,exports){
(function() {
  var Declaration, Flex, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    function Flex() {
      return Flex.__super__.constructor.apply(this, arguments);
    }

    Flex.names = ['flex-grow', 'flex-positive'];

    Flex.prototype.normalize = function() {
      return 'flex';
    };

    Flex.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return prefix + 'box-flex';
      } else if (spec === 2012) {
        return prefix + 'flex-positive';
      } else {
        return Flex.__super__.prefixed.apply(this, arguments);
      }
    };

    return Flex;

  })(Declaration);

  module.exports = Flex;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],21:[function(require,module,exports){
(function() {
  var Declaration, FlexShrink, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexShrink = (function(_super) {
    __extends(FlexShrink, _super);

    function FlexShrink() {
      return FlexShrink.__super__.constructor.apply(this, arguments);
    }

    FlexShrink.names = ['flex-shrink', 'flex-negative'];

    FlexShrink.prototype.normalize = function() {
      return 'flex-shrink';
    };

    FlexShrink.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return prefix + 'flex-negative';
      } else {
        return FlexShrink.__super__.prefixed.apply(this, arguments);
      }
    };

    FlexShrink.prototype.set = function(decl, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012 || spec === 'final') {
        return FlexShrink.__super__.set.apply(this, arguments);
      }
    };

    return FlexShrink;

  })(Declaration);

  module.exports = FlexShrink;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],22:[function(require,module,exports){
(function() {
  module.exports = function(prefix) {
    var spec;
    spec = prefix === '-webkit- 2009' || prefix === '-moz-' ? 2009 : prefix === '-ms-' ? 2012 : prefix === '-webkit-' ? 'final' : void 0;
    if (prefix === '-webkit- 2009') {
      prefix = '-webkit-';
    }
    return [spec, prefix];
  };

}).call(this);

},{}],23:[function(require,module,exports){
(function() {
  var Declaration, FlexWrap, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexWrap = (function(_super) {
    __extends(FlexWrap, _super);

    function FlexWrap() {
      return FlexWrap.__super__.constructor.apply(this, arguments);
    }

    FlexWrap.names = ['flex-wrap'];

    FlexWrap.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec !== 2009) {
        return FlexWrap.__super__.set.apply(this, arguments);
      }
    };

    return FlexWrap;

  })(Declaration);

  module.exports = FlexWrap;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],24:[function(require,module,exports){
(function() {
  var Declaration, Flex, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    function Flex() {
      return Flex.__super__.constructor.apply(this, arguments);
    }

    Flex.names = ['flex', 'box-flex'];

    Flex.oldValues = {
      'auto': '1',
      'none': '0'
    };

    Flex.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return prefix + 'box-flex';
      } else {
        return Flex.__super__.prefixed.apply(this, arguments);
      }
    };

    Flex.prototype.normalize = function() {
      return 'flex';
    };

    Flex.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec === 2009) {
        decl.value = decl.value.split(' ')[0];
        decl.value = Flex.oldValues[decl.value] || decl.value;
        return Flex.__super__.set.call(this, decl, prefix);
      } else {
        return Flex.__super__.set.apply(this, arguments);
      }
    };

    return Flex;

  })(Declaration);

  module.exports = Flex;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],25:[function(require,module,exports){
(function() {
  var Fullscreen, Selector,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Selector = require('../selector');

  Fullscreen = (function(_super) {
    __extends(Fullscreen, _super);

    function Fullscreen() {
      return Fullscreen.__super__.constructor.apply(this, arguments);
    }

    Fullscreen.names = [':fullscreen'];

    Fullscreen.prototype.prefixed = function(prefix) {
      if ('-webkit-' === prefix) {
        return ':-webkit-full-screen';
      } else if ('-moz-' === prefix) {
        return ':-moz-full-screen';
      } else {
        return ":" + prefix + "fullscreen";
      }
    };

    return Fullscreen;

  })(Selector);

  module.exports = Fullscreen;

}).call(this);

},{"../selector":40}],26:[function(require,module,exports){
(function() {
  var Gradient, OldValue, Value, isDirection, list, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  utils = require('../utils');

  list = require('postcss/lib/list');

  isDirection = /top|left|right|bottom/gi;

  Gradient = (function(_super) {
    __extends(Gradient, _super);

    function Gradient() {
      return Gradient.__super__.constructor.apply(this, arguments);
    }

    Gradient.names = ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient'];

    Gradient.prototype.replace = function(string, prefix) {
      return list.space(string).map((function(_this) {
        return function(value) {
          var after, args, close, params;
          if (value.slice(0, +_this.name.length + 1 || 9e9) !== _this.name + '(') {
            return value;
          }
          close = value.lastIndexOf(')');
          after = value.slice(close + 1);
          args = value.slice(_this.name.length + 1, +(close - 1) + 1 || 9e9);
          params = list.comma(args);
          params = _this.newDirection(params);
          if (prefix === '-webkit- old') {
            if (args.indexOf('px') === -1) {
              return _this.oldWebkit(value, args, params, after);
            }
          } else {
            _this.convertDirection(params);
            return prefix + _this.name + '(' + params.join(', ') + ')' + after;
          }
        };
      })(this)).join(' ');
    };

    Gradient.prototype.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left'
    };

    Gradient.prototype.oldDirections = {
      'top': 'left bottom, left top',
      'left': 'right top, left top',
      'bottom': 'left top, left bottom',
      'right': 'left top, right top',
      'top right': 'left bottom, right top',
      'top left': 'right bottom, left top',
      'right top': 'left bottom, right top',
      'right bottom': 'left top, right bottom',
      'bottom right': 'left top, right bottom',
      'bottom left': 'right top, left bottom',
      'left top': 'right bottom, left top',
      'left bottom': 'right top, left bottom'
    };

    Gradient.prototype.newDirection = function(params) {
      var first, value;
      first = params[0];
      if (first.indexOf('to ') === -1 && isDirection.test(first)) {
        first = first.split(' ');
        first = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = first.length; _i < _len; _i++) {
            value = first[_i];
            _results.push(this.directions[value.toLowerCase()] || value);
          }
          return _results;
        }).call(this);
        params[0] = 'to ' + first.join(' ');
      }
      return params;
    };

    Gradient.prototype.oldWebkit = function(value, args, params, after) {
      if (this.name !== 'linear-gradient') {
        return value;
      }
      if (params[0] && params[0].indexOf('deg') !== -1) {
        return value;
      }
      if (args.indexOf('-corner') !== -1) {
        return value;
      }
      if (args.indexOf('-side') !== -1) {
        return value;
      }
      params = this.oldDirection(params);
      params = this.colorStops(params);
      return '-webkit-gradient(linear, ' + params.join(', ') + ')' + after;
    };

    Gradient.prototype.convertDirection = function(params) {
      if (params.length > 0) {
        if (params[0].slice(0, 3) === 'to ') {
          return params[0] = this.fixDirection(params[0]);
        } else if (params[0].indexOf('deg') !== -1) {
          return params[0] = this.fixAngle(params[0]);
        } else if (params[0].indexOf(' at ') !== -1) {
          return this.fixRadial(params);
        }
      }
    };

    Gradient.prototype.fixDirection = function(param) {
      var value;
      param = param.split(' ');
      param.splice(0, 1);
      param = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = param.length; _i < _len; _i++) {
          value = param[_i];
          _results.push(this.directions[value.toLowerCase()] || value);
        }
        return _results;
      }).call(this);
      return param.join(' ');
    };

    Gradient.prototype.roundFloat = function(float, digits) {
      return parseFloat(float.toFixed(digits));
    };

    Gradient.prototype.fixAngle = function(param) {
      param = parseFloat(param);
      param = Math.abs(450 - param) % 360;
      param = this.roundFloat(param, 3);
      return "" + param + "deg";
    };

    Gradient.prototype.oldDirection = function(params) {
      var direction;
      if (params.length === 0) {
        params;
      }
      if (params[0].indexOf('to ') !== -1) {
        direction = params[0].replace(/^to\s+/, '');
        direction = this.oldDirections[direction];
        params[0] = direction;
        return params;
      } else {
        direction = this.oldDirections.bottom;
        return [direction].concat(params);
      }
    };

    Gradient.prototype.colorStops = function(params) {
      return params.map(function(param, i) {
        var color, match, position, _ref;
        if (i === 0) {
          return param;
        }
        _ref = list.space(param), color = _ref[0], position = _ref[1];
        if (position == null) {
          match = param.match(/^(.*\))(\d.*)$/);
          if (match) {
            color = match[1];
            position = match[2];
          }
        }
        if (position && position.indexOf(')') !== -1) {
          color += ' ' + position;
          position = void 0;
        }
        if (i === 1 && (position === void 0 || position === '0%')) {
          return "from(" + color + ")";
        } else if (i === params.length - 1 && (position === void 0 || position === '100%')) {
          return "to(" + color + ")";
        } else if (position) {
          return "color-stop(" + position + ", " + color + ")";
        } else {
          return "color-stop(" + color + ")";
        }
      });
    };

    Gradient.prototype.fixRadial = function(params) {
      var first;
      first = params[0].split(/\s+at\s+/);
      return params.splice(0, 1, first[1], first[0]);
    };

    Gradient.prototype.old = function(prefix) {
      var regexp, string, type;
      if (prefix === '-webkit-') {
        type = this.name === 'linear-gradient' ? 'linear' : 'radial';
        string = '-gradient';
        regexp = utils.regexp("-webkit-(" + type + "-gradient|gradient\\(\\s*" + type + ")", false);
        return new OldValue(prefix + this.name, string, regexp);
      } else {
        return Gradient.__super__.old.apply(this, arguments);
      }
    };

    return Gradient;

  })(Value);

  module.exports = Gradient;

}).call(this);

},{"../old-value":36,"../utils":42,"../value":43,"postcss/lib/list":87}],27:[function(require,module,exports){
(function() {
  var Declaration, JustifyContent, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  JustifyContent = (function(_super) {
    __extends(JustifyContent, _super);

    function JustifyContent() {
      return JustifyContent.__super__.constructor.apply(this, arguments);
    }

    JustifyContent.names = ['justify-content', 'flex-pack', 'box-pack'];

    JustifyContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    JustifyContent.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return prefix + 'box-pack';
      } else if (spec === 2012) {
        return prefix + 'flex-pack';
      } else {
        return JustifyContent.__super__.prefixed.apply(this, arguments);
      }
    };

    JustifyContent.prototype.normalize = function(prop) {
      return 'justify-content';
    };

    JustifyContent.prototype.set = function(decl, prefix) {
      var spec, value;
      spec = flexSpec(prefix)[0];
      if (spec === 2009 || spec === 2012) {
        value = JustifyContent.oldValues[decl.value] || decl.value;
        decl.value = value;
        if (spec !== 2009 || value !== 'distribute') {
          return JustifyContent.__super__.set.call(this, decl, prefix);
        }
      } else if (spec === 'final') {
        return JustifyContent.__super__.set.apply(this, arguments);
      }
    };

    return JustifyContent;

  })(Declaration);

  module.exports = JustifyContent;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],28:[function(require,module,exports){
(function() {
  var Declaration, Order, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  Order = (function(_super) {
    __extends(Order, _super);

    function Order() {
      return Order.__super__.constructor.apply(this, arguments);
    }

    Order.names = ['order', 'flex-order', 'box-ordinal-group'];

    Order.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2009) {
        return prefix + 'box-ordinal-group';
      } else if (spec === 2012) {
        return prefix + 'flex-order';
      } else {
        return Order.__super__.prefixed.apply(this, arguments);
      }
    };

    Order.prototype.normalize = function(prop) {
      return 'order';
    };

    Order.prototype.set = function(decl, prefix) {
      var spec;
      spec = flexSpec(prefix)[0];
      if (spec === 2009) {
        decl.value = (parseInt(decl.value) + 1).toString();
        return Order.__super__.set.call(this, decl, prefix);
      } else {
        return Order.__super__.set.apply(this, arguments);
      }
    };

    return Order;

  })(Declaration);

  module.exports = Order;

}).call(this);

},{"../declaration":5,"./flex-spec":22}],29:[function(require,module,exports){
(function() {
  var Placeholder, Selector,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Selector = require('../selector');

  Placeholder = (function(_super) {
    __extends(Placeholder, _super);

    function Placeholder() {
      return Placeholder.__super__.constructor.apply(this, arguments);
    }

    Placeholder.names = ['::placeholder'];

    Placeholder.prototype.possible = function() {
      return Placeholder.__super__.possible.apply(this, arguments).concat('-moz- old');
    };

    Placeholder.prototype.prefixed = function(prefix) {
      if ('-webkit-' === prefix) {
        return '::-webkit-input-placeholder';
      } else if ('-ms-' === prefix) {
        return ':-ms-input-placeholder';
      } else if ('-moz- old' === prefix) {
        return ':-moz-placeholder';
      } else {
        return "::" + prefix + "placeholder";
      }
    };

    return Placeholder;

  })(Selector);

  module.exports = Placeholder;

}).call(this);

},{"../selector":40}],30:[function(require,module,exports){
(function() {
  var Declaration, TransformDecl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  TransformDecl = (function(_super) {
    __extends(TransformDecl, _super);

    function TransformDecl() {
      return TransformDecl.__super__.constructor.apply(this, arguments);
    }

    TransformDecl.names = ['transform', 'transform-origin'];

    TransformDecl.functions3d = ['matrix3d', 'translate3d', 'translateZ', 'scale3d', 'scaleZ', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'perspective'];

    TransformDecl.prototype.keykrameParents = function(decl) {
      var parent;
      parent = decl.parent;
      while (parent) {
        if (parent.type === 'atrule' && parent.name === 'keyframes') {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    };

    TransformDecl.prototype.contain3d = function(decl) {
      var func, _i, _len, _ref;
      if (decl.prop === 'transform-origin') {
        return false;
      }
      _ref = TransformDecl.functions3d;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        if (decl.value.indexOf("" + func + "(") !== -1) {
          return true;
        }
      }
      return false;
    };

    TransformDecl.prototype.insert = function(decl, prefix, prefixes) {
      if (prefix === '-ms-') {
        if (!this.contain3d(decl) && !this.keykrameParents(decl)) {
          return TransformDecl.__super__.insert.apply(this, arguments);
        }
      } else if (prefix === '-o-') {
        if (!this.contain3d(decl)) {
          return TransformDecl.__super__.insert.apply(this, arguments);
        }
      } else {
        return TransformDecl.__super__.insert.apply(this, arguments);
      }
    };

    return TransformDecl;

  })(Declaration);

  module.exports = TransformDecl;

}).call(this);

},{"../declaration":5}],31:[function(require,module,exports){
(function() {
  var TransformValue, Value,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Value = require('../value');

  TransformValue = (function(_super) {
    __extends(TransformValue, _super);

    function TransformValue() {
      return TransformValue.__super__.constructor.apply(this, arguments);
    }

    TransformValue.names = ['transform'];

    TransformValue.prototype.replace = function(value, prefix) {
      if (prefix === '-ms-') {
        return value;
      } else {
        return TransformValue.__super__.replace.apply(this, arguments);
      }
    };

    return TransformValue;

  })(Value);

  module.exports = TransformValue;

}).call(this);

},{"../value":43}],32:[function(require,module,exports){
(function() {
  var OldValue, Transition, Value,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  Transition = (function(_super) {
    __extends(Transition, _super);

    function Transition() {
      return Transition.__super__.constructor.apply(this, arguments);
    }

    Transition.names = ['flex', 'flex-grow', 'flex-shrink', 'flex-basis'];

    Transition.prototype.prefixed = function(prefix) {
      return this.all.prefixed(this.name, prefix);
    };

    Transition.prototype.replace = function(string, prefix) {
      return string.replace(this.regexp(), '$1' + this.prefixed(prefix) + '$3');
    };

    Transition.prototype.old = function(prefix) {
      return new OldValue(this.prefixed(prefix));
    };

    return Transition;

  })(Value);

  module.exports = Transition;

}).call(this);

},{"../old-value":36,"../value":43}],33:[function(require,module,exports){
(function() {
  var capitalize, names, prefix;

  capitalize = function(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  names = {
    ie: 'IE',
    ie_mob: 'IE Mobile',
    ios_saf: 'iOS',
    op_mini: 'Opera Mini',
    op_mob: 'Opera Mobile',
    and_chr: 'Chrome for Android',
    and_ff: 'Firefox for Android'
  };

  prefix = function(name, transition, prefixes) {
    var out;
    out = '  ' + name + (transition ? '*' : '') + ': ';
    out += prefixes.map(function(i) {
      return i.replace(/^-(.*)-$/g, '$1');
    }).join(', ');
    out += "\n";
    return out;
  };

  module.exports = function(prefixes) {
    var atrules, browser, data, list, name, needTransition, out, props, selector, selectors, string, transitionProp, useTransition, value, values, version, versions, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    if (prefixes.browsers.selected.length === 0) {
      return "No browsers selected";
    }
    versions = [];
    _ref = prefixes.browsers.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      browser = _ref[_i];
      _ref1 = browser.split(' '), name = _ref1[0], version = _ref1[1];
      name = names[name] || capitalize(name);
      if (versions[name]) {
        versions[name].push(version);
      } else {
        versions[name] = [version];
      }
    }
    out = "Browsers:\n";
    for (browser in versions) {
      list = versions[browser];
      list = list.sort(function(a, b) {
        return parseFloat(b) - parseFloat(a);
      });
      out += '  ' + browser + ': ' + list.join(', ') + "\n";
    }
    atrules = '';
    _ref2 = prefixes.add;
    for (name in _ref2) {
      data = _ref2[name];
      if (name[0] === '@' && data.prefixes) {
        atrules += prefix(name, false, data.prefixes);
      }
    }
    if (atrules !== '') {
      out += "\nAt-Rules:\n" + atrules;
    }
    selectors = '';
    _ref3 = prefixes.add.selectors;
    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
      selector = _ref3[_j];
      if (selector.prefixes) {
        selectors += prefix(selector.name, false, selector.prefixes);
      }
    }
    if (selectors !== '') {
      out += "\nSelectors:\n" + selectors;
    }
    values = '';
    props = '';
    useTransition = false;
    needTransition = (_ref4 = prefixes.add.transition) != null ? _ref4.prefixes : void 0;
    _ref5 = prefixes.add;
    for (name in _ref5) {
      data = _ref5[name];
      if (name[0] !== '@' && data.prefixes) {
        transitionProp = needTransition && prefixes.data[name].transition;
        if (transitionProp) {
          useTransition = true;
        }
        props += prefix(name, transitionProp, data.prefixes);
      }
      if (!data.values) {
        continue;
      }
      if (prefixes.transitionProps.some(function(i) {
        return i === name;
      })) {
        continue;
      }
      _ref6 = data.values;
      for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
        value = _ref6[_k];
        string = prefix(value.name, false, value.prefixes);
        if (values.indexOf(string) === -1) {
          values += string;
        }
      }
    }
    if (useTransition) {
      props += "  * - can be used in transition\n";
    }
    if (props !== '') {
      out += "\nProperties:\n" + props;
    }
    if (values !== '') {
      out += "\nValues:\n" + values;
    }
    if (atrules === '' && selectors === '' && props === '' && values === '') {
      out += '\nAwesome! Your browsers don\'t require any vendor prefixes.' + '\nNow you can remove Autoprefixer from build steps.';
    }
    return out;
  };

}).call(this);

},{}],34:[function(require,module,exports){
(function() {
  var Keyframes, Prefixer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefixer = require('./prefixer');

  Keyframes = (function(_super) {
    __extends(Keyframes, _super);

    function Keyframes() {
      return Keyframes.__super__.constructor.apply(this, arguments);
    }

    Keyframes.prototype.add = function(atRule, prefix) {
      var already, cloned, prefixed;
      prefixed = prefix + atRule.name;
      already = atRule.parent.some(function(i) {
        return i.name === prefixed && i.params === atRule.params;
      });
      if (already) {
        return;
      }
      cloned = this.clone(atRule, {
        name: prefixed
      });
      return atRule.parent.insertBefore(atRule, cloned);
    };

    Keyframes.prototype.process = function(node) {
      var parent, prefix, _i, _len, _ref, _results;
      parent = this.parentPrefix(node);
      _ref = this.prefixes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        if (parent && parent !== prefix) {
          continue;
        }
        _results.push(this.add(node, prefix));
      }
      return _results;
    };

    return Keyframes;

  })(Prefixer);

  module.exports = Keyframes;

}).call(this);

},{"./prefixer":37}],35:[function(require,module,exports){
(function() {
  var OldSelector;

  OldSelector = (function() {
    function OldSelector(selector, prefix) {
      var _i, _len, _ref;
      this.prefix = prefix;
      this.prefixed = selector.prefixed(this.prefix);
      this.regexp = selector.regexp(this.prefix);
      this.prefixeds = [];
      _ref = selector.possible();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        this.prefixeds.push([selector.prefixed(prefix), selector.regexp(prefix)]);
      }
      this.unprefixed = selector.name;
      this.nameRegexp = selector.regexp();
    }

    OldSelector.prototype.isHack = function(rule) {
      var before, index, regexp, rules, some, string, _i, _len, _ref, _ref1;
      index = rule.parent.index(rule) + 1;
      rules = rule.parent.childs;
      while (index < rules.length) {
        before = rules[index].selector;
        if (!before) {
          return true;
        }
        if (before.indexOf(this.unprefixed) !== -1 && before.match(this.nameRegexp)) {
          return false;
        }
        some = false;
        _ref = this.prefixeds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], string = _ref1[0], regexp = _ref1[1];
          if (before.indexOf(string) !== -1 && before.match(regexp)) {
            some = true;
            break;
          }
        }
        if (!some) {
          return true;
        }
        index += 1;
      }
      return true;
    };

    OldSelector.prototype.check = function(rule) {
      if (rule.selector.indexOf(this.prefixed) === -1) {
        return false;
      }
      if (!rule.selector.match(this.regexp)) {
        return false;
      }
      if (this.isHack(rule)) {
        return false;
      }
      return true;
    };

    return OldSelector;

  })();

  module.exports = OldSelector;

}).call(this);

},{}],36:[function(require,module,exports){
(function() {
  var OldValue, utils;

  utils = require('./utils');

  OldValue = (function() {
    function OldValue(name, string, regexp) {
      this.name = name;
      this.string = string;
      this.regexp = regexp;
      this.regexp || (this.regexp = utils.regexp(this.name));
      this.string || (this.string = this.name);
    }

    OldValue.prototype.check = function(value) {
      if (value.indexOf(this.string) !== -1) {
        return !!value.match(this.regexp);
      } else {
        return false;
      }
    };

    return OldValue;

  })();

  module.exports = OldValue;

}).call(this);

},{"./utils":42}],37:[function(require,module,exports){
(function() {
  var Browsers, Prefixer, utils, vendor;

  Browsers = require('./browsers');

  vendor = require('postcss/lib/vendor');

  utils = require('./utils');

  Prefixer = (function() {
    Prefixer.hack = function(klass) {
      var name, _i, _len, _ref, _results;
      this.hacks || (this.hacks = {});
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Prefixer.load = function(name, prefixes, all) {
      var klass, _ref;
      klass = (_ref = this.hacks) != null ? _ref[name] : void 0;
      if (klass) {
        return new klass(name, prefixes, all);
      } else {
        return new this(name, prefixes, all);
      }
    };

    Prefixer.clone = function(node, overrides) {
      var cloned;
      cloned = node.clone(overrides);
      if (node.type === 'decl') {
        cloned.between = node.between;
      }
      delete cloned._autoprefixerPrefix;
      delete cloned._autoprefixerValues;
      return cloned;
    };

    function Prefixer(name, prefixes, all) {
      this.name = name;
      this.prefixes = prefixes;
      this.all = all;
    }

    Prefixer.prototype.parentPrefix = function(node) {
      var prefix;
      prefix = node._autoprefixerPrefix != null ? node._autoprefixerPrefix : node.type === 'decl' && node.prop[0] === '-' ? vendor.prefix(node.prop) : node.type === 'root' ? false : node.type === 'rule' && node.selector.indexOf(':-') !== -1 ? node.selector.match(/:(-\w+-)/)[1] : node.type === 'atrule' && node.name[0] === '-' ? vendor.prefix(node.name) : this.parentPrefix(node.parent);
      if (Browsers.prefixes().indexOf(prefix) === -1) {
        prefix = false;
      }
      return node._autoprefixerPrefix = prefix;
    };

    Prefixer.prototype.process = function(node) {
      var added, parent, prefix, prefixes, _i, _j, _len, _len1, _ref;
      if (!this.check(node)) {
        return;
      }
      parent = this.parentPrefix(node);
      prefixes = [];
      _ref = this.prefixes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        if (parent && parent !== utils.removeNote(prefix)) {
          continue;
        }
        prefixes.push(prefix);
      }
      added = [];
      for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
        prefix = prefixes[_j];
        if (this.add(node, prefix, added.concat([prefix]))) {
          added.push(prefix);
        }
      }
      return added;
    };

    Prefixer.prototype.clone = function(node, overrides) {
      return Prefixer.clone(node, overrides);
    };

    return Prefixer;

  })();

  module.exports = Prefixer;

}).call(this);

},{"./browsers":4,"./utils":42,"postcss/lib/vendor":98}],38:[function(require,module,exports){
(function() {
  var Browsers, Declaration, Keyframes, Prefixes, Processor, Selector, Supports, Value, declsCache, utils, vendor;

  utils = require('./utils');

  vendor = require('postcss/lib/vendor');

  Declaration = require('./declaration');

  Processor = require('./processor');

  Keyframes = require('./keyframes');

  Supports = require('./supports');

  Browsers = require('./browsers');

  Selector = require('./selector');

  Value = require('./value');

  Selector.hack(require('./hacks/fullscreen'));

  Selector.hack(require('./hacks/placeholder'));

  Declaration.hack(require('./hacks/flex'));

  Declaration.hack(require('./hacks/order'));

  Declaration.hack(require('./hacks/filter'));

  Declaration.hack(require('./hacks/flex-flow'));

  Declaration.hack(require('./hacks/flex-grow'));

  Declaration.hack(require('./hacks/flex-wrap'));

  Declaration.hack(require('./hacks/align-self'));

  Declaration.hack(require('./hacks/flex-basis'));

  Declaration.hack(require('./hacks/align-items'));

  Declaration.hack(require('./hacks/flex-shrink'));

  Declaration.hack(require('./hacks/break-inside'));

  Declaration.hack(require('./hacks/border-image'));

  Declaration.hack(require('./hacks/align-content'));

  Declaration.hack(require('./hacks/border-radius'));

  Declaration.hack(require('./hacks/transform-decl'));

  Declaration.hack(require('./hacks/flex-direction'));

  Declaration.hack(require('./hacks/justify-content'));

  Declaration.hack(require('./hacks/background-size'));

  Value.hack(require('./hacks/gradient'));

  Value.hack(require('./hacks/transition'));

  Value.hack(require('./hacks/display-flex'));

  Value.hack(require('./hacks/filter-value'));

  Value.hack(require('./hacks/fill-available'));

  Value.hack(require('./hacks/transform-value'));

  declsCache = {};

  Prefixes = (function() {
    function Prefixes(data, browsers, options) {
      var _ref;
      this.data = data;
      this.browsers = browsers;
      this.options = options != null ? options : {};
      _ref = this.preprocess(this.select(this.data)), this.add = _ref[0], this.remove = _ref[1];
      this.processor = new Processor(this);
    }

    Prefixes.prototype.transitionProps = ['transition', 'transition-property'];

    Prefixes.prototype.cleaner = function() {
      var empty;
      if (!this.cleanerCache) {
        if (this.browsers.selected.length) {
          empty = new Browsers(this.browsers.data, []);
          this.cleanerCache = new Prefixes(this.data, empty, this.options);
        } else {
          return this;
        }
      }
      return this.cleanerCache;
    };

    Prefixes.prototype.select = function(list) {
      var add, all, data, name, notes, selected;
      selected = {
        add: {},
        remove: {}
      };
      for (name in list) {
        data = list[name];
        add = data.browsers.map(function(i) {
          var params;
          params = i.split(' ');
          return {
            browser: params[0] + ' ' + params[1],
            note: params[2]
          };
        });
        notes = add.filter(function(i) {
          return i.note;
        }).map((function(_this) {
          return function(i) {
            return _this.browsers.prefix(i.browser) + ' ' + i.note;
          };
        })(this));
        notes = utils.uniq(notes);
        add = add.filter((function(_this) {
          return function(i) {
            return _this.browsers.isSelected(i.browser);
          };
        })(this)).map((function(_this) {
          return function(i) {
            var prefix;
            prefix = _this.browsers.prefix(i.browser);
            if (i.note) {
              return prefix + ' ' + i.note;
            } else {
              return prefix;
            }
          };
        })(this));
        add = this.sort(utils.uniq(add));
        all = data.browsers.map((function(_this) {
          return function(i) {
            return _this.browsers.prefix(i);
          };
        })(this));
        if (data.mistakes) {
          all = all.concat(data.mistakes);
        }
        all = all.concat(notes);
        all = utils.uniq(all);
        if (add.length) {
          selected.add[name] = add;
          if (add.length < all.length) {
            selected.remove[name] = all.filter(function(i) {
              return add.indexOf(i) === -1;
            });
          }
        } else {
          selected.remove[name] = all;
        }
      }
      return selected;
    };

    Prefixes.prototype.sort = function(prefixes) {
      return prefixes.sort(function(a, b) {
        var aLength, bLength;
        aLength = utils.removeNote(a).length;
        bLength = utils.removeNote(b).length;
        if (aLength === bLength) {
          return b.length - a.length;
        } else {
          return bLength - aLength;
        }
      });
    };

    Prefixes.prototype.preprocess = function(selected) {
      var add, name, old, olds, prefix, prefixed, prefixes, prop, props, remove, selector, value, values, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref, _ref1, _ref2;
      add = {
        selectors: [],
        '@supports': new Supports(this)
      };
      _ref = selected.add;
      for (name in _ref) {
        prefixes = _ref[name];
        if (name === '@keyframes') {
          add[name] = new Keyframes(name, prefixes, this);
        } else if (this.data[name].selector) {
          add.selectors.push(Selector.load(name, prefixes, this));
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name, prefixes, this);
            for (_i = 0, _len = props.length; _i < _len; _i++) {
              prop = props[_i];
              if (!add[prop]) {
                add[prop] = {
                  values: []
                };
              }
              add[prop].values.push(value);
            }
          }
          if (!this.data[name].props) {
            values = ((_ref1 = add[name]) != null ? _ref1.values : void 0) || [];
            add[name] = Declaration.load(name, prefixes, this);
            add[name].values = values;
          }
        }
      }
      remove = {
        selectors: []
      };
      _ref2 = selected.remove;
      for (name in _ref2) {
        prefixes = _ref2[name];
        if (this.data[name].selector) {
          selector = Selector.load(name, prefixes);
          for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
            prefix = prefixes[_j];
            remove.selectors.push(selector.old(prefix));
          }
        } else if (name[0] === '@') {
          for (_k = 0, _len2 = prefixes.length; _k < _len2; _k++) {
            prefix = prefixes[_k];
            prefixed = '@' + prefix + name.slice(1);
            remove[prefixed] = {
              remove: true
            };
          }
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name, [], this);
            for (_l = 0, _len3 = prefixes.length; _l < _len3; _l++) {
              prefix = prefixes[_l];
              old = value.old(prefix);
              if (old) {
                for (_m = 0, _len4 = props.length; _m < _len4; _m++) {
                  prop = props[_m];
                  if (!remove[prop]) {
                    remove[prop] = {};
                  }
                  if (!remove[prop].values) {
                    remove[prop].values = [];
                  }
                  remove[prop].values.push(old);
                }
              }
            }
          }
          if (!this.data[name].props) {
            for (_n = 0, _len5 = prefixes.length; _n < _len5; _n++) {
              prefix = prefixes[_n];
              prop = vendor.unprefixed(name);
              olds = this.decl(name).old(name, prefix);
              for (_o = 0, _len6 = olds.length; _o < _len6; _o++) {
                prefixed = olds[_o];
                if (!remove[prefixed]) {
                  remove[prefixed] = {};
                }
                remove[prefixed].remove = true;
              }
            }
          }
        }
      }
      return [add, remove];
    };

    Prefixes.prototype.decl = function(prop) {
      var decl;
      decl = declsCache[prop];
      if (decl) {
        return decl;
      } else {
        return declsCache[prop] = Declaration.load(prop);
      }
    };

    Prefixes.prototype.unprefixed = function(prop) {
      prop = vendor.unprefixed(prop);
      return this.decl(prop).normalize(prop);
    };

    Prefixes.prototype.prefixed = function(prop, prefix) {
      prop = vendor.unprefixed(prop);
      return this.decl(prop).prefixed(prop, prefix);
    };

    Prefixes.prototype.values = function(type, prop) {
      var data, global, values, _ref, _ref1;
      data = this[type];
      global = (_ref = data['*']) != null ? _ref.values : void 0;
      values = (_ref1 = data[prop]) != null ? _ref1.values : void 0;
      if (global && values) {
        return utils.uniq(global.concat(values));
      } else {
        return global || values || [];
      }
    };

    Prefixes.prototype.group = function(decl) {
      var checker, index, length, rule, unprefixed;
      rule = decl.parent;
      index = rule.index(decl);
      length = rule.childs.length;
      unprefixed = this.unprefixed(decl.prop);
      checker = (function(_this) {
        return function(step, callback) {
          var other;
          index += step;
          while (index >= 0 && index < length) {
            other = rule.childs[index];
            if (other.type === 'decl') {
              if (step === -1 && other.prop === unprefixed) {
                if (!Browsers.withPrefix(other.value)) {
                  break;
                }
              }
              if (_this.unprefixed(other.prop) !== unprefixed) {
                break;
              } else if (callback(other) === true) {
                return true;
              }
              if (step === +1 && other.prop === unprefixed) {
                if (!Browsers.withPrefix(other.value)) {
                  break;
                }
              }
            }
            index += step;
          }
          return false;
        };
      })(this);
      return {
        up: function(callback) {
          return checker(-1, callback);
        },
        down: function(callback) {
          return checker(+1, callback);
        }
      };
    };

    return Prefixes;

  })();

  module.exports = Prefixes;

}).call(this);

},{"./browsers":4,"./declaration":5,"./hacks/align-content":6,"./hacks/align-items":7,"./hacks/align-self":8,"./hacks/background-size":9,"./hacks/border-image":10,"./hacks/border-radius":11,"./hacks/break-inside":12,"./hacks/display-flex":13,"./hacks/fill-available":14,"./hacks/filter":16,"./hacks/filter-value":15,"./hacks/flex":24,"./hacks/flex-basis":17,"./hacks/flex-direction":18,"./hacks/flex-flow":19,"./hacks/flex-grow":20,"./hacks/flex-shrink":21,"./hacks/flex-wrap":23,"./hacks/fullscreen":25,"./hacks/gradient":26,"./hacks/justify-content":27,"./hacks/order":28,"./hacks/placeholder":29,"./hacks/transform-decl":30,"./hacks/transform-value":31,"./hacks/transition":32,"./keyframes":34,"./processor":39,"./selector":40,"./supports":41,"./utils":42,"./value":43,"postcss/lib/vendor":98}],39:[function(require,module,exports){
(function() {
  var Processor, Value, utils, vendor;

  vendor = require('postcss/lib/vendor');

  Value = require('./value');

  utils = require('./utils');

  Processor = (function() {
    function Processor(prefixes) {
      this.prefixes = prefixes;
    }

    Processor.prototype.add = function(css) {
      var keyframes, supports;
      keyframes = this.prefixes.add['@keyframes'];
      supports = this.prefixes.add['@supports'];
      css.eachAtRule((function(_this) {
        return function(rule) {
          if (rule.name === 'keyframes') {
            if (!_this.disabled(rule)) {
              return keyframes != null ? keyframes.process(rule) : void 0;
            }
          } else if (rule.name === 'supports') {
            if (!_this.disabled(rule)) {
              return supports.process(rule);
            }
          }
        };
      })(this));
      css.eachRule((function(_this) {
        return function(rule) {
          var selector, _i, _len, _ref, _results;
          if (_this.disabled(rule)) {
            return;
          }
          _ref = _this.prefixes.add.selectors;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            selector = _ref[_i];
            _results.push(selector.process(rule));
          }
          return _results;
        };
      })(this));
      css.eachDecl((function(_this) {
        return function(decl) {
          var prefix;
          prefix = _this.prefixes.add[decl.prop];
          if (prefix && prefix.prefixes) {
            if (!_this.disabled(decl)) {
              return prefix.process(decl);
            }
          }
        };
      })(this));
      return css.eachDecl((function(_this) {
        return function(decl) {
          var unprefixed, value, _i, _len, _ref;
          if (_this.disabled(decl)) {
            return;
          }
          unprefixed = _this.prefixes.unprefixed(decl.prop);
          _ref = _this.prefixes.values('add', unprefixed);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            value = _ref[_i];
            value.process(decl);
          }
          return Value.save(_this.prefixes, decl);
        };
      })(this));
    };

    Processor.prototype.remove = function(css) {
      var checker, _i, _len, _ref;
      css.eachAtRule((function(_this) {
        return function(rule, i) {
          if (_this.prefixes.remove['@' + rule.name]) {
            if (!_this.disabled(rule)) {
              return rule.parent.remove(i);
            }
          }
        };
      })(this));
      _ref = this.prefixes.remove.selectors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        checker = _ref[_i];
        css.eachRule((function(_this) {
          return function(rule, i) {
            if (checker.check(rule)) {
              if (!_this.disabled(rule)) {
                return rule.parent.remove(i);
              }
            }
          };
        })(this));
      }
      return css.eachDecl((function(_this) {
        return function(decl, i) {
          var notHack, rule, unprefixed, _j, _len1, _ref1, _ref2;
          if (_this.disabled(decl)) {
            return;
          }
          rule = decl.parent;
          unprefixed = _this.prefixes.unprefixed(decl.prop);
          if ((_ref1 = _this.prefixes.remove[decl.prop]) != null ? _ref1.remove : void 0) {
            notHack = _this.prefixes.group(decl).down(function(other) {
              return other.prop === unprefixed;
            });
            if (notHack) {
              if (decl.before.indexOf("\n") > -1) {
                _this.reduceSpaces(decl);
              }
              rule.remove(i);
              return;
            }
          }
          _ref2 = _this.prefixes.values('remove', unprefixed);
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            checker = _ref2[_j];
            if (checker.check(decl.value)) {
              rule.remove(i);
              return;
            }
          }
        };
      })(this));
    };

    Processor.prototype.disabled = function(node) {
      var status;
      if (node._autoprefixerDisabled != null) {
        return node._autoprefixerDisabled;
      } else if (node.childs) {
        status = void 0;
        node.each(function(i) {
          if (i.type !== 'comment') {
            return;
          }
          if (i.text === 'autoprefixer: off') {
            status = false;
            return false;
          } else if (i.text === 'autoprefixer: on') {
            status = true;
            return false;
          }
        });
        return node._autoprefixerDisabled = status != null ? !status : node.parent ? this.disabled(node.parent) : false;
      } else {
        return node._autoprefixerDisabled = this.disabled(node.parent);
      }
    };

    Processor.prototype.reduceSpaces = function(decl) {
      var diff, parts, prevMin, stop;
      stop = false;
      this.prefixes.group(decl).up(function(other) {
        return stop = true;
      });
      if (stop) {
        return;
      }
      parts = decl.before.split("\n");
      prevMin = parts[parts.length - 1].length;
      diff = false;
      return this.prefixes.group(decl).down(function(other) {
        var last;
        parts = other.before.split("\n");
        last = parts.length - 1;
        if (parts[last].length > prevMin) {
          if (diff === false) {
            diff = parts[last].length - prevMin;
          }
          parts[last] = parts[last].slice(0, -diff);
          return other.before = parts.join("\n");
        }
      });
    };

    return Processor;

  })();

  module.exports = Processor;

}).call(this);

},{"./utils":42,"./value":43,"postcss/lib/vendor":98}],40:[function(require,module,exports){
(function() {
  var Browsers, OldSelector, Prefixer, Selector, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldSelector = require('./old-selector');

  Prefixer = require('./prefixer');

  Browsers = require('./browsers');

  utils = require('./utils');

  Selector = (function(_super) {
    __extends(Selector, _super);

    function Selector(name, prefixes, all) {
      this.name = name;
      this.prefixes = prefixes;
      this.all = all;
      this.regexpCache = {};
    }

    Selector.prototype.check = function(rule) {
      if (rule.selector.indexOf(this.name) !== -1) {
        return !!rule.selector.match(this.regexp());
      } else {
        return false;
      }
    };

    Selector.prototype.prefixed = function(prefix) {
      return this.name.replace(/^([^\w]*)/, '$1' + prefix);
    };

    Selector.prototype.regexp = function(prefix) {
      var name;
      if (this.regexpCache[prefix]) {
        return this.regexpCache[prefix];
      }
      name = prefix ? this.prefixed(prefix) : this.name;
      return this.regexpCache[prefix] = RegExp("(^|[^:\"'=])" + (utils.escapeRegexp(name)), "gi");
    };

    Selector.prototype.possible = function() {
      return Browsers.prefixes();
    };

    Selector.prototype.prefixeds = function(rule) {
      var prefix, prefixeds, _i, _len, _ref;
      if (rule._autoprefixerPrefixeds) {
        return rule._autoprefixerPrefixeds;
      }
      prefixeds = {};
      _ref = this.possible();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        prefixeds[prefix] = this.replace(rule.selector, prefix);
      }
      return rule._autoprefixerPrefixeds = prefixeds;
    };

    Selector.prototype.already = function(rule, prefixeds, prefix) {
      var before, index, key, prefixed, some;
      index = rule.parent.index(rule) - 1;
      while (index >= 0) {
        before = rule.parent.childs[index];
        if (before.type !== 'rule') {
          return false;
        }
        some = false;
        for (key in prefixeds) {
          prefixed = prefixeds[key];
          if (before.selector === prefixed) {
            if (prefix === key) {
              return true;
            } else {
              some = true;
              break;
            }
          }
        }
        if (!some) {
          return false;
        }
        index -= 1;
      }
      return false;
    };

    Selector.prototype.replace = function(selector, prefix) {
      return selector.replace(this.regexp(), '$1' + this.prefixed(prefix));
    };

    Selector.prototype.add = function(rule, prefix) {
      var cloned, prefixeds;
      prefixeds = this.prefixeds(rule);
      if (this.already(rule, prefixeds, prefix)) {
        return;
      }
      cloned = this.clone(rule, {
        selector: prefixeds[prefix]
      });
      return rule.parent.insertBefore(rule, cloned);
    };

    Selector.prototype.old = function(prefix) {
      return new OldSelector(this, prefix);
    };

    return Selector;

  })(Prefixer);

  module.exports = Selector;

}).call(this);

},{"./browsers":4,"./old-selector":35,"./prefixer":37,"./utils":42}],41:[function(require,module,exports){
(function() {
  var Prefixes, Supports, Value, findCondition, findDecl, list, postcss, split, utils;

  Prefixes = require('./prefixes');

  Value = require('./value');

  utils = require('./utils');

  postcss = require('postcss');

  list = require('postcss/lib/list');

  split = /\(\s*([^\(\):]+)\s*:([^\)]+)/;

  findDecl = /\(\s*([^\(\):]+)\s*:\s*(.+)\s*\)/g;

  findCondition = /(not\s*)?\(\s*([^\(\):]+)\s*:\s*(.+?(?!\s*or\s*).+?)\s*\)*\s*\)\s*or\s*/gi;

  Supports = (function() {
    function Supports(all) {
      this.all = all;
    }

    Supports.prototype.virtual = function(prop, value) {
      var rule;
      rule = postcss.parse('a{}').first;
      rule.append({
        prop: prop,
        value: value,
        before: ''
      });
      return rule;
    };

    Supports.prototype.prefixed = function(prop, value) {
      var decl, prefixer, rule, _i, _j, _len, _len1, _ref, _ref1;
      rule = this.virtual(prop, value);
      prefixer = this.all.add[prop];
      if (prefixer != null) {
        if (typeof prefixer.process === "function") {
          prefixer.process(rule.first);
        }
      }
      _ref = rule.childs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        decl = _ref[_i];
        _ref1 = this.all.values('add', prop);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          value = _ref1[_j];
          value.process(decl);
        }
        Value.save(this.all, decl);
      }
      return rule.childs;
    };

    Supports.prototype.clean = function(params) {
      return params.replace(findCondition, (function(_this) {
        return function(all) {
          var check, checker, prop, unprefixed, value, _, _i, _len, _ref, _ref1, _ref2;
          if (all.slice(0, 3).toLowerCase() === 'not') {
            return all;
          }
          _ref = all.match(split), _ = _ref[0], prop = _ref[1], value = _ref[2];
          unprefixed = _this.all.unprefixed(prop);
          if ((_ref1 = _this.all.cleaner().remove[prop]) != null ? _ref1.remove : void 0) {
            check = new RegExp('(\\(|\\s)' + utils.escapeRegexp(unprefixed) + ':');
            if (check.test(params)) {
              return '';
            }
          }
          _ref2 = _this.all.cleaner().values('remove', unprefixed);
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            checker = _ref2[_i];
            if (checker.check(value)) {
              return '';
            }
          }
          return all;
        };
      })(this)).replace(/\(\s*\((.*)\)\s*\)/g, '($1)');
    };

    Supports.prototype.process = function(rule) {
      rule.params = this.clean(rule.params);
      return rule.params = rule.params.replace(findDecl, (function(_this) {
        return function(all, prop, value) {
          var i, stringed;
          stringed = (function() {
            var _i, _len, _ref, _results;
            _ref = this.prefixed(prop, value);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push("(" + i.prop + ": " + i.value + ")");
            }
            return _results;
          }).call(_this);
          if (stringed.length === 1) {
            return stringed[0];
          } else {
            return '(' + stringed.join(' or ') + ')';
          }
        };
      })(this));
    };

    return Supports;

  })();

  module.exports = Supports;

}).call(this);

},{"./prefixes":38,"./utils":42,"./value":43,"postcss":92,"postcss/lib/list":87}],42:[function(require,module,exports){
(function() {
  module.exports = {
    error: function(text) {
      var err;
      err = new Error(text);
      err.autoprefixer = true;
      throw err;
    },
    uniq: function(array) {
      var filtered, i, _i, _len;
      filtered = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        i = array[_i];
        if (filtered.indexOf(i) === -1) {
          filtered.push(i);
        }
      }
      return filtered;
    },
    removeNote: function(string) {
      if (string.indexOf(' ') === -1) {
        return string;
      } else {
        return string.split(' ')[0];
      }
    },
    escapeRegexp: function(string) {
      return string.replace(/[.?*+\^\$\[\]\\(){}|\-]/g, '\\$&');
    },
    regexp: function(word, escape) {
      if (escape == null) {
        escape = true;
      }
      if (escape) {
        word = this.escapeRegexp(word);
      }
      return RegExp("(^|[\\s,(])(" + word + "($|[\\s(,]))", "gi");
    }
  };

}).call(this);

},{}],43:[function(require,module,exports){
(function() {
  var OldValue, Prefixer, Value, utils, vendor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Prefixer = require('./prefixer');

  OldValue = require('./old-value');

  utils = require('./utils');

  vendor = require('postcss/lib/vendor');

  Value = (function(_super) {
    __extends(Value, _super);

    function Value() {
      return Value.__super__.constructor.apply(this, arguments);
    }

    Value.save = function(prefixes, decl) {
      var already, cloned, prefix, prefixed, propPrefix, rule, trimmed, value, _ref, _results;
      _ref = decl._autoprefixerValues;
      _results = [];
      for (prefix in _ref) {
        value = _ref[prefix];
        if (value === decl.value) {
          continue;
        }
        propPrefix = vendor.prefix(decl.prop);
        if (propPrefix === prefix) {
          _results.push(decl.value = value);
        } else if (propPrefix === '-pie-') {
          continue;
        } else {
          prefixed = prefixes.prefixed(decl.prop, prefix);
          rule = decl.parent;
          if (rule.every(function(i) {
            return i.prop !== prefixed;
          })) {
            trimmed = value.replace(/\s+/, ' ');
            already = rule.some(function(i) {
              return i.prop === decl.prop && i.value.replace(/\s+/, ' ') === trimmed;
            });
            if (!already) {
              cloned = this.clone(decl, {
                value: value
              });
              _results.push(decl.parent.insertBefore(decl, cloned));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    };

    Value.prototype.check = function(decl) {
      var value;
      value = decl.value;
      if (value.indexOf(this.name) !== -1) {
        return !!value.match(this.regexp());
      } else {
        return false;
      }
    };

    Value.prototype.regexp = function() {
      return this.regexpCache || (this.regexpCache = utils.regexp(this.name));
    };

    Value.prototype.replace = function(string, prefix) {
      return string.replace(this.regexp(), '$1' + prefix + '$2');
    };

    Value.prototype.add = function(decl, prefix) {
      var value, _ref;
      decl._autoprefixerValues || (decl._autoprefixerValues = {});
      value = decl._autoprefixerValues[prefix] || ((_ref = decl._value) != null ? _ref.raw : void 0) || decl.value;
      value = this.replace(value, prefix);
      if (value) {
        return decl._autoprefixerValues[prefix] = value;
      }
    };

    Value.prototype.old = function(prefix) {
      return new OldValue(prefix + this.name);
    };

    return Value;

  })(Prefixer);

  module.exports = Value;

}).call(this);

},{"./old-value":36,"./prefixer":37,"./utils":42,"postcss/lib/vendor":98}],44:[function(require,module,exports){

},{}],45:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (this.length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start) throw new TypeError('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new TypeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new TypeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":46,"ieee754":47,"is-array":48}],46:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],47:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],48:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],49:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":50}],50:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],51:[function(require,module,exports){
module.exports={"eras":{"e-35":"35 versions back","e-34":"34 versions back","e-33":"33 versions back","e-32":"32 versions back","e-31":"31 versions back","e-30":"30 versions back","e-29":"29 versions back","e-28":"28 versions back","e-27":"27 versions back","e-26":"26 versions back","e-25":"25 versions back","e-24":"24 versions back","e-23":"23 versions back","e-22":"22 versions back","e-21":"21 versions back","e-20":"20 versions back","e-19":"19 versions back","e-18":"18 versions back","e-17":"17 versions back","e-16":"16 versions back","e-15":"15 versions back","e-14":"14 versions back","e-13":"13 versions back","e-12":"12 versions back","e-11":"11 versions back","e-10":"10 versions back","e-9":"9 versions back","e-8":"8 versions back","e-7":"7 versions back","e-6":"6 versions back","e-5":"5 versions back","e-4":"4 versions back","e-3":"3 versions back","e-2":"2 versions back","e-1":"Previous version","e0":"Current","e1":"Near future","e2":"Farther future","e3":"3 versions ahead"},"agents":{"ie":{"browser":"IE","abbr":"IE","prefix":"ms","type":"desktop","usage_global":{"5.5":0.009298,"6":0.147553,"7":0.0772897,"8":3.18293,"9":2.12898,"10":2.01656,"11":7.39873},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"5.5","6","7","8","9","10","11",null,null,null]},"firefox":{"browser":"Firefox","abbr":"FF","prefix":"moz","type":"desktop","usage_global":{"2":0.013434,"3":0.053736,"3.5":0.013434,"3.6":0.094038,"4":0.026868,"5":0.013434,"6":0.013434,"7":0.013434,"8":0.040302,"9":0.020151,"10":0.033585,"11":0.033585,"12":0.073887,"13":0.026868,"14":0.033585,"15":0.047019,"16":0.060453,"17":0.047019,"18":0.040302,"19":0.033585,"20":0.040302,"21":0.047019,"22":0.040302,"23":0.053736,"24":0.13434,"25":0.073887,"26":0.080604,"27":0.120906,"28":0.080604,"29":0.13434,"30":0.288831,"31":0.577662,"32":8.23504,"33":1.79344,"34":0.120906,"35":0.006717,"36":0},"versions":[null,null,"2","3","3.5","3.6","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"]},"chrome":{"browser":"Chrome","abbr":"Chr.","prefix":"webkit","type":"desktop","usage_global":{"4":0.013434,"5":0.013434,"6":0.020151,"7":0.013434,"8":0.013434,"9":0.006717,"10":0.020151,"11":0.107472,"12":0.033585,"13":0.026868,"14":0.020151,"15":0.026868,"16":0.020151,"17":0.013434,"18":0.033585,"19":0.020151,"20":0.020151,"21":0.167925,"22":0.094038,"23":0.033585,"24":0.053736,"25":0.040302,"26":0.06717,"27":0.087321,"28":0.080604,"29":0.20151,"30":0.161208,"31":0.698568,"32":0.221661,"33":0.651549,"34":0.476907,"35":0.926946,"36":1.27623,"37":15.7312,"38":12.3929,"39":0.13434,"40":0.120906,"41":0,"42":0},"versions":["4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42"]},"safari":{"browser":"Safari","abbr":"Saf.","prefix":"webkit","type":"desktop","usage_global":{"3.1":0,"3.2":0.008692,"4":0.080604,"5":0.154491,"5.1":0.503775,"6":0.147774,"6.1":0.396303,"7":0.987399,"7.1":0.759021,"8":0.308982},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"3.1","3.2","4","5","5.1","6","6.1","7","7.1","8",null,null,null]},"opera":{"browser":"Opera","abbr":"Op.","prefix":"webkit","type":"desktop","usage_global":{"9.5-9.6":0.00685,"10.0-10.1":0.020151,"10.5":0.008392,"10.6":0.007296,"11":0.014996,"11.1":0.008219,"11.5":0.00685,"11.6":0.013434,"12":0.013434,"12.1":0.174642,"15":0.00685,"16":0.00685,"17":0.00685,"18":0.013434,"19":0.006717,"20":0.020151,"21":0.013434,"22":0.013434,"23":0.013434,"24":0.295548,"25":0.295548,"26":0,"27":0},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"9.5-9.6","10.0-10.1","10.5","10.6","11","11.1","11.5","11.6","12","12.1","15","16","17","18","19","20","21","22","23","24","25","26","27",null],"prefix_exceptions":{"9.5-9.6":"o","10.0-10.1":"o","10.5":"o","10.6":"o","11":"o","11.1":"o","11.5":"o","11.6":"o","12":"o","12.1":"o"}},"ios_saf":{"browser":"iOS Safari","abbr":"iOS","prefix":"webkit","type":"mobile","usage_global":{"3.2":0,"4.0-4.1":0,"4.2-4.3":0,"5.0-5.1":0.0579149,"6.0-6.1":0.25979,"7.0-7.1":3.59321,"8":3.15802,"8.1":1.15499},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"3.2","4.0-4.1","4.2-4.3","5.0-5.1","6.0-6.1","7.0-7.1","8","8.1",null,null,null]},"op_mini":{"browser":"Opera Mini","abbr":"O.Mini","prefix":"o","type":"mobile","usage_global":{"5.0-8.0":2.81805},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"5.0-8.0",null,null,null]},"android":{"browser":"Android Browser","abbr":"And.","prefix":"webkit","type":"mobile","usage_global":{"2.1":0,"2.2":0.00831376,"2.3":0.191216,"3":0.00623532,"4":0.421923,"4.1":1.24152,"4.2-4.3":1.8602,"4.4":2.36873,"4.4.3-4.4.4":0.773179,"37":0},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"2.1","2.2","2.3","3","4","4.1","4.2-4.3","4.4","4.4.3-4.4.4","37",null,null]},"op_mob":{"browser":"Opera Mobile","abbr":"O.Mob","prefix":"o","type":"mobile","usage_global":{"10":0,"11.5":0,"12":0.00813289,"12.1":0.036598,"24":0},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"10",null,null,"11.5","12","12.1","24",null,null,null],"prefix_exceptions":{"24":"webkit"}},"bb":{"browser":"Blackberry Browser","abbr":"BB","prefix":"webkit","type":"mobile","usage_global":{"7":0.0878202,"10":0},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"7","10",null,null,null]},"and_chr":{"browser":"Chrome for Android","abbr":"Chr/And.","prefix":"webkit","type":"mobile","usage_global":{"38":9.5135},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"38",null,null,null]},"and_ff":{"browser":"Firefox for Android","abbr":"FF/And.","prefix":"moz","type":"mobile","usage_global":{"32":0.154301},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"32",null,null,null]},"ie_mob":{"browser":"IE Mobile","abbr":"IE.Mob","prefix":"ms","type":"mobile","usage_global":{"10":0.458602,"11":0},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"10","11",null,null,null]},"and_uc":{"browser":"UC Browser for Android","abbr":"UC","prefix":"webkit","type":"mobile","usage_global":{"9.9":2.86934},"versions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"9.9",null,null,null],"prefix_exceptions":{"9.9":"webkit"}}},"statuses":{"rec":"Recommendation","pr":"Proposed Recommendation","cr":"Candidate Recommendation","wd":"Working Draft","other":"Other","unoff":"Unofficial / Note"},"cats":{"CSS":["CSS","CSS2","CSS3"],"HTML5":["Canvas","HTML5"],"JS API":["JS API"],"Other":["PNG","Other","DOM"],"SVG":["SVG"]},"updated":1416467220,"data":{"png-alpha":{"title":"PNG alpha transparency","description":"Semi-transparent areas in PNG files","spec":"http://www.w3.org/TR/PNG/","status":"rec","links":[{"url":"http://en.wikipedia.org/wiki/Portable_Network_Graphics","title":"Wikipedia"},{"url":"http://dillerdesign.com/experiment/DD_belatedPNG/","title":"Workaround for IE6"}],"categories":["PNG"],"stats":{"ie":{"5.5":"n","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"IE6 does support full transparency in 8-bit PNGs, which can sometimes be an alternative to 24-bit PNGs.","notes_by_num":{},"usage_perc_y":96.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"apng":{"title":"Animated PNG (APNG)","description":"Like animated GIFs, but allowing 24-bit colors and alpha transparency","spec":"https://wiki.mozilla.org/APNG_Specification","status":"unoff","links":[{"url":"http://en.wikipedia.org/wiki/APNG","title":"Wikipedia"},{"url":"https://github.com/davidmz/apng-canvas","title":"Polyfill using canvas"},{"url":"https://chrome.google.com/webstore/detail/ehkepjiconegkhpodgoaeamnpckdbblp","title":"Chrome extension providing support"}],"categories":["PNG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Where support for APNG is missing, only the first frame is displayed","notes_by_num":{},"usage_perc_y":17.64,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"video":{"title":"Video element","description":"Method of playing videos on webpages (without requiring a plug-in)","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#the-video-element","status":"cr","links":[{"url":"https://dev.opera.com/articles/view/everything-you-need-to-know-about-html5-video-and-audio/","title":"Detailed article on video/audio elements"},{"url":"http://webmproject.org","title":"WebM format information"},{"url":"http://camendesign.co.uk/code/video_for_everybody","title":"Video for Everybody"},{"url":"http://diveintohtml5.info/video.html","title":"Video on the Web - includes info on Android support"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/video.js#video","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/video","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Different browsers have support for different video formats, see sub-features for details. \r\n\r\nThe Android browser (before 2.3) requires [specific handling](http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/) to run the video element.","notes_by_num":{},"usage_perc_y":90.57,"usage_perc_a":0.01,"ucprefix":false,"parent":"","keywords":"<video>","ie_id":"","chrome_id":""},"audio":{"title":"Audio element","description":"Method of playing sound on webpages (without requiring a plug-in)","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#the-audio-element","status":"cr","links":[{"url":"http://html5doctor.com/native-audio-in-the-browser/","title":"HTML5 Doctor article"},{"url":"https://dev.opera.com/articles/view/everything-you-need-to-know-about-html5-video-and-audio/","title":"Detailed article on video/audio elements"},{"url":"http://www.jplayer.org/latest/demos/","title":"Demos of audio player that uses the audio element"},{"url":"http://24ways.org/2010/the-state-of-html5-audio","title":"Detailed article on support"},{"url":"http://textopia.org/androidsoundformats.html","title":"File format test page"},{"url":"http://www.phoboslab.org/log/2011/03/the-state-of-html5-audio","title":"The State of HTML5 Audio"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/audio.js#audio","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/audio","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"a","10.0-10.1":"a","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":90.57,"usage_perc_a":0.03,"ucprefix":false,"parent":"","keywords":"<audio>","ie_id":"","chrome_id":""},"contenteditable":{"title":"contenteditable attribute (basic support)","description":"Method of making any HTML element editable","spec":"http://www.w3.org/TR/html/editing.html#contenteditable","status":"cr","links":[{"url":"http://html5demos.com/contenteditable","title":"Demo page"},{"url":"https://blog.whatwg.org/the-road-to-html-5-contenteditable","title":"WHATWG blog post"},{"url":"http://accessgarage.wordpress.com/2009/05/08/how-to-hack-your-app-to-make-contenteditable-work/","title":"Blog post on usage problems"},{"url":"http://docs.webplatform.org/wiki/html/attributes/contentEditable","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"a","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"This support only refers to very basic editing capability, implementations vary significantly on how certain elements can be edited.","notes_by_num":{},"usage_perc_y":93.83,"usage_perc_a":0.05,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"dragndrop":{"title":"Drag and Drop","description":"Method of easily dragging and dropping elements on a page, requiring minimal JavaScript.","spec":"https://html.spec.whatwg.org/multipage/interaction.html#dnd","status":"wd","links":[{"url":"http://html5doctor.com/native-drag-and-drop/","title":"HTML5 Doctor article"},{"url":"http://nettutsplus.s3.amazonaws.com/64_html5dragdrop/demo/index.html","title":"Shopping cart demo"},{"url":"http://html5demos.com/drag","title":"Demo with link blocks"},{"url":"http://docs.webplatform.org/wiki/dom/DragEvent","title":"WebPlatform Docs"},{"url":"https://github.com/MihaiValentin/setDragImage-IE","title":"Polyfill for setDragImage in IE"},{"url":"http://blog.teamtreehouse.com/implementing-native-drag-and-drop","title":"Implementing Native Drag and Drop"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"a #1","6":"a #1","7":"a #1","8":"a #1","9":"a #1","10":"a #2","11":"a #2"},"firefox":{"2":"p","3":"p","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"y","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"`dataTransfer.items` only supported by Chrome.\r\n\r\nCurrently no browser supports the `dropzone` attribute.\r\n\r\nFirefox supports any kind of DOM elements for `.setDragImage`. Chrome must have either an `HTMLImageElement` or any kind of DOM elements attached to the DOM and within the viewport of the browser for `.setDragImage`.","notes_by_num":{"1":"Partial support refers to no support for the `dataTransfer.files` or `.types` objects and limited supported formats for `dataTransfer.setData`/`getData`.","2":"Partial support refers to not supporting `.setDragImage`"},"usage_perc_y":51.26,"usage_perc_a":14.96,"ucprefix":false,"parent":"","keywords":"draganddrop","ie_id":"","chrome_id":""},"queryselector":{"title":"querySelector/querySelectorAll","description":"Method of accessing DOM elements using CSS selectors","spec":"http://www.w3.org/TR/selectors-api/","status":"rec","links":[{"url":"https://developer.mozilla.org/en/DOM/element.querySelector","title":"MDN article on querySelector"},{"url":"https://developer.mozilla.org/En/DOM/Element.querySelectorAll","title":"MDN article on querySelectorAll"},{"url":"http://cjihrig.com/blog/javascripts-selectors-api/","title":"Blog post"},{"url":"http://docs.webplatform.org/wiki/css/selectors_api/querySelector","title":"WebPlatform Docs"}],"categories":["DOM"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"a #1","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Partial support in IE8 is due to being limited to [CSS 2.1 selectors](/#feat=css-sel2). Additionally, it will have trouble with selectors including unrecognized tags (for example HTML5 ones)."},"usage_perc_y":93.43,"usage_perc_a":3.18,"ucprefix":false,"parent":"","keywords":"query,selectors,selectors api","ie_id":"","chrome_id":""},"getelementsbyclassname":{"title":"getElementsByClassName","description":"Method of accessing DOM elements by class name","spec":"http://www.w3.org/TR/dom/#dom-document-getelementsbyclassname","status":"wd","links":[{"url":"http://www.quirksmode.org/dom/tests/basics.html#getElementsByClassName","title":"Test page"},{"url":"http://docs.webplatform.org/wiki/dom/HTMLElement/getElementsByClassName","title":"WebPlatform Docs"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.49,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"byclassname","ie_id":"","chrome_id":""},"forms":{"title":"HTML5 form features","description":"Expanded form options, including things like date pickers, sliders, validation, placeholders and multiple file uploads. Previously known as \"Web forms 2.0\".","spec":"https://html.spec.whatwg.org/multipage/forms.html#forms","status":"wd","links":[{"url":"https://miketaylr.com/code/input-type-attr.html","title":"HTML5 inputs and attribute support page"},{"url":"https://github.com/westonruter/webforms2","title":"Cross-browser JS implementation (based on original spec)"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"a","11":"a"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"p","3.2":"p","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"n","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"a"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":3.2,"usage_perc_a":81.37,"ucprefix":false,"parent":"","keywords":"input,datepicker","ie_id":"","chrome_id":""},"html5semantic":{"title":"New semantic elements","description":"HTML5 offers some new elements, primarily for semantic purposes. The elements include: section, article, aside, header, footer, nav, figure, figcaption, time, mark, main.","spec":"https://html.spec.whatwg.org/multipage/semantics.html#sections","status":"wd","links":[{"url":"https://blog.whatwg.org/supporting-new-elements-in-ie","title":"Workaround for IE"},{"url":"https://blog.whatwg.org/styling-ie-noscript","title":"Alternate workaround"},{"url":"http://oli.jp/2009/html5-structure3/","title":"Article on structural elements"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/dom.js#dom-html5-elements","title":"has.js test"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y #1","10":"y #1","11":"y #1"},"firefox":{"2":"n","3":"a #1","3.5":"a #1","3.6":"a #1","4":"y #1","5":"y #1","6":"y #1","7":"y #1","8":"y #1","9":"y #1","10":"y #1","11":"y #1","12":"y #1","13":"y #1","14":"y #1","15":"y #1","16":"y #1","17":"y #1","18":"y #1","19":"y #1","20":"y #1","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a #1","5":"a #1","6":"y #1","7":"y #1","8":"y #1","9":"y #1","10":"y #1","11":"y #1","12":"y #1","13":"y #1","14":"y #1","15":"y #1","16":"y #1","17":"y #1","18":"y #1","19":"y #1","20":"y #1","21":"y #1","22":"y #1","23":"y #1","24":"y #1","25":"y #1","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a #1","3.2":"a #1","4":"a #1","5":"y #1","5.1":"y #1","6":"y #1","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"a #1","9.5-9.6":"a #1","10.0-10.1":"a #1","10.5":"a #1","10.6":"a #1","11":"a #1","11.1":"y #1","11.5":"y #1","11.6":"y #1","12":"y #1","12.1":"y #1","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a #1","4.0-4.1":"y #1","4.2-4.3":"y #1","5.0-5.1":"y #1","6.0-6.1":"y #1","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a #1"},"android":{"2.1":"a #1","2.2":"y #1","2.3":"y #1","3":"y #1","4":"y #1","4.1":"y #1","4.2-4.3":"y #1","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y #1","10":"y #1"},"op_mob":{"10":"a #1","11":"y #1","11.1":"y #1","11.5":"y #1","12":"y #1","12.1":"y #1","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y #1","11":"y #1"},"and_uc":{"9.9":"y #1"}},"notes":"Partial support refers to missing the default styling. This is easily taken care of by using display:block for all new elements (except time and mark, these should be display:inline anyway). IE11 and older versions of other browsers do not support the <main> element.","notes_by_num":{"1":"Does not include support for the <main> element "},"usage_perc_y":90.34,"usage_perc_a":3.16,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"offline-apps":{"title":"Offline web applications","description":"Method of defining web page files to be cached using a cache manifest file, allowing them to work offline on subsequent visits to the page","spec":"https://html.spec.whatwg.org/multipage/browsers.html#offline","status":"wd","links":[{"url":"http://www.sitepoint.com/offline-web-application-tutorial/","title":"Sitepoint tutorial"},{"url":"http://diveintohtml5.info/offline.html","title":"Dive Into HTML5 article"},{"url":"http://hacks.mozilla.org/2010/01/offline-web-applications/","title":"Mozilla Hacks article/demo"},{"url":"http://docs.webplatform.org/wiki/apis/appcache/ApplicationCache","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"n","10":"y","11":"y"},"firefox":{"2":"p","3":"a","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"p","10.5":"p","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":88.44,"usage_perc_a":0.05,"ucprefix":false,"parent":"","keywords":"appcache,app cache,application cache,online","ie_id":"applicationcache","chrome_id":"6192449487634432"},"webworkers":{"title":"Web Workers","description":"Method of running scripts in the background, isolated from the web page","spec":"http://www.w3.org/TR/workers/","status":"cr","links":[{"url":"https://developer.mozilla.org/En/Using_web_workers","title":"MDN article"},{"url":"http://nerget.com/rayjs-mt/rayjs.html","title":"Web Worker demo"},{"url":"http://code.google.com/p/ie-web-worker/","title":"Polyfill for IE (single threaded)"},{"url":"http://net.tutsplus.com/tutorials/javascript-ajax/getting-started-with-web-workers/","title":"Tutorial"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"p","10.5":"p","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":84.71,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"fontface":{"title":"@font-face Web fonts","description":"Method of displaying fonts downloaded from websites","spec":"http://www.w3.org/TR/css3-webfonts/","status":"cr","links":[{"url":"http://webfonts.info","title":"News and information site"},{"url":"http://en.wikipedia.org/wiki/Web_typography","title":"Wikipedia"},{"url":"http://www.css3files.com/font/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/atrules/@font-face","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"a","2.3":"a","3":"a","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support before IE9 refers to only supporting EOT fonts. Safari for iOS 4.1 and below only supports SVG fonts.","notes_by_num":{},"usage_perc_y":90.32,"usage_perc_a":3.71,"ucprefix":false,"parent":"","keywords":"font face","ie_id":"","chrome_id":""},"eot":{"title":"EOT - Embedded OpenType fonts","description":"Type of font that can be derived from a regular font, allowing small files and legal use of high-quality fonts. Usage is restricted by the file being tied to the website","spec":"http://www.w3.org/Submission/EOT/","status":"unoff","links":[{"url":"http://en.wikipedia.org/wiki/Embedded_OpenType","title":"Wikipedia"},{"url":"http://www.microsoft.com/typography/web/embedding/default.aspx","title":"Example pages"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Proposal by Microsoft, being considered for W3C standardization.","notes_by_num":{},"usage_perc_y":14.95,"usage_perc_a":0,"ucprefix":false,"parent":"fontface","keywords":"","ie_id":"","chrome_id":""},"woff":{"title":"WOFF - Web Open Font Format","description":"Compressed TrueType/OpenType font that contains information about the font's source.","spec":"http://www.w3.org/TR/WOFF/","status":"rec","links":[{"url":"http://hacks.mozilla.org/2009/10/woff/","title":"Mozilla hacks blog post"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Reported to be supported in some modified versions of the Android 4.0 browser.","notes_by_num":{},"usage_perc_y":86.56,"usage_perc_a":0,"ucprefix":false,"parent":"fontface","keywords":"","ie_id":"","chrome_id":""},"multibackgrounds":{"title":"CSS3 Multiple backgrounds","description":"Method of using multiple images as a background","spec":"http://www.w3.org/TR/css3-background/","status":"cr","links":[{"url":"http://www.css3.info/preview/multiple-backgrounds/","title":"Demo & information page"},{"url":"http://www.css3files.com/background/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/background-image","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.39,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"border-image":{"title":"CSS3 Border images","description":"Method of using images for borders","spec":"http://www.w3.org/TR/css3-background/#the-border-image","status":"cr","links":[{"url":"http://www.css3files.com/border/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/border-image","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y"},"firefox":{"2":"n","3":"n","3.5":"a x","3.6":"a x","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a x","3.2":"a x","4":"a x","5":"a x","5.1":"a x","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"a","10.6":"a","11":"a x","11.1":"a x","11.5":"a x","11.6":"a x","12":"a x","12.1":"a x","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a x","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"a x","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a x","10":"y"},"op_mob":{"10":"n","11":"a x","11.1":"a x","11.5":"a x","12":"a x","12.1":"a x","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Note that both the border-style and border-width must be specified for border-images to work according to spec, though older implementations may not have this requirement. Partial support refers to supporting the shorthand syntax, but not the individual properties (border-image-source, border-image-slice, etc). ","notes_by_num":{},"usage_perc_y":80.35,"usage_perc_a":5.64,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"background-img-opts":{"title":"CSS3 Background-image options","description":"New properties to affect background images, including background-clip, background-origin and background-size","spec":"http://www.w3.org/TR/css3-background/#backgrounds","status":"cr","links":[{"url":"http://www.standardista.com/css3/css3-background-properties","title":"Detailed compatibility tables and demos"},{"url":"http://www.css3files.com/background/","title":"Information page"},{"url":"https://github.com/louisremi/background-size-polyfill","title":"Polyfill for IE7-8"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"a x","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"a x","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a x","2.2":"y x","2.3":"y x","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in Opera Mini refers to not supporting background sizing or background attachments. However Opera Mini 7.5 supports background sizing (including cover and contain values).\r\n\r\nPartial support in Safari 6 refers to not supporting background sizing offset from edges syntax.","notes_by_num":{},"usage_perc_y":88.87,"usage_perc_a":4.54,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-table":{"title":"CSS Table display","description":"Method of displaying elements as tables, rows, and cells","spec":"http://www.w3.org/TR/CSS21/tables.html","status":"rec","links":[{"url":"http://www.onenaught.com/posts/201/use-css-displaytable-for-layout","title":"Blog post on usage"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":96.69,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"display:table, display: table,table-cell,table-row,table-layout","ie_id":"","chrome_id":""},"css-gencontent":{"title":"CSS Generated content for pseudo-elements","description":"Method of displaying text or images before or after the given element's contents using the ::before and ::after pseudo-elements. All browsers with support also support the `attr()` notation in the `content` property. ","spec":"http://www.w3.org/TR/CSS21/generate.html","status":"rec","links":[{"url":"http://www.westciv.com/style_master/academy/css_tutorial/advanced/generated_content.html","title":"Guide on usage"},{"url":"https://dev.opera.com/articles/view/css-generated-content-techniques/","title":"Dev.Opera article"},{"url":"http://docs.webplatform.org/wiki/css/generated_and_replaced_content","title":"WebPlatform Docs"}],"categories":["CSS2","CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"a","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"IE8 only supports the single-colon CSS 2.1 syntax (i.e. :pseudo-class). It does not support the double-colon CSS3 syntax (i.e. ::pseudo-element)\r\n\r\nFor content to appear in pseudo-elements, the `content` property must be set (but may be an empty string).","notes_by_num":{},"usage_perc_y":93.51,"usage_perc_a":3.18,"ucprefix":false,"parent":"","keywords":"before,after","ie_id":"","chrome_id":""},"css-fixed":{"title":"CSS position:fixed","description":"Method of keeping an element in a fixed location regardless of scroll position","spec":"http://www.w3.org/TR/CSS21/visuren.html#fixed-positioning","status":"rec","links":[{"url":"http://www.css-101.org/fixed-positioning/05.php","title":"Workaround for IE6"},{"url":"http://bradfrostweb.com/blog/mobile/fixed-position/","title":"Article on mobile support"},{"url":"http://docs.webplatform.org/wiki/css/properties/position","title":"WebPlatform Docs"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Only works in Android 2.2+ by using the following meta tag: <meta name=\"viewport\" content=\"width=device-width, user-scalable=no\">. Partial support in iOS Safari refers to [buggy behavior](http://remysharp.com/2012/05/24/issues-with-position-fixed-scrolling-on-ios/).","notes_by_num":{},"usage_perc_y":85.53,"usage_perc_a":8.42,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"hashchange":{"title":"Hashchange event","description":"Event triggered in JavaScript when the URL's hash has changed (for example: page.html#foo to page.html#bar) ","spec":"https://html.spec.whatwg.org/multipage/browsers.html#the-hashchangeevent-interface","status":"cr","links":[{"url":"https://developer.mozilla.org/en/DOM/window.onhashchange","title":"MDN article"},{"url":"http://msdn.microsoft.com/en-us/library/cc288209(VS.85).aspx","title":"MSDN article"},{"url":"http://www.quirksmode.org/dom/events/tests/hashchange.html","title":"Simple demo"},{"url":"http://github.com/3nr1c/jUri.js","title":"Polyfill"},{"url":"http://docs.webplatform.org/wiki/dom/Element/hashchange","title":"WebPlatform Docs"}],"categories":["HTML5","JS API"],"stats":{"ie":{"5.5":"p","6":"p","7":"p","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.65,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"onhashchange,HashChangeEvent","ie_id":"","chrome_id":""},"css-sel2":{"title":"CSS 2.1 selectors","description":"Basic CSS selectors including: `*` (universal selector), `>` (child selector), `:first-child`, `:link`, `:visited`, `:active`, `:hover`, `:focus`, `:lang()`, `+` (adjacent sibling selector), `[attr]`, `[attr=\"val\"]`, `[attr~=\"val\"]`, `[attr|=\"bar\"]`, `.foo` (class selector), `#foo` (id selector)","spec":"http://www.w3.org/TR/CSS21/selector.html","status":"rec","links":[{"url":"http://www.quirksmode.org/css/contents.html","title":"Detailed support information"},{"url":"http://www.yourhtmlsource.com/stylesheets/advancedselectors.html","title":"Examples of advanced selectors"},{"url":"http://selectivizr.com","title":"Selectivizr: Polyfill for IE6-8"},{"url":"http://docs.webplatform.org/wiki/css/selectors","title":"WebPlatform Docs"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"n","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":96.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-sel3":{"title":"CSS3 selectors","description":"Advanced element selection using selectors including: `[foo^=\"bar\"]`, `[foo$=\"bar\"]`, `[foo*=\"bar\"]`, `:root`, `:nth-child()`,  `:nth-last-child()`, `nth-of-type`, `nth-last-of-type()`, `:last-child`, `:first-of-type`, `:last-of-type`, `:only-child`, `:only-of-type`, `:empty`, `:target`, `:enabled`, `:disabled`, `:checked`, `:not()`, `~` (general sibling)","spec":"http://www.w3.org/TR/css3-selectors/","status":"rec","links":[{"url":"http://www.quirksmode.org/css/selectors/","title":"Detailed support information"},{"url":"http://www.css3.info/selectors-test/","title":"Automated CSS3 selector test"},{"url":"http://selectivizr.com","title":"Selectivizr: Polyfill for IE6-8"},{"url":"http://docs.webplatform.org/wiki/css/selectors","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"p","7":"a","8":"a","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"IE7 and IE8 support only these CSS3 selectors: General siblings (`element1~element2`) and Attribute selectors `[attr^=val]`, `[attr$=val]`, and `[attr*=val]`","notes_by_num":{},"usage_perc_y":93.43,"usage_perc_a":3.26,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-textshadow":{"title":"CSS3 Text-shadow","description":"Method of applying one or more shadow or blur effects to text","spec":"http://www.w3.org/TR/css-text-decor-3/#text-shadow-property","status":"wd","links":[{"url":"http://hacks.mozilla.org/2009/06/text-shadow/","title":"Mozilla hacks article"},{"url":"http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_text-shadow.htm","title":"Live editor"},{"url":"http://www.css3files.com/shadow/#textshadow","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/text-shadow","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y #1","11":"y #1"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y #1","11":"y #1"},"and_uc":{"9.9":"y"}},"notes":"Opera Mini ignores the blur-radius set, so no blur effect is visible. Text-shadow behavior can be somewhat emulated in older IE versions using the non-standard \"dropshadow\" or \"glow\" filters. ","notes_by_num":{"1":"IE 10+ supports a fourth length value for the shadow's \"spread\". This is not (yet) part of the specification. "},"usage_perc_y":88.39,"usage_perc_a":2.91,"ucprefix":false,"parent":"","keywords":"text shadow","ie_id":"","chrome_id":""},"css-boxshadow":{"title":"CSS3 Box-shadow","description":"Method of displaying an inner or outer shadow effect to elements","spec":"http://www.w3.org/TR/css3-background/#box-shadow","status":"cr","links":[{"url":"https://developer.mozilla.org/En/CSS/-moz-box-shadow","title":"MDN article"},{"url":"http://westciv.com/tools/boxshadows/index.html","title":"Live editor"},{"url":"http://tests.themasta.com/blogstuff/boxshadowdemo.html","title":"Demo of various effects"},{"url":"http://www.css3files.com/shadow/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/box-shadow","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y x","3.6":"y x","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a x","3.2":"a x","4":"a x","5":"y x","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y x","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Can be partially emulated in older IE versions using the non-standard \"shadow\" filter. Partial support in Safari, iOS Safari and Android Browser refers to missing \"inset\" and blur radius value support.","notes_by_num":{},"usage_perc_y":90.29,"usage_perc_a":0.3,"ucprefix":false,"parent":"","keywords":"box-shadows,boxshadows,box shadow,shaow","ie_id":"","chrome_id":""},"css3-colors":{"title":"CSS3 Colors","description":"Method of describing colors using Hue, Saturation and Lightness (hsl()) rather than just RGB, as well as allowing alpha-transparency with rgba() and hsla().","spec":"http://www.w3.org/TR/css3-color/","status":"rec","links":[{"url":"https://dev.opera.com/articles/view/color-in-opera-10-hsl-rgb-and-alpha-transparency/","title":"Dev.Opera article"},{"url":"http://www.css3files.com/color/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/color#RGBA_Notation","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"a","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"a","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.48,"usage_perc_a":0.02,"ucprefix":false,"parent":"","keywords":"rgb,hsl,rgba,hsla","ie_id":"","chrome_id":""},"css3-boxsizing":{"title":"CSS3 Box-sizing","description":"Method of specifying whether or not an element's borders and padding should be included in size units","spec":"http://www.w3.org/TR/css3-ui/#box-sizing","status":"wd","links":[{"url":"https://developer.mozilla.org/En/CSS/Box-sizing","title":"MDN article"},{"url":"http://www.456bereastreet.com/archive/201104/controlling_width_with_css3_box-sizing/","title":"Blog post"},{"url":"https://github.com/Schepp/box-sizing-polyfill","title":"Polyfill for IE"},{"url":"http://css-tricks.com/box-sizing/","title":"CSS Tricks"},{"url":"http://docs.webplatform.org/wiki/css/properties/box-sizing","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"p","6":"p","7":"p","8":"a","9":"a","10":"a","11":"a"},"firefox":{"2":"y x","3":"y x","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"a x","3.2":"a x","4":"a x","5":"a x","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"a x","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"a x","10":"a"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"Partial support refers to supporting only the `content-box` and `border-box` values, not `padding-box` (which was added to the spec later).","notes_by_num":{},"usage_perc_y":12.72,"usage_perc_a":83.97,"ucprefix":false,"parent":"","keywords":"border-box,content-box,padding-box","ie_id":"","chrome_id":""},"css-mediaqueries":{"title":"CSS3 Media Queries","description":"Method of applying styles based on media information. Includes things like page and device dimensions","spec":"http://www.w3.org/TR/css3-mediaqueries/","status":"rec","links":[{"url":"http://ie.microsoft.com/testdrive/HTML5/85CSS3_MediaQueries/","title":"IE demo page with information"},{"url":"http://webdesignerwall.com/tutorials/responsive-design-with-css3-media-queries","title":"Media Queries tutorial"},{"url":"https://github.com/scottjehl/Respond","title":"Polyfill for IE"},{"url":"http://docs.webplatform.org/wiki/css/atrules/@media","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"p","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Incomplete support by older webkit browsers refers to only acknowledging different media rules on page reload","notes_by_num":{},"usage_perc_y":93.43,"usage_perc_a":0.01,"ucprefix":false,"parent":"","keywords":"@media","ie_id":"","chrome_id":""},"multicolumn":{"title":"CSS3 Multiple column layout","description":"Method of flowing information in multiple columns","spec":"http://www.w3.org/TR/css3-multicol/","status":"cr","links":[{"url":"https://dev.opera.com/articles/view/css3-multi-column-layout/","title":"Dev.Opera article"},{"url":"http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/an-introduction-to-the-css3-multiple-column-layout-module/","title":"Introduction page"},{"url":"http://docs.webplatform.org/wiki/css/properties/column-width","title":"WebPlatform Docs"},{"url":"https://github.com/BetleyWhitehorne/CSS3MultiColumn","title":"Polyfill"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"a x","3":"a x","3.5":"a x","3.6":"a x","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x","37":"a x","38":"a x","39":"a x","40":"a x","41":"a x","42":"a x"},"safari":{"3.1":"a x","3.2":"a x","4":"a x","5":"a x","5.1":"a x","6":"a x","6.1":"a x","7":"a x","7.1":"a x","8":"a x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x"},"ios_saf":{"3.2":"a x","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"a x","6.0-6.1":"a x","7.0-7.1":"a x","8":"a x","8.1":"a x"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"a x","4.4.3-4.4.4":"a x","37":"a x"},"bb":{"7":"a x","10":"a x"},"op_mob":{"10":"n","11":"n","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"a x"},"and_chr":{"38":"a x"},"and_ff":{"32":"a x"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a x"}},"notes":"Partial support refers to not supporting the `break-before`, `break-after`, `break-inside` properties. Webkit browsers do have equivalent support for the non-standard `-webkit-column-break-*` properties while Firefox supports `page-break-*` to accomplish the same result.","notes_by_num":{},"usage_perc_y":12.95,"usage_perc_a":78.36,"ucprefix":false,"parent":"","keywords":"column-count","ie_id":"multicolumnfullsupport","chrome_id":"6526151266664448"},"border-radius":{"title":"CSS3 Border-radius (rounded corners)","description":"Method of making the border corners round","spec":"http://www.w3.org/TR/css3-background/#the-border-radius","status":"cr","links":[{"url":"http://border-radius.com","title":"Border-radius CSS Generator"},{"url":"http://muddledramblings.com/table-of-css3-border-radius-compliance","title":"Detailed compliance table"},{"url":"http://www.css3files.com/border/#borderradius","title":"Information page"},{"url":"http://css3pie.com/","title":"Polyfill which includes border-radius"},{"url":"http://docs.webplatform.org/wiki/css/properties/border-radius","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"a x","3":"y x","3.5":"y x","3.6":"y x","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y x","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":90.64,"usage_perc_a":0.01,"ucprefix":false,"parent":"","keywords":"roundedcorners, border radius,-moz-border-radius","ie_id":"","chrome_id":""},"transforms2d":{"title":"CSS3 Transforms","description":"Method of transforming an element including rotating, scaling, etc.","spec":"http://www.w3.org/TR/css3-2d-transforms/","status":"wd","links":[{"url":"http://www.westciv.com/tools/transforms/","title":"Live editor"},{"url":"https://developer.mozilla.org/en/CSS/-moz-transform","title":"MDN article"},{"url":"http://www.webresourcesdepot.com/cross-browser-css-transforms-csssandpaper/","title":"Workaround script for IE"},{"url":"http://www.css3files.com/transform/","title":"Information page"},{"url":"http://www.useragentman.com/IETransformsTranslator/","title":"Converter for IE"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/css/transforms/transform","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y x","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y x","10.6":"y x","11":"y x","11.1":"y x","11.5":"y x","11.6":"y x","12":"y x","12.1":"y","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"The scale transform can be emulated in IE < 9 using Microsoft's \"zoom\" extension, others are (not easily) possible using the MS Matrix filter","notes_by_num":{},"usage_perc_y":90.59,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"transformation,translate,rotation,rotate,scale,css-transforms","ie_id":"transforms","chrome_id":"6437640580628480"},"use-strict":{"title":"ECMAScript 5 Strict Mode","description":"Method of placing code in a \"strict\" operating context.","spec":"http://ecma-international.org/ecma-262/5.1/#sec-14.1","status":"other","links":[{"url":"http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/","title":"Information page"},{"url":"http://javascriptweblog.wordpress.com/2011/05/03/javascript-strict-mode/","title":"Article with test suite"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a","5.1":"a","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Safari refers to strict mode still accepting a lot of JS that should be considered invalid.","notes_by_num":{},"usage_perc_y":87.12,"usage_perc_a":0.66,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"transforms3d":{"title":"CSS3 3D Transforms","description":"Method of transforming an element in the third dimension using the `transform` property. Includes support for the `perspective` property to set the perspective in z-space and the `backface-visibility` property to toggle display of the reverse side of a 3D-transformed element.","spec":"http://www.w3.org/TR/css3-3d-transforms/","status":"wd","links":[{"url":"http://css3.bradshawenterprises.com/flip/","title":"Multi-browser demo"},{"url":"http://hacks.mozilla.org/2011/10/css-3d-transformations-in-firefox-nightly/","title":"Mozilla hacks article"},{"url":"http://thewebrocks.com/demos/3D-css-tester/","title":"3D CSS Tester"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/css/transforms/transform","title":"WebPlatform Docs"},{"url":"http://desandro.github.io/3dtransforms/","title":"Intro to CSS 3D transforms"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y x"}},"notes":"Partial support in IE refers to not supporting [the transform-style: preserve-3d property](http://msdn.microsoft.com/en-us/library/ie/hh673529%28v=vs.85%29.aspx#the_ms_transform_style_property). This prevents nesting 3D transformed elements.","notes_by_num":{},"usage_perc_y":77.64,"usage_perc_a":9.87,"ucprefix":false,"parent":"","keywords":"css 3d,3dtransforms,translate3d,backface visibility,perspective","ie_id":"transforms,csstransformspreserve3d","chrome_id":"6437640580628480"},"sharedworkers":{"title":"Shared Web Workers","description":"Method of allowing multiple scripts to communicate with a single web worker.","spec":"http://www.w3.org/TR/workers/#shared-workers-introduction","status":"cr","links":[{"url":"http://www.sitepoint.com/javascript-shared-web-workers-html5/","title":"Sitepoint article"},{"url":"http://greenido.wordpress.com/2011/11/03/web-workers-part-3-out-of-3-shared-wrokers/","title":"Blog post"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"u","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":50.41,"usage_perc_a":0,"ucprefix":false,"parent":"webworkers","keywords":"shared worker","ie_id":"","chrome_id":""},"css-hyphens":{"title":"CSS Hyphenation","description":"Method of controlling when words at the end of lines should be hyphenated using the \"hyphens\" property.","spec":"http://www.w3.org/TR/css3-text/#hyphenation","status":"wd","links":[{"url":"https://developer.mozilla.org/en/CSS/hyphens","title":"MDN article"},{"url":"http://blog.fontdeck.com/post/9037028497/hyphens","title":"Blog post"},{"url":"http://docs.webplatform.org/wiki/css/properties/hyphens","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"a x"}},"notes":"Chrome 29- and Android 4.0 Browser support \"-webkit-hyphens: none\", but not the \"auto\" property. Chrome 30+ doesn't support it either.","notes_by_num":{},"usage_perc_y":33.24,"usage_perc_a":2.87,"ucprefix":false,"parent":"","keywords":"hyphen,shy","ie_id":"","chrome_id":""},"css-transitions":{"title":"CSS3 Transitions","description":"Simple method of animating certain properties of an element","spec":"http://www.w3.org/TR/css3-transitions/","status":"wd","links":[{"url":"http://www.webdesignerdepot.com/2010/01/css-transitions-101/","title":"Article on usage"},{"url":"http://www.css3files.com/transition/","title":"Information page"},{"url":"http://www.the-art-of-web.com/css/timing-function/","title":"Examples on timing functions"},{"url":"http://www.opera.com/docs/specs/presto2.12/css/transitions/","title":"Animation of property types support in Opera"},{"url":"http://docs.webplatform.org/wiki/css/properties/transition","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y x","10.6":"y x","11":"y x","11.1":"y x","11.5":"y x","11.6":"y x","12":"y x","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"y x","11":"y x","11.1":"y x","11.5":"y x","12":"y x","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"","notes_by_num":{},"usage_perc_y":88.35,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"css transition","ie_id":"","chrome_id":""},"font-feature":{"title":"Font feature settings","description":"Method of applying advanced typographic and language-specific font features to supported OpenType fonts.","spec":"http://w3.org/TR/css3-fonts/#font-rend-props","status":"wd","links":[{"url":"http://ie.microsoft.com/testdrive/Graphics/opentype/","title":"Demo pages (IE/Firefox only)"},{"url":"http://hacks.mozilla.org/2010/11/firefox-4-font-feature-support/","title":"Mozilla hacks article"},{"url":"http://html5accessibility.com/","title":"Detailed tables on accessability support"},{"url":"http://docs.webplatform.org/wiki/css/properties/font-feature-settings","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"a","5":"a","5.1":"a","6":"a","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y x"}},"notes":"Partial support in older Firefox versions refers to using an older syntax. Partial support in older Chrome versions refers to lacking support in Mac OS X. ","notes_by_num":{},"usage_perc_y":71.46,"usage_perc_a":1.64,"ucprefix":false,"parent":"","keywords":"font-feature,font-feature-settings,kern,kerning,font-variant-alternates,ligatures,font-variant-ligatures","ie_id":"","chrome_id":""},"css-animation":{"title":"CSS3 Animation","description":"Complex method of animating certain properties of an element","spec":"http://www.w3.org/TR/css3-animations/","status":"wd","links":[{"url":"http://robertnyman.com/2010/05/06/css3-animations/","title":"Blog post on usage"},{"url":"http://www.css3files.com/animation/","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/animations","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"y x","12.1":"y","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y","27":"y"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"Partial support in Android browser refers to buggy behavior in different scenarios.","notes_by_num":{},"usage_perc_y":88.04,"usage_perc_a":0.21,"ucprefix":false,"parent":"","keywords":"animations,css-animations,keyframe,keyframes","ie_id":"","chrome_id":""},"css-gradients":{"title":"CSS Gradients","description":"Method of defining a linear or radial color gradient as a CSS image.","spec":"http://www.w3.org/TR/css3-images/","status":"cr","links":[{"url":"http://www.colorzilla.com/gradient-editor/","title":"Cross-browser editor"},{"url":"http://www.css3files.com/gradient/","title":"Information page"},{"url":"http://css3pie.com/","title":"Tool to emulate support in IE"},{"url":"http://docs.webplatform.org/wiki/css/functions/linear-gradient","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"a x","5":"a x","5.1":"y x","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"a x","11.5":"a x","11.6":"y x","12":"y x","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a x","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"a x","11.5":"a x","12":"y x","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"Syntax used by browsers with prefixed support may be incompatible with that for proper support. \r\n\r\nPartial support in Opera 11.10 and 11.50 also refers to only having support for linear gradients.\r\n\r\nSupport can be somewhat emulated in older IE versions using the non-standard \"gradient\" filter. \r\n\r\nFirefox 10+, Opera 11.6+, Chrome 26+ and IE10+ also support the new \"to (side)\" syntax.","notes_by_num":{},"usage_perc_y":87.78,"usage_perc_a":0.62,"ucprefix":false,"parent":"","keywords":"linear,linear-gradient,gradiant","ie_id":"gradients","chrome_id":"5785905063264256"},"css-canvas":{"title":"CSS Canvas Drawings","description":"Method of using HTML5 Canvas as a background image","spec":"http://webkit.org/blog/176/css-canvas-drawing/","status":"unoff","links":[{"url":"http://webkit.org/blog/176/css-canvas-drawing/","title":"Webkit blog post"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"u","35":"u","36":"u"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y x"}},"notes":"Proposal by Webkit, being considered for W3C standardization. A similar effect can be achieved in Firefox 4+ using the -moz-element() background property","notes_by_num":{},"usage_perc_y":65.64,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-reflections":{"title":"CSS Reflections","description":"Method of displaying a reflection of an element","spec":"http://webkit.org/blog/182/css-reflections/","status":"unoff","links":[{"url":"http://webkit.org/blog/182/css-reflections/","title":"Webkit blog post"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Similar effect can be achieved in Firefox 4+ using the -moz-element() background property","notes_by_num":{},"usage_perc_y":62.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"box-reflect","ie_id":"","chrome_id":"5627300510957568"},"css-masks":{"title":"CSS Masks","description":"Method of displaying part of an element, using a selected image as a mask","spec":"http://www.w3.org/TR/css-masking/","status":"cr","links":[{"url":"http://docs.webplatform.org/wiki/css/properties/mask","title":"WebPlatform Docs"},{"url":"http://www.html5rocks.com/en/tutorials/masking/adobe/","title":"HTML5 Rocks article"},{"url":"http://thenittygritty.co/css-masking","title":"Detailed blog post"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"a","3.6":"a","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x","37":"a x","38":"a x","39":"a x","40":"a x","41":"a x","42":"a x"},"safari":{"3.1":"n","3.2":"n","4":"a x","5":"a x","5.1":"a x","6":"a x","6.1":"a x","7":"a x","7.1":"a x","8":"a x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x"},"ios_saf":{"3.2":"a x","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"a x","6.0-6.1":"a x","7.0-7.1":"a x","8":"a x","8.1":"a x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"a x","4.4.3-4.4.4":"a x","37":"a x"},"bb":{"7":"a x","10":"a x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a x"},"and_chr":{"38":"a x"},"and_ff":{"32":"a"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"a x"}},"notes":"Partial support in WebKit/Blink browsers refers to supporting the mask-image and mask-box-image properties, but lacks support for othe parts of the spec. Partial support in Firefox refers to only support for inline SVG mask elements i.e. mask: url(#foo).","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":78.29,"ucprefix":false,"parent":"","keywords":"","ie_id":"masks","chrome_id":"5381559662149632"},"svg":{"title":"SVG (basic support)","description":"Method of displaying basic Vector Graphics features using the embed or object elements. Refers to the SVG 1.1 spec.","spec":"http://www.w3.org/TR/SVG/","status":"rec","links":[{"url":"http://en.wikipedia.org/wiki/Scalable_Vector_Graphics","title":"Wikipedia"},{"url":"http://www.alistapart.com/articles/using-svg-for-flexible-scalable-and-fun-backgrounds-part-i","title":"A List Apart article"},{"url":"http://svg-wow.org/","title":"SVG showcase site"},{"url":"http://code.google.com/p/svgweb/","title":"SVG Web: Flash-based polyfill"},{"url":"http://svg-edit.googlecode.com","title":"Web-based SVG editor"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#svg","title":"has.js test"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y #2","10":"y #2","11":"y #2"},"firefox":{"2":"a","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"a #1","4":"a #1","4.1":"a #1","4.2-4.3":"a #1","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y #2","11":"y #2"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Partial support in Android 3 & 4 refers to not supporting masking.","2":"IE9-11 desktop & mobile don't properly scale SVG files.  [Adding height, width, viewport, and CSS rules](http://codepen.io/tomByrer/pen/qEBbzw?editors=110) seem to be the best workaround."},"usage_perc_y":89.77,"usage_perc_a":3.54,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"svg-css":{"title":"SVG in CSS backgrounds","description":"Method of using SVG images as CSS backgrounds","spec":"http://www.w3.org/TR/css3-background/#background-image","status":"cr","links":[{"url":"http://designfestival.com/a-farewell-to-css3-gradients/","title":"Tutorial for advanced effects"}],"categories":["CSS3","SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"a","4":"a","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Firefox and Opera Mini/Mobile refers to SVG images being blurry when scaled. Partial support in iOS Safari and older Safari versions refers to failing to support tiling or the background-position property.","notes_by_num":{},"usage_perc_y":89.42,"usage_perc_a":3.7,"ucprefix":false,"parent":"","keywords":"svg-in-css,svgincss,css-svg","ie_id":"","chrome_id":""},"svg-smil":{"title":"SVG SMIL animation","description":"Method of using animation elements to animate SVG images","spec":"http://www.w3.org/TR/SVG/animate.html","status":"rec","links":[{"url":"http://svg-wow.org/blog/category/animation/","title":"Examples on SVG WOW"},{"url":"https://developer.mozilla.org/en/SVG/SVG_animation_with_SMIL","title":"MDN article"},{"url":"http://leunen.me/fakesmile/","title":"JS library to support SMIL in SVG"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#svg-smil","title":"has.js test"},{"url":"https://github.com/madsgraphics/SVGEventListener","title":"Polyfill for SMIL animate events on SVG"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"a","5":"a","5.1":"a","6":"a","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"y"}},"notes":"Partial support in Safari refers to not working in HTML files.","notes_by_num":{},"usage_perc_y":77.35,"usage_perc_a":0.96,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"svg-fonts":{"title":"SVG fonts","description":"Method of using fonts defined as SVG shapes. Considered among a number of browser vendors as a deprecated feature with support being removed.","spec":"http://www.w3.org/TR/SVG/fonts.html","status":"rec","links":[{"url":"http://jeremie.patonnier.net/post/2011/02/07/Why-are-SVG-Fonts-so-different","title":"Blog post"},{"url":"http://opentype.info/blog/2010/04/13/the-ipad-and-svg-fonts-in-mobile-safari/","title":"Blog post on usage for iPad"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"n #1","39":"n #1","40":"n #1","41":"n #1","42":"n #1"},"safari":{"3.1":"n","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"n #1","26":"n #1","27":"n #1"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n #2"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"n #1"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Chrome 38 and newer support SVG fonts only on Windows Vista and XP.","2":"Supported in Opera Mini in SVG images only, not in HTML."},"usage_perc_y":43.32,"usage_perc_a":0,"ucprefix":false,"parent":"fontface","keywords":"","ie_id":"","chrome_id":"5930075908210688"},"svg-filters":{"title":"SVG filters","description":"Method of using photoshop-like effects on SVG objects including blurring and color manipulation.","spec":"http://www.w3.org/TR/SVG/filters.html","status":"rec","links":[{"url":"http://electricbeach.org/?p=950","title":"Experiments with filter effects"},{"url":"http://svg-wow.org/blog/category/filters/","title":"SVG filter demos"},{"url":"http://docs.webplatform.org/wiki/svg/elements/filter","title":"WebPlatform Docs"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"a","6":"a","7":"a","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":86.68,"usage_perc_a":0.05,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"svg-html":{"title":"SVG effects for HTML","description":"Method of using SVG transforms, filters, etc on HTML elements using either CSS or the foreignObject element","spec":"http://www.w3.org/TR/SVG11/extend.html#ForeignObjectElement","status":"wd","links":[{"url":"https://developer.mozilla.org/en/SVG/Tutorial/Other_content_in_SVG","title":"MDN Tutorial"},{"url":"https://developer.mozilla.org/En/Applying_SVG_effects_to_HTML_content","title":"MDN Reference page"},{"url":"https://dvcs.w3.org/hg/FXTF/raw-file/tip/filters/index.html","title":"Filter Effects draft"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"a","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"n","3.2":"n","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"a","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support refers to lack of filter support or buggy result from effects. A [CSS Filter Effects](https://dvcs.w3.org/hg/FXTF/raw-file/tip/filters/index.html) specification is in the works that would replace this method.","notes_by_num":{},"usage_perc_y":12.65,"usage_perc_a":70.88,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"svg-html5":{"title":"Inline SVG in HTML5","description":"Method of using SVG tags directly in HTML documents. Requires HTML5 parser.","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#svg-0","status":"cr","links":[{"url":"http://hacks.mozilla.org/2010/05/firefox-4-the-html5-parser-inline-svg-speed-and-more/","title":"Mozilla Hacks blog post"},{"url":"http://samples.msdn.microsoft.com/ietestcenter/html5/svghtml_harness.htm?url=SVG_HTML_Elements_001","title":"Test suite"}],"categories":["HTML5","SVG"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":89.95,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"canvas":{"title":"Canvas (basic support)","description":"Method of generating fast, dynamic graphics using JavaScript","spec":"https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element","status":"cr","links":[{"url":"https://developer.mozilla.org/en/Canvas_tutorial","title":"Tutorial by Mozilla"},{"url":"http://www.canvasdemos.com/","title":"Showcase site"},{"url":"http://glimr.rubyforge.org/cake/canvas.html","title":"Animation kit "},{"url":"http://diveintohtml5.info/canvas.html","title":"Another tutorial"},{"url":"http://explorercanvas.googlecode.com/","title":"Implementation for Internet Explorer"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#canvas","title":"has.js test"}],"categories":["Canvas","HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Opera Mini supports the canvas element, but is unable to play animations or run other more complex applications. Android 2.x supports canvas except the toDataURL() function. See http://code.google.com/p/android/issues/detail?id=7901 Some (slow) workarounds are described here: http://stackoverflow.com/q/10488033/841830","notes_by_num":{},"usage_perc_y":90.49,"usage_perc_a":3.02,"ucprefix":false,"parent":"","keywords":"","ie_id":"canvas","chrome_id":"5100084685438976"},"canvas-text":{"title":"Text API for Canvas","description":"Method of displaying text on Canvas elements","spec":"https://html.spec.whatwg.org/multipage/scripting.html#drawing-text-to-the-bitmap","status":"wd","links":[{"url":"https://developer.mozilla.org/en/Drawing_text_using_a_canvas#Additional_examples","title":"Examples by Mozilla"},{"url":"http://code.google.com/p/canvas-text/","title":"Support library"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#canvas-text","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/canvas/CanvasRenderingContext2D/fillText","title":"WebPlatform Docs"}],"categories":["Canvas","HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":90.58,"usage_perc_a":0,"ucprefix":false,"parent":"canvas","keywords":"","ie_id":"","chrome_id":""},"namevalue-storage":{"title":"Web Storage - name/value pairs","description":"Method of storing data locally like cookies, but for larger amounts of data (sessionStorage and localStorage, used to fall under HTML5).","spec":"http://www.w3.org/TR/webstorage/#storage","status":"rec","links":[{"url":"https://developer.mozilla.org/En/DOM/Storage","title":"Gecko reference"},{"url":"http://code.google.com/p/sessionstorage/","title":"Support library"},{"url":"http://html5demos.com/storage","title":"Simple demo"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-localstorage;native-sessionstorage","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/web-storage/Storage/localStorage","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"a","3":"a","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.76,"usage_perc_a":0.07,"ucprefix":false,"parent":"","keywords":"webstorage,local storage","ie_id":"webstorage","chrome_id":"5345825534246912"},"sql-storage":{"title":"Web SQL Database","description":"Method of storing data client-side, allows Sqlite database queries for access and manipulation","spec":"http://www.w3.org/TR/webdatabase/","status":"unoff","links":[{"url":"http://html5doctor.com/introducing-web-sql-databases/","title":"HTML5 Doctor article"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-sql-db","title":"has.js test"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"The Web SQL Database specification is no longer being maintained and support may be dropped in future versions.","notes_by_num":{},"usage_perc_y":65.94,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"db-storage,websql","ie_id":"websqldatabase","chrome_id":"6330987952734208"},"indexeddb":{"title":"IndexedDB","description":"Method of storing data client-side, allows indexed database queries.","spec":"http://www.w3.org/TR/IndexedDB/","status":"cr","links":[{"url":"http://hacks.mozilla.org/2010/06/comparing-indexeddb-and-webdatabase/","title":"Mozilla Hacks article"},{"url":"https://github.com/axemclion/IndexedDBShim","title":"Polyfill for browsers supporting WebSQL"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-indexeddb","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/indexedDB","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a #1","11":"a #1"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"n","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"y x","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"p","6.1":"p","7":"p","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"p","12.1":"p","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"a #3","8.1":"a #3"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"p","10":"a x #2"},"op_mob":{"10":"n","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a #1","11":"a #1"},"and_uc":{"9.9":"p"}},"notes":"","notes_by_num":{"1":"Partial support in IE 10 & 11 refers to a number of subfeatures [not being supported](http://codepen.io/cemerick/pen/Itymi).","2":"Partial support in BB10 refers to an [outdated specification](http://www.w3.org/TR/2011/WD-IndexedDB-20110419/) being implemented.","3":"Partial support in iOS 8 refers to [seriously buggy behavior](http://www.raymondcamden.com/2014/9/25/IndexedDB-on-iOS-8--Broken-Bad)."},"usage_perc_y":60.19,"usage_perc_a":14.9,"ucprefix":false,"parent":"","keywords":"indexdb","ie_id":"indexeddb","chrome_id":"6507459568992256"},"online-status":{"title":"Online/offline status","description":"Events to indicate when the user's connected (`online` and `offline` events) and the `navigator.onLine` property to see current status.","spec":"https://html.spec.whatwg.org/multipage/browsers.html#browser-state","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine.onLine#Specification","title":"MDN article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"a #2","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"a #3","5":"a #3","6":"a #3","7":"a #3","8":"a #3","9":"a #3","10":"a #3","11":"a #3","12":"a #3","13":"a #3","14":"a #3","15":"a #3","16":"a #3","17":"a #3","18":"a #3","19":"a #3","20":"a #3","21":"a #3","22":"a #3","23":"a #3","24":"a #3","25":"a #3","26":"a #3","27":"a #3","28":"a #3","29":"a #3","30":"a #3","31":"a #3","32":"a #3","33":"a #3","34":"a #3","35":"a #3","36":"a #3"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"a","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"u","4.0-4.1":"u","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"u","2.2":"u","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a #1","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a #1"}},"notes":"\"online\" does not always mean connection to the internet, it can also just mean connection to some network.\r\n\r\nEarly versions of Chrome and Safari always reported \"true\" for `navigator.onLine`","notes_by_num":{"1":"Seems to support `navigator.onLine` but not `online`/`offline` events.","2":"IE8 only supports the `online`/`offline` events on `document.body`, rather than `window`.","3":"Desktop Firefox responds to the status of its \"Work Offline\" mode. If not in that mode, `navigator.onLine` in always `true`, regardless of the actual network connectivity status."},"usage_perc_y":74.59,"usage_perc_a":18.7,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"eventsource":{"title":"Server-sent events","description":"Method of continuously sending data from a server to the browser, rather than repeatedly requesting it (EventSource interface, used to fall under HTML5)","spec":"http://www.w3.org/TR/eventsource/","status":"cr","links":[{"url":"http://www.html5rocks.com/tutorials/eventsource/basics/","title":"HTML5 Rocks tutorial"},{"url":"http://samshull.blogspot.com/2010/10/ajax-push-in-ios-safari-and-chrome-with.html","title":"Blog post with demo"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-eventsource","title":"has.js test"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"a","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"a","11":"a","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":74.58,"usage_perc_a":0.05,"ucprefix":false,"parent":"","keywords":"serversent,s-sent-events","ie_id":"serversenteventseventsource","chrome_id":"5311740673785856"},"x-doc-messaging":{"title":"Cross-document messaging","description":"Method of sending information from a page on one domain to a page on a different one (using postMessage)","spec":"https://html.spec.whatwg.org/multipage/comms.html#crossDocumentMessages","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/window.postMessage","title":"MDN article"},{"url":"http://html5demos.com/postmessage2","title":"Simple demo"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-crosswindowmessaging","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/web-messaging/MessagePort/postMessage","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"a","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y"}},"notes":"Partial support in IE8-9 refers to only working in frames/iframes (not other tabs/windows). Also in IE 9 and below an object cannot be sent using postMessage. Partial support in IE10 refers to [limitations in certain conditions](http://stackoverflow.com/questions/16226924/is-cross-origin-postmessage-broken-in-ie10)","notes_by_num":{},"usage_perc_y":81.48,"usage_perc_a":15.19,"ucprefix":false,"parent":"","keywords":"","ie_id":"postmessage","chrome_id":"4786174115708928"},"datauri":{"title":"Data URIs","description":"Method of embedding images and other files in webpages as a string of text","spec":"http://www.ietf.org/rfc/rfc2397.txt","status":"other","links":[{"url":"http://css-tricks.com/5970-data-uris/","title":"Information page"},{"url":"http://en.wikipedia.org/wiki/data_URI_scheme","title":"Wikipedia"},{"url":"http://www.websiteoptimization.com/speed/tweak/inline-images/","title":"Data URL converter"},{"url":"http://klevjers.com/papers/phishing.pdf","title":"Information on security issues"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"a","9":"a","10":"a","11":"a"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y"}},"notes":"Support in Internet Explorer 8 is limited to images and linked resources like CSS files, not HTML files. Max URI length in IE8 is 32KB. In IE9+ JavaScript files are supported too and the maximum size limit set to 4GB.","notes_by_num":{},"usage_perc_y":81.51,"usage_perc_a":15.19,"ucprefix":false,"parent":"","keywords":"data url,datauris,data uri,dataurl,dataurls,base64","ie_id":"","chrome_id":""},"mathml":{"title":"MathML","description":"Special tags that allow mathematical formulas and notations to be written on web pages.","spec":"http://www.w3.org/TR/MathML/","status":"rec","links":[{"url":"http://en.wikipedia.org/wiki/MathML","title":"Wikipedia"},{"url":"http://www.mozilla.org/projects/mathml/demo/","title":"MathML demos"},{"url":"http://www.mathjax.org","title":"Cross-browser support script"},{"url":"https://developer.mozilla.org/en/MathML/Element","title":"MDN element reference"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"n","10":"n","11":"n"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"y","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p","37":"p","38":"p","39":"p","40":"p","41":"p","42":"p"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"p","37":"p"},"bb":{"7":"p","10":"y"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"p"},"and_chr":{"38":"p"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"a"}},"notes":"Opera's support is limited to a CSS profile of MathML. Support was added in Chrome 24, but removed afterwards due to instability.","notes_by_num":{},"usage_perc_y":24.1,"usage_perc_a":3.14,"ucprefix":false,"parent":"","keywords":"","ie_id":"mathml","chrome_id":"5240822173794304"},"css-featurequeries":{"title":"CSS Feature Queries","description":"CSS Feature Queries allow authors to condition rules based on whether particular property declarations are supported in CSS using the @supports at rule.","spec":"http://www.w3.org/TR/css3-conditional/#at-supports","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/@supports","title":"MDN Article"},{"url":"http://mcc.id.au/blog/2012/08/supports","title":"@supports in Firefox"},{"url":"http://dabblet.com/gist/3895764","title":"Test case"},{"url":"http://docs.webplatform.org/wiki/css/atrules/@supports","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"See also the [CSS.supports() DOM API](#feat=css-supports-api)","notes_by_num":{},"usage_perc_y":58.49,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"supports,conditional","ie_id":"conditionalrules","chrome_id":"4993981813358592"},"xhtml":{"title":"XHTML served as application/xhtml+xml","description":"A strict form of HTML, and allows embedding of other XML languages","spec":"http://www.w3.org/TR/xhtml1/","status":"rec","links":[{"url":"http://en.wikipedia.org/wiki/XHTML","title":"Wikipedia"},{"url":"http://www.xmlplease.com/xhtml/xhtml5polyglot/","title":"Information on XHTML5"},{"url":"http://docs.webplatform.org/wiki/concepts/internet_and_web/the_web_standards_model#What_is_XHTML.3F","title":"WebPlatform Docs"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"The XHTML syntax is very close to HTML, and thus is almost always ([incorrectly](https://developer.mozilla.org/en-US/docs/XHTML#MIME_type_versus_DOCTYPE)) served as text/html on the web.","notes_by_num":{},"usage_perc_y":93.51,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"xhtml+xml","ie_id":"","chrome_id":""},"xhtmlsmil":{"title":"XHTML+SMIL animation","description":"Method of using SMIL animation in web pages","spec":"http://www.w3.org/TR/XHTMLplusSMIL/","status":"unoff","links":[{"url":"http://en.wikipedia.org/wiki/XHTML%2BSMIL","title":"Wikipedia"},{"url":"http://leunen.me/fakesmile/","title":"JS library to support XHTML+SMIL"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"a","7":"a","8":"a","9":"n","10":"n","11":"n"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p","37":"p","38":"p","39":"p","40":"p","41":"p","42":"p"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"p","6.1":"p","7":"p","7.1":"p","8":"p"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"p","12.1":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"p","37":"p"},"bb":{"7":"p","10":"p"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"p"},"and_chr":{"38":"p"},"and_ff":{"32":"p"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"p"}},"notes":"Internet Explorer supports the W3C proposal HTML+TIME, which is largely the same as XHTML+SMIL","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":3.41,"ucprefix":false,"parent":"xhtml","keywords":"","ie_id":"","chrome_id":""},"wai-aria":{"title":"WAI-ARIA Accessibility features","description":"Method of providing ways for people with disabilities to use dynamic web content and web applications.","spec":"http://www.w3.org/TR/wai-aria/","status":"rec","links":[{"url":"http://www.w3.org/WAI/intro/aria","title":"Information page"},{"url":"http://www.paciellogroup.com/blog/2011/10/browser-assistive-technology-tests-redux/","title":"Links to various test results"},{"url":"http://en.wikipedia.org/wiki/WAI-ARIA","title":"Wikipedia"},{"url":"http://www.alistapart.com/articles/the-accessibility-of-wai-aria/","title":"ALA Article"},{"url":"http://zufelt.ca/blog/are-you-confused-html5-and-wai-aria-yet","title":"HTML5/WAI-ARIA information"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"a","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"n","3.2":"n","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":27.89,"usage_perc_a":62.1,"ucprefix":false,"parent":"","keywords":"wai,aria","ie_id":"","chrome_id":""},"geolocation":{"title":"Geolocation","description":"Method of informing a website of the user's geographical location","spec":"http://www.w3.org/TR/geolocation-API/","status":"cr","links":[{"url":"http://html5demos.com/geo","title":"Simple demo"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-geolocation","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/geolocation","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"p","10.5":"p","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"n","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":90.47,"usage_perc_a":0.01,"ucprefix":false,"parent":"","keywords":"","ie_id":"geolocation","chrome_id":"6348855016685568"},"flexbox":{"title":"Flexible Box Layout Module","description":"Method of positioning elements in horizontal or vertical stacks.","spec":"http://www.w3.org/TR/css3-flexbox/","status":"cr","links":[{"url":"http://bennettfeely.com/flexplorer/","title":"Flexbox CSS generator"},{"url":"http://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html","title":"Article on using the latest spec"},{"url":"https://dev.opera.com/articles/view/advanced-cross-browser-flexbox/","title":"Tutorial on cross-browser support"},{"url":"http://philipwalton.github.io/solved-by-flexbox/","title":"Examples on how to solve common layout problems with flexbox"},{"url":"http://css-tricks.com/snippets/css/a-guide-to-flexbox/","title":"A Complete Guide to Flexbox"},{"url":"http://the-echoplex.net/flexyboxes/","title":"Flexbox playground and code generator"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x #2","11":"y"},"firefox":{"2":"a x #1","3":"a x #1","3.5":"a x #1","3.6":"a x #1","4":"a x #1","5":"a x #1","6":"a x #1","7":"a x #1","8":"a x #1","9":"a x #1","10":"a x #1","11":"a x #1","12":"a x #1","13":"a x #1","14":"a x #1","15":"a x #1","16":"a x #1","17":"a x #1","18":"a x #1","19":"a x #1","20":"a x #1","21":"a x #1","22":"a #3","23":"a #3","24":"a #3","25":"a #3","26":"a #3","27":"a #3","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a x #1","5":"a x #1","6":"a x #1","7":"a x #1","8":"a x #1","9":"a x #1","10":"a x #1","11":"a x #1","12":"a x #1","13":"a x #1","14":"a x #1","15":"a x #1","16":"a x #1","17":"a x #1","18":"a x #1","19":"a x #1","20":"a x #1","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a x #1","3.2":"a x #1","4":"a x #1","5":"a x #1","5.1":"a x #1","6":"a x #1","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y x","16":"y x","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a x #1","4.0-4.1":"a x #1","4.2-4.3":"a x #1","5.0-5.1":"a x #1","6.0-6.1":"a x #1","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x #1","2.2":"a x #1","2.3":"a x #1","3":"a x #1","4":"a x #1","4.1":"a x #1","4.2-4.3":"a x #1","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a x #1","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a x #2","11":"y"},"and_uc":{"9.9":"a x #1"}},"notes":"Most partial support refers to supporting an [older version](http://www.w3.org/TR/2009/WD-css3-flexbox-20090723/) of the specification or an [older syntax](http://www.w3.org/TR/2012/WD-css3-flexbox-20120322/).","notes_by_num":{"1":"Only supports the [old flexbox](http://www.w3.org/TR/2009/WD-css3-flexbox-20090723) specification and does not support wrapping.","2":"Only supports the [2012 syntax](http://www.w3.org/TR/2012/WD-css3-flexbox-20120322/)","3":"Does not support flex-wrap or flex-flow properties"},"usage_perc_y":76.33,"usage_perc_a":12.12,"ucprefix":false,"parent":"","keywords":"flex-box,flex-direction,flex-wrap,flex-flow,flex-grow,flex-basis","ie_id":"flexbox","chrome_id":"4837301406400512"},"webgl":{"title":"WebGL - 3D Canvas graphics","description":"Method of generating dynamic 3D graphics using JavaScript, accelerated through hardware","spec":"https://www.khronos.org/registry/webgl/specs/1.0/","status":"other","links":[{"url":"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation","title":"Instructions on enabling WebGL"},{"url":"http://www.khronos.org/webgl/wiki/Tutorial","title":"Tutorial"},{"url":"http://hacks.mozilla.org/2009/12/webgl-draft-released-today/","title":"Firefox blog post"},{"url":"http://webkit.org/blog/603/webgl-now-available-in-webkit-nightlies/","title":"Webkit blog post"},{"url":"https://github.com/iewebgl/iewebgl","title":"Polyfill for IE"}],"categories":["Canvas"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"p","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"a","12.1":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"a"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"a","12.1":"a","24":"y"},"and_chr":{"38":"a"},"and_ff":{"32":"a"},"ie_mob":{"10":"p","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Support listed as \"partial\" refers to the fact that not all users with these browsers have WebGL access. This is due to the additional requirement for users to have [up to date video drivers](http://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists). This problem was [solved in Chrome on Windows](http://blog.chromium.org/2012/02/gpu-accelerating-2d-canvas-and-enabling.html) as of version 18.\r\n\r\nNote that WebGL is part of the [Khronos Group](http://www.khronos.org/webgl/), not the W3C.","notes_by_num":{},"usage_perc_y":48.27,"usage_perc_a":26.37,"ucprefix":false,"parent":"canvas","keywords":"web gl","ie_id":"webglcanvas3d,webglinstancingextension","chrome_id":"6049512976023552"},"fileapi":{"title":"File API","description":"Method of manipulating file objects in web applications client-side, as well as programmatically selecting them and accessing their data.","spec":"http://www.w3.org/TR/FileAPI/","status":"wd","links":[{"url":"https://developer.mozilla.org/en/Using_files_from_web_applications","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/apis/file","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"a","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Safari and other WebKit browsers refers to lacking FileReader support. ","notes_by_num":{},"usage_perc_y":83.09,"usage_perc_a":4.34,"ucprefix":false,"parent":"","keywords":"FileReader","ie_id":"","chrome_id":""},"shadowdom":{"title":"Shadow DOM","description":"Method of establishing and maintaining functional boundaries between DOM trees and how these trees interact with each other within a document, thus enabling better functional encapsulation within the DOM.","spec":"http://www.w3.org/TR/shadow-dom/","status":"wd","links":[{"url":"http://html5-demos.appspot.com/static/shadowdom-visualizer/index.html","title":"Shadow DOM Visualizer"},{"url":"http://www.html5rocks.com/tutorials/webcomponents/shadowdom/","title":"HTML5Rocks - Shadow DOM 101 article"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Supported in Firefox behind the `dom.webcomponents.enabled` flag."},"usage_perc_y":46.62,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"web components","ie_id":"shadowdomunprefixed","chrome_id":"4507242028072960"},"websockets":{"title":"Web Sockets","description":"Bidirectional communication technology for web apps","spec":"http://www.w3.org/TR/websockets/","status":"cr","links":[{"url":"http://websocket.org/aboutwebsocket.html","title":"WebSockets information"},{"url":"http://updates.html5rocks.com/2011/08/What-s-different-in-the-new-WebSocket-protocol","title":"Details on newer protocol"},{"url":"http://en.wikipedia.org/wiki/WebSocket","title":"Wikipedia"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-websockets","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/websocket","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a #1","5":"a #1","6":"a x #2","7":"a x #2","8":"a x #2","9":"a x #2","10":"a x #2","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a #1","5":"a #1","6":"a #1","7":"a #1","8":"a #1","9":"a #1","10":"a #1","11":"a #1","12":"a #1","13":"a #1","14":"a #1","15":"a #2","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a #1","5.1":"a #1","6":"a #2","6.1":"a #2","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"a #1","11.1":"a #1","11.5":"a #1","11.6":"a #1","12":"a #1","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"a #1","5.0-5.1":"a #1","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y #1","10":"y"},"op_mob":{"10":"n","11":"a #1","11.1":"a #1","11.5":"a #1","12":"a #1","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Partial support refers to the websockets implementation using an older version of the protocol and/or the implementation being disabled by default (due to security issues with the older protocol).","2":"Partial support refers to lacking support for binary data. "},"usage_perc_y":82.72,"usage_perc_a":1.8,"ucprefix":true,"parent":"","keywords":"","ie_id":"websocket","chrome_id":"6555138000945152"},"hidden":{"title":"hidden attribute","description":"The `hidden` attribute may be applied to any element, and effectively hides elements similar to `display: none` in CSS.","spec":"http://www.w3.org/TR/html5/editing.html#the-hidden-attribute","status":"pr","links":[{"url":"http://davidwalsh.name/html5-hidden","title":"Article on hidden attribute"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"y"}},"notes":"The hidden state can be easily overridden with a CSS `display` property set to anything other than `none`.","notes_by_num":{},"usage_perc_y":88.1,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"script-async":{"title":"async attribute for external scripts","description":"The boolean async attribute on script elements allows the external JavaScript file to run when it's available, without delaying page load first.","spec":"https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async","status":"cr","links":[{"url":"https://developer.mozilla.org/en/HTML/Element/script#Attributes","title":"MDN article"},{"url":"http://ie.microsoft.com/testdrive/Performance/AsyncScripts/Default.html","title":"Demo"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/script.js#script-async","title":"has.js test"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Using script.async = false; to maintain execution order for dynamically-added scripts isn't supported in Safari 5.0","notes_by_num":{},"usage_perc_y":87.65,"usage_perc_a":0.15,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"cors":{"title":"Cross-Origin Resource Sharing","description":"Method of performing XMLHttpRequests across domains","spec":"http://www.w3.org/TR/cors/","status":"rec","links":[{"url":"http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/","title":"Mozilla Hacks blog post"},{"url":"http://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx","title":"Alternative implementation by IE8"},{"url":"https://dev.opera.com/articles/view/dom-access-control-using-cross-origin-resource-sharing/","title":"DOM access using CORS"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-cors-xhr","title":"has.js test"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"a","9":"a","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Supported somewhat in IE8 and IE9 using the XDomainRequest object (but has [limitations]( http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx))","notes_by_num":{},"usage_perc_y":88.39,"usage_perc_a":5.31,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"calc":{"title":"calc() as CSS unit value","description":"Method of allowing calculated values for length units, i.e. `width: calc(100% - 3em)`","spec":"http://www.w3.org/TR/css3-values/#calc","status":"cr","links":[{"url":"http://hacks.mozilla.org/2010/06/css3-calc/","title":"Mozilla Hacks article"},{"url":"https://developer.mozilla.org/en/CSS/-moz-calc","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/css/functions/calc","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a","4.4.3-4.4.4":"a","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"Support can be somewhat emulated in older versions of IE using the non-standard `expression()` syntax. Partial support in IE9 refers to the browser crashing when used as a `background-position` value. Partial support in Android Browser 4.4 refers to the browser lacking the ability to multiply and divide values.","notes_by_num":{},"usage_perc_y":77.04,"usage_perc_a":5.27,"ucprefix":false,"parent":"","keywords":"","ie_id":"csscalc","chrome_id":"5765241438732288"},"ruby":{"title":"Ruby annotation","description":"Method of adding pronunciation or other annotations using ruby elements (primarily used in East Asian typography)","spec":"http://www.w3.org/TR/html-markup/ruby.html","status":"wd","links":[{"url":"http://html5doctor.com/ruby-rt-rp-element/","title":"HTML5 Doctor article"},{"url":"http://docs.webplatform.org/wiki/html/elements/ruby","title":"WebPlatform Docs"},{"url":"https://addons.mozilla.org/firefox/addon/1935/","title":"Add-on \"XHTML Ruby Support\" for Firefox"},{"url":"https://addons.mozilla.org/firefox/addon/6812/","title":"Addon \"HTML Ruby\" for Firefox support"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p"},"chrome":{"4":"p","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"p","12.1":"p","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"p","10":"a"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"p"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"Browsers without native support can still simulate support using CSS. Partial support refers to only supporting basic ruby, may still be missing writing-mode, Complex ruby and CSS3 Ruby","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":80.68,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-opacity":{"title":"CSS3 Opacity","description":"Method of setting the transparency level of an element","spec":"http://www.w3.org/TR/css3-color/","status":"rec","links":[{"url":"http://www.css3files.com/color/#opacity","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/opacity","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Transparency for elements in IE8 and older can be achieved using the proprietary \"filter\" property and does not work well with PNG images using alpha transparency.","notes_by_num":{},"usage_perc_y":93.51,"usage_perc_a":3.42,"ucprefix":false,"parent":"","keywords":"transparent,transparency,alpha","ie_id":"","chrome_id":""},"form-validation":{"title":"Form validation","description":"Method of setting required fields and field types without requiring JavaScript","spec":"https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation","status":"wd","links":[{"url":"http://docs.webplatform.org/wiki/html/attributes/required","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y"}},"notes":"Partial support in Safari refers to lack of notice when form with required fields is attempted to be submitted. Partial support in IE10 mobile refers to lack of warning when blocking submission.","notes_by_num":{},"usage_perc_y":70.08,"usage_perc_a":3.72,"ucprefix":false,"parent":"forms","keywords":"","ie_id":"","chrome_id":"6091813840486400"},"history":{"title":"Session history management","description":"Method of manipulating the user's browser's session history in JavaScript using history.pushState, history.replaceState and the popstate event","spec":"https://html.spec.whatwg.org/multipage/browsers.html#dom-history-pushstate","status":"cr","links":[{"url":"http://www.adequatelygood.com/2010/7/Saner-HTML5-History-Management","title":"Introduction to history management"},{"url":"https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history","title":"MDN article"},{"url":"http://html5demos.com/history","title":"Demo page"},{"url":"https://github.com/browserstate/history.js","title":"History.js polyfill "},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-history-state","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/dom/History","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a","5.1":"a","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"a","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"y","2.3":"y","3":"n","4":"n","4.1":"n","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a"}},"notes":"Older iOS versions and Android 4.0.4 claim support, but implementation is too buggy to be useful.","notes_by_num":{},"usage_perc_y":83.01,"usage_perc_a":3.53,"ucprefix":false,"parent":"","keywords":"onpushstate,onreplacestate","ie_id":"","chrome_id":""},"json":{"title":"JSON parsing","description":"Method of converting JavaScript objects to JSON strings and JSON back to objects using JSON.stringify() and JSON.parse()","spec":"http://es5.github.com/#x15.12","status":"other","links":[{"url":"https://developer.mozilla.org/En/Using_native_JSON","title":"MDN article"},{"url":"http://www.json.org/js.html","title":"JSON in JS (includes script w/support)"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/json.js#json","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/apis/json","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Requires document to be in IE8+ [standards mode](http://msdn.microsoft.com/en-us/library/cc288325%28VS.85%29.aspx) to work in IE8.","notes_by_num":{},"usage_perc_y":96.58,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"classlist":{"title":"classList (DOMTokenList )","description":"Method of easily manipulating classes on elements, using the DOMTokenList object.","spec":"http://www.w3.org/TR/dom/#dom-element-classlist","status":"wd","links":[{"url":"http://hacks.mozilla.org/2010/01/classlist-in-firefox-3-6/","title":"Mozilla Hacks article"},{"url":"https://github.com/eligrey/classList.js","title":"Polyfill script"},{"url":"http://docs.webplatform.org/wiki/dom/Element/classList","title":"WebPlatform Docs"},{"url":"http://www.sitepoint.com/exploring-classlist-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/classlist-api-demo.html","title":"Demo using classList"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"p","6":"p","7":"p","8":"p","9":"p","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"p","11":"p","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":87.9,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"text-overflow":{"title":"CSS3 Text-overflow","description":"Append ellipsis when text overflows its containing element","spec":"http://www.w3.org/TR/css3-ui/#text-overflow0","status":"wd","links":[{"url":"https://github.com/rmorse/AutoEllipsis","title":"jQuery polyfill for Firefox"},{"url":"https://developer.mozilla.org/En/CSS/Text-overflow","title":"MDN article"},{"url":"http://www.css3files.com/text/","title":"Information page"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-text-overflow","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/css/properties/text-overflow","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y x","9.5-9.6":"y x","10.0-10.1":"y x","10.5":"y x","10.6":"y x","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y x","11":"y x","11.1":"y x","11.5":"y x","12":"y x","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":96.69,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"textoverflow,ellipsis","ie_id":"","chrome_id":""},"webm":{"title":"WebM video format","description":"Multimedia format designed to provide a royalty-free, high-quality open video compression format for use with HTML5 video. WebM supports the video codec VP8 and VP9.","spec":"http://www.webmproject.org/","status":"other","links":[{"url":"https://tools.google.com/dlpage/webmmf","title":"Codec for IE9 support"},{"url":"http://www.broken-links.com/2010/09/01/playing-webm-in-safari-with-plugins/","title":"Info on supporting WebM in Safari"},{"url":"http://webmproject.org","title":"Official website"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/video.js#video-webm","title":"has.js test"},{"url":"http://perian.org/","title":"Perian :Mac OSX Webm Codec install"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"p","10":"p","11":"p"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"p","4":"p","5":"p","5.1":"p","6":"p","6.1":"p","7":"p","7.1":"p","8":"p"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"a","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"y"}},"notes":"Will work in IE9+ and Safari/MacOSX provided the user has the WebM codecs installed. Partial support indicates that at least one codec is supported but not all.","notes_by_num":{},"usage_perc_y":57.73,"usage_perc_a":9,"ucprefix":false,"parent":"video","keywords":"matroska","ie_id":"","chrome_id":"6362186595172352"},"mpeg4":{"title":"MPEG-4/H.264 video format","description":"Commonly used video compression format (not royalty-free)","spec":"http://ip.hhi.de/imagecom_G1/assets/pdfs/csvt_overview_0305.pdf","status":"other","links":[{"url":"http://en.wikipedia.org/wiki/H.264/MPEG-4_AVC","title":"Wikipedia article"},{"url":"http://www.interoperabilitybridges.com/html5-extension-for-wmp-plugin","title":"Firefox extension allowing support in Win7"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"a"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a"}},"notes":"The Android 2.3 browser currently requires [specific handling](http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/) to play videos\r\n\r\nFirefox supports H.264 on Windows 7 and later since version 21. Firefox supports H.264 on Linux since version 26 if the appropriate gstreamer plug-ins are installed.\r\n\r\nPartial support for Firefox refers to the lack of support in OSX & some Linux platforms, for Android Firefox it refers to the inability of hardware acceleration.","notes_by_num":{},"usage_perc_y":70.53,"usage_perc_a":18.41,"ucprefix":false,"parent":"video","keywords":"avc,mp4,mpv,mov,aac,h264","ie_id":"","chrome_id":""},"ogv":{"title":"Ogg/Theora video format","description":"Free lossy video compression format.","spec":"http://theora.org/doc/","status":"other","links":[{"url":"http://en.wikipedia.org/wiki/Theora","title":"Wikipedia article"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"p","10":"p","11":"p"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":50.5,"usage_perc_a":0,"ucprefix":false,"parent":"video","keywords":"xiph","ie_id":"","chrome_id":""},"wordwrap":{"title":"CSS3 Overflow-wrap","description":"Allows lines to be broken within words if an otherwise unbreakable string is too long to fit. Currently mostly supported using the `word-wrap` property.","spec":"http://www.w3.org/TR/css3-text/#overflow-wrap","status":"wd","links":[{"url":"https://developer.mozilla.org/En/CSS/Word-wrap","title":"MDN article"},{"url":"http://www.css3files.com/text/#wordwrap","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/properties/word-wrap","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"a","3.6":"a","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"a","5.1":"a","6":"a","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a","10":"y"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"a"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"Partial support refers to requiring the legacy name \"word-wrap\" (rather than overflow-wrap) to work.","notes_by_num":{},"usage_perc_y":57.24,"usage_perc_a":39.59,"ucprefix":false,"parent":"","keywords":"wordwrap,word-wrap","ie_id":"","chrome_id":""},"progressmeter":{"title":"Progress & Meter","description":"Method of indicating a progress state (progress element) or the current level of a gauge (meter element).\r\n","spec":"https://html.spec.whatwg.org/multipage/forms.html#the-progress-element","status":"wd","links":[{"url":"https://dev.opera.com/articles/new-form-features-in-html5/#newoutput","title":"Dev.Opera article"},{"url":"http://html5doctor.com/measure-up-with-the-meter-tag/","title":"HTML5 Doctor on meter element "},{"url":"http://peter.sh/examples/?/html/meter-progress.html","title":"Examples of progress and meter elements"},{"url":"http://docs.webplatform.org/wiki/html/elements/progress","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"y"}},"notes":"Partial support in Firefox 6-15, IE10 & iOS7 Safari refers to supporting the progress element, but not the meter element. iOS7 Safari also does not support \"indeterminate\" progress elements.","notes_by_num":{},"usage_perc_y":65.33,"usage_perc_a":18.12,"ucprefix":false,"parent":"forms","keywords":"","ie_id":"","chrome_id":""},"object-fit":{"title":"CSS3 object-fit/object-position","description":"Method of specifying how an object (image or video) should fit inside its box. object-fit options include \"contain\" (fit according to aspect ratio), \"fill\" (stretches object to fill) and \"cover\" (overflows box but maintains ratio), where object-position allows the object to be repositioned like background-image does.","spec":"http://www.w3.org/TR/css3-images/","status":"cr","links":[{"url":"https://dev.opera.com/articles/view/css3-object-fit-object-position/","title":"Dev.Opera article"},{"url":"http://docs.webplatform.org/wiki/css/properties/object-fit","title":"WebPlatform Docs"},{"url":"https://github.com/anselmh/object-fit","title":"object-fit JavaScript-Polyfill"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"a #1","8":"a #1"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"y x","11":"y x","11.1":"y x","11.5":"y x","11.6":"y x","12":"y x","12.1":"y x","15":"n","16":"n","17":"n","18":"n","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"a #1","8.1":"a #1"},"op_mini":{"5.0-8.0":"y x"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"y x","11.1":"y x","11.5":"y x","12":"y x","12.1":"y x","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Partial support in Safari refers to support for `object-fit` but not `object-position`."},"usage_perc_y":46.68,"usage_perc_a":5.38,"ucprefix":false,"parent":"","keywords":"objectfit,objectposition","ie_id":"objectfitandobjectposition","chrome_id":"5302669702856704"},"xhr2":{"title":"XMLHttpRequest 2","description":"Adds more functionality to AJAX requests like file uploads, transfer progress information and the ability to send form data.","spec":"http://www.w3.org/TR/XMLHttpRequest2/","status":"wd","links":[{"url":"https://developer.mozilla.org/en/XMLHttpRequest/FormData","title":"MDN article on FormData"},{"url":"https://github.com/3nr1c/jUri.js","title":"Polyfill for FormData object"},{"url":"http://docs.webplatform.org/wiki/apis/xhr/XMLHttpRequest","title":"WebPlatform Docs"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"a","3.6":"a","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"u","5":"u","6":"u","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":87.96,"usage_perc_a":0.11,"ucprefix":false,"parent":"","keywords":"formdata","ie_id":"","chrome_id":""},"minmaxwh":{"title":"CSS min/max-width/height","description":"Method of setting a minimum or maximum width or height to an element. ","spec":"http://www.w3.org/TR/CSS21/visudet.html#min-max-widths","status":"rec","links":[{"url":"http://code.google.com/p/ie7-js/","title":"JS library with support"},{"url":"http://docs.webplatform.org/wiki/css/properties/min-width","title":"WebPlatform Docs"},{"url":"http://www.impressivewebs.com/min-max-width-height-css/","title":"CSS Basics post"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"p","6":"p","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"IE7 does not support \"inherit\" as a value on any of these properties. IE8 has some bugs with max-width/height combined with overflow: auto/scroll.","notes_by_num":{},"usage_perc_y":96.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"min-width,min-height,max-width,max-height","ie_id":"","chrome_id":""},"details":{"title":"Details & Summary elements","description":"The <details> element generates a simple no-JavaScript widget to show/hide element contents, optionally by clicking on its child <summary> element.","spec":"https://html.spec.whatwg.org/multipage/forms.html#the-details-element","status":"wd","links":[{"url":"https://mathiasbynens.be/notes/html5-details-jquery","title":"jQuery fallback script"},{"url":"https://gist.github.com/370590","title":"Fallback script"},{"url":"http://html5doctor.com/summary-figcaption-element/","title":"HTML5 Doctor article"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-details","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/details","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"p","10":"y"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":64.34,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"detailssummary","chrome_id":"5348024557502464"},"text-stroke":{"title":"CSS text-stroke","description":"Method of declaring the outline (stroke) width and color for text.","spec":"http://developer.apple.com/library/safari/documentation/appleapplications/reference/SafariCSSRef/Articles/StandardCSSProperties.html#//apple_ref/doc/uid/TP30001266-_webkit_text_stroke","status":"unoff","links":[{"url":"http://css-tricks.com/7405-adding-stroke-to-web-text/","title":"Information & workarounds"},{"url":"http://www.westciv.com/tools/textStroke/","title":"Live editor"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"u","35":"u","36":"u"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"a x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"n","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Does not yet appear in any W3C specification. Was briefly included in a spec as the \"text-outline\" property, but this was removed.","notes_by_num":{},"usage_perc_y":62.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"textstroke,stroke-color,stroke-width,fill-color","ie_id":"","chrome_id":""},"inline-block":{"title":"CSS inline-block","description":"Method of displaying an element as a block while flowing it with text. ","spec":"http://www.w3.org/TR/CSS21/visuren.html#fixed-positioning","status":"rec","links":[{"url":"http://robertnyman.com/2010/02/24/css-display-inline-block-why-it-rocks-and-why-it-sucks/","title":"Blog post w/info"},{"url":"http://blog.mozilla.com/webdev/2009/02/20/cross-browser-inline-block/","title":"Info on cross browser support"},{"url":"http://docs.webplatform.org/wiki/css/properties/display","title":"WebPlatform Docs"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"a x","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Only supported in IE6 and IE7 on elements with a display of \"inline\" by default. [Alternative properties](http://blog.mozilla.com/webdev/2009/02/20/cross-browser-inline-block/) are available to provide complete cross-browser support.","notes_by_num":{},"usage_perc_y":96.68,"usage_perc_a":0.25,"ucprefix":false,"parent":"","keywords":"inlineblock","ie_id":"","chrome_id":""},"notifications":{"title":"Web Notifications","description":"Method of alerting the user outside of a web page by displaying notifications (that do not require interaction by the user).","spec":"http://www.w3.org/TR/notifications/","status":"wd","links":[{"url":"http://www.html5rocks.com/tutorials/notifications/quick/","title":"HTML5 Rocks tutorial"},{"url":"http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification","title":"Chromium API"},{"url":"https://addons.mozilla.org/en-us/firefox/addon/221523/","title":"Add-on "},{"url":"https://developer.mozilla.org/en-US/docs/Web/API/notification","title":"MDN Notifications"},{"url":"http://www.sitepoint.com/introduction-web-notifications-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/web-notifications-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a x","4.4.3-4.4.4":"a x","37":"a x"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a x"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":48.24,"usage_perc_a":3.72,"ucprefix":false,"parent":"","keywords":"","ie_id":"webnotifications","chrome_id":"5064350557536256"},"stream":{"title":"getUserMedia/Stream API","description":"Method of accessing external device data (such as a webcam video stream). Formerly this was envisioned as the <device> element.","spec":"http://www.w3.org/TR/mediacapture-streams/","status":"wd","links":[{"url":"https://dev.opera.com/blog/webcam-orientation-preview/","title":"Technology preview from Opera"},{"url":"http://docs.webplatform.org/wiki/dom/Navigator/getUserMedia","title":"WebPlatform Docs"}],"categories":["HTML5","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"y","12.1":"y","15":"n","16":"n","17":"n","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y x"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"y x"},"and_chr":{"38":"y"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y x"}},"notes":"","notes_by_num":{},"usage_perc_y":59.01,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"camera,device,getUserMedia,media stream,Media Capture API","ie_id":"mediacaptureandstreams","chrome_id":"6067380039974912,6605041225957376"},"svg-img":{"title":"SVG in HTML img element","description":"Method of displaying SVG images in HTML using <img>","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html","status":"cr","links":[{"url":"http://blog.dholbert.org/2010/10/svg-as-image.html","title":"Blog post with examples"},{"url":"http://www.codedread.com/blog/","title":"Blog with SVGs an images"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"a","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.13,"usage_perc_a":0.01,"ucprefix":false,"parent":"","keywords":"svg-as-img,svg-in-img","ie_id":"","chrome_id":""},"datalist":{"title":"Datalist element","description":"Method of setting a list of options for a user to select in a text field, while leaving the ability to enter a custom value.","spec":"https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element","status":"wd","links":[{"url":"http://hacks.mozilla.org/2010/11/firefox-4-html5-forms/","title":"Mozilla Hacks article"},{"url":"http://afarkas.github.com/webshim/demos/","title":"HTML5 Library including datalist support"},{"url":"https://developer.mozilla.org/en/HTML/Element/datalist","title":"MDN reference"},{"url":"http://docs.webplatform.org/wiki/html/elements/datalist","title":"WebPlatform Docs"},{"url":"http://demo.agektmr.com/datalist/","title":"Eiji Kitamura's options demos & tests"},{"url":"http://github.com/thgreasi/datalist-polyfill","title":"Minimal Datalist polyfill w/tutorial"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"a","11":"a"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"p","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"p"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"y"}},"notes":"Partial support in IE10 refers to [significantly buggy behavior](http://playground.onereason.eu/2013/04/ie10s-lousy-support-for-datalists/).","notes_by_num":{},"usage_perc_y":60.35,"usage_perc_a":9.42,"ucprefix":false,"parent":"forms","keywords":"list attribute","ie_id":"datalistelement","chrome_id":"6090950820495360"},"dataset":{"title":"dataset & data-* attributes","description":"Method of applying and accessing custom data to elements.","spec":"https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes","status":"wd","links":[{"url":"http://html5doctor.com/html5-custom-data-attributes/","title":"HTML5 Doctor article"},{"url":"http://html5demos.com/dataset","title":"Demo using dataset"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/dom.js#dom-dataset","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/attributes/data-*","title":"WebPlatform Docs"},{"url":"https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset","title":"MDN Reference - dataset"},{"url":"https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes","title":"MDN Guide - Using data-* attributes"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"y"},"firefox":{"2":"a","3":"a","3.5":"a","3.6":"a","4":"a","5":"a","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"a","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"a","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"a","11":"a","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support refers to being able to use `data-*` attributes and access them using `getAttribute`. \r\n\r\n\"Supported\" refers to accessing the values using the `dataset` property. Current spec only refers to support on HTML elements, only some browsers also have support for SVG/MathML elements.","notes_by_num":{},"usage_perc_y":85.32,"usage_perc_a":11.61,"ucprefix":false,"parent":"","keywords":"DOMStringMap","ie_id":"","chrome_id":""},"css-grid":{"title":"CSS Grid Layout","description":"Method of using a grid concept to lay out content, providing a mechanism for authors to divide available space for lay out into columns and rows using a set of predictable sizing behaviors","spec":"http://www.w3.org/TR/css3-grid-layout/","status":"wd","links":[{"url":"http://blogs.msdn.com/b/ie/archive/2011/04/14/ie10-platform-preview-and-css-features-for-adaptive-layouts.aspx","title":"IE Blog post"},{"url":"https://bugs.webkit.org/show_bug.cgi?id=60731","title":"Webkit (Chrome, Safari, etc.) feature request"},{"url":"https://bugzilla.mozilla.org/show_bug.cgi?id=616605","title":"Mozilla (Firefox) feature request"},{"url":"https://github.com/codler/Grid-Layout-Polyfill","title":"Polyfill based on old spec"},{"url":"https://github.com/FremyCompany/css-grid-polyfill/","title":"Polyfill based on new spec"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"p","10":"a x #2","11":"a x #2"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"u","35":"u","36":"u"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"p","26":"p","27":"p","28":"p","29":"p d #1","30":"p d #1","31":"p d #1","32":"p d #1","33":"p d #1","34":"p d #1","35":"p d #1","36":"p d #1","37":"p d #1","38":"p d #1","39":"p d #1","40":"p d #1","41":"p d #1","42":"p d #1"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"p","6.1":"p","7":"p","7.1":"p","8":"p"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"p","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"p","37":"p"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"p"},"and_chr":{"38":"p"},"and_ff":{"32":"n"},"ie_mob":{"10":"a x #2","11":"a x #2"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags","2":"Partial support in IE refers to supporting an [older version](http://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/) of the specification."},"usage_perc_y":0,"usage_perc_a":9.87,"ucprefix":false,"parent":"","keywords":"grids,grid-row,grid-column","ie_id":"grid","chrome_id":"4589636412243968"},"menu":{"title":"Toolbar/context menu","description":"Method of defining a toolbar menu, a context menu or a list of (interactive) options using the <menu> element.","spec":"https://html.spec.whatwg.org/multipage/forms.html#the-menu-element","status":"cr","links":[{"url":"https://bug617528.bugzilla.mozilla.org/attachment.cgi?id=554309","title":"Demo"},{"url":"http://addyosmani.github.com/jQuery-contextMenu/","title":"jQuery polyfill"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/events.js#event-contextmenu","title":"has.js test"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support in Firefox refers to being limited to context menus, not toolbar menus.","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":12.32,"ucprefix":false,"parent":"","keywords":"contextmenu,menuitem,command","ie_id":"","chrome_id":""},"rem":{"title":"rem (root em) units","description":"Type of unit similar to \"em\", but relative only to the root element, not any parent element. Thus compounding does not occur as it does with \"em\" units.","spec":"http://www.w3.org/TR/css3-values/#font-relative-lengths","status":"cr","links":[{"url":"http://snook.ca/archives/html_and_css/font-size-with-rem","title":"Article on usage"},{"url":"https://github.com/chuckcarpenter/REM-unit-polyfill","title":"REM Polyfill"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"u","5":"u","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":90.41,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"rems","ie_id":"","chrome_id":""},"ttf":{"title":"TTF/OTF - TrueType and OpenType font support","description":"Support for the TrueType (.ttf)and OpenType (.otf) outline font formats in @font-face. ","spec":"http://developer.apple.com/fonts/TTRefMan/index.html","status":"other","links":[{"url":"http://stackoverflow.com/questions/17694143/what-is-the-status-of-ttf-support-in-internet-explorer","title":"What is the status of TTF support in Internet Explorer?"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"u","11":"u"},"and_uc":{"9.9":"y"}},"notes":"Partial support in IE9 refers to the fonts only working [when set to be \"installable\"](http://blogs.msdn.com/b/ie/archive/2010/07/15/the-css-corner-better-web-typography-for-better-design.aspx).","notes_by_num":{},"usage_perc_y":78.61,"usage_perc_a":11.54,"ucprefix":false,"parent":"fontface","keywords":"","ie_id":"","chrome_id":""},"touch":{"title":"Touch events","description":"Method of registering when, where and how the interface is touched, for devices with a touch screen. These DOM events are similar to mousedown, mousemove, etc.","spec":"http://www.w3.org/TR/touch-events/","status":"rec","links":[{"url":"http://www.quirksmode.org/mobile/tableTouch.html","title":"Detailed support tables"},{"url":"http://www.quirksmode.org/m/tests/drag2.html","title":"Multi-touch demo"},{"url":"http://schepers.cc/getintouch","title":"Information on the spec development"},{"url":"http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx","title":"Internet Explorer's gesture and touch implementation."},{"url":"http://github.com/CamHenlin/TouchPolyfill","title":"Touch polyfill for supporting touch events on Internet Explorer"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"p","11":"p"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"n d #1","26":"n d #1","27":"n d #1","28":"n d #1","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"y"}},"notes":"Internet Explorer implements Pointer Events specification which supports more input devices than Touch Events one.\r\n\r\nThere is a library on GitHub that is working toward bringing W3C touch events to IE 10 and 11: https://github.com/CamHenlin/TouchPolyfill \r\n\r\nRemoved support in Firefox refers to desktop Firefox only.","notes_by_num":{"1":"Can be enabled in Firefox using the dom.w3c_touch_events.enabled flag (disabled by default for site compatibility reasons)"},"usage_perc_y":62.3,"usage_perc_a":0.48,"ucprefix":false,"parent":"","keywords":"touchstart,touchend,touchmove,touchenter,touchleave,touchcancel","ie_id":"touchevents","chrome_id":"6296903092273152"},"matchesselector":{"title":"matches() DOM method","description":"Method of testing whether or not a DOM element matches a given selector. Formerly known (and largely supported with prefix) as matchesSelector.","spec":"http://www.w3.org/TR/selectors-api2/","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/Element.mozMatchesSelector","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/dom/HTMLElement/matchesSelector","title":"WebPlatform Docs"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a x","10":"a x","11":"a x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"a x","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"y","35":"y","36":"y"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a x","5.1":"a x","6":"a x","6.1":"a x","7":"a x","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"a x","11.6":"a x","12":"a x","12.1":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"a x","4.2-4.3":"a x","5.0-5.1":"a x","6.0-6.1":"a x","7.0-7.1":"a x","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"a x","2.3":"a x","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"a x","4.4.3-4.4.4":"a x","37":"y"},"bb":{"7":"a x","10":"a x"},"op_mob":{"10":"n","11":"n","11.1":"a x","11.5":"a x","12":"a x","12.1":"a x","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"a x"},"ie_mob":{"10":"a x","11":"a x"},"and_uc":{"9.9":"a x"}},"notes":"Partial support refers to supporting the older specification's \"matchesSelector\" name rather than just \"matches\".","notes_by_num":{},"usage_perc_y":46.71,"usage_perc_a":43.74,"ucprefix":false,"parent":"","keywords":" matchesSelector","ie_id":"","chrome_id":""},"pointer-events":{"title":"CSS pointer-events (for HTML)","description":"This CSS property, when set to \"none\" allows elements to not receive hover/click events, instead the event will occur on anything behind it. ","spec":"http://wiki.csswg.org/spec/css4-ui#pointer-events","status":"unoff","links":[{"url":"http://robertnyman.com/2010/03/22/css-pointer-events-to-allow-clicks-on-underlying-elements/","title":"Article & tutorial"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-pointerevents","title":"has.js test"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Already part of the SVG specification, and all SVG-supporting browsers appear to support the property on SVG elements.","notes_by_num":{},"usage_perc_y":85.67,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"pointerevents","ie_id":"csspointerevents","chrome_id":""},"blobbuilder":{"title":"Blob constructing","description":"Construct Blobs (binary large objects) either using the BlobBuilder API (deprecated) or the Blob constructor.","spec":"http://www.w3.org/TR/file-writer-api/#the-blobbuilder-interface","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/BlobBuilder","title":"MDN article on BlobBuilder"},{"url":"https://developer.mozilla.org/en-US/docs/DOM/Blob","title":"MDN article on Blobs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"a x","4.4.3-4.4.4":"a x","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a x"}},"notes":"Partial support refers to only supporting the now deprecated BlobBuilder to create blobs.","notes_by_num":{},"usage_perc_y":76.97,"usage_perc_a":10.11,"ucprefix":true,"parent":"fileapi","keywords":"","ie_id":"blob","chrome_id":"5328783104016384"},"filereader":{"title":"FileReader API","description":"Method of reading the contents of a File or Blob object into memory","spec":"http://www.w3.org/TR/FileAPI/#dfn-filereader","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/FileReader","title":"FileReader API"},{"url":"http://docs.webplatform.org/wiki/apis/file/FileReader","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":87.3,"usage_perc_a":0,"ucprefix":false,"parent":"fileapi","keywords":"","ie_id":"filereader","chrome_id":"5171003185430528"},"filesystem":{"title":"Filesystem & FileWriter API","description":"Method of reading and writing files to a sandboxed file system.","spec":"http://www.w3.org/TR/file-system-api/","status":"unoff","links":[{"url":"http://www.html5rocks.com/en/tutorials/file/filesystem/","title":"HTML5 Rocks tutorial"},{"url":"http://docs.webplatform.org/wiki/apis/filesystem","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"The File API: Directories and System specification is no longer being maintained and support may be dropped in future versions.","notes_by_num":{},"usage_perc_y":44.01,"usage_perc_a":0.18,"ucprefix":false,"parent":"","keywords":"filewriter","ie_id":"filewriter","chrome_id":"5452478162141184"},"bloburls":{"title":"Blob URLs","description":"Method of creating URL handles to the specified File or Blob object.","spec":"http://www.w3.org/TR/FileAPI/#url","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/window.URL.createObjectURL","title":"MDN article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"","notes_by_num":{},"usage_perc_y":86.44,"usage_perc_a":0,"ucprefix":false,"parent":"fileapi","keywords":"createobjecturl","ie_id":"","chrome_id":""},"rellist":{"title":"relList (DOMTokenList)","description":"Method of easily manipulating rel attribute values on elements, using the DOMTokenList object (similar to classList).","spec":"https://html.spec.whatwg.org/multipage/semantics.html#dom-a-rellist","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/DOM/DOMTokenList","title":"MDN - DOMTokenList"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":11.18,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"typedarrays":{"title":"Typed Arrays","description":"JavaScript typed arrays provide a mechanism for accessing raw binary data much more efficiently.\r\n","spec":"http://www.khronos.org/registry/typedarray/specs/latest/","status":"other","links":[{"url":"https://developer.mozilla.org/en/javascript_typed_arrays","title":"MDN article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a #1","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"a #2","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"a #2","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a #1","11":"a #1"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"IE10 (and IE 10&11 mobile) does not support `Uint8ClampedArray`"},"usage_perc_y":84.74,"usage_perc_a":2.98,"ucprefix":false,"parent":"","keywords":"float64array,dataview,uint8array","ie_id":"typedarrays","chrome_id":"5135818813341696"},"deviceorientation":{"title":"DeviceOrientation events","description":"API for detecting orientation and motion events from the device running the browser.","spec":"http://www.w3.org/TR/orientation-event/","status":"wd","links":[{"url":"http://www.html5rocks.com/en/tutorials/device/orientation/","title":"HTML5 Rocks tutorial"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-orientation","title":"has.js test"},{"url":"http://html5labs.interoperabilitybridges.com/prototypes/device-orientation-events/device-orientation-events/info","title":"DeviceOrientation implementation prototype for IE10"},{"url":"http://aurelio.audero.it/demo/device-orientation-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"p","4":"p","5":"p","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a"},"chrome":{"4":"n","5":"n","6":"n","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"y","12.1":"y","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"a"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"a"}},"notes":"Partial support refers to the lack of compassneedscalibration event. Partial support also refers to the lack of devicemotion event support for Chrome 30- and Opera. Opera Mobile 14 lost the ondevicemotion event support. Firefox 3.6, 4 and 5 support the non-standard [MozOrientation](https://developer.mozilla.org/en/DOM/MozOrientation) event.","notes_by_num":{},"usage_perc_y":0.04,"usage_perc_a":81.86,"ucprefix":false,"parent":"","keywords":"","ie_id":"deviceorientation,devicemotion","chrome_id":"5874690627207168,5556931766779904"},"script-defer":{"title":"defer attribute for external scripts","description":"The boolean defer attribute on script elements allows the external JavaScript file to run when the DOM is loaded, without delaying page load first.","spec":"https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer","status":"cr","links":[{"url":"https://developer.mozilla.org/en/HTML/Element/script#Attributes","title":"MDN article"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/script.js#script-defer","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/attributes/defer","title":"WebPlatform Docs"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"a","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older IE refers to a buggy implementation (see issue)","notes_by_num":{},"usage_perc_y":87.82,"usage_perc_a":5.55,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"nav-timing":{"title":"Navigation Timing API","description":"API for accessing timing information related to navigation and elements.","spec":"http://www.w3.org/TR/navigation-timing/","status":"rec","links":[{"url":"https://developer.mozilla.org/en/API/navigationTiming","title":"MDN article"},{"url":"http://www.html5rocks.com/en/tutorials/webperformance/basics/","title":"HTML5 Rocks tutorial"},{"url":"http://docs.webplatform.org/wiki/apis/navigation_timing","title":"WebPlatform Docs"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Removed in iOS 8.1 due to poor performance.","notes_by_num":{},"usage_perc_y":81.71,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"performance,performance.timing","ie_id":"navigationtimingapi","chrome_id":"5584144679567360"},"audio-api":{"title":"Web Audio API","description":"High-level JavaScript API for processing and synthesizing audio","spec":"http://www.w3.org/TR/webaudio/","status":"wd","links":[{"url":"https://github.com/corbanbrook/audionode.js","title":"Polyfill to support Web Audio API in Firefox"},{"url":"http://docs.webplatform.org/wiki/apis/webaudio","title":"WebPlatform Docs"},{"url":"http://www.doboism.com/projects/webaudio-compatibility/","title":"Additional browser compatibility tests for specific features"},{"url":"https://github.com/g200kg/WAAPISim","title":"Polyfill to enable Web Audio API through Firefox Audio Data api or flash"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"u"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Firefox versions < 25 support an alternative, deprecated audio API.\r\n\r\nChrome support [went through some changes](http://updates.html5rocks.com/2014/07/Web-Audio-Changes-in-m36) as of version 36.","notes_by_num":{},"usage_perc_y":66.6,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"web-audio","ie_id":"webaudioapi","chrome_id":"6261718720184320"},"css-regions":{"title":"CSS Regions","description":"Method of flowing content into multiple elements.","spec":"http://www.w3.org/TR/css3-regions/","status":"wd","links":[{"url":"http://html.adobe.com/webstandards/cssregions/","title":"Adobe demos and samples"},{"url":"http://msdn.microsoft.com/en-us/ie/hh272902#_CSSConnected","title":"IE10 developer guide info"},{"url":"http://docs.webplatform.org/wiki/css/atrules/@region","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x","11":"a x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"a x","16":"a x","17":"a x","18":"a x","19":"n d","20":"n d","21":"n d","22":"n d","23":"n d","24":"n d","25":"n d","26":"n d","27":"n d","28":"n d","29":"n d","30":"n d","31":"n d","32":"n d","33":"n d","34":"n d","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"a x","11":"a x"},"and_uc":{"9.9":"y x"}},"notes":"Support in IE10 and IE11 is limited to using an iframe as a content source with the `-ms-flow-into: flow_name;` and `-ms-flow-from: flow_name;` syntax. ","notes_by_num":{},"usage_perc_y":13.23,"usage_perc_a":9.97,"ucprefix":false,"parent":"","keywords":"","ie_id":"regions","chrome_id":"5655612935372800"},"spellcheck-attribute":{"title":"Spellcheck attribute","description":"Attribute for `input`/`textarea` fields to enable/disable the browser's spellchecker.","spec":"https://html.spec.whatwg.org/multipage/interaction.html#spelling-and-grammar-checking","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/HTML/Controlling_spell_checking_in_HTML_formsControlling_spell_checking_in_HTML_forms","title":"MDN article"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"a","10":"a"},"op_mob":{"10":"a","11":"a","11.1":"a","11.5":"a","12":"a","12.1":"a","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"a"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"The partial support in mobile browsers results from their OS generally having built-in spell checking instead of using the wavy underline to indicate misspelled words. `spellcheck=\"false\"` does not seem to have any effect in these browsers.","notes_by_num":{},"usage_perc_y":59.99,"usage_perc_a":31.04,"ucprefix":false,"parent":"","keywords":"spelling","ie_id":"","chrome_id":""},"fullscreen":{"title":"Full Screen API","description":"API for allowing content (like a video or canvas element) to take up the entire screen.","spec":"http://www.w3.org/TR/fullscreen/","status":"wd","links":[{"url":"https://developer.mozilla.org/en/DOM/Using_full-screen_mode","title":"MDN article"},{"url":"http://jlongster.com/2011/11/21/canvas.html","title":"Blog post"},{"url":"http://hacks.mozilla.org/2012/01/using-the-fullscreen-api-in-web-browsers/","title":"Mozilla hacks article"},{"url":"http://docs.webplatform.org/wiki/dom/Element/requestFullscreen","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"a x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"a x"},"ie_mob":{"10":"n","11":"y x"},"and_uc":{"9.9":"n"}},"notes":"Partial support refers to supporting an earlier draft of the spec.","notes_by_num":{},"usage_perc_y":54.02,"usage_perc_a":13.03,"ucprefix":false,"parent":"","keywords":"full-screen","ie_id":"fullscreenapi","chrome_id":"5259513871466496"},"requestanimationframe":{"title":"requestAnimationFrame","description":"API allowing a more efficient way of running script-based animation, compared to traditional methods using timeouts.","spec":"http://www.w3.org/TR/animation-timing/#requestAnimationFrame","status":"cr","links":[{"url":"http://paulirish.com/2011/requestanimationframe-for-smart-animating/","title":"Blog post"},{"url":"http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/","title":"Mozilla Hacks article"},{"url":"http://docs.webplatform.org/wiki/dom/Window/requestAnimationFrame","title":"WebPlatform Docs"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":83.36,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"requestanimationframe","chrome_id":"5233400470306816"},"input-range":{"title":"Range input type","description":"Form field type that allows the user to select a value using a slider widget.","spec":"https://html.spec.whatwg.org/multipage/forms.html#range-state-(type=range)","status":"wd","links":[{"url":"https://github.com/fryn/html5slider","title":"Polyfill for Firefox"},{"url":"https://github.com/freqdec/fd-slider","title":"Cross-browser polyfill"},{"url":"http://tutorialzine.com/2011/12/what-you-need-to-know-html5-range-input/","title":"Tutorial"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-range","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/input/type/range","title":"WebPlatform Docs"},{"url":"https://github.com/andreruffert/rangeslider.js","title":"rangeslider.js polyfill"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"u","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Currently all Android browsers with partial support hide the slider input field by default. However, the element [can be styled](http://tiffanybbrown.com/2012/02/07/input-typerange-and-androids-stock-browser/) to be made visible and usable.","notes_by_num":{},"usage_perc_y":85.82,"usage_perc_a":1.87,"ucprefix":false,"parent":"forms","keywords":"input type=\"range\"","ie_id":"","chrome_id":""},"matchmedia":{"title":"matchMedia","description":"API for finding out whether or not a media query applies to the document.","spec":"http://www.w3.org/TR/cssom-view/#dom-window-matchmedia","status":"wd","links":[{"url":"https://github.com/paulirish/matchMedia.js/","title":"matchMedia.js polyfill"},{"url":"https://developer.mozilla.org/en/DOM/window.matchMedia","title":"MDN article"},{"url":"https://developer.mozilla.org/en/CSS/Using_media_queries_from_code","title":"MDN tutorial"},{"url":"http://docs.webplatform.org/wiki/css/media_queries/apis/matchMedia","title":"WebPlatform Docs"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":87.63,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"mediaquerylist","ie_id":"matchmedia","chrome_id":"4677872220372992"},"input-datetime":{"title":"Date and time input types","description":"Form field widget to easily allow users to enter a date or a time, generally by using a calendar/time input widget. Previously there was also a single field for both date & time, but this has been deprecated.","spec":"https://html.spec.whatwg.org/multipage/forms.html#date-state-(type=date)","status":"cr","links":[{"url":"http://net.tutsplus.com/tutorials/javascript-ajax/quick-tip-cross-browser-datepickers-within-minutes/","title":"Datepicker tutorial w/polyfill"},{"url":"https://github.com/zoltan-dulac/html5Forms.js","title":"Polyfill for HTML5 forms"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-datetime;input-type-datetime-local","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/input/type/date","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"Partial support in iOS refers to a lack of support for attributes like step, min, or max.\r\n\r\nOlder versions of Safari provide date-formatted text fields, but no real calendar widget.\r\n\r\nSome modified versions of the Android 4.x browser do have support for date/time fields.","notes_by_num":{},"usage_perc_y":58.41,"usage_perc_a":0,"ucprefix":false,"parent":"forms","keywords":"datepicker,timepicker,input type=\"date\",input type=\"time\"","ie_id":"","chrome_id":"6640933999214592"},"input-color":{"title":"Color input type","description":"Form field allowing the user to select a color.","spec":"https://html.spec.whatwg.org/multipage/forms.html#color-state-(type=color)","status":"wd","links":[{"url":"http://www.html5tutorial.info/html5-color.php","title":"Tutorial"},{"url":"https://github.com/jonstipe/color-polyfill","title":"Polyfill"},{"url":"http://docs.webplatform.org/wiki/html/elements/input/type/color","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"n","16":"n","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"a"}},"notes":"","notes_by_num":{},"usage_perc_y":58.65,"usage_perc_a":2.87,"ucprefix":false,"parent":"forms","keywords":"colour,input type=\"color\"","ie_id":"","chrome_id":""},"input-number":{"title":"Number input type","description":"Form field type for numbers.","spec":"https://html.spec.whatwg.org/multipage/forms.html#number-state-(type=number)","status":"wd","links":[{"url":"http://www.html5tutorial.info/html5-number.php","title":"Tutorial"},{"url":"https://github.com/jonstipe/number-polyfill","title":"Polyfill"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-number","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/elements/input/type/number","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"a"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"iOS Safari, Android 4, Chrome for Android show number input, but do not use \"step\", \"min\" or \"max\" attributes or show increment/decrement buttons. Internet Explorer 10 and 11 do not show increment/decrement buttons.","notes_by_num":{},"usage_perc_y":49.45,"usage_perc_a":37.3,"ucprefix":false,"parent":"forms","keywords":"spinner,input type=\"number\"","ie_id":"","chrome_id":""},"iframe-sandbox":{"title":"sandbox attribute for iframes","description":"Method of running external site pages with reduced privileges (e.g. no JavaScript) in iframes","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-sandbox","status":"cr","links":[{"url":"http://blog.chromium.org/2010/05/security-in-depth-html5s-sandbox.html","title":"Chromium blog article"},{"url":"http://msdn.microsoft.com/en-us/hh563496","title":"MSDN article"},{"url":"http://docs.webplatform.org/wiki/html/attributes/sandbox","title":"WebPlatform Docs"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":86.82,"usage_perc_a":0.71,"ucprefix":false,"parent":"","keywords":"","ie_id":"iframesandboxattribute","chrome_id":"5715536319086592"},"css-counters":{"title":"CSS Counters","description":"Method of controlling number values in generated content, using the counter-reset and counter-increment properties.","spec":"http://www.w3.org/TR/CSS21/generate.html#counters","status":"wd","links":[{"url":"http://onwebdev.blogspot.com/2012/02/css-counters-tutorial.html","title":"Tutorial and information"},{"url":"https://developer.mozilla.org/en/CSS_Counters","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/css/properties/counter-reset","title":"WebPlatform Docs"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":96.69,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-resize":{"title":"CSS resize property","description":"Method of allowing an element to be resized by the user, with options to limit to a given direction. ","spec":"http://www.w3.org/TR/css3-ui/#resize","status":"wd","links":[{"url":"http://css-tricks.com/almanac/properties/r/resize/","title":"CSS Tricks info"},{"url":"http://davidwalsh.name/textarea-resize","title":"On textarea resizing"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"a","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Opera 12.10+ currently only supports the resize property for textarea elements.","notes_by_num":{},"usage_perc_y":60.13,"usage_perc_a":0.17,"ucprefix":false,"parent":"","keywords":"horizontal,vertical","ie_id":"","chrome_id":""},"input-placeholder":{"title":"input placeholder attribute","description":"Method of setting placeholder text for text-like input fields, to suggest the expected inserted information.","spec":"https://html.spec.whatwg.org/multipage/forms.html#attr-input-placeholder","status":"cr","links":[{"url":"http://www.zachleat.com/web/placeholder/","title":"Article on usage"},{"url":"https://github.com/mathiasbynens/jquery-placeholder","title":"Polyfill"},{"url":"https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-attr-placeholder","title":"has.js test"},{"url":"http://docs.webplatform.org/wiki/html/attributes/placeholder","title":"WebPlatform Docs"},{"url":"https://code.google.com/p/android/issues/detail?id=24626","title":"Issue 24626: Placeholder text for an input type="}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"a","11.1":"a","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"a","4.1":"a","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Safari and Opera versions refers to lacking placeholder support on textarea elements. ","notes_by_num":{},"usage_perc_y":86.56,"usage_perc_a":1.78,"ucprefix":false,"parent":"forms","keywords":"","ie_id":"","chrome_id":""},"spdy":{"title":"SPDY networking protocol","description":"Networking protocol for low-latency transport of content over the web.","spec":"http://tools.ietf.org/html/draft-mbelshe-httpbis-spdy-00","status":"unoff","links":[{"url":"http://en.wikipedia.org/wiki/SPDY","title":"Wikipedia"},{"url":"http://dev.chromium.org/spdy/spdy-whitepaper","title":"SPDY whitepaper"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"u"},"and_uc":{"9.9":"u"}},"notes":"","notes_by_num":{},"usage_perc_y":68.02,"usage_perc_a":7.4,"ucprefix":false,"parent":"","keywords":"","ie_id":"spdy3","chrome_id":"5152586365665280"},"css-repeating-gradients":{"title":"CSS Repeating Gradients","description":"Method of defining a repeating linear or radial color gradient as a CSS image.","spec":"http://www.w3.org/TR/css3-images/#repeating-gradients","status":"cr","links":[{"url":"https://developer.mozilla.org/en/CSS/repeating-linear-gradient","title":"MDN article"},{"url":"http://www.css3files.com/gradient/#repeatinglineargradient","title":"Information page"},{"url":"http://docs.webplatform.org/wiki/css/repeating-linear-gradient","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"y x","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"a x","11.5":"a x","11.6":"y x","12":"y x","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"a x","11.5":"a x","12":"y x","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"Firefox 10+, Chrome 26+ and Opera 11.6+ also support the new \"to (side)\" syntax.","notes_by_num":{},"usage_perc_y":87.78,"usage_perc_a":0.02,"ucprefix":false,"parent":"css-gradients","keywords":"","ie_id":"","chrome_id":""},"css-filters":{"title":"CSS Filter Effects","description":"Method of applying filter effects (like blur, grayscale, brightness, contrast and hue) to elements, previously only possible by using SVG.","spec":"http://www.w3.org/TR/filter-effects/","status":"wd","links":[{"url":"http://html5-demos.appspot.com/static/css/filters/index.html","title":"Demo file for WebKit browsers"},{"url":"http://www.html5rocks.com/en/tutorials/filters/understanding-css/","title":"HTML5Rocks article"},{"url":"http://dl.dropbox.com/u/3260327/angular/CSS3ImageManipulation.html","title":"Filter editor"},{"url":"http://bennettfeely.com/filters/","title":"Filter Playground"}],"categories":["CSS","CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"a","4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a d","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y x"}},"notes":"Note that this property is significantly different from and incompatible with Microsoft's [older \"filter\" property](http://msdn.microsoft.com/en-us/library/ie/ms530752%28v=vs.85%29.aspx).\r\n\r\nPartial support in Firefox 31 [only with url() version](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#Browser_compatibility)","notes_by_num":{},"usage_perc_y":60.68,"usage_perc_a":12.47,"ucprefix":false,"parent":"","keywords":"sepia,hue-rotate,invert,saturate","ie_id":"filters","chrome_id":""},"getcomputedstyle":{"title":"getComputedStyle","description":"API to get the current computed CSS styles applied to an element. This may be the current value applied by an animation or as set by a stylesheet.","spec":"http://www.w3.org/TR/cssom/#dom-window-getcomputedstyle","status":"rec","links":[{"url":"https://developer.mozilla.org/en/DOM/window.getComputedStyle","title":"MDN article"},{"url":"http://ie.microsoft.com/testdrive/HTML5/getComputedStyle/","title":"Demo"},{"url":"http://snipplr.com/view/13523/","title":"Polyfill for IE"},{"url":"http://docs.webplatform.org/wiki/css/cssom/methods/getComputedStyle","title":"WebPlatform Docs"}],"categories":["CSS3","DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"a","3.5":"a","3.6":"a","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"a","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"a"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a","10":"y"},"op_mob":{"10":"a","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Firefox versions refers to requiring the second parameter to be included.\r\n\r\nPartial support in all other browsers refers to not supporting getComputedStyle on pseudo-elements.","notes_by_num":{},"usage_perc_y":89.99,"usage_perc_a":3.51,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"word-break":{"title":"CSS3 word-break","description":"Property to prevent or allow words to be broken over multiple lines between letters.","spec":"http://www.w3.org/TR/css3-text/#word-break","status":"wd","links":[{"url":"https://developer.mozilla.org/en/CSS/word-break","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/css/properties/word-break","title":"WebPlatform Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"a","10":"a"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"a"}},"notes":"Partial support refers to supporting the \"break-all\" value, but not the \"keep-all\" value.","notes_by_num":{},"usage_perc_y":27.63,"usage_perc_a":65.65,"ucprefix":false,"parent":"","keywords":"break-all,keep-all","ie_id":"","chrome_id":""},"viewport-units":{"title":"Viewport units: vw, vh, vmin, vmax","description":"Length units representing 1% of the viewport size for viewport width (vw), height (vh), the smaller of the two (vmin), or the larger of the two (vmax).","spec":"http://www.w3.org/TR/css3-values/#viewport-relative-lengths","status":"cr","links":[{"url":"http://css-tricks.com/viewport-sized-typography/","title":"Blog post"},{"url":"https://github.com/saabi/vminpoly","title":"Polyfill"},{"url":"https://github.com/rodneyrehm/viewport-units-buggyfill","title":"Buggyfill - Polyfill that fixes buggy support"},{"url":"http://blog.rodneyrehm.de/archives/34-iOS7-Mobile-Safari-And-Viewport-Units.html","title":"Back-Forward issue blog post"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"a","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"a","7.0-7.1":"a","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a #1","11":"a #1"},"and_uc":{"9.9":"n"}},"notes":"Partial support in IE9 refers to supporting \"vm\" instead of \"vmin\".\r\n\r\nPartial support in IE10 refers to lack of \"vmax\" support.\r\n\r\nPartial support in iOS7 is due to buggy behavior of the \"vh\" unit (see [workaround](https://gist.github.com/pburtchaell/e702f441ba9b3f76f587)).\r\n\r\nAll other partial support refers to not supporting the \"vmax\" unit. ","notes_by_num":{},"usage_perc_y":65.36,"usage_perc_a":16.41,"ucprefix":false,"parent":"","keywords":"vm,viewport-percentage","ie_id":"","chrome_id":""},"contentsecuritypolicy":{"title":"Content Security Policy 1.0","description":"Mitigate cross-site scripting attacks by whitelisting allowed sources of script, style, and other resources.","spec":"http://www.w3.org/TR/CSP/","status":"cr","links":[{"url":"http://html5rocks.com/en/tutorials/security/content-security-policy/","title":"HTML5Rocks article"},{"url":"http://content-security-policy.com/","title":"CSP Examples & Quick Reference"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a #1","11":"a #1"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y #1","5":"y #1","6":"y #1","7":"y #1","8":"y #1","9":"y #1","10":"y #1","11":"y #1","12":"y #1","13":"y #1","14":"y #1","15":"y #1","16":"y #1","17":"y #1","18":"y #1","19":"y #1","20":"y #1","21":"y #1","22":"y #1","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"y #2","15":"y #2","16":"y #2","17":"y #2","18":"y #2","19":"y #2","20":"y #2","21":"y #2","22":"y #2","23":"y #2","24":"y #2","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"a #2","6":"y #2","6.1":"y #2","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"a #2","6.0-6.1":"y #2","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y #2"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a #1","11":"a #1"},"and_uc":{"9.9":"y x"}},"notes":"The standard HTTP header is `Content-Security-Policy` which is used unless otherwise noted.","notes_by_num":{"1":"Supported through the `X-Content-Security-Policy` header","2":"Supported through the `X-Webkit-CSP` header"},"usage_perc_y":73.3,"usage_perc_a":10.44,"ucprefix":false,"parent":"","keywords":"csp,security,header","ie_id":"contentsecuritypolicy","chrome_id":"5205088045891584"},"pagevisibility":{"title":"Page Visibility","description":"JavaScript API for determining whether a document is visible on the display","spec":"http://www.w3.org/TR/page-visibility/","status":"rec","links":[{"url":"https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/apis/timing/properties/visibilityState","title":"WebPlatform Docs"},{"url":"http://www.sitepoint.com/introduction-to-page-visibility-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/page-visibility-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"","notes_by_num":{},"usage_perc_y":82.85,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"visibilitystate","ie_id":"pagevisibilityapi","chrome_id":"5689697795833856"},"stricttransportsecurity":{"title":"Strict Transport Security","description":"Declare that a website is only accessible over a secure connection (HTTPS).","spec":"http://tools.ietf.org/html/rfc6797","status":"other","links":[{"url":"http://dev.chromium.org/sts","title":"Chromium article"},{"url":"https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_Security","title":"MDN article"},{"url":"https://www.owasp.org/index.php/HTTP_Strict_Transport_Security","title":"OWASP article"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"u","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"u"}},"notes":"The HTTP header is 'Strict-Transport-Security'.","notes_by_num":{},"usage_perc_y":66.49,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"sts,hsts,security,header","ie_id":"httpstricttransportsecurityhsts","chrome_id":"4941480133132288"},"style-scoped":{"title":"Scoped CSS","description":"Allows CSS rules to be scoped to part of the document, based on the position of the style element.","spec":"https://html.spec.whatwg.org/multipage/semantics.html#attr-style-scoped","status":"cr","links":[{"url":"https://github.com/PM5544/scoped-polyfill","title":"Polyfill"},{"url":"http://html5doctor.com/the-scoped-attribute/","title":"HTML5 Doctor article"},{"url":"http://updates.html5rocks.com/2012/03/A-New-Experimental-Feature-style-scoped","title":"HTML5Rocks article"}],"categories":["CSS","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n d #1","21":"n d #1","22":"n d #1","23":"n d #1","24":"n d #1","25":"n d #1","26":"n d #1","27":"n d #1","28":"n d #1","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"u","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags"},"usage_perc_y":14.81,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"scope","ie_id":"scopedstyles","chrome_id":"5374137958662144"},"svg-fragment":{"title":"SVG fragment identifiers","description":"Method of displaying only a part of an SVG image by defining a view ID or view box dimensions as the file's fragment identifier.","spec":"http://www.w3.org/TR/SVG/linking.html#SVGFragmentIdentifiers","status":"rec","links":[{"url":"http://www.broken-links.com/2012/08/14/better-svg-sprites-with-fragment-identifiers/","title":"Blog post"}],"categories":["SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"y","8":"y"},"opera":{"9":"u","9.5-9.6":"u","10.0-10.1":"u","10.5":"u","10.6":"u","11":"u","11.1":"u","11.5":"u","11.6":"u","12":"u","12.1":"y","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"u","11":"u","11.1":"u","11.5":"u","12":"u","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":70.27,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"fragments,sprite","ie_id":"","chrome_id":""},"outline":{"title":"CSS outline","description":"The CSS outline property is a shorthand property for setting one or more of the individual outline properties outline-style, outline-width and outline-color in a single rule. In most cases the use of this shortcut is preferable and more convenient.","spec":"http://www.w3.org/TR/CSS2/ui.html#propdef-outline","status":"rec","links":[{"url":"http://dev.w3.org/csswg/css3-ui/#outline","title":"CSS Basic User Interface Module Level 3"},{"url":"https://developer.mozilla.org/en-US/docs/CSS/outline","title":"Mozilla Developer Network: outline"}],"categories":["CSS2"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"y","9":"y #1","10":"y #1","11":"y #1"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y #1","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y #1","11":"y #1"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Also supports the value of `invert` for `outline-color`. (support of this value is optional for browsers)"},"usage_perc_y":93.88,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"-moz-outline,outline-width,outline-style,outline-color","ie_id":"","chrome_id":""},"download":{"title":"Download attribute","description":"When used on an anchor, this attribute signifies that the resource it points to should be downloaded by the browser rather than navigate to it.","spec":"https://html.spec.whatwg.org/multipage/semantics.html#downloading-resources","status":"wd","links":[{"url":"http://updates.html5rocks.com/2011/08/Downloading-resources-in-HTML5-a-download","title":"HTML5Rocks post"},{"url":"http://html5-demos.appspot.com/static/a.download.html","title":"Demo: creating a text file and downloading it."}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":59.1,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"download,a.download,a[download],download attribute","ie_id":"adownloadattribute","chrome_id":"6473924464345088"},"pointer":{"title":"Pointer events","description":"This specification integrates various inputs from mice, touchscreens, and pens, making separate implementations no longer necessary and authoring for cross-device pointers easier. Not to be mistaken with the unrelated \"pointer-events\" CSS property.","spec":"http://www.w3.org/TR/pointerevents/","status":"cr","links":[{"url":"http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx","title":"Implementation of Pointer Events in IE10"},{"url":"http://blogs.msdn.com/b/eternalcoding/archive/2013/01/16/hand-js-a-polyfill-for-supporting-pointer-events-on-every-browser.aspx","title":"Hand.js, the polyfill for browsers only supporting Touch Events"},{"url":"http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx","title":"Article & tutorial"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p","37":"p","38":"p","39":"p","40":"p","41":"p","42":"p"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"u","7":"u","7.1":"u","8":"u"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"p","37":"p"},"bb":{"7":"p","10":"p"},"op_mob":{"10":"n","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"p"},"and_chr":{"38":"p"},"and_ff":{"32":"p"},"ie_mob":{"10":"a x","11":"y"},"and_uc":{"9.9":"p"}},"notes":"Partial support in IE10 refers the lack of pointerenter and pointerleave events. Firefox Nightly provides 'dom.w3c_pointer_events.enabled' option to support this specification starting with version 28.","notes_by_num":{},"usage_perc_y":7.4,"usage_perc_a":2.48,"ucprefix":false,"parent":"","keywords":"pointerdown,pointermove,pointerup,pointercancel,pointerover,pointerout,pointerenter,pointerleave","ie_id":"pointerevents","chrome_id":"4504699138998272"},"user-select-none":{"title":"CSS user-select: none","description":"Method of preventing text/element selection using CSS. ","spec":"https://developer.mozilla.org/en-US/docs/CSS/user-select","status":"unoff","links":[{"url":"https://developer.mozilla.org/en-US/docs/CSS/user-select","title":"MDN article"},{"url":"http://css-tricks.com/almanac/properties/u/user-select/","title":"CSS Tricks article"},{"url":"http://msdn.microsoft.com/en-us/library/ie/hh781492(v=vs.85).aspx","title":"MSDN Documentation"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x","11":"y x"},"firefox":{"2":"y x","3":"y x","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"u","5":"u","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y x"},"ie_mob":{"10":"y x","11":"y x"},"and_uc":{"9.9":"y x"}},"notes":"Currently the user-select property does not appear in any W3C specification. Support information here is only for \"none\" value, not others.","notes_by_num":{},"usage_perc_y":88.21,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"webp":{"title":"WebP image format","description":"Image format that supports lossy and lossless compression, as well as animation and alpha transparency.","spec":"https://developers.google.com/speed/webp/","status":"other","links":[{"url":"https://developers.google.com/speed/webp/","title":"Official website"},{"url":"http://antimatter15.github.io/weppy/demo.html","title":"Polyfill for browsers with WebM support"},{"url":"http://libwebpjs.appspot.com/","title":"Decoder in JS"},{"url":"http://webpjs.appspot.com/","title":"Polyfill for browsers with or without WebM support (i.e. IE6-IE9, Safari/iOS version 6.1 and below; Firefox versions 24 and bel"},{"url":"https://developers.google.com/speed/webp/faq#which_web_browsers_natively_support_webp","title":"Official website FAQ - Which web browsers natively support WebP?"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p"},"chrome":{"4":"n","5":"n","6":"p","7":"p","8":"p","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"p","11":"p","11.1":"a","11.5":"a","11.6":"a","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"a","4.1":"a","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"a","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"Partial support in older Chrome, Opera and Android refers to browser not supporting lossless and alpha versions of WebP. Animated webp images are supported in Chrome 32+ and Opera 19+.","notes_by_num":{},"usage_perc_y":54.48,"usage_perc_a":2.3,"ucprefix":false,"parent":"","keywords":"","ie_id":"webpimageformatsupport","chrome_id":"6471725441089536,4785074604081152"},"intrinsic-width":{"title":"Intrinsic & Extrinsic Sizing","description":"Allows for the heights and widths to be specified in intrinsic values using the fill-available, max-content, min-content, and fit-content properties.","spec":"http://www.w3.org/TR/css3-sizing/","status":"wd","links":[{"url":"http://demosthenes.info/blog/662/Design-From-the-Inside-Out-With-CSS-MinContent","title":"Min-Content tutorial"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Prefixes are on the values, not the property names (e.g. -webkit-min-content) Firefox currently supports the \"-moz-available\" property rather than \"-moz-fill-available\".","notes_by_num":{},"usage_perc_y":69.7,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"fill-available,max-content,min-content,fit-content,contain-floats","ie_id":"cssintrinsicsizing","chrome_id":"5901353784180736"},"cryptography":{"title":"Web Cryptography","description":"JavaScript API for performing basic cryptographic operations in web applications","spec":"http://www.w3.org/TR/WebCryptoAPI/","status":"wd","links":[{"url":"http://polycrypt.net/","title":"PolyCrypt: A WebCrypto Polyfill"},{"url":"http://www.slideshare.net/Channy/the-history-and-status-of-web-crypto-api","title":"The History and Status of Web Crypto API"},{"url":"http://research.microsoft.com/en-us/projects/msrjscrypto/","title":"Microsoft Research JavaScript Cryptography Library"}],"categories":["HTML5","JS API"],"stats":{"ie":{"5.5":"n","6":"p","7":"p","8":"p","9":"p","10":"p","11":"a x #1"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"n d #2","33":"n d #2","34":"n d #2","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"p","33":"p","34":"p","35":"p","36":"p","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"p","6.1":"p","7":"p","7.1":"y x #3","8":"y x #3"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"p","12.1":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"y x #3","8.1":"y x #3"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"p","37":"y"},"bb":{"7":"p","10":"p"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"p"},"ie_mob":{"10":"p","11":"a x #1"},"and_uc":{"9.9":"p"}},"notes":"Many browsers support the `[crypto.getRandomValues()](#feat=getrandomvalues)` method, but not actual cryptography functionality under `crypto.subtle`. \r\n\r\nAs the specification is currently still in development, users may be better off using polyfills or libraries like [PolyCrypt](http://polycrypt.net/). \r\n\r\nFirefox also has support for [unofficial features](https://developer.mozilla.org/en-US/docs/JavaScript_crypto). \r\n\r\nIn Chrome the API is only usable over secure connections. ([corresponding bug](https://code.google.com/p/chromium/issues/detail?id=373032))","notes_by_num":{"1":"Support in IE11 is based an older version of the specification. ","2":"Supported in Firefox behind the `dom.webcrypto.enabled` flag. ","3":"Supported in Safari using the `crypto.webkitSubtle` prefix"},"usage_perc_y":43.87,"usage_perc_a":7.4,"ucprefix":false,"parent":"","keywords":"subtle,subtlecrypto","ie_id":"webcryptoapi","chrome_id":"5030265697075200"},"template":{"title":"HTML templates","description":"Method of declaring a portion of reusable markup that is parsed but not rendered until cloned.","spec":"https://html.spec.whatwg.org/multipage/scripting.html#the-template-element","status":"wd","links":[{"url":"http://www.html5rocks.com/en/tutorials/webcomponents/template/","title":"HTML5Rocks - HTML's New template Tag"},{"url":"http://polymer-project.org","title":"Polymer project (polyfill & web components framework)"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":63.85,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"web components, template","ie_id":"templateelement","chrome_id":"5207287069147136"},"opus":{"title":"Opus","description":"Royalty-free open audio codec by IETF, which incorporated SILK from Skype and CELT from Xiph.org, to serve higher sound quality and lower latency at the same bitrate.","spec":"http://tools.ietf.org/html/rfc6716","status":"other","links":[{"url":"https://hacks.mozilla.org/2012/07/firefox-beta-15-supports-the-new-opus-audio-format/","title":"Introduction of Opus by Mozilla"},{"url":"http://www.ietf.org/mail-archive/web/rtcweb/current/msg04953.html","title":"Google's statement about the use of VP8 and Opus codec for WebRTC standard"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"For Opera the Linux version may be able to play it when the GStreamer module is up to date and the served mime-type is 'audio/ogg'.","notes_by_num":{},"usage_perc_y":44.57,"usage_perc_a":0,"ucprefix":false,"parent":"audio","keywords":"","ie_id":"","chrome_id":"4891189287321600"},"jpegxr":{"title":"JPEG XR image format","description":"The latest JPEG image format of Joint Photographic Experts Group which boasts better compression and supports lossless compression, alpha channel, and 48-bit deep color over normal jpg format.","spec":"http://www.itu.int/rec/T-REC-T.832","status":"other","links":[{"url":"http://msdn.microsoft.com/en-us/library/windows/desktop/hh707223(v=vs.85).aspx","title":"Microsoft JPEG XR Codec Overview"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":12,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"channel-messaging":{"title":"Channel messaging","description":"Method for having two-way communication between browsing contexts (using MessageChannel)","spec":"http://www.w3.org/TR/webmessaging/#channel-messaging","status":"cr","links":[{"url":"https://dev.opera.com/articles/view/window-postmessage-messagechannel/#channel","title":"An Introduction to HTML5 web messaging"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n d #1","27":"n d #1","28":"n d #1","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"u","10.0-10.1":"u","10.5":"u","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"u","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{"1":"Supported in Firefox behind the `dom.messageChannel.enabled` flag."},"usage_perc_y":71.99,"usage_perc_a":0,"ucprefix":false,"parent":"x-doc-messaging","keywords":"","ie_id":"messagechannels","chrome_id":"6710044586409984"},"css3-tabsize":{"title":"CSS3 tab-size","description":"Method of customizing the width of the tab character. Only effective using 'white-space: pre' or 'white-space: pre-wrap'.","spec":"http://www.w3.org/TR/css3-text/#tab-size1","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size","title":"MDN article"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"y x","11":"y x","11.1":"y x","11.5":"y x","11.6":"y x","12":"y x","12.1":"y x","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y x"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"n","11":"y x","11.1":"y x","11.5":"y x","12":"y x","12.1":"y x","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":73.05,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"tab-size,tab-width","ie_id":"","chrome_id":""},"mutationobserver":{"title":"Mutation Observer","description":"Method for observing and reacting to changes to the DOM. Replaces MutationEvents, which is deprecated.","spec":"http://www.w3.org/TR/dom/","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver","title":"MutationObserver from MDN"},{"url":"https://github.com/Polymer/MutationObservers","title":"Polyfill"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"p","10":"p","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"p","4.1":"p","4.2-4.3":"p","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"y"},"and_uc":{"9.9":"y x"}},"notes":"When the content of a node with a single CharacterData child node is changed by innerHTML attribute and the node have a single different one as a result, WebKit browsers consider it as a characterData mutation of the child CharacterData node, while other browsers think it as a childList mutation of the parent node.","notes_by_num":{},"usage_perc_y":80.32,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"MutationObserver","ie_id":"mutationobservers","chrome_id":"5021194726146048"},"css-selection":{"title":"::selection CSS pseudo-element","description":"The ::selection CSS pseudo-element applies rules to the portion of a document that has been highlighted (e.g., selected with the mouse or another pointing device) by the user.","spec":"https://developer.mozilla.org/en-US/docs/Web/CSS/::selection","status":"unoff","links":[{"url":"http://quirksmode.org/css/selectors/selection.html","title":"::selection test"},{"url":"http://docs.webplatform.org/wiki/css/selectors/pseudo-elements/::selection","title":"WebPlatform Docs"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"y x","3":"y x","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"u","11":"u","11.1":"u","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":75.62,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"::selection,selection","ie_id":"","chrome_id":""},"css-placeholder":{"title":":placeholder-shown CSS pseudo-class","description":"The :placeholder-shown pseudo-class represents the placeholder contents of a form field with placeholder text.","spec":"http://dev.w3.org/csswg/selectors/#placeholder","status":"unoff","links":[{"url":"http://msdn.microsoft.com/en-us/library/ie/hh772745(v=vs.85).aspx","title":"MSDN article"},{"url":"http://css-tricks.com/snippets/css/style-placeholder-text/","title":"CSS-Tricks article with all prefixes"},{"url":"http://wiki.csswg.org/ideas/placeholder-styling","title":"CSSWG discussion"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x","11":"a x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x"},"chrome":{"4":"a x","5":"a x","6":"a x","7":"a x","8":"a x","9":"a x","10":"a x","11":"a x","12":"a x","13":"a x","14":"a x","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x","37":"a x","38":"a x","39":"a x","40":"a x","41":"a x","42":"a x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"a x","5.1":"a x","6":"a x","6.1":"a x","7":"a x","7.1":"a x","8":"a x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a x","16":"a x","17":"a x","18":"a x","19":"a x","20":"a x","21":"a x","22":"a x","23":"a x","24":"a x","25":"a x","26":"a x","27":"a x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"a x","5.0-5.1":"a x","6.0-6.1":"a x","7.0-7.1":"a x","8":"a x","8.1":"a x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a x","2.2":"a x","2.3":"a x","3":"a x","4":"a x","4.1":"a x","4.2-4.3":"a x","4.4":"a x","4.4.3-4.4.4":"a x","37":"a x"},"bb":{"7":"u","10":"a x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a x"},"and_chr":{"38":"a x"},"and_ff":{"32":"a x"},"ie_mob":{"10":"a x","11":"a x"},"and_uc":{"9.9":"a x"}},"notes":"Partial support refers to support for alternative syntax: ::-webkit-input-placeholder (Chrome/Safari/Opera),\r\n::-moz-placeholder (Firefox) and \r\n:-ms-input-placeholder (IE). ","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":87.88,"ucprefix":false,"parent":"","keywords":"::placeholder,placeholder","ie_id":"","chrome_id":""},"canvas-blending":{"title":"Canvas blend modes","description":"Method of defining the effect resulting from overlaying two layers on a Canvas element. ","spec":"http://www.w3.org/TR/compositing-1/#blending","status":"wd","links":[{"url":"http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/","title":"Blog post"}],"categories":["Canvas"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":68.47,"usage_perc_a":0,"ucprefix":false,"parent":"canvas","keywords":"","ie_id":"compositingandblendingincanvas2d","chrome_id":""},"clipboard":{"title":"Clipboard API","description":"API to provide copy, cut and paste functionality using the OS clipboard.","spec":"http://www.w3.org/TR/clipboard-apis/","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent","title":"MDN page on ClipboardEvent"},{"url":"http://www.deluxeblogtips.com/2010/06/javascript-copy-to-clipboard.html","title":"Blog post on cross-browser usage"}],"categories":["JS API"],"stats":{"ie":{"5.5":"a #1","6":"a #1","7":"a #1","8":"a #1","9":"a #1","10":"a #1","11":"a #1"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"a","37":"a","38":"a","39":"a","40":"a","41":"a","42":"a"},"safari":{"3.1":"u","3.2":"u","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a","4.4.3-4.4.4":"a","37":"a"},"bb":{"7":"n","10":"a"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a"},"and_chr":{"38":"a"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support in IE refers using [a non-standard method](http://msdn.microsoft.com/en-us/library/ie/ms535220%28v=vs.85%29.aspx) of interacting with the clipboard. For other browsers it refers to not supporting the ClipboardEvent constructor.","notes_by_num":{},"usage_perc_y":11.9,"usage_perc_a":73.66,"ucprefix":false,"parent":"","keywords":"cut,copy,paste,clipboarddata","ie_id":"","chrome_id":""},"rtcpeerconnection":{"title":"WebRTC Peer-to-peer connections","description":"Method of allowing two users to communicate directly, browser to browser using the RTCPeerConnection API.","spec":"http://www.w3.org/TR/webrtc/#peer-to-peer-connections","status":"wd","links":[{"url":"http://www.webrtc.org/","title":"WebRTC Project site"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y x"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"BlackBerry 10 recognizes RTCPeerConnection but real support is unconfirmed.","notes_by_num":{},"usage_perc_y":55.44,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"webrtcwebrtcv10api","chrome_id":"6612462929444864"},"css3-cursors":{"title":"CSS3 Cursors (original values)","description":"CSS3 cursor values added in the 2004 spec, including none, context-menu, cell, vertical-text, alias, copy, no-drop, not-allowed, nesw-resize, nwse-resize, col-resize, row-resize and all-scroll. ","spec":"http://www.w3.org/TR/css3-ui/#cursor","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/cursor","title":"MDN Documentation"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"a","6":"a","7":"a","8":"a","9":"y","10":"y","11":"y"},"firefox":{"2":"a","3":"a","3.5":"a","3.6":"a","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"a","9.5-9.6":"a","10.0-10.1":"a","10.5":"a","10.6":"a","11":"a","11.1":"a","11.5":"a","11.6":"a","12":"a","12.1":"a","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"u"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support in IE refers to no support for the alias, cell, copy, ew-resize, ns-resize, nesw-resize, nwse-resize or context-menu cursors. Opera 12.10- does not support 'none' or a URI.","notes_by_num":{},"usage_perc_y":61.91,"usage_perc_a":3.98,"ucprefix":false,"parent":"","keywords":"cursors, pointers","ie_id":"","chrome_id":""},"css3-cursors-newer":{"title":"CSS3 Cursors (new values)","description":"Support for `zoom-in` and `zoom-out` values for the CSS3 `cursor` property.","spec":"http://www.w3.org/TR/css3-ui/#cursor","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/cursor","title":"MDN Documentation"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"y x","3":"y x","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"y","12":"y","12.1":"y","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Chrome, Safari and Firefox also support the unofficial `grab` and `grabbing` values (with prefix)","notes_by_num":{},"usage_perc_y":50.93,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"cursors, pointers","ie_id":"","chrome_id":""},"webvtt":{"title":"WebVTT - Web Video Text Tracks","description":"Format for marking up text captions for multimedia resources.","spec":"http://dev.w3.org/html5/webvtt/","status":"unoff","links":[{"url":"http://www.html5rocks.com/en/tutorials/track/basics/","title":"Getting Started With the Track Element"},{"url":"https://dev.opera.com/articles/view/an-introduction-to-webvtt-and-track/","title":"An Introduction to WebVTT and track"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n d","25":"n d","26":"n d","27":"n d","28":"n d","29":"n d","30":"n d","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y"},"and_uc":{"9.9":"n"}},"notes":"WebVTT must be used with the <track> element.\r\n\r\nFirefox currently lacks support for the for ::cue pseudoelement.","notes_by_num":{},"usage_perc_y":77.85,"usage_perc_a":0,"ucprefix":false,"parent":"video","keywords":"captions,track","ie_id":"","chrome_id":"6719115557339136"},"promises":{"title":"Promises","description":"A promise represents the eventual result of an asynchronous operation.","spec":"https://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects","status":"other","links":[{"url":"http://promises-aplus.github.io/promises-spec/","title":"Promises/A+ spec"},{"url":"http://www.chromestatus.com/features/5681726336532480","title":"Chromium dashboard - ES6 Promises"},{"url":"http://www.html5rocks.com/en/tutorials/es6/promises/","title":"JavaScript Promises: There and back again - HTML5 Rocks"},{"url":"https://github.com/jakearchibald/ES6-Promises","title":"A polyfill for ES6-style Promises"}],"categories":["JS API"],"stats":{"ie":{"5.5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p"},"firefox":{"2":"p","3":"p","3.5":"p","3.6":"p","4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"a","28":"a","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"p","5":"p","6":"p","7":"p","8":"p","9":"p","10":"p","11":"p","12":"p","13":"p","14":"p","15":"p","16":"p","17":"p","18":"p","19":"p","20":"p","21":"p","22":"p","23":"p","24":"p","25":"p","26":"p","27":"p","28":"p","29":"p","30":"p","31":"p","32":"a","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"p","3.2":"p","4":"p","5":"p","5.1":"p","6":"p","6.1":"p","7":"p","7.1":"y","8":"y"},"opera":{"9":"p","9.5-9.6":"p","10.0-10.1":"p","10.5":"p","10.6":"p","11":"p","11.1":"p","11.5":"p","11.6":"p","12":"p","12.1":"p","15":"p","16":"p","17":"p","18":"p","19":"a","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"p","4.0-4.1":"p","4.2-4.3":"p","5.0-5.1":"p","6.0-6.1":"p","7.0-7.1":"p","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"p"},"android":{"2.1":"p","2.2":"p","2.3":"p","3":"p","4":"p","4.1":"p","4.2-4.3":"p","4.4":"p","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"p","10":"p"},"op_mob":{"10":"p","11":"p","11.1":"p","11.5":"p","12":"p","12.1":"p","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"p","11":"p"},"and_uc":{"9.9":"p"}},"notes":"","notes_by_num":{},"usage_perc_y":59.34,"usage_perc_a":0.43,"ucprefix":false,"parent":"","keywords":"futures","ie_id":"","chrome_id":"5681726336532480"},"css-sticky":{"title":"CSS position:sticky","description":"Keeps elements positioned as \"fixed\" or \"relative\" depending on how it appears in the viewport. As a result the element is \"stuck\" when necessary while scrolling.","spec":"http://dev.w3.org/csswg/css-position/#sticky-positioning","status":"unoff","links":[{"url":"http://updates.html5rocks.com/2012/08/Stick-your-landings-position-sticky-lands-in-WebKit","title":"HTML5Rocks"},{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/position","title":"MDN article"},{"url":"http://docs.webplatform.org/wiki/css/properties/position","title":"WebPlatform Docs"},{"url":"https://github.com/filamentgroup/fixed-sticky","title":"Polyfill"},{"url":"https://github.com/wilddeer/stickyfill","title":"Another polyfill"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n d #1","27":"n d #1","28":"n d #1","29":"n d #1","30":"n d #1","31":"n d #1","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n d #2","24":"n d #2","25":"n d #2","26":"n d #2","27":"n d #2","28":"n d #2","29":"n d #2","30":"n d #2","31":"n d #2","32":"n d #2","33":"n d #2","34":"n d #2","35":"n d #2","36":"n d #2","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Can be enabled in Firefox by setting the about:config preference layout.css.sticky.enabled to true","2":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags"},"usage_perc_y":20.93,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"positionsticky","chrome_id":"6190250464378880"},"dialog":{"title":"Dialog element","description":"Method of easily creating custom dialog boxes to display to the user with modal or non-modal options. Also includes a `::backdrop` pseudo-element for behind the element.","spec":"https://html.spec.whatwg.org/multipage/forms.html#the-dialog-element","status":"wd","links":[{"url":"https://github.com/GoogleChrome/dialog-polyfill","title":"Polyfill"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"u","35":"u","36":"u"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n d #2","20":"n d #2","21":"n d #2","22":"n d #2","23":"n d #2","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled through the \"Experimental Web Platform features\" flag in `chrome://flags`","2":"Enabled through the \"Experimental Web Platform features\" flag in `opera://flags`"},"usage_perc_y":38.48,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"HTMLDialogElement,showModal,backdrop","ie_id":"","chrome_id":"5770237022568448"},"css-variables":{"title":"CSS Variables","description":"Permits the declaration and usage of cascading variables in stylesheets.","spec":"http://www.w3.org/TR/css-variables/","status":"wd","links":[{"url":"https://hacks.mozilla.org/2013/12/css-variables-in-firefox-nightly/","title":"Mozilla hacks article (older syntax)"},{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables","title":"MDN article"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"u","41":"u","42":"u"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":10.89,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"css variables","ie_id":"cssvariables","chrome_id":"6401356696911872"},"vibration":{"title":"Vibration API","description":"Method to access the vibration mechanism of the hosting device.","spec":"http://www.w3.org/TR/vibration/","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/Guide/API/Vibration","title":"MDN article"},{"url":"http://davidwalsh.name/vibration-api","title":"Vibration API sample code & demo"},{"url":"http://code.tutsplus.com/tutorials/html5-vibration-api--mobile-22585","title":"Tuts+ article"},{"url":"http://aurelio.audero.it/demo/vibration-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":61.37,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"vibration,mobile,device","ie_id":"vibrationapi","chrome_id":"5698768766763008"},"css-backgroundblendmode":{"title":"CSS background-blend-mode","description":"Allows blending between CSS background images, gradients, and colors.","spec":"http://www.w3.org/TR/compositing-1/#background-blend-mode","status":"cr","links":[{"url":"http://codepen.io/bennettfeely/pen/rxoAc","title":"codepen example"},{"url":"https://medium.com/web-design-technique/6b51bf53743a","title":"Blog post"},{"url":"http://bennettfeely.com/gradients","title":"Demo"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":57.27,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"css blend modes,css blending modes,blending,multiply,screen,background","ie_id":"","chrome_id":"5768037999312896"},"css-mixblendmode":{"title":"Blending of HTML/SVG elements","description":"Allows blending between arbitrary SVG and HTML elements","spec":"http://www.w3.org/TR/compositing-1/#mix-blend-mode","status":"cr","links":[{"url":"http://codepen.io/bennettfeely/pen/csjzd","title":"codepen example"},{"url":"http://css-tricks.com/basics-css-blend-modes/","title":"Blog post"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1","37":"n d #1","38":"n d #1","39":"n d #1","40":"n d #1","41":"n d #1","42":"n d #1"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags"},"usage_perc_y":15.69,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"css blend modes,css blending modes","ie_id":"mixblendmode","chrome_id":"6362616360337408"},"web-speech":{"title":"Web Speech API","description":"Method to provide speech input and text-to-speech output features in a web browser.","spec":"https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html","status":"unoff","links":[{"url":"http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API","title":"HTML5Rocks article"},{"url":"http://www.sitepoint.com/introducing-web-speech-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/web-speech-api-demo.html","title":"Demo"},{"url":"http://zenorocha.github.io/voice-elements/","title":"Advanced demo and resource"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"a x","26":"a x","27":"a x","28":"a x","29":"a x","30":"a x","31":"a x","32":"a x","33":"a x","34":"a x","35":"a x","36":"a x","37":"a x","38":"a x","39":"a x","40":"a x","41":"a x","42":"a x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"a x","7":"a x","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"a x","8":"a x","8.1":"a x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"a x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support in Chrome refers to some attributes missing. Partial support in Safari refers to only Speech Synthesis supported.","notes_by_num":{},"usage_perc_y":0,"usage_perc_a":53.14,"ucprefix":false,"parent":"","keywords":"speech,recognition,ASR","ie_id":"webspeechapiinput","chrome_id":"5908775487668224"},"high-resolution-time":{"title":"High Resolution Time API","description":"Method to provide the current time in sub-millisecond resolution and such that it is not subject to system clock skew or adjustments. Called using `performance.now()`","spec":"http://www.w3.org/TR/hr-time/","status":"rec","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()","title":"MDN article"},{"url":"http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now","title":"HTML5Rocks article"},{"url":"http://www.sitepoint.com/discovering-the-high-resolution-time-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/high-resolution-time-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"y x","21":"y x","22":"y x","23":"y x","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":75.41,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"performance,now,testing","ie_id":"highresolutiontime","chrome_id":"5349124069130240"},"battery-status":{"title":"Battery Status API","description":"Method to provide information about the battery status of the hosting device.","spec":"http://www.w3.org/TR/battery-status/","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/WebAPI/Battery_Status","title":"MDN Docs"},{"url":"http://www.smartjava.org/examples/webapi-battery/","title":"Simple demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"a x #1","11":"a x #1","12":"a x #1","13":"a x #1","14":"a x #1","15":"a x #1","16":"a #1","17":"a #1","18":"a #1","19":"a #1","20":"a #1","21":"a #1","22":"a #1","23":"a #1","24":"a #1","25":"a #1","26":"a #1","27":"a #1","28":"a #1","29":"a #1","30":"a #1","31":"a #1","32":"a #1","33":"a #1","34":"a #1","35":"a #1","36":"a #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n d","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"y"},"and_ff":{"32":"a #1"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"a #1"}},"notes":"","notes_by_num":{"1":"Partial support refers to support for the older specification's `navigator.battery` rather than `navigator.getBattery()` to access the `BatteryManager`."},"usage_perc_y":22.46,"usage_perc_a":15.28,"ucprefix":false,"parent":"","keywords":"navigator.battery,navigator.getbattery,batterymanager","ie_id":"batterystatusapi","chrome_id":"4537134732017664"},"text-decoration":{"title":"text-decoration styling","description":"Method of defining the type, style and color of lines in the text-decoration property. These can be defined as shorthand (e.g. `text-decoration: line-through dashed blue`) or as single properties (e.g. `text-decoration-color: blue`)","spec":"http://www.w3.org/TR/css-text-decor-3/#line-decoration","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style","title":"MDN Documentation for text-decoration-style"},{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-color","title":"MDN Documentation for text-decoration-color"},{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line","title":"MDN Documentation for text-decoration-line"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n x d #1","27":"n x d #1","28":"n x d #1","29":"n x d #1","30":"n x d #1","31":"n x d #1","32":"n x d #1","33":"n x d #1","34":"n x d #1","35":"n x d #1","36":"n x d #1","37":"n x d #1","38":"n x d #1","39":"n x d #1","40":"n x d #1","41":"n x d #1","42":"n x d #1"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"a x #2","8":"a x #2"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"a x #2","8.1":"a x #2"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"All browsers support the CSS2 version of `text-decoration`, which matches only the `text-decoration-line` values (`underline`, etc.)","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags","2":"Partial support in Safari refers to not supporting the text-decoration-style property."},"usage_perc_y":12.5,"usage_perc_a":5.38,"ucprefix":false,"parent":"","keywords":"text-decoration-line,text-decoration-style,text-decoration-color","ie_id":"","chrome_id":""},"speech-synthesis":{"title":"Speech Synthesis API","description":"A web API for controlling a text-to-speech output.","spec":"https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section","status":"unoff","links":[{"url":"http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API","title":"HTML5Rocks article"},{"url":"http://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/","title":"SitePoint article"},{"url":"http://aurelio.audero.it/demo/speech-synthesis-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":51.19,"usage_perc_a":0,"ucprefix":false,"parent":"web-speech","keywords":"speech,synthesis,speechSynthesis,TTS,SpeechSynthesisUtterance,","ie_id":"webspeechapisynthesis","chrome_id":"4782875580825600"},"user-timing":{"title":"User Timing API","description":"Method to help web developers measure the performance of their applications by giving them access to high precision timestamps.","spec":"http://www.w3.org/TR/user-timing/","status":"rec","links":[{"url":"http://www.sitepoint.com/discovering-user-timing-api/","title":"SitePoint article"},{"url":"http://www.html5rocks.com/en/tutorials/webperformance/usertiming/","title":"HTML5Rocks article"},{"url":"https://gist.github.com/pmeenan/5902672","title":"Polyfill"},{"url":"http://aurelio.audero.it/demo/user-timing-api-demo.html","title":"Demo"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":56.49,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"performance,testing,mark,measure","ie_id":"usertimingapi","chrome_id":"5066549580791808"},"srcset":{"title":"Srcset attribute","description":"Allows authors to specify alternate high-resolution sources on `img` elements","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset","status":"other","links":[{"url":"https://www.webkit.org/blog/2910/improved-support-for-high-resolution-displays-with-the-srcset-image-attribute/","title":"Improved support for high-resolution displays with the srcset image attribute"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"a #2","35":"a #2","36":"a #2","37":"a #2","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"a #2","8":"a #2"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"a #2","22":"a #2","23":"a #2","24":"a #2","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"a #2","8.1":"a #2"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a #2"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Can be enabled in Firefox by setting the about:config preference dom.image.srcset.enabled to true","2":"Supports the subset of the syntax for resolution switching (using the `x` descriptor), but not the full syntax that can be used with `sizes` (using the `w` descriptor)."},"usage_perc_y":22.46,"usage_perc_a":24.13,"ucprefix":false,"parent":"","keywords":"","ie_id":"imgsrcset","chrome_id":"4644337115725824"},"ambient-light":{"title":"Ambient Light API","description":"Defines events that provide information about the ambient light level, as measured by a device's light sensor.","spec":"http://www.w3.org/TR/ambient-light/","status":"cr","links":[{"url":"http://aurelio.audero.it/demo/ambient-light-api-demo.html","title":"Demo"},{"url":"http://modernweb.com/2014/05/27/introduction-to-the-ambient-light-api/","title":"Article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Firefox desktop supports this API only on Mac OS X. [Support for Windows 7 is in progress](https://bugzilla.mozilla.org/show_bug.cgi?id=754199)","notes_by_num":{},"usage_perc_y":11.9,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"ambientlightevents","chrome_id":"5298357018820608"},"will-change":{"title":"CSS will-change property","description":"Method of optimizing animations by informing the browser which elements will change and what properties will change.","spec":"http://dev.w3.org/csswg/css-will-change/","status":"wd","links":[{"url":"https://dev.opera.com/articles/css-will-change-property/","title":"Detailed article"},{"url":"http://aerotwist.com/blog/bye-bye-layer-hacks/","title":"Blog post"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Supported in Firefox behind the `layout.css.will-change.enabled` flag"},"usage_perc_y":39.76,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"scroll-position","ie_id":"csswillchange","chrome_id":"5954199330226176"},"css-shapes":{"title":"CSS Shapes Level 1","description":"Allows geometric shapes to be set in CSS to define an area for text to flow around.","spec":"http://www.w3.org/TR/css-shapes/","status":"cr","links":[{"url":"http://html.adobe.com/webplatform/layout/shapes/","title":"Adobe demos and samples"},{"url":"http://html.adobe.com/webplatform/layout/shapes/browser-support/","title":"CSS shapes support test by Adobe"},{"url":"http://alistapart.com/article/css-shapes-101","title":"A List Apart article"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n d #1","35":"n d #1","36":"n d #1","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags"},"usage_perc_y":43.86,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"circle,ellipse,polygon,inset,shape-outside,shape-inside","ie_id":"shapes","chrome_id":"5163890719588352"},"domcontentloaded":{"title":"DOMContentLoaded","description":"JavaScript event that fires when the DOM is loaded, but before all page assets are loaded (CSS, images, etc.).","spec":"https://html.spec.whatwg.org/multipage/syntax.html#stop-parsing","status":"other","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/Reference/Events/DOMContentLoaded","title":"MDN: DOMContentLoaded"}],"categories":["DOM"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"y","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"y","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":93.51,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"dom,domready,onload,contentloaded,document","ie_id":"","chrome_id":""},"proximity":{"title":"Proximity API","description":"Defines events that provide information about the distance between a device and an object, as measured by a proximity sensor.","spec":"http://www.w3.org/TR/proximity/","status":"cr","links":[{"url":"http://aurelio.audero.it/demo/proximity-api-demo.html","title":"Demo"},{"url":"http://www.sitepoint.com/introducing-proximity-api/","title":"SitePoint article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":12.21,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"kerning-pairs-ligatures":{"title":"Improved kerning pairs & ligatures","description":"Currently non-standard method of improving kerning pairs & ligatures using text-rendering: optimizeLegibility.","spec":"http://www.w3.org/TR/SVG11/painting.html#TextRenderingProperty","status":"unoff","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering","title":"MDN article"},{"url":"http://css-tricks.com/almanac/properties/t/text-rendering/","title":"CSS Tricks article"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"u","4.0-4.1":"u","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":77.97,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"optimizeLegibility,optimizeSpeed,geometricPrecision","ie_id":"","chrome_id":""},"iframe-seamless":{"title":"seamless attribute for iframes","description":"The seamless attribute makes an iframe's contents actually part of a page, and adopts the styles from its hosting page. ","spec":"http://www.w3.org/html/wg/drafts/html/master/single-page.html#attr-iframe-seamless","status":"wd","links":[{"url":"https://github.com/ornj/seamless-polyfill","title":"Experimental polyfill"},{"url":"http://labs.ft.com/2013/01/seamless-iframes-not-quite-seamless/","title":"Article"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"u","35":"u","36":"u"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n d","21":"n d","22":"n d","23":"n d","24":"n d","25":"n d","26":"n d","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"u","41":"u","42":"u"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"u","27":"u"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y"}},"notes":"Chrome 20-26 had partial support behind a flag, though this was [later removed](http://crbug.com/229421). \r\n\r\nSafari 7 (& iOS 7 Safari) hides the border of seamless iframes and recognizes the 'seamless' DOM property, but does not provide actual support.","notes_by_num":{},"usage_perc_y":2.87,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"iframeseamlessattribute","chrome_id":"6630329993396224"},"css-image-orientation":{"title":"CSS3 image-orientation","description":"CSS property used generally to fix the intended orientation of an image. This can be done using 90 degree increments or based on the image's EXIF data using the \"from-image\" value.","spec":"http://www.w3.org/TR/css3-images/#image-orientation","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation","title":"MDN article"},{"url":"http://sethfowler.org/blog/2013/09/13/new-in-firefox-26-css-image-orientation/","title":"Blog post"},{"url":"http://jsbin.com/EXUTolo/4","title":"Demo (Chinese)"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Partial support in iOS refers to the browser using EXIF data by default, though it does not actually support the property. Opening the image in a new tab in Chrome results in the image shown in the orientation according to the EXIF data.","notes_by_num":{},"usage_perc_y":11.59,"usage_perc_a":8.22,"ucprefix":false,"parent":"","keywords":"image-orientation,from-image,flip","ie_id":"","chrome_id":""},"picture":{"title":"Picture element","description":"A responsive images method to control which image resource a user agent presents to a user, based on resolution, media query and/or support for a particular image format","spec":"https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element","status":"wd","links":[{"url":"http://responsiveimages.org/demos/","title":"Demo"},{"url":"http://code.tutsplus.com/tutorials/better-responsive-images-with-the-picture-element--net-36583","title":"Tutorial"},{"url":"http://usecases.responsiveimages.org/","title":"Read about the use cases"},{"url":"http://responsiveimages.org/","title":"General information about Responsive Images"},{"url":"https://dev.opera.com/articles/responsive-images/","title":"Blog post on usage"},{"url":"http://www.html5rocks.com/tutorials/responsive/picture-element/","title":"HTML5 Rocks tutorial"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n d #3","35":"n d #3","36":"n d #3"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n d #1","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n d #2","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags","2":"Enabled in Opera through the \"experimental Web Platform features\" flag in opera://flags","3":"Enabled in Firefox by setting the about:config preference dom.image.picture.enable to true"},"usage_perc_y":22.46,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"<picture>","ie_id":"pictureelement","chrome_id":"5910974510923776"},"woff2":{"title":"WOFF 2.0 - A better web font compression format","description":"TrueType/OpenType font that provides better compression than WOFF 1.0.","spec":"http://www.w3.org/TR/WOFF2/","status":"wd","links":[{"url":"https://gist.github.com/sergejmueller/cf6b4f2133bcb3e2f64a","title":"Basics about WOFF 2.0"},{"url":"http://everythingfonts.com/ttf-to-woff2","title":"WOFF 2.0 converter"}],"categories":["Other"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n d #1","36":"n d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Default 'enabled' for Firefox Aurora and Beta, but release versions will have [WOFF2 off by default](https://bugzilla.mozilla.org/show_bug.cgi?id=1064737#c10) until security concerns are quelled."},"usage_perc_y":39.77,"usage_perc_a":0,"ucprefix":false,"parent":"fontface","keywords":"woff, fontface, webfonts","ie_id":"","chrome_id":"6718644721549312"},"text-size-adjust":{"title":"CSS text-size-adjust","description":"On mobile devices, the text-size-adjust CSS property allows Web authors to control if and how the text-inflating algorithm is applied to the textual content of the element it is applied to.","spec":"http://dev.w3.org/csswg/css-size-adjust/","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust","title":"MDN Docs"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"n","41":"n","42":"n"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y x"},"ie_mob":{"10":"y x","11":"y x"},"and_uc":{"9.9":"y x"}},"notes":"","notes_by_num":{},"usage_perc_y":11.71,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"web-animation":{"title":"Web Animations API","description":"This function lets you create an animation purely in JavaScript and have it run as efficiently as any CSS Animation or Transition.","spec":"http://dev.w3.org/fxtf/web-animations/","status":"wd","links":[{"url":"http://updates.html5rocks.com/2014/05/Web-Animations---element-animate-is-now-in-Chrome-36","title":"HTML5 Rocks"},{"url":"http://updates.html5rocks.com/2013/12/New-Web-Animations-engine-in-Blink-drives-CSS-Animations-Transitions","title":"HTML5 Rocks"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":39.77,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"js,animation,animate","ie_id":"webanimationsjavascriptapi","chrome_id":"4854343836631040"},"resource-timing":{"title":"Resource Timing","description":"Method to help web developers to collect complete timing information related to resources on a document.","spec":"http://www.w3.org/TR/resource-timing/","status":"cr","links":[{"url":"http://aurelio.audero.it/demo/resource-timing-api-demo.html","title":"Demo"},{"url":"http://googledevelopers.blogspot.com/2013/12/measuring-network-performance-with.html","title":"Blog post"},{"url":"http://www.sitepoint.com/introduction-resource-timing-api/","title":"SitePoint article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n d #1","32":"n d #1","33":"n d #1","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Can be enabled in Firefox using the dom.enable_resource_timing flag"},"usage_perc_y":56.62,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"performance,testing,resource","ie_id":"resourcetimingapi","chrome_id":"5796350423728128"},"custom-elements":{"title":"Custom Elements","description":"Method of defining and using new types of DOM elements in a document.","spec":"http://www.w3.org/TR/custom-elements/","status":"wd","links":[{"url":"http://w3c.github.io/webcomponents/spec/custom/","title":"W3C Editor's Draft spec (closer to current implementations)"},{"url":"http://www.polymer-project.org/platform/custom-elements.html","title":"Polymer project (polyfill & web components framework)"},{"url":"http://www.html5rocks.com/tutorials/webcomponents/customelements/","title":"HTML5Rocks - Custom Elements: defining new elements in HTML"},{"url":"https://code.google.com/p/chromium/issues/detail?id=234509","title":"Chromium tracking bug: Implement Custom Elements"},{"url":"https://bugzilla.mozilla.org/show_bug.cgi?id=889230","title":"Firefox tracking bug: Implement Custom Elements (from Web Components)"},{"url":"http://status.modern.ie/customelements","title":"IE Web Platform Status and Roadmap: Custom Elements"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"p","11":"p"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n d #1","24":"n d #1","25":"n d #1","26":"n d #1","27":"n d #1","28":"n d #1","29":"n d #1","30":"p d #1","31":"p d #1","32":"p d #1","33":"p d #1","34":"p d #1","35":"p d #1","36":"p d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n d","28":"n d","29":"n d","30":"n d","31":"n d","32":"n d","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"p","6.1":"p","7":"p","7.1":"p","8":"p"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n d","16":"n d","17":"n d","18":"n d","19":"n d","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled through the \"dom.webcomponents.enabled\" preference in about:config"},"usage_perc_y":42.8,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"web components","ie_id":"customelements","chrome_id":"4642138092470272"},"imports":{"title":"HTML Imports","description":"Method of including and reusing HTML documents in other HTML documents.","spec":"http://www.w3.org/TR/html-imports/","status":"wd","links":[{"url":"http://www.polymer-project.org/platform/html-imports.html","title":"Polymer project (polyfill & web components framework)"},{"url":"http://www.html5rocks.com/tutorials/webcomponents/imports/","title":"HTML5Rocks - HTML Imports: #include for the web"},{"url":"https://code.google.com/p/chromium/issues/detail?id=240592","title":"Chromium tracking bug: Implement HTML Imports"},{"url":"https://bugzilla.mozilla.org/show_bug.cgi?id=877072","title":"Firefox tracking bug: Implement HTML Imports"},{"url":"http://status.modern.ie/htmlimports","title":"IE Web Platform Status and Roadmap: HTML Imports"}],"categories":["DOM","HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"p","11":"p"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"p","31":"p","32":"p d #1","33":"p d #1","34":"p d #1","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n d #2","31":"n d #2","32":"n d #2","33":"n d #2","34":"n d #2","35":"p d #3","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"p","6.1":"p","7":"p","7.1":"p","8":"p"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n d #4","18":"n d #4","19":"n d #4","20":"n d #4","21":"n d #4","22":"p d #5","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"p","8":"p","8.1":"p"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"p"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Enabled through the \"dom.webcomponents.enabled\" preference in about:config","2":"Enabled through the \"Enable HTML Imports\" flag in chrome://flags","3":"Enabled through the \"Experimental Web Platform features\" flag in chrome://flags","4":"Enabled through the \"Enable HTML Imports\" flag in opera://flags","5":"Enabled through the \"Experimental Web Platform features\" flag in opera://flags"},"usage_perc_y":39.78,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"web components","ie_id":"htmlimports","chrome_id":"5144752345317376"},"input-file-multiple":{"title":"Multiple file selection","description":"Allows users to select multiple files in the file picker.","spec":"https://html.spec.whatwg.org/multipage/forms.html#attr-input-multiple","status":"wd","links":[{"url":"https://code.google.com/p/chromium/issues/detail?id=348912","title":"Chrome bug (for Android)"},{"url":"http://www.raymondcamden.com/2012/2/28/Working-with-HTML5s-multiple-file-upload-support","title":"Article"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n #1"},"android":{"2.1":"n #1","2.2":"n #1","2.3":"n #1","3":"n #1","4":"n #1","4.1":"n #1","4.2-4.3":"n #1","4.4":"n #1","4.4.3-4.4.4":"n #1","37":"n #1"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n #1","11":"n #1","11.1":"n #1","11.5":"n #1","12":"n #1","12.1":"n #1","24":"n #1"},"and_chr":{"38":"n #1"},"and_ff":{"32":"n #1"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n #1"}},"notes":"","notes_by_num":{"1":"Not supported when tested on Android, presumably an OS limitation. "},"usage_perc_y":68.36,"usage_perc_a":0,"ucprefix":false,"parent":"forms","keywords":"","ie_id":"","chrome_id":""},"atob-btoa":{"title":"Base64 encoding and decoding","description":"Utility functions for of encoding and decoding strings to and from base 64: window.atob() and window.btoa().","spec":"https://html.spec.whatwg.org/multipage/webappapis.html#atob","status":"other","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa","title":"MDN article on btoa()"},{"url":"https://developer.mozilla.org/en-US/docs/Web/API/Window.atob","title":"MDN article on atob()"},{"url":"https://github.com/davidchambers/Base64.js","title":"Polyfill"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"y","3.2":"y","4":"y","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"u","10.0-10.1":"u","10.5":"u","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"y","4.0-4.1":"y","4.2-4.3":"y","5.0-5.1":"y","6.0-6.1":"y","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"y"},"op_mob":{"10":"u","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":91.34,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"atob,btoa","ie_id":"","chrome_id":""},"css-appearance":{"title":"CSS Appearance","description":"The `appearance` property defines how elements (particularly form controls) appear by default. By setting the value to `none` the default appearance can be entirely redefined using other CSS properties.","spec":"http://wiki.csswg.org/spec/css4-ui#appearance","status":"unoff","links":[{"url":"http://css-tricks.com/almanac/properties/a/appearance/","title":"CSS Tricks article"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"y x","3":"y x","3.5":"y x","3.6":"y x","4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"y x","5":"y x","6":"y x","7":"y x","8":"y x","9":"y x","10":"y x","11":"y x","12":"y x","13":"y x","14":"y x","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"y x","3.2":"y x","4":"y x","5":"y x","5.1":"y x","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"y x","4.0-4.1":"y x","4.2-4.3":"y x","5.0-5.1":"y x","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"y x","2.2":"y x","2.3":"y x","3":"y x","4":"y x","4.1":"y x","4.2-4.3":"y x","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"y x","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"y x"}},"notes":"The `appearance` property currently does not appear in any CSS specification so there is no specifically correct usage.","notes_by_num":{},"usage_perc_y":78.36,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-background-offsets":{"title":"CSS background-position edge offsets","description":"Allows CSS background images to be positioned relative to the specified edge using the 3 to 4 value syntax. For example: `background-position: right 5px bottom 5px;` for positioning 5px from the bottom-right corner.","spec":"http://www.w3.org/TR/css3-background/#background-position","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/background-position","title":"MDN article on background-position"},{"url":"http://briantree.se/quick-tip-06-use-four-value-syntax-properly-position-background-images/","title":"Basic information"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"y"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"y"},"op_mob":{"10":"n","11":"y","11.1":"y","11.5":"y","12":"y","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":83.96,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"4 value syntax","ie_id":"","chrome_id":""},"css-supports-api":{"title":"CSS.supports() DOM API","description":"The CSS.supports() static methods returns a Boolean value indicating if the browser supports a given CSS feature, or not.","spec":"http://dev.w3.org/csswg/css-conditional/#the-css-interface","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/CSS.supports","title":"MDN Docs"},{"url":"http://jsbin.com/rimevilotari/1/edit","title":"Demo (Chinese)"},{"url":"https://dev.opera.com/articles/native-css-feature-detection/","title":"Native CSS Feature Detection via the @supports Rule"},{"url":"http://davidwalsh.name/css-supports","title":"CSS @supports"},{"url":"http://blog.csdn.net/hfahe/article/details/8619480","title":"Article (Chinese)"}],"categories":["DOM","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n d","21":"n d","22":"n d","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"y #1","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"See also [@supports in CSS](#feat=css-featurequeries)\r\n\r\nSee the [WebKit Bug](http://trac.webkit.org/changeset/142739) for status in Safari","notes_by_num":{"1":"Opera 12 uses a different method name('window.supportsCSS')"},"usage_perc_y":58.49,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"conditional","ie_id":"conditionalrules","chrome_id":"4993981813358592"},"css-touch-action":{"title":"CSS touch-action property","description":"touch-action is a CSS property that controls filtering of gesture events, providing developers with a declarative mechanism to selectively disable touch scrolling (in one or both axes), pinch-zooming or double-tap-zooming.","spec":"http://www.w3.org/TR/pointerevents/#the-touch-action-css-property","status":"cr","links":[{"url":"http://docs.webplatform.org/wiki/css/properties/touch-action","title":"WebPlatform Docs"},{"url":"http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx","title":"MSDN Docs"},{"url":"http://updates.html5rocks.com/2013/12/300ms-tap-delay-gone-away","title":"300ms tap delay, gone away"},{"url":"http://blogs.telerik.com/appbuilder/posts/13-11-21/what-exactly-is.....-the-300ms-click-delay","title":"What Exactly Is..... The 300ms Click Delay"},{"url":"http://thx.github.io/mobile/300ms-click-delay/","title":"What Exactly Is..... The 300ms Click Delay(Chinese)"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y x #2","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n d #1","30":"n d #1","31":"n d #1","32":"n d #1","33":"n d #1","34":"n d #1","35":"n d #1","36":"n d #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"y x #2","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Supported in Firefox behind the `layout.css.touch_action.enabled` flag, Firefox for Windows 8 Touch ('Metro') enabled by default.","2":"IE10+ has already supported these property which are not in standard at present such as'pinch-zoom','double-tap-zoom','cross-slide-x','cross-slide-y'."},"usage_perc_y":49.65,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"touch action","ie_id":"csstouchaction","chrome_id":"5912074022551552"},"autofocus":{"title":"Autofocus attribute","description":"Allows a form field to be immediately focused on page load.","spec":"https://html.spec.whatwg.org/multipage/forms.html#autofocusing-a-form-control:-the-autofocus-attribute","status":"wd","links":[{"url":"http://davidwalsh.name/autofocus","title":"Article on autofocus"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"y","5.1":"y","6":"y","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"y","10.0-10.1":"y","10.5":"y","10.6":"y","11":"y","11.1":"y","11.5":"y","11.6":"y","12":"y","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"y","10":"u"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":76.94,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-clip-path":{"title":"CSS clip-path property","description":"Method of defining the visible region of an element using SVG or a shape definition.","spec":"http://www.w3.org/TR/css-masking-1/#the-clip-path","status":"wd","links":[{"url":"http://css-tricks.com/almanac/properties/c/clip/","title":"CSS Tricks article"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"a #1","3.6":"a #1","4":"a #1","5":"a #1","6":"a #1","7":"a #1","8":"a #1","9":"a #1","10":"a #1","11":"a #1","12":"a #1","13":"a #1","14":"a #1","15":"a #1","16":"a #1","17":"a #1","18":"a #1","19":"a #1","20":"a #1","21":"a #1","22":"a #1","23":"a #1","24":"a #1","25":"a #1","26":"a #1","27":"a #1","28":"a #1","29":"a #1","30":"a #1","31":"a #1","32":"a #1","33":"a #1","34":"a #1","35":"a #1","36":"a #1"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"a x #2","25":"a x #2","26":"a x #2","27":"a x #2","28":"a x #2","29":"a x #2","30":"a x #2","31":"a x #2","32":"a x #2","33":"a x #2","34":"a x #2","35":"a x #2","36":"a x #2","37":"a x #2","38":"a x #2","39":"a x #2","40":"a x #2","41":"a x #2","42":"a x #2"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"a x #2","7.1":"a x #2","8":"a x #2"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a x #2","16":"a x #2","17":"a x #2","18":"a x #2","19":"a x #2","20":"a x #2","21":"a x #2","22":"a x #2","23":"a x #2","24":"a x #2","25":"a x #2","26":"a x #2","27":"a x #2"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"a x #2","8":"a x #2","8.1":"a x #2"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"a x #2","4.4.3-4.4.4":"a x #2","37":"a x #2"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a x #2"},"and_chr":{"38":"a x #2"},"and_ff":{"32":"a #1"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{"1":"Partial support refers to only supporting the `url()` syntax.","2":"Partial support refers to supporting shapes and the `url(#foo)` syntax for inline SVG, but not shapes in external SVGs."},"usage_perc_y":0,"usage_perc_a":69.28,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"getrandomvalues":{"title":"crypto.getRandomValues()","description":"Method of generating cryptographically random values.","spec":"http://www.w3.org/TR/WebCryptoAPI/#RandomSource-method-getRandomValues","status":"wd","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues","title":"MDN article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"y","7":"y","7.1":"y","8":"y"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"y","8":"y","8.1":"y"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n","11":"y x"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":76.99,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"screen-orientation":{"title":"Screen Orientation","description":"Provides the ability to read the screen orientation state, to be informed when this state changes, and to be able to lock the screen orientation to a specific state.","spec":"http://www.w3.org/TR/screen-orientation/","status":"wd","links":[{"url":"http://aurelio.audero.it/demo/screen-orientation-api-demo.html","title":"Demo"},{"url":"https://developer.mozilla.org/en-US/docs/Web/API/Screen.orientation","title":"MDN article"},{"url":"http://www.sitepoint.com/introducing-screen-orientation-api/","title":"SitePoint article"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y x"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"y"},"and_ff":{"32":"y x"},"ie_mob":{"10":"n","11":"a x"},"and_uc":{"9.9":"y"}},"notes":"","notes_by_num":{},"usage_perc_y":44.78,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"screenorientationapi","chrome_id":"6191285283061760"},"font-loading":{"title":"CSS Font Loading","description":"This CSS module defines a scripting interface to font faces in CSS, allowing font faces to be easily created and loaded from script. It also provides methods to track the loading status of an individual font, or of all the fonts on an entire page.","spec":"http://dev.w3.org/csswg/css-font-loading/","status":"cr","links":[{"url":"https://www.igvita.com/2014/01/31/optimizing-web-font-rendering-performance/#font-load-events","title":"Optimizing with font load events"}],"categories":["CSS3","JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"y"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":40.71,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":"6244676289953792"},"font-unicode-range":{"title":"Font unicode-range subsetting","description":"This @font-face descriptor defines the set of Unicode codepoints that may be supported by the font face for which it is declared. The descriptor value is a comma-delimited list of Unicode range (<urange>) values. The union of these ranges defines the set of codepoints that serves as a hint for user agents when deciding whether or not to download a font resource for a given text run.","spec":"http://dev.w3.org/csswg/css-fonts/#descdef-unicode-range","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-range","title":"MDN: unicode-range"},{"url":"https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html#//apple_ref/css/property/unicode-range","title":"Safari CSS Reference: unicode-range"},{"url":"http://docs.webplatform.org/wiki/css/properties/unicode-range","title":"Web Platform Docs: unicode-range"},{"url":"http://jsbin.com/jeqoguzeye/1/edit?html,output","title":"Demo"}],"categories":["CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a","10":"a","11":"a"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"y"},"chrome":{"4":"a","5":"a","6":"a","7":"a","8":"a","9":"a","10":"a","11":"a","12":"a","13":"a","14":"a","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"a","24":"a","25":"a","26":"a","27":"a","28":"a","29":"a","30":"a","31":"a","32":"a","33":"a","34":"a","35":"a","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"a","3.2":"a","4":"a","5":"a","5.1":"a","6":"a","6.1":"a","7":"a","7.1":"a","8":"a"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"a","16":"a","17":"a","18":"a","19":"a","20":"a","21":"a","22":"a","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"a","4.0-4.1":"a","4.2-4.3":"a","5.0-5.1":"a","6.0-6.1":"a","7.0-7.1":"a","8":"a","8.1":"a"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"a","2.2":"a","2.3":"a","3":"a","4":"a","4.1":"a","4.2-4.3":"a","4.4":"a","4.4.3-4.4.4":"a","37":"y"},"bb":{"7":"u","10":"u"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"a"},"and_chr":{"38":"y"},"and_ff":{"32":"a"},"ie_mob":{"10":"a","11":"a"},"and_uc":{"9.9":"a"}},"notes":"Partial support indicates that unnecessary code-ranges are downloaded by the browser - see [browser test matrix](https://docs.google.com/a/chromium.org/spreadsheets/d/18h-1gaosu4-KYxH8JUNL6ZDuOsOKmWfauoai3CS3hPY/edit?pli=1#gid=0).","notes_by_num":{},"usage_perc_y":39.77,"usage_perc_a":37.94,"ucprefix":false,"parent":"","keywords":"font face,unicode,unicode-range","ie_id":"","chrome_id":""},"gamepad":{"title":"Gamepad API","description":"API to support input from USB gamepad controllers though JavaScript.","spec":"http://www.w3.org/TR/gamepad/","status":"wd","links":[{"url":"http://luser.github.io/gamepadtest/","title":"Controller demo"},{"url":"https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API","title":"MDN article"},{"url":"http://www.html5rocks.com/en/tutorials/doodles/gamepad/","title":"HTML5Rocks article"},{"url":"http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345","title":"Detailed tutorial"}],"categories":["JS API"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y x","22":"y x","23":"y x","24":"y x","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":45.37,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"gamepadapi","chrome_id":"5118776383111168"},"css-font-stretch":{"title":"CSS font-stretch","description":"If a font has multiple types of variations based on the width of characters, the `font-stretch` property allows the appropriate one to be selected. The property in itself does not cause the browser to stretch to a font.","spec":"http://www.w3.org/TR/css-fonts-3/#font-stretch-prop","status":"cr","links":[{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch","title":"MDN article"},{"url":"http://css-tricks.com/almanac/properties/f/font-stretch/","title":"CSS Tricks article"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"u","41":"u","42":"u"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"u","27":"u"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"y"},"ie_mob":{"10":"y","11":"y"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":24.44,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"font stretch","ie_id":"cssfontstretch","chrome_id":"4598830058176512"},"font-size-adjust":{"title":"CSS font-size-adjust","description":"Method of adjusting the font size in a matter that relates to the height of lowercase vs. uppercase letters. This makes it easier to set the size of fallback fonts.","spec":"http://www.w3.org/TR/css-fonts-3/#font-size-adjust-prop","status":"cr","links":[{"url":"http://webdesignernotebook.com/css/the-little-known-font-size-adjust-css3-property/","title":"Article on font-size-adjust"},{"url":"https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust","title":"MDN article on font-size-adjust"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"u","41":"u","42":"u"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"u","27":"u"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"n","7.0-7.1":"n","8":"n","8.1":"n"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"n"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"Does not appear to work on Firefox mobile, despite recognition of the property.","notes_by_num":{},"usage_perc_y":12.55,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"link-icon-png":{"title":"PNG favicons","description":"Icon used by browsers to identify a webpage or site. While all browsers support the `.ico` format, the PNG format can be preferable.","spec":"https://html.spec.whatwg.org/multipage/semantics.html#rel-icon","status":"pr","links":[{"url":"http://css-tricks.com/favicon-quiz/","title":"Detailed info on favicons for various uses"}],"categories":["HTML5"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"y"},"firefox":{"2":"y","3":"y","3.5":"y","3.6":"y","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"y #1","5":"y #1","6":"y #1","7":"y #1","8":"y #1","9":"y #1","10":"y #1","11":"y #1","12":"y #1","13":"y #1","14":"y #1","15":"y #1","16":"y #1","17":"y #1","18":"y #1","19":"y #1","20":"y #1","21":"y #1","22":"y #1","23":"y #1","24":"y #1","25":"y #1","26":"y #1","27":"y #1","28":"y #1","29":"y #1","30":"y #1","31":"y #1","32":"y #1","33":"y #1","34":"y #1","35":"y #1","36":"y #1","37":"y #1","38":"y #1","39":"y #1","40":"y #1","41":"y #1","42":"y #1"},"safari":{"3.1":"y #2","3.2":"y #2","4":"y #2","5":"y #2","5.1":"y #2","6":"y #2","6.1":"y #2","7":"y #2","7.1":"y #2","8":"y #2"},"opera":{"9":"y #3","9.5-9.6":"y #3","10.0-10.1":"y #3","10.5":"y #3","10.6":"y #3","11":"y #3","11.1":"y #3","11.5":"y #3","11.6":"y #3","12":"y #3","12.1":"y #3","15":"y #1","16":"y #1","17":"y #1","18":"y #1","19":"y #1","20":"y #1","21":"y #1","22":"y #1","23":"y #1","24":"y #1","25":"y #1","26":"y #1","27":"y #1"},"ios_saf":{"3.2":"n #4","4.0-4.1":"n #4","4.2-4.3":"n #4","5.0-5.1":"n #4","6.0-6.1":"n #4","7.0-7.1":"n #4","8":"n #4","8.1":"n #4"},"op_mini":{"5.0-8.0":"n #4"},"android":{"2.1":"y","2.2":"y","2.3":"y","3":"y","4":"y","4.1":"y","4.2-4.3":"y","4.4":"y #3","4.4.3-4.4.4":"y #3","37":"y #3"},"bb":{"7":"y","10":"n #4"},"op_mob":{"10":"n #4","11":"n #4","11.1":"n #4","11.5":"n #4","12":"n #4","12.1":"n #4","24":"n #4"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"n #4","11":"n #4"},"and_uc":{"9.9":"y #2"}},"notes":"Win8/IE10+ and iOS Safari support other types of icons for webpages too, using alternate tags.\r\n\r\nSee also [SVG favicons](#feat=link-icon-svg).","notes_by_num":{"1":"If both ICO and PNG are available, will use ICO over PNG if ICO has better matching sizes set.","2":"If both ICO and PNG are available, will ALWAYS use ICO file, regardless of sizes set.","3":"If multiple formats are available, will use the last one loaded, regardless of sizes (effectively picks at random).","4":"Does not use favicons at all (but may have alternative for bookmarks, etc)"},"usage_perc_y":77.82,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"link-icon-svg":{"title":"SVG favicons","description":"Icon used by browsers to identify a webpage or site. While all browsers support the `.ico` format, the SVG format can be preferable to more easily support higher resolutions or larger icons.","spec":"https://html.spec.whatwg.org/multipage/semantics.html#rel-icon","status":"pr","links":[{"url":"http://crbug.com/294179","title":"Chrome bug"}],"categories":["HTML5","SVG"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"y","5":"y","6":"y","7":"y","8":"y","9":"y","10":"y","11":"y","12":"y","13":"y","14":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n","37":"n","38":"n","39":"n","40":"u","41":"u","42":"u"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"n","6.1":"n","7":"n","7.1":"n","8":"n"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"u","27":"u"},"ios_saf":{"3.2":"n #1","4.0-4.1":"n #1","4.2-4.3":"n #1","5.0-5.1":"n #1","6.0-6.1":"n #1","7.0-7.1":"n #1","8":"n #1","8.1":"n #1"},"op_mini":{"5.0-8.0":"n #1"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"n","4.4.3-4.4.4":"n","37":"n"},"bb":{"7":"n","10":"n #1"},"op_mob":{"10":"n #1","11":"n #1","11.1":"n #1","11.5":"n #1","12":"n #1","12.1":"n #1","24":"n #1"},"and_chr":{"38":"n"},"and_ff":{"32":"n"},"ie_mob":{"10":"n #1","11":"n #1"},"and_uc":{"9.9":"n"}},"notes":"See also [PNG favicons](#feat=link-icon-png).","notes_by_num":{"1":"Does not use favicons at all"},"usage_perc_y":12.39,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""},"css-media-resolution":{"title":"Media Queries: resolution feature","description":"Allows a media query to be set based on the device pixels used per CSS unit. While the standard uses `min`/`max-resolution` for this, some browsers support the older non-standard `device-pixel-ratio` media query.","spec":"http://www.w3.org/TR/css3-mediaqueries/#resolution","status":"rec","links":[{"url":"http://www.w3.org/blog/CSS/2012/06/14/unprefix-webkit-device-pixel-ratio/","title":"How to unprefix -webkit-device-pixel-ratio"}],"categories":["CSS","CSS3"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"a #1","10":"a #1","11":"a #1"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"a #1","4":"a #1","5":"a #1","6":"a #1","7":"a #1","8":"a #1","9":"a #1","10":"a #1","11":"a #1","12":"a #1","13":"a #1","14":"a #1","15":"a #1","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y","28":"y","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y"},"chrome":{"4":"a x #2","5":"a x #2","6":"a x #2","7":"a x #2","8":"a x #2","9":"a x #2","10":"a x #2","11":"a x #2","12":"a x #2","13":"a x #2","14":"a x #2","15":"a x #2","16":"a x #2","17":"a x #2","18":"a x #2","19":"a x #2","20":"a x #2","21":"a x #2","22":"a x #2","23":"a x #2","24":"a x #2","25":"a x #2","26":"a x #2","27":"a x #2","28":"a x #2","29":"y","30":"y","31":"y","32":"y","33":"y","34":"y","35":"y","36":"y","37":"y","38":"y","39":"y","40":"y","41":"y","42":"y"},"safari":{"3.1":"n","3.2":"n","4":"a x #2","5":"a x #2","5.1":"a x #2","6":"a x #2","6.1":"a x #2","7":"a x #2","7.1":"a x #2","8":"a x #2"},"opera":{"9":"u","9.5-9.6":"u","10.0-10.1":"u","10.5":"u","10.6":"u","11":"u","11.1":"u","11.5":"u","11.6":"u","12":"u","12.1":"y","15":"y","16":"y","17":"y","18":"y","19":"y","20":"y","21":"y","22":"y","23":"y","24":"y","25":"y","26":"y","27":"y"},"ios_saf":{"3.2":"u","4.0-4.1":"a x #2","4.2-4.3":"a x #2","5.0-5.1":"a x #2","6.0-6.1":"a x #2","7.0-7.1":"a x #2","8":"a x #2","8.1":"a x #2"},"op_mini":{"5.0-8.0":"a #1"},"android":{"2.1":"u","2.2":"u","2.3":"u","3":"u","4":"a x #2","4.1":"a x #2","4.2-4.3":"a x #2","4.4":"y","4.4.3-4.4.4":"y","37":"y"},"bb":{"7":"a x #2","10":"a x #2"},"op_mob":{"10":"u","11":"u","11.1":"u","11.5":"u","12":"u","12.1":"y","24":"y"},"and_chr":{"38":"y"},"and_ff":{"32":"y"},"ie_mob":{"10":"a #1","11":"a #1"},"and_uc":{"9.9":"a x #2"}},"notes":"","notes_by_num":{"1":"Supports the `dpi unit`, but does not support `dppx` or `dpcm` units.","2":"Supported using the non-standard `min`/`max-device-pixel-ratio`"},"usage_perc_y":58.72,"usage_perc_a":34.38,"ucprefix":false,"parent":"css-mediaqueries","keywords":"@media,device-pixel-ratio,resolution","ie_id":"mediaqueriesresolutionfeature,dppxunitfortheresolutionmediaquery","chrome_id":"5944509615570944"},"css-image-set":{"title":"CSS image-set","description":"Method of letting the browser pick the most appropriate CSS background image from a given set, primarily for high PPI screens.","spec":"http://dev.w3.org/csswg/css-images-3/#image-set-notation","status":"unoff","links":[{"url":"http://cloudfour.com/examples/image-set/","title":"Demo"}],"categories":["CSS"],"stats":{"ie":{"5.5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n"},"firefox":{"2":"n","3":"n","3.5":"n","3.6":"n","4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"n","22":"n","23":"n","24":"n","25":"n","26":"n","27":"n","28":"n","29":"n","30":"n","31":"n","32":"n","33":"n","34":"n","35":"n","36":"n"},"chrome":{"4":"n","5":"n","6":"n","7":"n","8":"n","9":"n","10":"n","11":"n","12":"n","13":"n","14":"n","15":"n","16":"n","17":"n","18":"n","19":"n","20":"n","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x","28":"y x","29":"y x","30":"y x","31":"y x","32":"y x","33":"y x","34":"y x","35":"y x","36":"y x","37":"y x","38":"y x","39":"y x","40":"y x","41":"y x","42":"y x"},"safari":{"3.1":"n","3.2":"n","4":"n","5":"n","5.1":"n","6":"y x","6.1":"y x","7":"y x","7.1":"y x","8":"y x"},"opera":{"9":"n","9.5-9.6":"n","10.0-10.1":"n","10.5":"n","10.6":"n","11":"n","11.1":"n","11.5":"n","11.6":"n","12":"n","12.1":"n","15":"y x","16":"y x","17":"y x","18":"y x","19":"y x","20":"y x","21":"y x","22":"y x","23":"y x","24":"y x","25":"y x","26":"y x","27":"y x"},"ios_saf":{"3.2":"n","4.0-4.1":"n","4.2-4.3":"n","5.0-5.1":"n","6.0-6.1":"y x","7.0-7.1":"y x","8":"y x","8.1":"y x"},"op_mini":{"5.0-8.0":"n"},"android":{"2.1":"n","2.2":"n","2.3":"n","3":"n","4":"n","4.1":"n","4.2-4.3":"n","4.4":"y x","4.4.3-4.4.4":"y x","37":"y x"},"bb":{"7":"u","10":"y x"},"op_mob":{"10":"n","11":"n","11.1":"n","11.5":"n","12":"n","12.1":"n","24":"y x"},"and_chr":{"38":"y x"},"and_ff":{"32":"n"},"ie_mob":{"10":"n","11":"n"},"and_uc":{"9.9":"n"}},"notes":"","notes_by_num":{},"usage_perc_y":57.73,"usage_perc_a":0,"ucprefix":false,"parent":"","keywords":"","ie_id":"","chrome_id":""}}}
},{}],52:[function(require,module,exports){
module.exports={
  "title":"CSS3 Background-image options",
  "description":"New properties to affect background images, including background-clip, background-origin and background-size",
  "spec":"http://www.w3.org/TR/css3-background/#backgrounds",
  "status":"cr",
  "links":[
    {
      "url":"http://www.standardista.com/css3/css3-background-properties",
      "title":"Detailed compatibility tables and demos"
    },
    {
      "url":"http://www.css3files.com/background/",
      "title":"Information page"
    },
    {
      "url":"https://github.com/louisremi/background-size-polyfill",
      "title":"Polyfill for IE7-8"
    }
  ],
  "bugs":[
    {
      "description":"iOS Safari has buggy behavior with `background-size: cover;` on a page's body."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"y",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"a x",
      "4":"y",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"a",
      "3.2":"a",
      "4":"a",
      "5":"a",
      "5.1":"a",
      "6":"a",
      "6.1":"a",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"a x",
      "10.5":"y",
      "10.6":"y",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"a",
      "4.0-4.1":"a",
      "4.2-4.3":"a",
      "5.0-5.1":"a",
      "6.0-6.1":"a",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"a"
    },
    "android":{
      "2.1":"a x",
      "2.2":"y x",
      "2.3":"y x",
      "3":"y",
      "4":"y",
      "4.1":"y",
      "4.2-4.3":"y",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"y",
      "10":"y"
    },
    "op_mob":{
      "10":"y",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y"
    }
  },
  "notes":"Partial support in Opera Mini refers to not supporting background sizing or background attachments. However Opera Mini 7.5 supports background sizing (including cover and contain values).\r\n\r\nPartial support in Safari 6 refers to not supporting background sizing offset from edges syntax.",
  "notes_by_num":{
    
  },
  "usage_perc_y":88.87,
  "usage_perc_a":4.54,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],53:[function(require,module,exports){
module.exports={
  "title":"CSS3 Border images",
  "description":"Method of using images for borders",
  "spec":"http://www.w3.org/TR/css3-background/#the-border-image",
  "status":"cr",
  "links":[
    {
      "url":"http://www.css3files.com/border/",
      "title":"Information page"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/border-image",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"a x",
      "3.6":"a x",
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"a x",
      "3.2":"a x",
      "4":"a x",
      "5":"a x",
      "5.1":"a x",
      "6":"y",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"a",
      "10.6":"a",
      "11":"a x",
      "11.1":"a x",
      "11.5":"a x",
      "11.6":"a x",
      "12":"a x",
      "12.1":"a x",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"a x",
      "4.2-4.3":"a x",
      "5.0-5.1":"a x",
      "6.0-6.1":"y",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"a x",
      "4.1":"a x",
      "4.2-4.3":"a x",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"a x",
      "10":"y"
    },
    "op_mob":{
      "10":"n",
      "11":"a x",
      "11.1":"a x",
      "11.5":"a x",
      "12":"a x",
      "12.1":"a x",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"n",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y"
    }
  },
  "notes":"Note that both the border-style and border-width must be specified for border-images to work according to spec, though older implementations may not have this requirement. Partial support refers to supporting the shorthand syntax, but not the individual properties (border-image-source, border-image-slice, etc). ",
  "notes_by_num":{
    
  },
  "usage_perc_y":80.35,
  "usage_perc_a":5.64,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],54:[function(require,module,exports){
module.exports={
  "title":"CSS3 Border-radius (rounded corners)",
  "description":"Method of making the border corners round",
  "spec":"http://www.w3.org/TR/css3-background/#the-border-radius",
  "status":"cr",
  "links":[
    {
      "url":"http://border-radius.com",
      "title":"Border-radius CSS Generator"
    },
    {
      "url":"http://muddledramblings.com/table-of-css3-border-radius-compliance",
      "title":"Detailed compliance table"
    },
    {
      "url":"http://www.css3files.com/border/#borderradius",
      "title":"Information page"
    },
    {
      "url":"http://css3pie.com/",
      "title":"Polyfill which includes border-radius"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/border-radius",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Safari does not apply `border-radius` correctly to image borders: http://stackoverflow.com/q/17202128"
    },
    {
      "description":"Android Browser 2.3 does not support % value for `border-radius`."
    },
    {
      "description":"Border-radius does not work on fieldset elements in IE9."
    },
    {
      "description":"The stock browser on the Samsung Galaxy S4 with Android 4.2 does not support the `border-radius` shorthand property but does support the long-hand properties for each corner like `border-top-left-radius`."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"y",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"a x",
      "3":"y x",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"y x",
      "3.2":"y x",
      "4":"y x",
      "5":"y",
      "5.1":"y",
      "6":"y",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"y",
      "10.6":"y",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y",
      "4.2-4.3":"y",
      "5.0-5.1":"y",
      "6.0-6.1":"y",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"y x",
      "2.2":"y",
      "2.3":"y",
      "3":"y",
      "4":"y",
      "4.1":"y",
      "4.2-4.3":"y",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"y",
      "10":"y"
    },
    "op_mob":{
      "10":"n",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":90.64,
  "usage_perc_a":0.01,
  "ucprefix":false,
  "parent":"",
  "keywords":"roundedcorners, border radius,-moz-border-radius",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],55:[function(require,module,exports){
module.exports={
  "title":"calc() as CSS unit value",
  "description":"Method of allowing calculated values for length units, i.e. `width: calc(100% - 3em)`",
  "spec":"http://www.w3.org/TR/css3-values/#calc",
  "status":"cr",
  "links":[
    {
      "url":"http://hacks.mozilla.org/2010/06/css3-calc/",
      "title":"Mozilla Hacks article"
    },
    {
      "url":"https://developer.mozilla.org/en/CSS/-moz-calc",
      "title":"MDN article"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/functions/calc",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Safari 7.0 and older and Chrome 26 and older don't support viewport units in `calc()` expressions (fixed since then)."
    },
    {
      "description":"`calc()` doesn't work [inside a transform in IE](http://connect.microsoft.com/IE/feedback/details/814380/css3-using-calc-inside-a-transform-is-invalid)"
    },
    {
      "description":"IE9 appears to ignore `calc()` expressions when `display:table` is used."
    },
    {
      "description":"Safari 6 has a bug where an element with a width defined using `calc()` has its width reset when changing the height using JS (fixed in Safari 7)."
    },
    {
      "description":"IE11 and other browsers to a lesser extent have trouble supporting `calc()` inside [color or transform values](http://codepen.io/thebabydino/pen/wfraH)."
    },
    {
      "description":"IE10 crashes when a div with a property using `calc()` has a child with [same property with `inherit`](http://stackoverflow.com/questions/19423384/css-less-calc-method-is-crashing-my-ie10)."
    },
    {
      "description":"IE 9 - 11 don't render `box-shadow` when `calc()` is used for any of the values."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"a",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"y x",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"y x",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"a",
      "4.4.3-4.4.4":"a",
      "37":"y"
    },
    "bb":{
      "7":"n",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"Support can be somewhat emulated in older versions of IE using the non-standard `expression()` syntax. Partial support in IE9 refers to the browser crashing when used as a `background-position` value. Partial support in Android Browser 4.4 refers to the browser lacking the ability to multiply and divide values.",
  "notes_by_num":{
    
  },
  "usage_perc_y":77.04,
  "usage_perc_a":5.27,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"csscalc",
  "chrome_id":"5765241438732288",
  "shown":true
}
},{}],56:[function(require,module,exports){
module.exports={
  "title":"CSS3 Animation",
  "description":"Complex method of animating certain properties of an element",
  "spec":"http://www.w3.org/TR/css3-animations/",
  "status":"wd",
  "links":[
    {
      "url":"http://robertnyman.com/2010/05/06/css3-animations/",
      "title":"Blog post on usage"
    },
    {
      "url":"http://www.css3files.com/animation/",
      "title":"Information page"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/animations",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"'animation-fill-mode' property is not supported in Android browser below 2.3."
    },
    {
      "description":"iOS 6.1 and below do not support animation on pseudo-elements."
    },
    {
      "description":"@keyframes not supported in an inline or scoped stylesheet in Firefox (bug 830056)"
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"y x",
      "12.1":"y",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"y",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Partial support in Android browser refers to buggy behavior in different scenarios.",
  "notes_by_num":{
    
  },
  "usage_perc_y":88.04,
  "usage_perc_a":0.21,
  "ucprefix":false,
  "parent":"",
  "keywords":"animations,css-animations,keyframe,keyframes",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],57:[function(require,module,exports){
module.exports={
  "title":"CSS box-decoration-break",
  "description":"Controls whether the box's margins, borders, padding, and other decorations wrap the broken edges of the box fragments (when the box is split by a break (page/column/region/line).",
  "spec":"http://www.w3.org/TR/css3-break/#break-decoration",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break",
      "title":"MDN article"
    },
    {
      "url":"http://jsbin.com/xojoro/edit?css,output",
      "title":"Demo of effect on box border"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n",
      "28":"n",
      "29":"n",
      "30":"n",
      "31":"n",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"u",
      "5":"u",
      "6":"u",
      "7":"u",
      "8":"u",
      "9":"u",
      "10":"u",
      "11":"u",
      "12":"u",
      "13":"u",
      "14":"u",
      "15":"u",
      "16":"u",
      "17":"u",
      "18":"u",
      "19":"u",
      "20":"u",
      "21":"u",
      "22":"u",
      "23":"u",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"u",
      "3.2":"u",
      "4":"u",
      "5":"u",
      "5.1":"u",
      "6":"u",
      "6.1":"u",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"u",
      "9.5-9.6":"u",
      "10.0-10.1":"u",
      "10.5":"u",
      "10.6":"u",
      "11":"u",
      "11.1":"u",
      "11.5":"u",
      "11.6":"u",
      "12":"u",
      "12.1":"u",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"u",
      "4.0-4.1":"u",
      "4.2-4.3":"u",
      "5.0-5.1":"u",
      "6.0-6.1":"u",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"y"
    },
    "android":{
      "2.1":"u",
      "2.2":"u",
      "2.3":"u",
      "3":"u",
      "4":"u",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"u",
      "10":"u"
    },
    "op_mob":{
      "10":"u",
      "11":"u",
      "11.1":"u",
      "11.5":"u",
      "12":"u",
      "12.1":"u",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"u"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":72.86,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"box-decoration,box decoration,break",
  "ie_id":"",
  "chrome_id":"",
  "shown":false
}
},{}],58:[function(require,module,exports){
module.exports={
  "title":"CSS3 Box-shadow",
  "description":"Method of displaying an inner or outer shadow effect to elements",
  "spec":"http://www.w3.org/TR/css3-background/#box-shadow",
  "status":"cr",
  "links":[
    {
      "url":"https://developer.mozilla.org/En/CSS/-moz-box-shadow",
      "title":"MDN article"
    },
    {
      "url":"http://westciv.com/tools/boxshadows/index.html",
      "title":"Live editor"
    },
    {
      "url":"http://tests.themasta.com/blogstuff/boxshadowdemo.html",
      "title":"Demo of various effects"
    },
    {
      "url":"http://www.css3files.com/shadow/",
      "title":"Information page"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/box-shadow",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Safari 6, iOS 6 and Android 2.3 default browser don't work with a 0px value for \"spread\".\r\ne.g. -webkit-box-shadow: 5px 1px 0px #f04e29;\r\ndoesn't work, but\r\n-webkit-box-shadow: 5px 1px 1px #f04e29\r\ndoes."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"y",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"a x",
      "3.2":"a x",
      "4":"a x",
      "5":"y x",
      "5.1":"y",
      "6":"y",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"y",
      "10.6":"y",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y",
      "6.0-6.1":"y",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"y",
      "4.1":"y",
      "4.2-4.3":"y",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"y x",
      "10":"y"
    },
    "op_mob":{
      "10":"n",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y"
    }
  },
  "notes":"Can be partially emulated in older IE versions using the non-standard \"shadow\" filter. Partial support in Safari, iOS Safari and Android Browser refers to missing \"inset\" and blur radius value support.",
  "notes_by_num":{
    
  },
  "usage_perc_y":90.29,
  "usage_perc_a":0.3,
  "ucprefix":false,
  "parent":"",
  "keywords":"box-shadows,boxshadows,box shadow,shaow",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],59:[function(require,module,exports){
module.exports={
  "title":"CSS Filter Effects",
  "description":"Method of applying filter effects (like blur, grayscale, brightness, contrast and hue) to elements, previously only possible by using SVG.",
  "spec":"http://www.w3.org/TR/filter-effects/",
  "status":"wd",
  "links":[
    {
      "url":"http://html5-demos.appspot.com/static/css/filters/index.html",
      "title":"Demo file for WebKit browsers"
    },
    {
      "url":"http://www.html5rocks.com/en/tutorials/filters/understanding-css/",
      "title":"HTML5Rocks article"
    },
    {
      "url":"http://dl.dropbox.com/u/3260327/angular/CSS3ImageManipulation.html",
      "title":"Filter editor"
    },
    {
      "url":"http://bennettfeely.com/filters/",
      "title":"Filter Playground"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS",
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"a",
      "4":"a",
      "5":"a",
      "6":"a",
      "7":"a",
      "8":"a",
      "9":"a",
      "10":"a",
      "11":"a",
      "12":"a",
      "13":"a",
      "14":"a",
      "15":"a",
      "16":"a",
      "17":"a",
      "18":"a",
      "19":"a",
      "20":"a",
      "21":"a",
      "22":"a",
      "23":"a",
      "24":"a",
      "25":"a",
      "26":"a",
      "27":"a",
      "28":"a",
      "29":"a",
      "30":"a",
      "31":"a",
      "32":"a",
      "33":"a",
      "34":"a d",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"n",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"n"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Note that this property is significantly different from and incompatible with Microsoft's [older \"filter\" property](http://msdn.microsoft.com/en-us/library/ie/ms530752%28v=vs.85%29.aspx).\r\n\r\nPartial support in Firefox 31 [only with url() version](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#Browser_compatibility)",
  "notes_by_num":{
    
  },
  "usage_perc_y":60.68,
  "usage_perc_a":12.47,
  "ucprefix":false,
  "parent":"",
  "keywords":"sepia,hue-rotate,invert,saturate",
  "ie_id":"filters",
  "chrome_id":"",
  "shown":true
}
},{}],60:[function(require,module,exports){
module.exports={
  "title":"CSS Gradients",
  "description":"Method of defining a linear or radial color gradient as a CSS image.",
  "spec":"http://www.w3.org/TR/css3-images/",
  "status":"cr",
  "links":[
    {
      "url":"http://www.colorzilla.com/gradient-editor/",
      "title":"Cross-browser editor"
    },
    {
      "url":"http://www.css3files.com/gradient/",
      "title":"Information page"
    },
    {
      "url":"http://css3pie.com/",
      "title":"Tool to emulate support in IE"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/functions/linear-gradient",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"a x",
      "5":"a x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"a x",
      "11.5":"a x",
      "11.6":"y x",
      "12":"y x",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"a x",
      "4.2-4.3":"a x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"a x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"a x",
      "11.5":"a x",
      "12":"y x",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Syntax used by browsers with prefixed support may be incompatible with that for proper support. \r\n\r\nPartial support in Opera 11.10 and 11.50 also refers to only having support for linear gradients.\r\n\r\nSupport can be somewhat emulated in older IE versions using the non-standard \"gradient\" filter. \r\n\r\nFirefox 10+, Opera 11.6+, Chrome 26+ and IE10+ also support the new \"to (side)\" syntax.",
  "notes_by_num":{
    
  },
  "usage_perc_y":87.78,
  "usage_perc_a":0.62,
  "ucprefix":false,
  "parent":"",
  "keywords":"linear,linear-gradient,gradiant",
  "ie_id":"gradients",
  "chrome_id":"5785905063264256",
  "shown":true
}
},{}],61:[function(require,module,exports){
module.exports={
  "title":"CSS Hyphenation",
  "description":"Method of controlling when words at the end of lines should be hyphenated using the \"hyphens\" property.",
  "spec":"http://www.w3.org/TR/css3-text/#hyphenation",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en/CSS/hyphens",
      "title":"MDN article"
    },
    {
      "url":"http://blog.fontdeck.com/post/9037028497/hyphens",
      "title":"Blog post"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/hyphens",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y x",
      "11":"y x"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n",
      "28":"n",
      "29":"n",
      "30":"n",
      "31":"n",
      "32":"n",
      "33":"n",
      "34":"n",
      "35":"n",
      "36":"n",
      "37":"n",
      "38":"n",
      "39":"n",
      "40":"n",
      "41":"n",
      "42":"n"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"n",
      "10":"n"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"n"
    },
    "and_chr":{
      "38":"n"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"a x"
    }
  },
  "notes":"Chrome 29- and Android 4.0 Browser support \"-webkit-hyphens: none\", but not the \"auto\" property. Chrome 30+ doesn't support it either.",
  "notes_by_num":{
    
  },
  "usage_perc_y":33.24,
  "usage_perc_a":2.87,
  "ucprefix":false,
  "parent":"",
  "keywords":"hyphen,shy",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],62:[function(require,module,exports){
module.exports={
  "title":"CSS Masks",
  "description":"Method of displaying part of an element, using a selected image as a mask",
  "spec":"http://www.w3.org/TR/css-masking/",
  "status":"cr",
  "links":[
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/mask",
      "title":"WebPlatform Docs"
    },
    {
      "url":"http://www.html5rocks.com/en/tutorials/masking/adobe/",
      "title":"HTML5 Rocks article"
    },
    {
      "url":"http://thenittygritty.co/css-masking",
      "title":"Detailed blog post"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"a",
      "3.6":"a",
      "4":"a",
      "5":"a",
      "6":"a",
      "7":"a",
      "8":"a",
      "9":"a",
      "10":"a",
      "11":"a",
      "12":"a",
      "13":"a",
      "14":"a",
      "15":"a",
      "16":"a",
      "17":"a",
      "18":"a",
      "19":"a",
      "20":"a",
      "21":"a",
      "22":"a",
      "23":"a",
      "24":"a",
      "25":"a",
      "26":"a",
      "27":"a",
      "28":"a",
      "29":"a",
      "30":"a",
      "31":"a",
      "32":"a",
      "33":"a",
      "34":"a",
      "35":"a",
      "36":"a"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x",
      "37":"a x",
      "38":"a x",
      "39":"a x",
      "40":"a x",
      "41":"a x",
      "42":"a x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"a x",
      "5":"a x",
      "5.1":"a x",
      "6":"a x",
      "6.1":"a x",
      "7":"a x",
      "7.1":"a x",
      "8":"a x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"a x",
      "4.2-4.3":"a x",
      "5.0-5.1":"a x",
      "6.0-6.1":"a x",
      "7.0-7.1":"a x",
      "8":"a x",
      "8.1":"a x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"a x",
      "4.1":"a x",
      "4.2-4.3":"a x",
      "4.4":"a x",
      "4.4.3-4.4.4":"a x",
      "37":"a x"
    },
    "bb":{
      "7":"a x",
      "10":"a x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"a x"
    },
    "and_chr":{
      "38":"a x"
    },
    "and_ff":{
      "32":"a"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"a x"
    }
  },
  "notes":"Partial support in WebKit/Blink browsers refers to supporting the mask-image and mask-box-image properties, but lacks support for othe parts of the spec. Partial support in Firefox refers to only support for inline SVG mask elements i.e. mask: url(#foo).",
  "notes_by_num":{
    
  },
  "usage_perc_y":0,
  "usage_perc_a":78.29,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"masks",
  "chrome_id":"5381559662149632",
  "shown":true
}
},{}],63:[function(require,module,exports){
module.exports={
  "title":":placeholder-shown CSS pseudo-class",
  "description":"The :placeholder-shown pseudo-class represents the placeholder contents of a form field with placeholder text.",
  "spec":"http://dev.w3.org/csswg/selectors/#placeholder",
  "status":"unoff",
  "links":[
    {
      "url":"http://msdn.microsoft.com/en-us/library/ie/hh772745(v=vs.85).aspx",
      "title":"MSDN article"
    },
    {
      "url":"http://css-tricks.com/snippets/css/style-placeholder-text/",
      "title":"CSS-Tricks article with all prefixes"
    },
    {
      "url":"http://wiki.csswg.org/ideas/placeholder-styling",
      "title":"CSSWG discussion"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"a x",
      "11":"a x"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x",
      "37":"a x",
      "38":"a x",
      "39":"a x",
      "40":"a x",
      "41":"a x",
      "42":"a x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"a x",
      "5.1":"a x",
      "6":"a x",
      "6.1":"a x",
      "7":"a x",
      "7.1":"a x",
      "8":"a x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"a x",
      "5.0-5.1":"a x",
      "6.0-6.1":"a x",
      "7.0-7.1":"a x",
      "8":"a x",
      "8.1":"a x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"a x",
      "4.1":"a x",
      "4.2-4.3":"a x",
      "4.4":"a x",
      "4.4.3-4.4.4":"a x",
      "37":"a x"
    },
    "bb":{
      "7":"u",
      "10":"a x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"a x"
    },
    "and_chr":{
      "38":"a x"
    },
    "and_ff":{
      "32":"a x"
    },
    "ie_mob":{
      "10":"a x",
      "11":"a x"
    },
    "and_uc":{
      "9.9":"a x"
    }
  },
  "notes":"Partial support refers to support for alternative syntax: ::-webkit-input-placeholder (Chrome/Safari/Opera),\r\n::-moz-placeholder (Firefox) and \r\n:-ms-input-placeholder (IE). ",
  "notes_by_num":{
    
  },
  "usage_perc_y":0,
  "usage_perc_a":87.88,
  "ucprefix":false,
  "parent":"",
  "keywords":"::placeholder,placeholder",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],64:[function(require,module,exports){
module.exports={
  "title":"::selection CSS pseudo-element",
  "description":"The ::selection CSS pseudo-element applies rules to the portion of a document that has been highlighted (e.g., selected with the mouse or another pointing device) by the user.",
  "spec":"https://developer.mozilla.org/en-US/docs/Web/CSS/::selection",
  "status":"unoff",
  "links":[
    {
      "url":"http://quirksmode.org/css/selectors/selection.html",
      "title":"::selection test"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/selectors/pseudo-elements/::selection",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"::selection does not work on input elements in Chrome (tested on OS X and Windows XP)"
    }
  ],
  "categories":[
    "CSS"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"y",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"y x",
      "3":"y x",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x"
    },
    "chrome":{
      "4":"y",
      "5":"y",
      "6":"y",
      "7":"y",
      "8":"y",
      "9":"y",
      "10":"y",
      "11":"y",
      "12":"y",
      "13":"y",
      "14":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"y",
      "3.2":"y",
      "4":"y",
      "5":"y",
      "5.1":"y",
      "6":"y",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"y",
      "10.0-10.1":"y",
      "10.5":"y",
      "10.6":"y",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"n",
      "8":"n",
      "8.1":"n"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"n",
      "10":"n"
    },
    "op_mob":{
      "10":"u",
      "11":"u",
      "11.1":"u",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"n"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":75.62,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"::selection,selection",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],65:[function(require,module,exports){
module.exports={
  "title":"CSS position:sticky",
  "description":"Keeps elements positioned as \"fixed\" or \"relative\" depending on how it appears in the viewport. As a result the element is \"stuck\" when necessary while scrolling.",
  "spec":"http://dev.w3.org/csswg/css-position/#sticky-positioning",
  "status":"unoff",
  "links":[
    {
      "url":"http://updates.html5rocks.com/2012/08/Stick-your-landings-position-sticky-lands-in-WebKit",
      "title":"HTML5Rocks"
    },
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/position",
      "title":"MDN article"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/position",
      "title":"WebPlatform Docs"
    },
    {
      "url":"https://github.com/filamentgroup/fixed-sticky",
      "title":"Polyfill"
    },
    {
      "url":"https://github.com/wilddeer/stickyfill",
      "title":"Another polyfill"
    }
  ],
  "bugs":[
    {
      "description":"Firefox and Safari do not appear to support [sticky table headers](http://jsfiddle.net/Mf4YT/2/). (see also [Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=925259))"
    }
  ],
  "categories":[
    "CSS"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n d #1",
      "27":"n d #1",
      "28":"n d #1",
      "29":"n d #1",
      "30":"n d #1",
      "31":"n d #1",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n d #2",
      "24":"n d #2",
      "25":"n d #2",
      "26":"n d #2",
      "27":"n d #2",
      "28":"n d #2",
      "29":"n d #2",
      "30":"n d #2",
      "31":"n d #2",
      "32":"n d #2",
      "33":"n d #2",
      "34":"n d #2",
      "35":"n d #2",
      "36":"n d #2",
      "37":"n",
      "38":"n",
      "39":"n",
      "40":"n",
      "41":"n",
      "42":"n"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"n",
      "10":"n"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"n"
    },
    "and_chr":{
      "38":"n"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"",
  "notes_by_num":{
    "1":"Can be enabled in Firefox by setting the about:config preference layout.css.sticky.enabled to true",
    "2":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags"
  },
  "usage_perc_y":20.93,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"positionsticky",
  "chrome_id":"6190250464378880",
  "shown":true
}
},{}],66:[function(require,module,exports){
module.exports={
  "title":"CSS3 Transitions",
  "description":"Simple method of animating certain properties of an element",
  "spec":"http://www.w3.org/TR/css3-transitions/",
  "status":"wd",
  "links":[
    {
      "url":"http://www.webdesignerdepot.com/2010/01/css-transitions-101/",
      "title":"Article on usage"
    },
    {
      "url":"http://www.css3files.com/transition/",
      "title":"Information page"
    },
    {
      "url":"http://www.the-art-of-web.com/css/timing-function/",
      "title":"Examples on timing functions"
    },
    {
      "url":"http://www.opera.com/docs/specs/presto2.12/css/transitions/",
      "title":"Animation of property types support in Opera"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/transition",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Not supported on any pseudo-elements besides ::before and ::after for Firefox, Chrome 26+, Opera 16+ and IE10+."
    },
    {
      "description":"Transitionable properties with calc() derived values are not supported below and including IE11 (http://connect.microsoft.com/IE/feedback/details/762719/css3-calc-bug-inside-transition-or-transform)"
    },
    {
      "description":"'background-size' is not supported below and including IE10"
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"y x",
      "3.2":"y x",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"y x",
      "10.6":"y x",
      "11":"y x",
      "11.1":"y x",
      "11.5":"y x",
      "11.6":"y x",
      "12":"y x",
      "12.1":"y",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"y x",
      "2.2":"y x",
      "2.3":"y x",
      "3":"y x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"y x",
      "11":"y x",
      "11.1":"y x",
      "11.5":"y x",
      "12":"y x",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":88.35,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"css transition",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],67:[function(require,module,exports){
module.exports={
  "title":"CSS3 Box-sizing",
  "description":"Method of specifying whether or not an element's borders and padding should be included in size units",
  "spec":"http://www.w3.org/TR/css3-ui/#box-sizing",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/En/CSS/Box-sizing",
      "title":"MDN article"
    },
    {
      "url":"http://www.456bereastreet.com/archive/201104/controlling_width_with_css3_box-sizing/",
      "title":"Blog post"
    },
    {
      "url":"https://github.com/Schepp/box-sizing-polyfill",
      "title":"Polyfill for IE"
    },
    {
      "url":"http://css-tricks.com/box-sizing/",
      "title":"CSS Tricks"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/box-sizing",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Android browsers do not calculate correctly the dimensions (width and height) of the HTML select element."
    },
    {
      "description":"Safari 6.0.x does not use box-sizing on elements with display: table;"
    },
    {
      "description":"IE9 will subtract the width of the scrollbar to the width of the element when set to position: absolute, overflow: auto / overflow-y: scroll"
    },
    {
      "description":"IE 8 ignores `box-sizing: border-box` if min/max-width/height is used."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"p",
      "6":"p",
      "7":"p",
      "8":"a",
      "9":"a",
      "10":"a",
      "11":"a"
    },
    "firefox":{
      "2":"y x",
      "3":"y x",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a",
      "11":"a",
      "12":"a",
      "13":"a",
      "14":"a",
      "15":"a",
      "16":"a",
      "17":"a",
      "18":"a",
      "19":"a",
      "20":"a",
      "21":"a",
      "22":"a",
      "23":"a",
      "24":"a",
      "25":"a",
      "26":"a",
      "27":"a",
      "28":"a",
      "29":"a",
      "30":"a",
      "31":"a",
      "32":"a",
      "33":"a",
      "34":"a",
      "35":"a",
      "36":"a",
      "37":"a",
      "38":"a",
      "39":"a",
      "40":"a",
      "41":"a",
      "42":"a"
    },
    "safari":{
      "3.1":"a x",
      "3.2":"a x",
      "4":"a x",
      "5":"a x",
      "5.1":"a",
      "6":"a",
      "6.1":"a",
      "7":"a",
      "7.1":"a",
      "8":"a"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"a",
      "10.0-10.1":"a",
      "10.5":"a",
      "10.6":"a",
      "11":"a",
      "11.1":"a",
      "11.5":"a",
      "11.6":"a",
      "12":"a",
      "12.1":"a",
      "15":"a",
      "16":"a",
      "17":"a",
      "18":"a",
      "19":"a",
      "20":"a",
      "21":"a",
      "22":"a",
      "23":"a",
      "24":"a",
      "25":"a",
      "26":"a",
      "27":"a"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"a x",
      "4.2-4.3":"a x",
      "5.0-5.1":"a",
      "6.0-6.1":"a",
      "7.0-7.1":"a",
      "8":"a",
      "8.1":"a"
    },
    "op_mini":{
      "5.0-8.0":"a"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"a",
      "4.1":"a",
      "4.2-4.3":"a",
      "4.4":"a",
      "4.4.3-4.4.4":"a",
      "37":"a"
    },
    "bb":{
      "7":"a x",
      "10":"a"
    },
    "op_mob":{
      "10":"a",
      "11":"a",
      "11.1":"a",
      "11.5":"a",
      "12":"a",
      "12.1":"a",
      "24":"a"
    },
    "and_chr":{
      "38":"a"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"a",
      "11":"a"
    },
    "and_uc":{
      "9.9":"a"
    }
  },
  "notes":"Partial support refers to supporting only the `content-box` and `border-box` values, not `padding-box` (which was added to the spec later).",
  "notes_by_num":{
    
  },
  "usage_perc_y":12.72,
  "usage_perc_a":83.97,
  "ucprefix":false,
  "parent":"",
  "keywords":"border-box,content-box,padding-box",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],68:[function(require,module,exports){
module.exports={
  "title":"CSS3 Cursors (new values)",
  "description":"Support for `zoom-in` and `zoom-out` values for the CSS3 `cursor` property.",
  "spec":"http://www.w3.org/TR/css3-ui/#cursor",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/cursor",
      "title":"MDN Documentation"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"y x",
      "3":"y x",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"y x",
      "3.2":"y x",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"n",
      "8":"n",
      "8.1":"n"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"n"
    },
    "and_chr":{
      "38":"n"
    },
    "and_ff":{
      "32":"n"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"Chrome, Safari and Firefox also support the unofficial `grab` and `grabbing` values (with prefix)",
  "notes_by_num":{
    
  },
  "usage_perc_y":50.93,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"cursors, pointers",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],69:[function(require,module,exports){
module.exports={
  "title":"CSS3 tab-size",
  "description":"Method of customizing the width of the tab character. Only effective using 'white-space: pre' or 'white-space: pre-wrap'.",
  "spec":"http://www.w3.org/TR/css3-text/#tab-size1",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size",
      "title":"MDN article"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"y",
      "7":"y",
      "7.1":"y",
      "8":"y"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"y x",
      "11":"y x",
      "11.1":"y x",
      "11.5":"y x",
      "11.6":"y x",
      "12":"y x",
      "12.1":"y x",
      "15":"y",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"y",
      "8":"y",
      "8.1":"y"
    },
    "op_mini":{
      "5.0-8.0":"y x"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"y",
      "10":"y"
    },
    "op_mob":{
      "10":"n",
      "11":"y x",
      "11.1":"y x",
      "11.5":"y x",
      "12":"y x",
      "12.1":"y x",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":73.05,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"tab-size,tab-width",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],70:[function(require,module,exports){
module.exports={
  "title":"Flexible Box Layout Module",
  "description":"Method of positioning elements in horizontal or vertical stacks.",
  "spec":"http://www.w3.org/TR/css3-flexbox/",
  "status":"cr",
  "links":[
    {
      "url":"http://bennettfeely.com/flexplorer/",
      "title":"Flexbox CSS generator"
    },
    {
      "url":"http://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html",
      "title":"Article on using the latest spec"
    },
    {
      "url":"https://dev.opera.com/articles/view/advanced-cross-browser-flexbox/",
      "title":"Tutorial on cross-browser support"
    },
    {
      "url":"http://philipwalton.github.io/solved-by-flexbox/",
      "title":"Examples on how to solve common layout problems with flexbox"
    },
    {
      "url":"http://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      "title":"A Complete Guide to Flexbox"
    },
    {
      "url":"http://the-echoplex.net/flexyboxes/",
      "title":"Flexbox playground and code generator"
    }
  ],
  "bugs":[
    {
      "description":"IE10 and IE11 default values for `flex` are `0 0 auto` rather than `0 1 auto`, as per the draft spec, as of September 2013."
    },
    {
      "description":"In IE10 and IE11, containers with `display: flex` and `flex-direction: column` will not properly calculate their flexed childrens' sizes if the container has `min-height` but no explicit `height` property. [See bug](https://connect.microsoft.com/IE/feedback/details/802625/min-height-and-flexbox-flex-direction-column-dont-work-together-in-ie-10-11-preview)."
    },
    {
      "description":"In Chrome and Safari, the height of (non flex) children are not recognized in percentages. However Firefox and IE recognize and scale the children based on percentage heights. [Chrome bug](http://crbug.com/341310)"
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"a x #2",
      "11":"y"
    },
    "firefox":{
      "2":"a x #1",
      "3":"a x #1",
      "3.5":"a x #1",
      "3.6":"a x #1",
      "4":"a x #1",
      "5":"a x #1",
      "6":"a x #1",
      "7":"a x #1",
      "8":"a x #1",
      "9":"a x #1",
      "10":"a x #1",
      "11":"a x #1",
      "12":"a x #1",
      "13":"a x #1",
      "14":"a x #1",
      "15":"a x #1",
      "16":"a x #1",
      "17":"a x #1",
      "18":"a x #1",
      "19":"a x #1",
      "20":"a x #1",
      "21":"a x #1",
      "22":"a #3",
      "23":"a #3",
      "24":"a #3",
      "25":"a #3",
      "26":"a #3",
      "27":"a #3",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"a x #1",
      "5":"a x #1",
      "6":"a x #1",
      "7":"a x #1",
      "8":"a x #1",
      "9":"a x #1",
      "10":"a x #1",
      "11":"a x #1",
      "12":"a x #1",
      "13":"a x #1",
      "14":"a x #1",
      "15":"a x #1",
      "16":"a x #1",
      "17":"a x #1",
      "18":"a x #1",
      "19":"a x #1",
      "20":"a x #1",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"a x #1",
      "3.2":"a x #1",
      "4":"a x #1",
      "5":"a x #1",
      "5.1":"a x #1",
      "6":"a x #1",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"y",
      "15":"y x",
      "16":"y x",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"a x #1",
      "4.0-4.1":"a x #1",
      "4.2-4.3":"a x #1",
      "5.0-5.1":"a x #1",
      "6.0-6.1":"a x #1",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"a x #1",
      "2.2":"a x #1",
      "2.3":"a x #1",
      "3":"a x #1",
      "4":"a x #1",
      "4.1":"a x #1",
      "4.2-4.3":"a x #1",
      "4.4":"y",
      "4.4.3-4.4.4":"y",
      "37":"y"
    },
    "bb":{
      "7":"a x #1",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"a x #2",
      "11":"y"
    },
    "and_uc":{
      "9.9":"a x #1"
    }
  },
  "notes":"Most partial support refers to supporting an [older version](http://www.w3.org/TR/2009/WD-css3-flexbox-20090723/) of the specification or an [older syntax](http://www.w3.org/TR/2012/WD-css3-flexbox-20120322/).",
  "notes_by_num":{
    "1":"Only supports the [old flexbox](http://www.w3.org/TR/2009/WD-css3-flexbox-20090723) specification and does not support wrapping.",
    "2":"Only supports the [2012 syntax](http://www.w3.org/TR/2012/WD-css3-flexbox-20120322/)",
    "3":"Does not support flex-wrap or flex-flow properties"
  },
  "usage_perc_y":76.33,
  "usage_perc_a":12.12,
  "ucprefix":false,
  "parent":"",
  "keywords":"flex-box,flex-direction,flex-wrap,flex-flow,flex-grow,flex-basis",
  "ie_id":"flexbox",
  "chrome_id":"4837301406400512",
  "shown":true
}
},{}],71:[function(require,module,exports){
module.exports={
  "title":"Font feature settings",
  "description":"Method of applying advanced typographic and language-specific font features to supported OpenType fonts.",
  "spec":"http://w3.org/TR/css3-fonts/#font-rend-props",
  "status":"wd",
  "links":[
    {
      "url":"http://ie.microsoft.com/testdrive/Graphics/opentype/",
      "title":"Demo pages (IE/Firefox only)"
    },
    {
      "url":"http://hacks.mozilla.org/2010/11/firefox-4-font-feature-support/",
      "title":"Mozilla hacks article"
    },
    {
      "url":"http://html5accessibility.com/",
      "title":"Detailed tables on accessability support"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/font-feature-settings",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"a",
      "5":"a",
      "5.1":"a",
      "6":"a",
      "6.1":"n",
      "7":"n",
      "7.1":"n",
      "8":"n"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"a",
      "4.0-4.1":"a",
      "4.2-4.3":"a",
      "5.0-5.1":"a",
      "6.0-6.1":"a",
      "7.0-7.1":"n",
      "8":"n",
      "8.1":"n"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"n",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Partial support in older Firefox versions refers to using an older syntax. Partial support in older Chrome versions refers to lacking support in Mac OS X. ",
  "notes_by_num":{
    
  },
  "usage_perc_y":71.46,
  "usage_perc_a":1.64,
  "ucprefix":false,
  "parent":"",
  "keywords":"font-feature,font-feature-settings,kern,kerning,font-variant-alternates,ligatures,font-variant-ligatures",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],72:[function(require,module,exports){
module.exports={
  "title":"Full Screen API",
  "description":"API for allowing content (like a video or canvas element) to take up the entire screen.",
  "spec":"http://www.w3.org/TR/fullscreen/",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en/DOM/Using_full-screen_mode",
      "title":"MDN article"
    },
    {
      "url":"http://jlongster.com/2011/11/21/canvas.html",
      "title":"Blog post"
    },
    {
      "url":"http://hacks.mozilla.org/2012/01/using-the-fullscreen-api-in-web-browsers/",
      "title":"Mozilla hacks article"
    },
    {
      "url":"http://docs.webplatform.org/wiki/dom/Element/requestFullscreen",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Safari blocks access to keyboard events in fullscreen mode (as a security measure)."
    },
    {
      "description":"IE 11 does not allow scrolling when document.documentElement is set to full screen."
    },
    {
      "description":"IE 11 does not properly support fullscreen when opening from an iframe."
    },
    {
      "description":"IE 11 doesn't allow going to fullscreen mode when the event that triggers `msRequestFullscreen()` is a `keydown` event (`keypress` does work)"
    },
    {
      "description":"Opera 12.1 uses the older specificaton's `:fullscreen-ancestor` pseudo-class instead of the  the `::backdrop` pseudo-element."
    }
  ],
  "categories":[
    "JS API"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"y x"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"a x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"y",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"n",
      "8":"n",
      "8.1":"n"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"n",
      "10":"a"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"a x"
    },
    "ie_mob":{
      "10":"n",
      "11":"y x"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"Partial support refers to supporting an earlier draft of the spec.",
  "notes_by_num":{
    
  },
  "usage_perc_y":54.02,
  "usage_perc_a":13.03,
  "ucprefix":false,
  "parent":"",
  "keywords":"full-screen",
  "ie_id":"fullscreenapi",
  "chrome_id":"5259513871466496",
  "shown":true
}
},{}],73:[function(require,module,exports){
module.exports={
  "title":"Intrinsic & Extrinsic Sizing",
  "description":"Allows for the heights and widths to be specified in intrinsic values using the fill-available, max-content, min-content, and fit-content properties.",
  "spec":"http://www.w3.org/TR/css3-sizing/",
  "status":"wd",
  "links":[
    {
      "url":"http://demosthenes.info/blog/662/Design-From-the-Inside-Out-With-CSS-MinContent",
      "title":"Min-Content tutorial"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"n",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"Prefixes are on the values, not the property names (e.g. -webkit-min-content) Firefox currently supports the \"-moz-available\" property rather than \"-moz-fill-available\".",
  "notes_by_num":{
    
  },
  "usage_perc_y":69.7,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"fill-available,max-content,min-content,fit-content,contain-floats",
  "ie_id":"cssintrinsicsizing",
  "chrome_id":"5901353784180736",
  "shown":true
}
},{}],74:[function(require,module,exports){
module.exports={
  "title":"CSS3 Multiple column layout",
  "description":"Method of flowing information in multiple columns",
  "spec":"http://www.w3.org/TR/css3-multicol/",
  "status":"cr",
  "links":[
    {
      "url":"https://dev.opera.com/articles/view/css3-multi-column-layout/",
      "title":"Dev.Opera article"
    },
    {
      "url":"http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/an-introduction-to-the-css3-multiple-column-layout-module/",
      "title":"Introduction page"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/properties/column-width",
      "title":"WebPlatform Docs"
    },
    {
      "url":"https://github.com/BetleyWhitehorne/CSS3MultiColumn",
      "title":"Polyfill"
    }
  ],
  "bugs":[
    {
      "description":"In Firefox, the property `column-span` (or `-moz-column-span`) does not yet work. See [the bug](https://bugzilla.mozilla.org/show_bug.cgi?id=616436)."
    },
    {
      "description":"In Chrome, the `-webkit-column-count` directive does not yet work with print stylesheets. See the [following bug in Chromium](https://code.google.com/p/chromium/issues/detail?id=99358)."
    },
    {
      "description":"Chrome is reported to incorrectly calculate the container height, and often breaks on margins, padding, and can display 1px of the next column at the bottom of the previous column."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"a x",
      "3":"a x",
      "3.5":"a x",
      "3.6":"a x",
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x"
    },
    "chrome":{
      "4":"a x",
      "5":"a x",
      "6":"a x",
      "7":"a x",
      "8":"a x",
      "9":"a x",
      "10":"a x",
      "11":"a x",
      "12":"a x",
      "13":"a x",
      "14":"a x",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x",
      "28":"a x",
      "29":"a x",
      "30":"a x",
      "31":"a x",
      "32":"a x",
      "33":"a x",
      "34":"a x",
      "35":"a x",
      "36":"a x",
      "37":"a x",
      "38":"a x",
      "39":"a x",
      "40":"a x",
      "41":"a x",
      "42":"a x"
    },
    "safari":{
      "3.1":"a x",
      "3.2":"a x",
      "4":"a x",
      "5":"a x",
      "5.1":"a x",
      "6":"a x",
      "6.1":"a x",
      "7":"a x",
      "7.1":"a x",
      "8":"a x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"y",
      "11.5":"y",
      "11.6":"y",
      "12":"y",
      "12.1":"y",
      "15":"a x",
      "16":"a x",
      "17":"a x",
      "18":"a x",
      "19":"a x",
      "20":"a x",
      "21":"a x",
      "22":"a x",
      "23":"a x",
      "24":"a x",
      "25":"a x",
      "26":"a x",
      "27":"a x"
    },
    "ios_saf":{
      "3.2":"a x",
      "4.0-4.1":"a x",
      "4.2-4.3":"a x",
      "5.0-5.1":"a x",
      "6.0-6.1":"a x",
      "7.0-7.1":"a x",
      "8":"a x",
      "8.1":"a x"
    },
    "op_mini":{
      "5.0-8.0":"y"
    },
    "android":{
      "2.1":"a x",
      "2.2":"a x",
      "2.3":"a x",
      "3":"a x",
      "4":"a x",
      "4.1":"a x",
      "4.2-4.3":"a x",
      "4.4":"a x",
      "4.4.3-4.4.4":"a x",
      "37":"a x"
    },
    "bb":{
      "7":"a x",
      "10":"a x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"y",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"a x"
    },
    "and_chr":{
      "38":"a x"
    },
    "and_ff":{
      "32":"a x"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"a x"
    }
  },
  "notes":"Partial support refers to not supporting the `break-before`, `break-after`, `break-inside` properties. Webkit browsers do have equivalent support for the non-standard `-webkit-column-break-*` properties while Firefox supports `page-break-*` to accomplish the same result.",
  "notes_by_num":{
    
  },
  "usage_perc_y":12.95,
  "usage_perc_a":78.36,
  "ucprefix":false,
  "parent":"",
  "keywords":"column-count",
  "ie_id":"multicolumnfullsupport",
  "chrome_id":"6526151266664448",
  "shown":true
}
},{}],75:[function(require,module,exports){
module.exports={
  "title":"Pointer events",
  "description":"This specification integrates various inputs from mice, touchscreens, and pens, making separate implementations no longer necessary and authoring for cross-device pointers easier. Not to be mistaken with the unrelated \"pointer-events\" CSS property.",
  "spec":"http://www.w3.org/TR/pointerevents/",
  "status":"cr",
  "links":[
    {
      "url":"http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx",
      "title":"Implementation of Pointer Events in IE10"
    },
    {
      "url":"http://blogs.msdn.com/b/eternalcoding/archive/2013/01/16/hand-js-a-polyfill-for-supporting-pointer-events-on-every-browser.aspx",
      "title":"Hand.js, the polyfill for browsers only supporting Touch Events"
    },
    {
      "url":"http://blogs.msdn.com/b/davrous/archive/2013/02/20/handling-touch-in-your-html5-apps-thanks-to-the-pointer-events-of-ie10-and-windows-8.aspx",
      "title":"Article & tutorial"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "DOM",
    "JS API"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"a x",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"p",
      "7":"p",
      "8":"p",
      "9":"p",
      "10":"p",
      "11":"p",
      "12":"p",
      "13":"p",
      "14":"p",
      "15":"p",
      "16":"p",
      "17":"p",
      "18":"p",
      "19":"p",
      "20":"p",
      "21":"p",
      "22":"p",
      "23":"p",
      "24":"p",
      "25":"p",
      "26":"p",
      "27":"p",
      "28":"p",
      "29":"p",
      "30":"p",
      "31":"p",
      "32":"p",
      "33":"p",
      "34":"p",
      "35":"p",
      "36":"p"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"p",
      "23":"p",
      "24":"p",
      "25":"p",
      "26":"p",
      "27":"p",
      "28":"p",
      "29":"p",
      "30":"p",
      "31":"p",
      "32":"p",
      "33":"p",
      "34":"p",
      "35":"p",
      "36":"p",
      "37":"p",
      "38":"p",
      "39":"p",
      "40":"p",
      "41":"p",
      "42":"p"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"u",
      "7":"u",
      "7.1":"u",
      "8":"u"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"p",
      "16":"p",
      "17":"p",
      "18":"p",
      "19":"p",
      "20":"p",
      "21":"p",
      "22":"p",
      "23":"p",
      "24":"p",
      "25":"p",
      "26":"p",
      "27":"p"
    },
    "ios_saf":{
      "3.2":"p",
      "4.0-4.1":"p",
      "4.2-4.3":"p",
      "5.0-5.1":"p",
      "6.0-6.1":"p",
      "7.0-7.1":"p",
      "8":"p",
      "8.1":"p"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"p",
      "2.2":"p",
      "2.3":"p",
      "3":"p",
      "4":"p",
      "4.1":"p",
      "4.2-4.3":"p",
      "4.4":"p",
      "4.4.3-4.4.4":"p",
      "37":"p"
    },
    "bb":{
      "7":"p",
      "10":"p"
    },
    "op_mob":{
      "10":"n",
      "11":"p",
      "11.1":"p",
      "11.5":"p",
      "12":"p",
      "12.1":"p",
      "24":"p"
    },
    "and_chr":{
      "38":"p"
    },
    "and_ff":{
      "32":"p"
    },
    "ie_mob":{
      "10":"a x",
      "11":"y"
    },
    "and_uc":{
      "9.9":"p"
    }
  },
  "notes":"Partial support in IE10 refers the lack of pointerenter and pointerleave events. Firefox Nightly provides 'dom.w3c_pointer_events.enabled' option to support this specification starting with version 28.",
  "notes_by_num":{
    
  },
  "usage_perc_y":7.4,
  "usage_perc_a":2.48,
  "ucprefix":false,
  "parent":"",
  "keywords":"pointerdown,pointermove,pointerup,pointercancel,pointerover,pointerout,pointerenter,pointerleave",
  "ie_id":"pointerevents",
  "chrome_id":"4504699138998272",
  "shown":true
}
},{}],76:[function(require,module,exports){
module.exports={
  "title":"text-decoration styling",
  "description":"Method of defining the type, style and color of lines in the text-decoration property. These can be defined as shorthand (e.g. `text-decoration: line-through dashed blue`) or as single properties (e.g. `text-decoration-color: blue`)",
  "spec":"http://www.w3.org/TR/css-text-decor-3/#line-decoration",
  "status":"cr",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style",
      "title":"MDN Documentation for text-decoration-style"
    },
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-color",
      "title":"MDN Documentation for text-decoration-color"
    },
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line",
      "title":"MDN Documentation for text-decoration-line"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n x d #1",
      "27":"n x d #1",
      "28":"n x d #1",
      "29":"n x d #1",
      "30":"n x d #1",
      "31":"n x d #1",
      "32":"n x d #1",
      "33":"n x d #1",
      "34":"n x d #1",
      "35":"n x d #1",
      "36":"n x d #1",
      "37":"n x d #1",
      "38":"n x d #1",
      "39":"n x d #1",
      "40":"n x d #1",
      "41":"n x d #1",
      "42":"n x d #1"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"n",
      "7":"n",
      "7.1":"a x #2",
      "8":"a x #2"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"n",
      "6.0-6.1":"n",
      "7.0-7.1":"n",
      "8":"a x #2",
      "8.1":"a x #2"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"n",
      "10":"n"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"n"
    },
    "and_chr":{
      "38":"n"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"n",
      "11":"n"
    },
    "and_uc":{
      "9.9":"n"
    }
  },
  "notes":"All browsers support the CSS2 version of `text-decoration`, which matches only the `text-decoration-line` values (`underline`, etc.)",
  "notes_by_num":{
    "1":"Enabled in Chrome through the \"experimental Web Platform features\" flag in chrome://flags",
    "2":"Partial support in Safari refers to not supporting the text-decoration-style property."
  },
  "usage_perc_y":12.5,
  "usage_perc_a":5.38,
  "ucprefix":false,
  "parent":"",
  "keywords":"text-decoration-line,text-decoration-style,text-decoration-color",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],77:[function(require,module,exports){
module.exports={
  "title":"CSS text-size-adjust",
  "description":"On mobile devices, the text-size-adjust CSS property allows Web authors to control if and how the text-inflating algorithm is applied to the textual content of the element it is applied to.",
  "spec":"http://dev.w3.org/csswg/css-size-adjust/",
  "status":"wd",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust",
      "title":"MDN Docs"
    }
  ],
  "bugs":[
    {
      "description":"There is a bug in Webkit-based desktop browsers. If -webkit-text-size-adjust is explicitely set to none, Webkit-based desktop browsers, like Chrome or Safari, instead of ignoring the property, will prevent the user to zoom in or out the Web page."
    },
    {
      "description":"If the viewport in IE Phone is set using <meta> element, the value of the CSS text-size-adjust property is ignored."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n",
      "28":"n",
      "29":"n",
      "30":"n",
      "31":"n",
      "32":"n",
      "33":"n",
      "34":"n",
      "35":"n",
      "36":"n"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"n",
      "13":"n",
      "14":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n",
      "28":"n",
      "29":"n",
      "30":"n",
      "31":"n",
      "32":"n",
      "33":"n",
      "34":"n",
      "35":"n",
      "36":"n",
      "37":"n",
      "38":"n",
      "39":"n",
      "40":"n",
      "41":"n",
      "42":"n"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"n",
      "5":"n",
      "5.1":"n",
      "6":"n",
      "6.1":"n",
      "7":"n",
      "7.1":"n",
      "8":"n"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"n",
      "16":"n",
      "17":"n",
      "18":"n",
      "19":"n",
      "20":"n",
      "21":"n",
      "22":"n",
      "23":"n",
      "24":"n",
      "25":"n",
      "26":"n",
      "27":"n"
    },
    "ios_saf":{
      "3.2":"n",
      "4.0-4.1":"n",
      "4.2-4.3":"n",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"n",
      "4":"n",
      "4.1":"n",
      "4.2-4.3":"n",
      "4.4":"n",
      "4.4.3-4.4.4":"n",
      "37":"n"
    },
    "bb":{
      "7":"n",
      "10":"n"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"n"
    },
    "and_chr":{
      "38":"n"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"y x",
      "11":"y x"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"",
  "notes_by_num":{
    
  },
  "usage_perc_y":11.71,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],78:[function(require,module,exports){
module.exports={
  "title":"CSS3 Transforms",
  "description":"Method of transforming an element including rotating, scaling, etc.",
  "spec":"http://www.w3.org/TR/css3-2d-transforms/",
  "status":"wd",
  "links":[
    {
      "url":"http://www.westciv.com/tools/transforms/",
      "title":"Live editor"
    },
    {
      "url":"https://developer.mozilla.org/en/CSS/-moz-transform",
      "title":"MDN article"
    },
    {
      "url":"http://www.webresourcesdepot.com/cross-browser-css-transforms-csssandpaper/",
      "title":"Workaround script for IE"
    },
    {
      "url":"http://www.css3files.com/transform/",
      "title":"Information page"
    },
    {
      "url":"http://www.useragentman.com/IETransformsTranslator/",
      "title":"Converter for IE"
    },
    {
      "url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform",
      "title":"has.js test"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/transforms/transform",
      "title":"WebPlatform Docs"
    }
  ],
  "bugs":[
    {
      "description":"Scaling transforms in Android 2.3 fails to scale element background images."
    },
    {
      "description":"Firefox and IE don't support CSS transforms on SVG elements (though SVG transform attributes do work)."
    },
    {
      "description":"Transforms may break position:fixed styles of contained elements"
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"p",
      "7":"p",
      "8":"p",
      "9":"y x",
      "10":"y",
      "11":"y"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"y x",
      "3.2":"y x",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"y x",
      "10.6":"y x",
      "11":"y x",
      "11.1":"y x",
      "11.5":"y x",
      "11.6":"y x",
      "12":"y x",
      "12.1":"y",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"y x",
      "2.2":"y x",
      "2.3":"y x",
      "3":"y x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"y",
      "11.1":"y",
      "11.5":"y",
      "12":"y",
      "12.1":"y",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"y",
      "11":"y"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"The scale transform can be emulated in IE < 9 using Microsoft's \"zoom\" extension, others are (not easily) possible using the MS Matrix filter",
  "notes_by_num":{
    
  },
  "usage_perc_y":90.59,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"transformation,translate,rotation,rotate,scale,css-transforms",
  "ie_id":"transforms",
  "chrome_id":"6437640580628480",
  "shown":true
}
},{}],79:[function(require,module,exports){
module.exports={
  "title":"CSS3 3D Transforms",
  "description":"Method of transforming an element in the third dimension using the `transform` property. Includes support for the `perspective` property to set the perspective in z-space and the `backface-visibility` property to toggle display of the reverse side of a 3D-transformed element.",
  "spec":"http://www.w3.org/TR/css3-3d-transforms/",
  "status":"wd",
  "links":[
    {
      "url":"http://css3.bradshawenterprises.com/flip/",
      "title":"Multi-browser demo"
    },
    {
      "url":"http://hacks.mozilla.org/2011/10/css-3d-transformations-in-firefox-nightly/",
      "title":"Mozilla hacks article"
    },
    {
      "url":"http://thewebrocks.com/demos/3D-css-tester/",
      "title":"3D CSS Tester"
    },
    {
      "url":"https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform",
      "title":"has.js test"
    },
    {
      "url":"http://docs.webplatform.org/wiki/css/transforms/transform",
      "title":"WebPlatform Docs"
    },
    {
      "url":"http://desandro.github.io/3dtransforms/",
      "title":"Intro to CSS 3D transforms"
    }
  ],
  "bugs":[
    {
      "description":"Some configurations of Linux and older Windows machines (those without WebGL support) have trouble with 3D transforms and will treat them as if `perspective` was set as `none`."
    },
    {
      "description":"Firefox on Windows [incorrectly renders plugin content within no-op 3D transforms](https://bugzilla.mozilla.org/show_bug.cgi?id=1048279)."
    }
  ],
  "categories":[
    "CSS3"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"a",
      "11":"a"
    },
    "firefox":{
      "2":"n",
      "3":"n",
      "3.5":"n",
      "3.6":"n",
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y",
      "17":"y",
      "18":"y",
      "19":"y",
      "20":"y",
      "21":"y",
      "22":"y",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y",
      "28":"y",
      "29":"y",
      "30":"y",
      "31":"y",
      "32":"y",
      "33":"y",
      "34":"y",
      "35":"y",
      "36":"y"
    },
    "chrome":{
      "4":"n",
      "5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"n",
      "11":"n",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y",
      "37":"y",
      "38":"y",
      "39":"y",
      "40":"y",
      "41":"y",
      "42":"y"
    },
    "safari":{
      "3.1":"n",
      "3.2":"n",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y",
      "24":"y",
      "25":"y",
      "26":"y",
      "27":"y"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"n",
      "2.2":"n",
      "2.3":"n",
      "3":"y x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y"
    },
    "and_chr":{
      "38":"y"
    },
    "and_ff":{
      "32":"y"
    },
    "ie_mob":{
      "10":"a",
      "11":"a"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Partial support in IE refers to not supporting [the transform-style: preserve-3d property](http://msdn.microsoft.com/en-us/library/ie/hh673529%28v=vs.85%29.aspx#the_ms_transform_style_property). This prevents nesting 3D transformed elements.",
  "notes_by_num":{
    
  },
  "usage_perc_y":77.64,
  "usage_perc_a":9.87,
  "ucprefix":false,
  "parent":"",
  "keywords":"css 3d,3dtransforms,translate3d,backface visibility,perspective",
  "ie_id":"transforms,csstransformspreserve3d",
  "chrome_id":"6437640580628480",
  "shown":true
}
},{}],80:[function(require,module,exports){
module.exports={
  "title":"CSS user-select: none",
  "description":"Method of preventing text/element selection using CSS. ",
  "spec":"https://developer.mozilla.org/en-US/docs/CSS/user-select",
  "status":"unoff",
  "links":[
    {
      "url":"https://developer.mozilla.org/en-US/docs/CSS/user-select",
      "title":"MDN article"
    },
    {
      "url":"http://css-tricks.com/almanac/properties/u/user-select/",
      "title":"CSS Tricks article"
    },
    {
      "url":"http://msdn.microsoft.com/en-us/library/ie/hh781492(v=vs.85).aspx",
      "title":"MSDN Documentation"
    }
  ],
  "bugs":[
    
  ],
  "categories":[
    "CSS"
  ],
  "stats":{
    "ie":{
      "5.5":"n",
      "6":"n",
      "7":"n",
      "8":"n",
      "9":"n",
      "10":"y x",
      "11":"y x"
    },
    "firefox":{
      "2":"y x",
      "3":"y x",
      "3.5":"y x",
      "3.6":"y x",
      "4":"y x",
      "5":"y x",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x"
    },
    "chrome":{
      "4":"u",
      "5":"u",
      "6":"y x",
      "7":"y x",
      "8":"y x",
      "9":"y x",
      "10":"y x",
      "11":"y x",
      "12":"y x",
      "13":"y x",
      "14":"y x",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x",
      "28":"y x",
      "29":"y x",
      "30":"y x",
      "31":"y x",
      "32":"y x",
      "33":"y x",
      "34":"y x",
      "35":"y x",
      "36":"y x",
      "37":"y x",
      "38":"y x",
      "39":"y x",
      "40":"y x",
      "41":"y x",
      "42":"y x"
    },
    "safari":{
      "3.1":"y x",
      "3.2":"y x",
      "4":"y x",
      "5":"y x",
      "5.1":"y x",
      "6":"y x",
      "6.1":"y x",
      "7":"y x",
      "7.1":"y x",
      "8":"y x"
    },
    "opera":{
      "9":"n",
      "9.5-9.6":"n",
      "10.0-10.1":"n",
      "10.5":"n",
      "10.6":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "11.6":"n",
      "12":"n",
      "12.1":"n",
      "15":"y x",
      "16":"y x",
      "17":"y x",
      "18":"y x",
      "19":"y x",
      "20":"y x",
      "21":"y x",
      "22":"y x",
      "23":"y x",
      "24":"y x",
      "25":"y x",
      "26":"y x",
      "27":"y x"
    },
    "ios_saf":{
      "3.2":"y x",
      "4.0-4.1":"y x",
      "4.2-4.3":"y x",
      "5.0-5.1":"y x",
      "6.0-6.1":"y x",
      "7.0-7.1":"y x",
      "8":"y x",
      "8.1":"y x"
    },
    "op_mini":{
      "5.0-8.0":"n"
    },
    "android":{
      "2.1":"y x",
      "2.2":"y x",
      "2.3":"y x",
      "3":"y x",
      "4":"y x",
      "4.1":"y x",
      "4.2-4.3":"y x",
      "4.4":"y x",
      "4.4.3-4.4.4":"y x",
      "37":"y x"
    },
    "bb":{
      "7":"y x",
      "10":"y x"
    },
    "op_mob":{
      "10":"n",
      "11":"n",
      "11.1":"n",
      "11.5":"n",
      "12":"n",
      "12.1":"n",
      "24":"y x"
    },
    "and_chr":{
      "38":"y x"
    },
    "and_ff":{
      "32":"y x"
    },
    "ie_mob":{
      "10":"y x",
      "11":"y x"
    },
    "and_uc":{
      "9.9":"y x"
    }
  },
  "notes":"Currently the user-select property does not appear in any W3C specification. Support information here is only for \"none\" value, not others.",
  "notes_by_num":{
    
  },
  "usage_perc_y":88.21,
  "usage_perc_a":0,
  "ucprefix":false,
  "parent":"",
  "keywords":"",
  "ie_id":"",
  "chrome_id":"",
  "shown":true
}
},{}],81:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Container = require("./container");

var AtRule = (function (Container) {
  var AtRule = function AtRule(defaults) {
    this.type = "atrule";
    Container.call(this, defaults);
  };

  _extends(AtRule, Container);

  _classProps(AtRule, null, {
    stringify: {
      writable: true,


      // Stringify at-rule
      value: function (builder, semicolon) {
        var name = "@" + this.name;
        var params = this.params ? this.stringifyRaw("params") : "";

        if (typeof (this.afterName) != "undefined") {
          name += this.afterName;
        } else if (params) {
          name += " ";
        }

        if (this.childs) {
          this.stringifyBlock(builder, name + params);
        } else {
          var before = this.style("beforeRule");
          if (before) builder(before);
          var end = (this.between || "") + (semicolon ? ";" : "");
          builder(name + params + end, this);
        }
      }
    },
    append: {
      writable: true,


      // Hack to mark, that at-rule contains childs
      value: function (child) {
        if (!this.childs) this.childs = [];
        return Container.prototype.append.call(this, child);
      }
    },
    prepend: {
      writable: true,


      // Hack to mark, that at-rule contains childs
      value: function (child) {
        if (!this.childs) this.childs = [];
        return Container.prototype.prepend.call(this, child);
      }
    },
    insertBefore: {
      writable: true,


      // Hack to mark, that at-rule contains childs
      value: function (exist, add) {
        if (!this.childs) this.childs = [];
        return Container.prototype.insertBefore.call(this, exist, add);
      }
    },
    insertAfter: {
      writable: true,


      // Hack to mark, that at-rule contains childs
      value: function (exist, add) {
        if (!this.childs) this.childs = [];
        return Container.prototype.insertAfter.call(this, exist, add);
      }
    }
  });

  return AtRule;
})(Container);

module.exports = AtRule;
},{"./container":83}],82:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Node = require("./node");

var Comment = (function (Node) {
  var Comment = function Comment(defaults) {
    this.type = "comment";
    Node.call(this, defaults);
  };

  _extends(Comment, Node);

  _classProps(Comment, null, {
    styleMap: {
      writable: true,
      value: function () {
        return {
          commentLeft: this.left,
          commentRight: this.right
        };
      }
    },
    stringify: {
      writable: true,


      // Stringify declaration
      value: function (builder) {
        if (this.before) builder(this.before);
        var left = this.style("commentLeft");
        var right = this.style("commentRight");
        builder("/*" + left + this.text + right + "*/", this);
      }
    }
  });

  return Comment;
})(Node);

module.exports = Comment;
},{"./node":89}],83:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Node = require("./node");
var Declaration = require("./declaration");

var Container = (function (Node) {
  var Container = function Container() {
    Node.apply(this, arguments);
  };

  _extends(Container, Node);

  _classProps(Container, null, {
    styleMap: {
      writable: true,
      value: function () {
        var style = {
          beforeRule: this.before,
          beforeOpen: this.between
        };
        if (this.childs && this.childs.length) {
          style.beforeClose = this.after;
        } else {
          style.emptyBody = this.after;
        }
        return style;
      }
    },
    stringifyContent: {
      writable: true,


      // Stringify container childs
      value: function (builder) {
        if (!this.childs) return;

        var i, last = this.childs.length - 1;
        while (last > 0) {
          if (this.childs[last].type != "comment") break;
          last -= 1;
        }

        for (i = 0; i < this.childs.length; i++) {
          this.childs[i].stringify(builder, last != i || this.semicolon);
        }
      }
    },
    stringifyBlock: {
      writable: true,


      // Stringify node with start (for example, selector) and brackets block
      // with child inside
      value: function (builder, start) {
        var before = this.style("beforeRule");
        if (before) builder(before);
        builder(start + this.style("beforeOpen") + "{", this, "start");

        var after;
        if (this.childs && this.childs.length) {
          this.stringifyContent(builder);
          after = this.style("beforeClose");
        } else {
          after = this.style("emptyBody");
        }

        if (after) builder(after);
        builder("}", this, "end");
      }
    },
    push: {
      writable: true,


      // Add child to end of list without any checks.
      // Please, use `append()` method, `push()` is mostly for parser.
      value: function (child) {
        child.parent = this;
        this.childs.push(child);
        return this;
      }
    },
    each: {
      writable: true,


      // Execute `callback` on every child element. First arguments will be child
      // node, second will be index.
      //
      //   css.each( (rule, i) => {
      //       console.log(rule.type + ' at ' + i);
      //   });
      //
      // It is safe for add and remove elements to list while iterating:
      //
      //  css.each( (rule) => {
      //      css.insertBefore( rule, addPrefix(rule) );
      //      # On next iteration will be next rule, regardless of that
      //      # list size was increased
      //  });
      value: function (callback) {
        if (!this.lastEach) this.lastEach = 0;
        if (!this.indexes) this.indexes = {};

        this.lastEach += 1;
        var id = this.lastEach;
        this.indexes[id] = 0;

        if (!this.childs) return;

        var index, result;
        while (this.indexes[id] < this.childs.length) {
          index = this.indexes[id];
          result = callback(this.childs[index], index);
          if (result === false) break;

          this.indexes[id] += 1;
        }

        delete this.indexes[id];

        if (result === false) return false;
      }
    },
    eachInside: {
      writable: true,


      // Execute callback on every child in all rules inside.
      //
      // First argument will be child node, second will be index inside parent.
      //
      //   css.eachInside( (node, i) => {
      //       console.log(node.type + ' at ' + i);
      //   });
      //
      // Also as `each` it is safe of insert/remove nodes inside iterating.
      value: function (callback) {
        return this.each(function (child, i) {
          var result = callback(child, i);

          if (result !== false && child.eachInside) {
            result = child.eachInside(callback);
          }

          if (result === false) return result;
        });
      }
    },
    eachDecl: {
      writable: true,


      // Execute callback on every declaration in all rules inside.
      // It will goes inside at-rules recursivelly.
      //
      // First argument will be declaration node, second will be index inside
      // parent rule.
      //
      //   css.eachDecl( (decl, i) => {
      //       console.log(decl.prop + ' in ' + decl.parent.selector + ':' + i);
      //   });
      //
      // Also as `each` it is safe of insert/remove nodes inside iterating.
      value: function (callback) {
        return this.eachInside(function (child, i) {
          if (child.type == "decl") {
            var result = callback(child, i);
            if (result === false) return result;
          }
        });
      }
    },
    eachRule: {
      writable: true,


      // Execute `callback` on every rule in conatiner and inside child at-rules.
      //
      // First argument will be rule node, second will be index inside parent.
      //
      //   css.eachRule( (rule, i) => {
      //       if ( parent.type == 'atrule' ) {
      //           console.log(rule.selector + ' in ' + rule.parent.name);
      //       } else {
      //           console.log(rule.selector + ' at ' + i);
      //       }
      //   });
      value: function (callback) {
        return this.eachInside(function (child, i) {
          if (child.type == "rule") {
            var result = callback(child, i);
            if (result === false) return result;
          }
        });
      }
    },
    eachAtRule: {
      writable: true,


      // Execute `callback` on every at-rule in conatiner and inside at-rules.
      //
      // First argument will be at-rule node, second will be index inside parent.
      //
      //   css.eachAtRule( (atrule, parent, i) => {
      //       if ( parent.type == 'atrule' ) {
      //           console.log(atrule.name + ' in ' + atrule.parent.name);
      //       } else {
      //           console.log(atrule.name + ' at ' + i);
      //       }
      //   });
      value: function (callback) {
        return this.eachInside(function (child, i) {
          if (child.type == "atrule") {
            var result = callback(child, i);
            if (result === false) return result;
          }
        });
      }
    },
    eachComment: {
      writable: true,


      // Execute callback on every block comment (only between rules
      // and declarations, not inside selectors and values) in all rules inside.
      //
      // First argument will be comment node, second will be index inside
      // parent rule.
      //
      //   css.eachComment( (comment, i) => {
      //       console.log(comment.content + ' at ' + i);
      //   });
      //
      // Also as `each` it is safe of insert/remove nodes inside iterating.
      value: function (callback) {
        return this.eachInside(function (child, i) {
          if (child.type == "comment") {
            var result = callback(child, i);
            if (result === false) return result;
          }
        });
      }
    },
    append: {
      writable: true,


      // Add child to container.
      //
      //   css.append(rule);
      //
      // You can add declaration by hash:
      //
      //   rule.append({ prop: 'color', value: 'black' });
      value: function (child) {
        var childs = this.normalize(child, this.last);
        for (var i = 0; i < childs.length; i++) {
          this.childs.push(childs[i]);
        }
        return this;
      }
    },
    prepend: {
      writable: true,


      // Add child to beginning of container
      //
      //   css.prepend(rule);
      //
      // You can add declaration by hash:
      //
      //   rule.prepend({ prop: 'color', value: 'black' });
      value: function (child) {
        var childs = this.normalize(child, this.first, "prepend").reverse();
        for (var i = 0; i < childs.length; i++) {
          this.childs.unshift(childs[i]);
        }

        for (var id in this.indexes) {
          this.indexes[id] = this.indexes[id] + childs.length;
        }

        return this;
      }
    },
    insertBefore: {
      writable: true,


      // Insert new `added` child before `exist`.
      // You can set node object or node index (it will be faster) in `exist`.
      //
      //   css.insertAfter(1, rule);
      //
      // You can add declaration by hash:
      //
      //   rule.insertBefore(1, { prop: 'color', value: 'black' });
      value: function (exist, add) {
        exist = this.index(exist);

        var type = exist === 0 ? "prepend" : false;
        var childs = this.normalize(add, this.childs[exist], type).reverse();
        for (var i = 0; i < childs.length; i++) {
          this.childs.splice(exist, 0, childs[i]);
        }

        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (exist <= index) {
            this.indexes[id] = index + childs.length;
          }
        }

        return this;
      }
    },
    insertAfter: {
      writable: true,


      // Insert new `added` child after `exist`.
      // You can set node object or node index (it will be faster) in `exist`.
      //
      //   css.insertAfter(1, rule);
      //
      // You can add declaration by hash:
      //
      //   rule.insertAfter(1, { prop: 'color', value: 'black' });
      value: function (exist, add) {
        exist = this.index(exist);

        var childs = this.normalize(add, this.childs[exist]).reverse();
        for (var i = 0; i < childs.length; i++) {
          this.childs.splice(exist + 1, 0, childs[i]);
        }

        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (exist < index) {
            this.indexes[id] = index + childs.length;
          }
        }

        return this;
      }
    },
    remove: {
      writable: true,


      // Remove `child` by index or node.
      //
      //   css.remove(2);
      value: function (child) {
        child = this.index(child);
        this.childs.splice(child, 1);

        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (index >= child) {
            this.indexes[id] = index - 1;
          }
        }

        return this;
      }
    },
    every: {
      writable: true,


      // Return true if all childs return true in `condition`.
      // Just shorcut for `childs.every`.
      value: function (condition) {
        return this.childs.every(condition);
      }
    },
    some: {
      writable: true,


      // Return true if one or more childs return true in `condition`.
      // Just shorcut for `childs.some`.
      value: function (condition) {
        return this.childs.some(condition);
      }
    },
    index: {
      writable: true,


      // Return index of child
      value: function (child) {
        if (typeof (child) == "number") {
          return child;
        } else {
          return this.childs.indexOf(child);
        }
      }
    },
    first: {
      // Shortcut to get first child
      get: function () {
        if (!this.childs) return undefined;
        return this.childs[0];
      }
    },
    last: {
      // Shortcut to get first child
      get: function () {
        if (!this.childs) return undefined;
        return this.childs[this.childs.length - 1];
      }
    },
    normalize: {
      writable: true,


      // Normalize child before insert. Copy before from `sample`.
      value: function (child, sample) {
        if (!child.type && !Array.isArray(child)) {
          child = new Declaration(child);
        }

        var childs;
        if (child.type == "root") {
          childs = child.childs;
        } else if (Array.isArray(child)) {
          childs = child.map(function (i) {
            return i.clone();
          });
        } else {
          if (child.parent) {
            child = child.clone();
          }
          childs = [child];
        }

        for (var i = 0; i < childs.length; i++) {
          child = childs[i];
          child.parent = this;
          if (typeof (child.before) == "undefined" && sample) {
            child.before = sample.before;
          }
        }

        return childs;
      }
    }
  });

  return Container;
})(Node);

["rules", "decls", "list"].forEach(function (name) {
  Object.defineProperty(Container.prototype, name, {
    get: function () {
      if (console && console.warn) {
        console.warn("Property " + name + " has been deprecated and " + "will be removed in 3.1. Use childs instead.");
      }
      return this.childs;
    }
  });
});

module.exports = Container;
},{"./declaration":85,"./node":89}],84:[function(require,module,exports){
(function (process){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var PreviousMap = require("./previous-map");

var path = require("path");

var CssSyntaxError = (function (Error) {
  var CssSyntaxError = function CssSyntaxError(input, message, line, column) {
    this.reason = message;

    var origin = input.origin(line, column);

    if (origin) {
      for (var name in origin) {
        this[name] = origin[name];
      }

      this.generated = {
        line: line,
        column: column,
        source: input.css
      };
      if (input.file) this.generated.file = input.file;
    } else {
      if (input.file) this.file = input.file;
      this.line = line;
      this.column = column;
      this.source = input.css;
    }

    this.message = this.file ? this.file : "<css input>";
    this.message += ":" + line + ":" + column + ": " + message;
  };

  _extends(CssSyntaxError, Error);

  _classProps(CssSyntaxError, null, {
    highlight: {
      writable: true,


      // Return source of broken lines
      value: function (color) {
        var num = this.line - 1;
        var lines = this.source.split("\n");

        var prev = num > 0 ? lines[num - 1] + "\n" : "";
        var broken = lines[num];
        var next = num < lines.length - 1 ? "\n" + lines[num + 1] : "";

        var mark = "\n";
        for (var i = 0; i < this.column - 1; i++) {
          mark += " ";
        }

        if (typeof (color) == "undefined" && typeof (process) != "undefined") {
          if (process.stdout && process.env) {
            color = process.stdout.isTTY && !process.env.NODE_DISABLE_COLORS;
          }
        }

        if (color) {
          mark += "\u001b[1;31m^\u001b[0m";
        } else {
          mark += "^";
        }

        return prev + broken + mark + next;
      }
    },
    toString: {
      writable: true,
      value: function () {
        var text = this.message;
        if (this.source) text += "\n" + this.highlight();
        return text;
      }
    }
  });

  return CssSyntaxError;
})(Error);

module.exports = CssSyntaxError;
}).call(this,require('_process'))
},{"./previous-map":93,"_process":50,"path":49}],85:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Node = require("./node");
var vendor = require("./vendor");

var Declaration = (function (Node) {
  var Declaration = function Declaration(defaults) {
    this.type = "decl";
    Node.call(this, defaults);
  };

  _extends(Declaration, Node);

  _classProps(Declaration, null, {
    styleMap: {
      writable: true,
      value: function () {
        return {
          beforeDecl: this.before,
          colon: this.between
        };
      }
    },
    stringify: {
      writable: true,


      // Stringify declaration
      value: function (builder, semicolon) {
        var before = this.style("beforeDecl");
        if (before) builder(before);

        var between = this.style("colon");
        var string = this.prop + between + this.stringifyRaw("value");

        if (this.important) {
          string += this._important || " !important";
        }

        if (semicolon) string += ";";
        builder(string, this);
      }
    },
    clone: {
      writable: true,


      // Clean `before` and `between` property in clone to copy it from new
      // parent rule
      value: function (overrides) {
        if (overrides === undefined) overrides = {};
        var cloned = Node.prototype.clone.call(this, overrides);
        delete cloned.before;
        delete cloned.between;
        return cloned;
      }
    }
  });

  return Declaration;
})(Node);

module.exports = Declaration;
},{"./node":89,"./vendor":98}],86:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var CssSyntaxError = require("./css-syntax-error");
var PreviousMap = require("./previous-map");
var Parser = require("./parser");

var path = require("path");

var sequence = 0;

var Input = (function () {
  var Input = function Input(css, opts) {
    if (opts === undefined) opts = {};
    this.css = css.toString();
    this.opts = opts;

    if (this.css[0] == "\ufeff" || this.css[0] == "\ufffe") {
      this.css = this.css.slice(1);
    }

    sequence += 1;
    this.id = "<input css " + sequence + ">";

    this.safe = !!this.opts.safe;

    if (this.opts.map == "inline") {
      this.opts.map = { inline: true };
      console.warn("Shortcut map: \"inline\" is deprecated " + "and will be remove in 3.1");
    }
    if (this.opts.from) {
      this.file = path.resolve(this.opts.from);
    }

    var map = new PreviousMap(this.css, this.opts, this.id);
    if (map.text) {
      this.map = map;
      var file = map.consumer().file;
      if (!this.file && file) this.file = this.mapResolve(file);
    }

    this.from = this.file ? this.file : this.id;
    if (this.map) this.map.file = this.from;
  };

  _classProps(Input, null, {
    error: {
      writable: true,


      // Throw syntax error from this input
      value: function (message, line, column) {
        throw new CssSyntaxError(this, message, line, column);
      }
    },
    origin: {
      writable: true,


      // Get origin position of code if source map was given
      value: function (line, column) {
        if (!this.map) return false;
        var consumer = this.map.consumer();

        var from = consumer.originalPositionFor({ line: line, column: column });
        if (!from.source) return false;

        var result = {
          file: this.mapResolve(from.source),
          line: from.line,
          column: from.column
        };

        var source = consumer.sourceContentFor(result.file);
        if (source) result.source = source;

        return result;
      }
    },
    mapResolve: {
      writable: true,


      // Return path relative from source map root
      value: function (file) {
        return path.resolve(this.map.consumer().sourceRoot || ".", file);
      }
    }
  });

  return Input;
})();

module.exports = Input;
},{"./css-syntax-error":84,"./parser":91,"./previous-map":93,"path":49}],87:[function(require,module,exports){
"use strict";

// Methods to parse list and split it to array
var list = {
  // Split string to array by separator symbols with function and inside strings
  // cheching
  split: function (string, separators, last) {
    var array = [];
    var current = "";
    var split = false;

    var func = 0;
    var quote = false;
    var escape = false;

    for (var i = 0; i < string.length; i++) {
      var letter = string[i];

      if (quote) {
        if (escape) {
          escape = false;
        } else if (letter == "\\") {
          escape = true;
        } else if (letter == quote) {
          quote = false;
        }
      } else if (letter == "\"" || letter == "'") {
        quote = letter;
      } else if (letter == "(") {
        func += 1;
      } else if (letter == ")") {
        if (func > 0) func -= 1;
      } else if (func === 0) {
        for (var j = 0; j < separators.length; j++) {
          if (letter == separators[j]) split = true;
        }
      }

      if (split) {
        if (current !== "") array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }

    if (last || current !== "") array.push(current.trim());
    return array;
  },

  // Split list devided by space:
  //
  //   list.space('a b') #=> ['a', 'b']
  //
  // It check for fuction and strings:
  //
  //   list.space('calc(1px + 1em) "b c"') #=> ['calc(1px + 1em)', '"b c"']
  space: function (string) {
    return this.split(string, [" ", "\n", "\t"]);
  },

  // Split list devided by comma
  //
  //   list.comma('a, b') #=> ['a', 'b']
  //
  // It check for fuction and strings:
  //
  //   list.comma('rgba(0, 0, 0, 0) white') #=> ['rgba(0, 0, 0, 0)', '"white"']
  comma: function (string) {
    return this.split(string, [","], true);
  }

};

module.exports = list;
},{}],88:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Result = require("./result");

var mozilla = require("source-map");
var Base64 = require("js-base64").Base64;
var path = require("path");

var MapGenerator = (function () {
  var MapGenerator = function MapGenerator(root, opts) {
    this.root = root;
    this.opts = opts;
    this.mapOpts = opts.map || {};
  };

  _classProps(MapGenerator, null, {
    isMap: {
      writable: true,


      // Should map be generated
      value: function () {
        if (typeof (this.opts.map) != "undefined") {
          return !!this.opts.map;
        } else {
          return this.previous().length > 0;
        }
      }
    },
    previous: {
      writable: true,


      // Return source map arrays from previous compilation step (like Sass)
      value: function () {
        var _this = this;
        if (!this.previousMaps) {
          this.previousMaps = [];
          this.root.eachInside(function (node) {
            if (node.source && node.source.map) {
              if (_this.previousMaps.indexOf(node.source.map) == -1) {
                _this.previousMaps.push(node.source.map);
              }
            }
          });
        }

        return this.previousMaps;
      }
    },
    isInline: {
      writable: true,


      // Should we inline source map to annotation comment
      value: function () {
        if (typeof (this.mapOpts.inline) != "undefined") {
          return this.mapOpts.inline;
        }

        var annotation = this.mapOpts.annotation;
        if (typeof (annotation) != "undefined" && annotation !== true) {
          return false;
        }

        if (this.previous().length) {
          return this.previous().some(function (i) {
            return i.inline;
          });
        } else {
          return true;
        }
      }
    },
    isSourcesContent: {
      writable: true,


      // Should we set sourcesContent
      value: function () {
        if (typeof (this.mapOpts.sourcesContent) != "undefined") {
          return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
          return this.previous().some(function (i) {
            return i.withContent();
          });
        } else {
          return true;
        }
      }
    },
    clearAnnotation: {
      writable: true,


      // Clear source map annotation comment
      value: function () {
        if (this.mapOpts.annotation === false) return;

        var node;
        for (var i = this.root.childs.length - 1; i >= 0; i--) {
          node = this.root.childs[i];
          if (node.type != "comment") continue;
          if (node.text.match(/^# sourceMappingURL=/)) {
            this.root.remove(i);
            return;
          }
        }
      }
    },
    setSourcesContent: {
      writable: true,


      // Set origin CSS content
      value: function () {
        var _this2 = this;
        var already = {};
        this.root.eachInside(function (node) {
          if (node.source) {
            var file = node.source.file || node.source.id;
            if (file && !already[file]) {
              already[file] = true;
              var relative = _this2.relative(file);
              _this2.map.setSourceContent(relative, node.source.content);
            }
          }
        });
      }
    },
    applyPrevMaps: {
      writable: true,


      // Apply source map from previous compilation step (like Sass)
      value: function () {
        var prev, previous = this.previous();
        for (var i = 0; i < previous.length; i++) {
          prev = previous[i];

          var from = this.relative(prev.file);
          var root = prev.root || path.dirname(prev.file);
          var map;

          if (this.mapOpts.sourcesContent === false) {
            map = new mozilla.SourceMapConsumer(prev.text);
            map.sourcesContent = map.sourcesContent.map(function (i) {
              return null;
            });
          } else {
            map = prev.consumer();
          }

          this.map.applySourceMap(map, from, this.relative(root));
        }
      }
    },
    isAnnotation: {
      writable: true,


      // Should we add annotation comment
      value: function () {
        if (this.isInline()) {
          return true;
        } else if (typeof (this.mapOpts.annotation) != "undefined") {
          return this.mapOpts.annotation;
        } else if (this.previous().length) {
          return this.previous().some(function (i) {
            return i.annotation;
          });
        } else {
          return true;
        }
      }
    },
    addAnnotation: {
      writable: true,


      // Add source map annotation comment if it is needed
      value: function () {
        var content;

        if (this.isInline()) {
          content = "data:application/json;base64," + Base64.encode(this.map.toString());
        } else if (typeof (this.mapOpts.annotation) == "string") {
          content = this.mapOpts.annotation;
        } else {
          content = this.outputFile() + ".map";
        }

        this.css += "\n/*# sourceMappingURL=" + content + " */";
      }
    },
    outputFile: {
      writable: true,


      // Return output CSS file path
      value: function () {
        if (this.opts.to) {
          return this.relative(this.opts.to);
        } else if (this.opts.from) {
          return this.relative(this.opts.from);
        } else {
          return "to.css";
        }
      }
    },
    generateMap: {
      writable: true,


      // Return Result object with map
      value: function () {
        this.stringify();
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();

        if (this.isInline()) {
          return [this.css];
        } else {
          return [this.css, this.map];
        }
      }
    },
    relative: {
      writable: true,


      // Return path relative from output CSS file
      value: function (file) {
        var from = this.opts.to ? path.dirname(this.opts.to) : ".";

        if (typeof (this.mapOpts.annotation) == "string") {
          from = path.dirname(path.resolve(from, this.mapOpts.annotation));
        }

        file = path.relative(from, file);
        if (path.sep == "\\") {
          return file.replace(/\\/g, "/");
        } else {
          return file;
        }
      }
    },
    sourcePath: {
      writable: true,


      // Return path of node source for map
      value: function (node) {
        return this.relative(node.source.file || node.source.id);
      }
    },
    stringify: {
      writable: true,


      // Return CSS string and source map
      value: function () {
        var _this3 = this;
        this.css = "";
        this.map = new mozilla.SourceMapGenerator({ file: this.outputFile() });

        var line = 1;
        var column = 1;

        var lines, last;
        var builder = function (str, node, type) {
          _this3.css += str;

          if (node && node.source && node.source.start && type != "end") {
            _this3.map.addMapping({
              source: _this3.sourcePath(node),
              original: {
                line: node.source.start.line,
                column: node.source.start.column - 1
              },
              generated: {
                line: line,
                column: column - 1
              }
            });
          }

          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column = column + str.length;
          }

          if (node && node.source && node.source.end && type != "start") {
            _this3.map.addMapping({
              source: _this3.sourcePath(node),
              original: {
                line: node.source.end.line,
                column: node.source.end.column
              },
              generated: {
                line: line,
                column: column
              }
            });
          }
        };

        this.root.stringify(builder);
      }
    },
    generate: {
      writable: true,


      // Return Result object with or without map
      value: function () {
        this.clearAnnotation();

        if (this.isMap()) {
          return this.generateMap();
        } else {
          return [this.root.toString()];
        }
      }
    }
  });

  return MapGenerator;
})();

module.exports = MapGenerator;
},{"./result":94,"js-base64":99,"path":49,"source-map":100}],89:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

// Recursivly clone objects
var clone = function (obj, parent) {
  if (typeof (obj) != "object") return obj;
  var cloned = new obj.constructor();

  for (var name in obj) {
    if (!obj.hasOwnProperty(name)) continue;
    var value = obj[name];

    if (name == "parent" && typeof (value) == "object") {
      if (parent) cloned[name] = parent;
    } else if (name == "source") {
      cloned[name] = value;
    } else if (value instanceof Array) {
      cloned[name] = value.map(function (i) {
        return clone(i, cloned);
      });
    } else {
      cloned[name] = clone(value, cloned);
    }
  }

  return cloned;
};

var Node = (function () {
  var Node = function Node(defaults) {
    if (defaults === undefined) defaults = {};
    for (var name in defaults) {
      this[name] = defaults[name];
    }
  };

  _classProps(Node, null, {
    removeSelf: {
      writable: true,


      // Remove this node from parent
      //
      //   decl.removeSelf();
      //
      // Note, that removing by index is faster:
      //
      //   rule.each( (decl, i) => rule.remove(i) );
      value: function () {
        if (this.parent) {
          this.parent.remove(this);
        }
        return this;
      }
    },
    replace: {
      writable: true,


      // Shortcut to insert nodes before and remove self.
      //
      //   importNode.replace( loadedRoot );
      value: function (nodes) {
        this.parent.insertBefore(this, nodes);
        this.parent.remove(this);
        return this;
      }
    },
    toString: {
      writable: true,


      // Return CSS string of current node
      //
      //   decl.toString(); //=> "  color: black"
      value: function () {
        var result = "";
        var builder = function (str) {
          return result += str;
        };
        this.stringify(builder);
        return result;
      }
    },
    clone: {
      writable: true,


      // Clone current node
      //
      //   rule.append( decl.clone() );
      //
      // You can override properties while cloning:
      //
      //   rule.append( decl.clone({ value: '0' }) );
      value: function (overrides) {
        if (overrides === undefined) overrides = {};
        var cloned = clone(this);
        for (var name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
    },
    toJSON: {
      writable: true,


      // Remove `parent` node on cloning to fix circular structures
      value: function () {
        var fixed = {};

        for (var name in this) {
          if (!this.hasOwnProperty(name)) continue;
          if (name == "parent") continue;
          var value = this[name];

          if (value instanceof Array) {
            fixed[name] = value.map(function (i) {
              return (typeof (i) == "object" && i.toJSON) ? i.toJSON() : i;
            });
          } else if (typeof (value) == "object" && value.toJSON) {
            fixed[name] = value.toJSON();
          } else {
            fixed[name] = value;
          }
        }

        return fixed;
      }
    },
    styleMap: {
      writable: true,
      value: function () {
        return {};
      }
    },
    style: {
      writable: true,


      // Copy code style from first node with same type
      value: function (name) {
        // Already had
        var value = this.styleMap()[name];
        if (typeof (value) != "undefined") return value;

        var parent = this.parent;

        // Hack for first rule in CSS
        if (!parent && (name == "beforeRule" || name == "beforeDecl")) {
          return "";
        }
        if (name == "beforeRule" && !parent.parent && parent.first == this) {
          return "";
        }

        // Floating child without parent
        if (!parent) return this.defaultStyle[name];

        // Detect style by other nodes
        var root = parent;
        while (root.parent) root = root.parent;

        if (!root.styleCache) root.styleCache = {};
        if (typeof (root.styleCache[name]) != "undefined") {
          return root.styleCache[name];
        }

        root.eachInside(function (other) {
          value = other.styleMap()[name];
          if (typeof (value) != "undefined") return false;
        });
        if (typeof (value) == "undefined") value = this.defaultStyle[name];

        root.styleCache[name] = value;
        return value;
      }
    },
    stringifyRaw: {
      writable: true,


      // Use raw value if origin was not changed
      value: function (prop) {
        var value = this[prop];
        var raw = this["_" + prop];
        if (raw && raw.value === value) {
          return raw.raw;
        } else {
          return value;
        }
      }
    }
  });

  return Node;
})();

// Default code style
Node.prototype.defaultStyle = {
  colon: ": ",
  beforeDecl: "\n    ",
  commentLeft: " ",
  commentRight: " ",
  beforeRule: "\n",
  beforeOpen: " ",
  beforeClose: "\n",
  emptyBody: ""
};

module.exports = Node;
},{}],90:[function(require,module,exports){
"use strict";

var Parser = require("./parser");
var Input = require("./input");

module.exports = function (css, opts) {
  var input = new Input(css, opts);

  var parser = new Parser(input);
  parser.tokenize();
  parser.loop();

  return parser.root;
};
},{"./input":86,"./parser":91}],91:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Declaration = require("./declaration");
var tokenize = require("./tokenize");
var Comment = require("./comment");
var AtRule = require("./at-rule");
var Root = require("./root");
var Rule = require("./rule");

var Parser = (function () {
  var Parser = function Parser(input) {
    this.input = input;

    this.root = new Root();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;

    if (this.input.map) this.root.prevMap = this.input.map;
  };

  _classProps(Parser, null, {
    tokenize: {
      writable: true,
      value: function () {
        this.tokens = tokenize(this.input);
      }
    },
    loop: {
      writable: true,
      value: function () {
        var token;
        while ((token = this.tokens.shift()) !== undefined) {
          if (!this.nextToken(token)) this.spaces += token[1];
        }
        this.endFile();
      }
    },
    nextToken: {
      writable: true,
      value: function (token) {
        return this.word(token) || this.end(token) || this.comment(token) || this.atrule(token) || this.emptyRule(token);
      }
    },
    comment: {
      writable: true,
      value: function (token) {
        if (token[0] != "comment") return false;

        var node = new Comment();
        this.init(node, token[2], token[3]);
        node.source.end = { line: token[4], column: token[5] };

        var text = token[1].slice(2, -2);
        if (text.match(/^\s*$/)) {
          node.left = text;
          node.text = "";
          node.right = "";
        } else {
          var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
          node.left = match[1];
          node.text = match[2];
          node.right = match[3];
        }
        return true;
      }
    },
    emptyRule: {
      writable: true,
      value: function (token) {
        if (token[0] != "{") return;

        var node = new Rule();
        this.init(node, token[2], token[3]);
        node.between = "";
        node.selector = "";
        this.current = node;
        return true;
      }
    },
    word: {
      writable: true,
      value: function (start) {
        if (start[0] != "word" && start[0] != ":") return;

        var token;
        var colon = false;
        var buffer = [start];
        var end = false;
        while (true) {
          token = this.tokens.shift();

          if (!token) {
            end = true;
            break;
          } else if (token[0] == ";") {
            buffer.push(token);
            if (colon) {
              this.decl(buffer);
              return true;
            } else {
              break;
            }
          } else if (token[0] == "{") {
            this.rule(buffer);
            return true;
          } else if (token[0] == "}") {
            this.tokens.unshift(token);
            end = true;
            break;
          } else if (token[0] == "at-word") {
            this.tokens.unshift(token);
            break;
          } else {
            if (token[0] == ":") colon = true;
            buffer.push(token);
          }
        }

        if (end && colon) {
          while (buffer.length) {
            token = buffer[buffer.length - 1];
            if (token[0] != "space" && token[0] != "comment") break;
            this.tokens.unshift(buffer.pop());
          }
          this.decl(buffer);
          return true;
        }

        if (this.input.safe) {
          this.spaces += this.map(buffer, function (i) {
            return i[1];
          }).join("");
          return true;
        } else {
          this.input.error("Unknown word", start[2], start[3]);
        }
      }
    },
    rule: {
      writable: true,
      value: function (tokens) {
        var node = new Rule();
        this.init(node, tokens[0][2], tokens[0][3]);

        node.between = this.spacesFromEnd(tokens);
        this.raw(node, "selector", tokens);
        this.current = node;
      }
    },
    decl: {
      writable: true,
      value: function (tokens) {
        var node = new Declaration();
        this.init(node);

        var last = tokens[tokens.length - 1];
        if (last[0] == ";") {
          node.source.end = { line: last[2], column: last[3] };
          this.semicolon = true;
          tokens.pop();
        } else {
          node.source.end = { line: last[4], column: last[5] };
        }

        while (tokens[0][0] != "word") {
          node.before += tokens.shift()[1];
        }
        node.source.start = { line: tokens[0][2], column: tokens[0][3] };

        node.prop = tokens.shift()[1];
        node.between = "";

        var token;
        while (tokens.length) {
          token = tokens.shift();
          node.between += token[1];

          if (token[0] == ":") {
            break;
          } else if (token[0] != "space" && token[0] != "comment") {
            this.unknownWord(node, token);
          }
        }

        if (node.prop[0] == "_" || node.prop[0] == "*") {
          node.before += node.prop[0];
          node.prop = node.prop.slice(1);
        }
        node.between += this.spacesFromStart(tokens);

        var i;
        for (i = 2; i < tokens.length; i++) {
          if (tokens[i][0] == ":") this.missedSemicolon(tokens, i);
        }

        for (i = tokens.length - 1; i > 0; i--) {
          token = tokens[i];
          if (token[1] == "!important") {
            node.important = true;
            var string = this.stringFrom(tokens, i);
            string = this.spacesFromEnd(tokens) + string;
            if (string != " !important") node._important = string;
            break;
          } else if (token[0] != "space" && token[0] != "comment") {
            break;
          }
        }

        this.raw(node, "value", tokens);
      }
    },
    atrule: {
      writable: true,
      value: function (token) {
        if (token[0] != "at-word") return;

        var node = new AtRule();
        node.name = token[1].slice(1);
        if (node.name === "") {
          if (this.input.safe) {
            node.name = "";
          } else {
            this.input.error("At-rule without name", token[2], token[3]);
          }
        }
        this.init(node, token[2], token[3]);

        var next;
        var last = false;
        var open = false;
        var params = [];
        while (true) {
          token = this.tokens.shift();
          if (!token) {
            last = true;
            break;
          } else if (token[0] == ";") {
            node.source.end = { line: token[2], column: token[3] };
            this.semicolon = true;
            break;
          } else if (token[0] == "{") {
            open = true;
            break;
          } else {
            params.push(token);
          }
        }

        node.between = this.spacesFromEnd(params);
        if (params.length) {
          node.afterName = this.spacesFromStart(params);
          this.raw(node, "params", params);
          if (last) {
            token = params[params.length - 1];
            node.source.end = { line: token[4], column: token[5] };
            this.spaces = node.between;
            node.between = "";
          }
        } else {
          node.afterName = "";
          node.params = "";
        }

        if (open) {
          node.childs = [];
          this.current = node;
        }
        return true;
      }
    },
    end: {
      writable: true,
      value: function (token) {
        if (token[0] != "}") return;

        if (this.semicolon) {
          this.current.semicolon = true;
          this.semicolon = false;
        }
        this.current.after = (this.current.after || "") + this.spaces;
        this.spaces = "";

        if (this.current.parent) {
          this.current.source.end = { line: token[2], column: token[3] };
          this.current = this.current.parent;
        } else if (!this.input.safe) {
          this.input.error("Unexpected }", token[2], token[3]);
        } else {
          this.current.after += "}";
        }

        return true;
      }
    },
    endFile: {
      writable: true,
      value: function () {
        if (this.current.parent && !this.input.safe) {
          var pos = this.current.source.start;
          this.input.error("Unclosed block", pos.line, pos.column);
        }

        if (this.semicolon) this.current.semicolon = true;
        this.current.after = (this.current.after || "") + this.spaces;

        while (this.current.parent) {
          this.current = this.current.parent;
          this.current.after = "";
        }
      }
    },
    unknownWord: {
      writable: true,
      value: function (node, token) {
        if (this.input.safe) {
          node.source.start = { line: token[2], column: token[3] };
          node.before += node.prop + node.between;
          node.prop = tokens.shift()[1];
          node.between = "";
        } else {
          this.input.error("Unknown word", token[2], token[3]);
        }
      }
    },
    missedSemicolon: {
      writable: true,
      value: function (tokens, colon) {
        if (this.input.safe) {
          var split;
          for (split = colon - 1; split >= 0; split--) {
            if (tokens[split][0] == "word") break;
          }
          for (split -= 1; split >= 0; split--) {
            if (tokens[split][0] != "space") {
              split += 1;
              break;
            }
          }
          var other = tokens.splice(split, tokens.length - split);
          this.decl(other);
        } else {
          var token;
          var founded = 0;
          for (var j = colon - 1; j >= 0; j--) {
            token = tokens[j];
            if (token[0] != "space") {
              founded += 1;
              if (founded == 2) break;
            }
          }
          this.input.error("Missed semicolon", token[4], token[5]);
        }
      }
    },
    init: {
      writable: true,


      // Helpers

      value: function (node, line, column) {
        this.current.push(node);

        node.source = { start: { line: line, column: column }, content: this.input.css };
        if (this.input.map) node.source.map = this.input.map;
        if (this.input.file) {
          node.source.file = this.input.file;
        } else {
          node.source.id = this.input.id;
        }

        node.before = this.spaces;
        this.spaces = "";
        this.semicolon = false;
      }
    },
    raw: {
      writable: true,
      value: function (node, prop, tokens) {
        var clean = true;
        var value = this.map(tokens, function (token) {
          if (token[0] == "comment") {
            clean = false;
            return "";
          } else {
            return token[1];
          }
        }).join("");
        if (!clean) {
          var origin = tokens.map(function (i) {
            return i[1];
          }).join("");
          node["_" + prop] = { value: value, raw: origin };
        }
        node[prop] = value;
      }
    },
    spacesFromEnd: {
      writable: true,
      value: function (tokens) {
        var next;
        var spaces = "";
        while (tokens.length) {
          next = tokens[tokens.length - 1];
          if (next[0] != "space" && next[0] != "comment") break;
          spaces += tokens.pop()[1];
        }
        return spaces;
      }
    },
    spacesFromStart: {
      writable: true,
      value: function (tokens) {
        var next;
        var spaces = "";
        while (tokens.length) {
          next = tokens[0];
          if (next[0] != "space" && next[0] != "comment") break;
          spaces += tokens.shift()[1];
        }
        return spaces;
      }
    },
    stringFrom: {
      writable: true,
      value: function (tokens, i) {
        var part = tokens.splice(i, tokens.length - i);
        return this.map(part, function (i) {
          return i[1];
        }).join("");
      }
    },
    map: {
      writable: true,
      value: function (array, callback) {
        var mapped = [];
        for (var i = 0; i < array.length; i++) {
          mapped.push(callback(array[i], i));
        }
        return mapped;
      }
    }
  });

  return Parser;
})();

module.exports = Parser;
},{"./at-rule":81,"./comment":82,"./declaration":85,"./root":95,"./rule":96,"./tokenize":97}],92:[function(require,module,exports){
"use strict";

var _slice = Array.prototype.slice;
var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Declaration = require("./declaration");
var Comment = require("./comment");
var AtRule = require("./at-rule");
var Result = require("./result");
var Rule = require("./rule");
var Root = require("./root");

var PostCSS = (function () {
  var PostCSS = function PostCSS(processors) {
    var _this = this;
    if (processors === undefined) processors = [];
    this.processors = processors.map(function (i) {
      return _this.normalize(i);
    });
  };

  _classProps(PostCSS, null, {
    use: {
      writable: true,


      // Add another function to CSS processors
      value: function (processor) {
        processor = this.normalize(processor);
        if (processor instanceof PostCSS) {
          this.processors = this.processors.concat(processor.processors);
        } else {
          this.processors.push(processor);
        }
        return this;
      }
    },
    process: {
      writable: true,


      // Process CSS throw installed processors
      value: function (css, opts) {
        if (opts === undefined) opts = {};
        if (opts.map == "inline") {
          opts.map = { inline: true };
          console.warn("Shortcut map: \"inline\" is deprecated " + "and will be remove in 3.1");
        }

        var parsed;
        if (css instanceof Root) {
          parsed = css;
        } else if (css instanceof Result) {
          parsed = css.root;
          if (css.map && typeof (opts.map) == "undefined") {
            opts.map = { prev: css.map };
          }
        } else {
          parsed = postcss.parse(css, opts);
        }

        for (var i = 0; i < this.processors.length; i++) {
          var returned = this.processors[i](parsed, opts);
          if (returned instanceof Root) parsed = returned;
        }

        return parsed.toResult(opts);
      }
    },
    normalize: {
      writable: true,


      // Return processor function
      value: function (processor) {
        var type = typeof (processor);
        if ((type == "object" || type == "function") && processor.postcss) {
          return processor.postcss;
        } else {
          return processor;
        }
      }
    }
  });

  return PostCSS;
})();

// Framework for CSS postprocessors
//
//   var processor = postcss(function (css) {
//       // Change nodes in css
//   });
//   processor.process(css)
var postcss = function () {
  var processors = _slice.call(arguments);

  if (processors.length == 1 && Array.isArray(processors[0])) {
    processors = processors[0];
  }
  return new PostCSS(processors);
};

// Compile CSS to nodes
postcss.parse = require("./parse");

// Nodes shortcuts
postcss.comment = function (defaults) {
  return new Comment(defaults);
};
postcss.atRule = function (defaults) {
  return new AtRule(defaults);
};
postcss.decl = function (defaults) {
  return new Declaration(defaults);
};
postcss.rule = function (defaults) {
  return new Rule(defaults);
};
postcss.root = function (defaults) {
  return new Root(defaults);
};

module.exports = postcss;
},{"./at-rule":81,"./comment":82,"./declaration":85,"./parse":90,"./result":94,"./root":95,"./rule":96}],93:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var mozilla = require("source-map");
var Base64 = require("js-base64").Base64;
var path = require("path");
var fs = require("fs");

var PreviousMap = (function () {
  var PreviousMap = function PreviousMap(css, opts) {
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");

    var text = this.loadMap(opts.from, opts.map ? opts.map.prev : undefined);
    if (text) this.text = text;
  };

  _classProps(PreviousMap, null, {
    consumer: {
      writable: true,


      // Return SourceMapConsumer object to read map
      value: function () {
        if (!this.consumerCache) {
          this.consumerCache = new mozilla.SourceMapConsumer(this.text);
        }
        return this.consumerCache;
      }
    },
    withContent: {
      writable: true,


      // Is map has sources content
      value: function () {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
    },
    startWith: {
      writable: true,


      // Is `string` is starting with `start`
      value: function (string, start) {
        if (!string) return false;
        return string.substr(0, start.length) == start;
      }
    },
    loadAnnotation: {
      writable: true,


      // Load for annotation comment from previous compilation step
      value: function (css) {
        var match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
        if (match) this.annotation = match[1].trim();
      }
    },
    decodeInline: {
      writable: true,


      // Encode different type of inline
      value: function (text) {
        var uri = "data:application/json,";
        var base64 = "data:application/json;base64,";

        if (this.startWith(text, uri)) {
          return decodeURIComponent(text.substr(uri.length));
        } else if (this.startWith(text, base64)) {
          return Base64.decode(text.substr(base64.length));
        } else {
          var encoding = text.match(/data:application\/json;([^,]+),/)[1];
          throw new Error("Unsupported source map encoding " + encoding);
        }
      }
    },
    loadMap: {
      writable: true,


      // Load previous map
      value: function (file, prev) {
        if (prev === false) return;

        if (prev) {
          if (typeof (prev) == "string") {
            return prev;
          } else if (prev instanceof mozilla.SourceMapConsumer) {
            return mozilla.SourceMapGenerator.fromSourceMap(prev).toString();
          } else if (prev instanceof mozilla.SourceMapGenerator) {
            return prev.toString();
          } else if (typeof (prev) == "object" && prev.mappings) {
            return JSON.stringify(prev);
          } else {
            throw new Error("Unsupported previous source map format: " + prev.toString());
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          var map = this.annotation;
          if (file) map = path.join(path.dirname(file), map);

          this.root = path.dirname(map);
          if (fs.existsSync && fs.existsSync(map)) {
            return fs.readFileSync(map, "utf-8").toString().trim();
          }
        }
      }
    }
  });

  return PreviousMap;
})();

module.exports = PreviousMap;
},{"fs":44,"js-base64":99,"path":49,"source-map":100}],94:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var MapGenerator = require("./map-generator");

var Result = (function () {
  var Result = function Result(root, opts) {
    if (opts === undefined) opts = {};
    this.root = root;
    this.opts = opts;
  };

  _classProps(Result, null, {
    map: {
      // Lazy method to return source map
      get: function () {
        if (!this.cssCached) this.stringify();
        return this.mapCached;
      }
    },
    css: {
      // Lazy method to return CSS string
      get: function () {
        if (!this.cssCached) this.stringify();
        return this.cssCached;
      }
    },
    toString: {
      writable: true,


      // Return CSS string on any try to print
      value: function () {
        return this.css;
      }
    },
    stringify: {
      writable: true,


      // Generate CSS and map
      value: function () {
        var map = new MapGenerator(this.root, this.opts);
        var generated = map.generate();
        this.cssCached = generated[0];
        this.mapCached = generated[1];
      }
    }
  });

  return Result;
})();

module.exports = Result;
},{"./map-generator":88}],95:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Declaration = require("./declaration");
var Container = require("./container");
var Comment = require("./comment");
var AtRule = require("./at-rule");
var Result = require("./result");
var Rule = require("./rule");

var Root = (function (Container) {
  var Root = function Root(defaults) {
    this.type = "root";
    this.childs = [];
    Container.call(this, defaults);
  };

  _extends(Root, Container);

  _classProps(Root, null, {
    remove: {
      writable: true,


      // Fix space when we remove first child
      value: function (child) {
        child = this.index(child);

        if (child === 0 && this.childs.length > 1) {
          this.childs[1].before = this.childs[child].before;
        }

        return Container.prototype.remove.call(this, child);
      }
    },
    normalize: {
      writable: true,


      // Fix spaces on insert before first rule
      value: function (child, sample, type) {
        var childs = Container.prototype.normalize.call(this, child, sample, type);

        for (var i = 0; i < childs.length; i++) {
          if (type == "prepend") {
            if (this.childs.length > 1) {
              sample.before = this.childs[1].before;
            } else if (this.childs.length == 1) {
              sample.before = this.after;
            }
          } else {
            if (this.childs.length > 1) {
              if (sample) childs[i].before = sample.before;
            } else {
              childs[i].before = this.after;
            }
          }
        }

        return childs;
      }
    },
    stringify: {
      writable: true,


      // Stringify styles
      value: function (builder) {
        this.stringifyContent(builder);
        if (this.after) builder(this.after);
      }
    },
    toResult: {
      writable: true,


      // Generate processing result with optional source map
      value: function (opts) {
        if (opts === undefined) opts = {};
        return new Result(this, opts);
      }
    }
  });

  return Root;
})(Container);

module.exports = Root;
},{"./at-rule":81,"./comment":82,"./container":83,"./declaration":85,"./result":94,"./rule":96}],96:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Container = require("./container");
var Declaration = require("./declaration");
var list = require("./list");

var Rule = (function (Container) {
  var Rule = function Rule(defaults) {
    this.type = "rule";
    this.childs = [];
    Container.call(this, defaults);
  };

  _extends(Rule, Container);

  _classProps(Rule, null, {
    selectors: {
      // Shortcut to get selectors as array

      get: function () {
        return list.comma(this.selector);
      },
      set: function (values) {
        this.selector = values.join(", ");
      }
    },
    stringify: {
      writable: true,


      // Stringify rule
      value: function (builder) {
        this.stringifyBlock(builder, this.stringifyRaw("selector"));
      }
    }
  });

  return Rule;
})(Container);

module.exports = Rule;
},{"./container":83,"./declaration":85,"./list":87}],97:[function(require,module,exports){
"use strict";

var singleQuote = "'".charCodeAt(0), doubleQuote = "\"".charCodeAt(0), backslash = "\\".charCodeAt(0), slash = "/".charCodeAt(0), newline = "\n".charCodeAt(0), space = " ".charCodeAt(0), feed = "\f".charCodeAt(0), tab = "\t".charCodeAt(0), cr = "\r".charCodeAt(0), bracket = "(".charCodeAt(0), openCurly = "{".charCodeAt(0), closeCurly = "}".charCodeAt(0), semicolon = ";".charCodeAt(0), asterisk = "*".charCodeAt(0), colon = ":".charCodeAt(0), at = "@".charCodeAt(0), atEnd = /[ \n\t\r\{'"/]/g, wordEnd = /[ \n\t\r\(\{\}:;@!'"]|\/(?=\*)/g;

module.exports = function (input) {
  var tokens = [];
  var css = input.css.valueOf();

  var code, next, quote, lines, last, content, nextLine, nextOffset, escaped, escapePos;

  var length = css.length;
  var offset = -1;
  var line = 1;
  var pos = 0;

  var unclosed = function (what, end) {
    if (input.safe) {
      css += end;
      next = css.length - 1;
    } else {
      input.error("Unclosed " + what, line, pos - offset);
    }
  };

  while (pos < length) {
    code = css.charCodeAt(pos);

    if (code == newline) {
      offset = pos;
      line += 1;
    }

    switch (code) {
      case newline:
      case space:
      case feed:
      case tab:
      case cr:
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code == newline) {
            offset = next;
            line += 1;
          }
        } while (code == space || code == newline || code == tab || code == cr || code == feed);

        tokens.push(["space", css.slice(pos, next)]);
        pos = next - 1;
        break;

      case openCurly:
        tokens.push(["{", "{", line, pos - offset]);
        break;

      case closeCurly:
        tokens.push(["}", "}", line, pos - offset]);
        break;

      case colon:
        tokens.push([":", ":", line, pos - offset]);
        break;

      case semicolon:
        tokens.push([";", ";", line, pos - offset]);
        break;

      case singleQuote:
      case doubleQuote:
        if (code == singleQuote) {
          quote = "'";
        } else {
          quote = "\"";
        }

        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next == -1) unclosed("quote", quote);
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) == backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);

        tokens.push(["string", css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
        pos = next;
        break;

      case bracket:
        next = pos;

        do {
          escaped = false;
          next = css.indexOf(")", next + 1);
          if (next == -1) unclosed("bracket", ")");
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) == backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);

        content = css.slice(pos, next + 1);
        lines = content.split("\n");
        last = lines.length - 1;

        if (last > 0) {
          nextLine = line + last;
          nextOffset = next - lines[last].length;
        } else {
          nextLine = line;
          nextOffset = offset;
        }

        tokens.push(["brackets", content, line, pos - offset, nextLine, next - nextOffset]);

        offset = nextOffset;
        line = nextLine;
        pos = next;
        break;

      case at:
        atEnd.lastIndex = pos + 1;
        atEnd.test(css);
        if (atEnd.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = atEnd.lastIndex - 2;
        }
        tokens.push(["at-word", css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
        pos = next;
        break;

      default:
        if (code == slash && css.charCodeAt(pos + 1) == asterisk) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) unclosed("comment", "*/");

          content = css.slice(pos, next + 1);
          lines = content.split("\n");
          last = lines.length - 1;

          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }

          tokens.push(["comment", content, line, pos - offset, nextLine, next - nextOffset]);

          offset = nextOffset;
          line = nextLine;
          pos = next;
        } else {
          wordEnd.lastIndex = pos + 1;
          wordEnd.test(css);
          if (wordEnd.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = wordEnd.lastIndex - 2;
          }

          tokens.push(["word", css.slice(pos, next + 1), line, pos - offset, line, next - offset]);
          pos = next;
        }

        break;
    }

    pos++;
  }

  return tokens;
};
},{}],98:[function(require,module,exports){
"use strict";

// Methods to work with vendor prefixes
var vendor = {
  // Return vendor prefix from property name, if it exists
  //
  //   vendor.prefix('-moz-box-sizing') #=> '-moz-'
  //   vendor.prefix('box-sizing')      #=> ''
  prefix: function (prop) {
    if (prop[0] == "-") {
      var sep = prop.indexOf("-", 1);
      return prop.substr(0, sep + 1);
    } else {
      return "";
    }
  },

  // Remove prefix from property name
  //
  //   vendor.prefix('-moz-box-sizing') #=> 'box-sizing'
  //   vendor.prefix('box-sizing')      #=> 'box-sizing'
  unprefixed: function (prop) {
    if (prop[0] == "-") {
      var sep = prop.indexOf("-", 1);
      return prop.substr(sep + 1);
    } else {
      return prop;
    }
  }

};

module.exports = vendor;
},{}],99:[function(require,module,exports){
(function (global){
/*
 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *    http://opensource.org/licenses/mit-license
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

(function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.1.5";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        buffer = require('buffer').Buffer;
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer
        ? function (u) { return (new buffer(u)).toString('base64') } 
    : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe 
            ? _encode(u)
            : _encode(u).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer
        ? function(a) { return (new buffer(a, 'base64')).toString() }
    : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            a.replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    // that's it!
})(this);

if (this['Meteor']) {
    Base64 = global.Base64; // for normal export in Meteor.js
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":45}],100:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":105,"./source-map/source-map-generator":106,"./source-map/source-node":107}],101:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});

},{"./util":108,"amdefine":109}],102:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string via the out parameter.
   */
  exports.decode = function base64VLQ_decode(aStr, aOutParam) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aStr.slice(i);
  };

});

},{"./base64":103,"amdefine":109}],103:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var charToIntMap = {};
  var intToCharMap = {};

  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .forEach(function (ch, index) {
      charToIntMap[ch] = index;
      intToCharMap[index] = ch;
    });

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 digit to an integer.
   */
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
    }
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  };

});

},{"amdefine":109}],104:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return aHaystack[mid];
    }
    else if (cmp > 0) {
      // aHaystack[mid] is greater than our needle.
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
      }
      // We did not find an exact match, return the next closest one
      // (termination case 2).
      return aHaystack[mid];
    }
    else {
      // aHaystack[mid] is less than our needle.
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
      }
      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (2) or (3) and return the appropriate thing.
      return aLow < 0
        ? null
        : aHaystack[aLow];
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0
      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
      : null;
  };

});

},{"amdefine":109}],105:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');

  /**
   * A SourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  /**
   * Create a SourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns SourceMapConsumer
   */
  SourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(SourceMapConsumer.prototype);

      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      smc.__generatedMappings = aSourceMap._mappings.slice()
        .sort(util.compareByGeneratedPositions);
      smc.__originalMappings = aSourceMap._mappings.slice()
        .sort(util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  SourceMapConsumer.prototype._nextCharIsMappingSeparator =
    function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
      var c = aStr.charAt(0);
      return c === ";" || c === ",";
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var str = aStr;
      var temp = {};
      var mapping;

      while (str.length > 0) {
        if (str.charAt(0) === ';') {
          generatedLine++;
          str = str.slice(1);
          previousGeneratedColumn = 0;
        }
        else if (str.charAt(0) === ',') {
          str = str.slice(1);
        }
        else {
          mapping = {};
          mapping.generatedLine = generatedLine;

          // Generated column.
          base64VLQ.decode(str, temp);
          mapping.generatedColumn = previousGeneratedColumn + temp.value;
          previousGeneratedColumn = mapping.generatedColumn;
          str = temp.rest;

          if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
            // Original source.
            base64VLQ.decode(str, temp);
            mapping.source = this._sources.at(previousSource + temp.value);
            previousSource += temp.value;
            str = temp.rest;
            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
              throw new Error('Found a source, but no line and column');
            }

            // Original line.
            base64VLQ.decode(str, temp);
            mapping.originalLine = previousOriginalLine + temp.value;
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;
            str = temp.rest;
            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
              throw new Error('Found a source and line, but no column');
            }

            // Original column.
            base64VLQ.decode(str, temp);
            mapping.originalColumn = previousOriginalColumn + temp.value;
            previousOriginalColumn = mapping.originalColumn;
            str = temp.rest;

            if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
              // Original name.
              base64VLQ.decode(str, temp);
              mapping.name = this._names.at(previousName + temp.value);
              previousName += temp.value;
              str = temp.rest;
            }
          }

          this.__generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            this.__originalMappings.push(mapping);
          }
        }
      }

      this.__generatedMappings.sort(util.compareByGeneratedPositions);
      this.__originalMappings.sort(util.compareByOriginalPositions);
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  SourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator);
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  SourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var mapping = this._findMapping(needle,
                                      this._generatedMappings,
                                      "generatedLine",
                                      "generatedColumn",
                                      util.compareByGeneratedPositions);

      if (mapping && mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source != null && this.sourceRoot != null) {
          source = util.join(this.sourceRoot, source);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: util.getArg(mapping, 'name', null)
        };
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  SourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot != null) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot != null
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      throw new Error('"' + aSource + '" is not in the SourceMap.');
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      if (this.sourceRoot != null) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }

      var mapping = this._findMapping(needle,
                                      this._originalMappings,
                                      "originalLine",
                                      "originalColumn",
                                      util.compareByOriginalPositions);

      if (mapping) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null)
        };
      }

      return {
        line: null,
        column: null
      };
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source;
        if (source != null && sourceRoot != null) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name
        };
      }).forEach(aCallback, context);
    };

  exports.SourceMapConsumer = SourceMapConsumer;

});

},{"./array-set":101,"./base64-vlq":102,"./binary-search":104,"./util":108,"amdefine":109}],106:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      this._validateMapping(generated, original, source, name);

      if (source != null && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name != null && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.push({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent != null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "sourceFile" relative if an absolute Url is passed.
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "sourceFile"
      this._mappings.forEach(function (mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source)
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile = util.join(aSourceMapPath, sourceFile);
          }
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      // The mappings must be guaranteed to be in sorted order before we start
      // serializing them or else the generated line numbers (which are defined
      // via the ';' separators) will be all messed up. Note: it might be more
      // performant to maintain the sorting as we insert them, rather than as we
      // serialize them, but the big O is the same either way.
      this._mappings.sort(util.compareByGeneratedPositions);

      for (var i = 0, len = this._mappings.length; i < len; i++) {
        mapping = this._mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source != null) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name != null) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this);
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});

},{"./array-set":101,"./base64-vlq":102,"./util":108,"amdefine":109}],107:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
  var util = require('./util');

  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
  // operating systems these days (capturing the result).
  var REGEX_NEWLINE = /(\r?\n)/;

  // Matches a Windows-style newline, or any character.
  var REGEX_CHARACTER = /\r\n|[\s\S]/g;

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // All even indices of this array are one line of the generated code,
      // while all odd indices are the newlines between two adjacent lines
      // (since `REGEX_NEWLINE` captures its match).
      // Processed fragments are removed from this array, by calling `shiftNextLine`.
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var shiftNextLine = function() {
        var lineContents = remainingLines.shift();
        // The last line of a file might not have a newline.
        var newLine = remainingLines.shift() || "";
        return lineContents + newLine;
      };

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[0];
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLines.length > 0) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.join(""));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          var source = aRelativePath
            ? util.join(aRelativePath, mapping.source)
            : mapping.source;
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i] instanceof SourceNode) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      chunk.match(REGEX_CHARACTER).forEach(function (ch, idx, array) {
        if (REGEX_NEWLINE.test(ch)) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === array.length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column += ch.length;
        }
      });
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});

},{"./source-map-generator":106,"./util":108,"amdefine":109}],108:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consequtive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = (path.charAt(0) === '/');

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }

    aRoot = aRoot.replace(/\/$/, '');

    // XXX: It is possible to remove this block, and the tests still pass!
    var url = urlParse(aRoot);
    if (aPath.charAt(0) == "/" && url && url.path == "/") {
      return aPath.slice(1);
    }

    return aPath.indexOf(aRoot + '/') === 0
      ? aPath.substr(aRoot.length + 1)
      : aPath;
  }
  exports.relative = relative;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  function strcmp(aStr1, aStr2) {
    var s1 = aStr1 || "";
    var s2 = aStr2 || "";
    return (s1 > s2) - (s1 < s2);
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp;

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp || onlyCompareOriginal) {
      return cmp;
    }

    cmp = strcmp(mappingA.name, mappingB.name);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    return mappingA.generatedColumn - mappingB.generatedColumn;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings where the generated positions are
   * compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
    var cmp;

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp || onlyCompareGenerated) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositions = compareByGeneratedPositions;

});

},{"amdefine":109}],109:[function(require,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = require('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,require('_process'),"/../node_modules/postcss/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"_process":50,"path":49}]},{},[1])(1)
});