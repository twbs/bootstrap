var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/mark.js/dist/mark.js
var require_mark = __commonJS({
  "node_modules/mark.js/dist/mark.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.Mark = factory();
    })(exports, (function() {
      "use strict";
      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      var classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      var createClass = /* @__PURE__ */ (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      var DOMIterator = (function() {
        function DOMIterator2(ctx) {
          var iframes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var exclude = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
          var iframesTimeout = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 5e3;
          classCallCheck(this, DOMIterator2);
          this.ctx = ctx;
          this.iframes = iframes;
          this.exclude = exclude;
          this.iframesTimeout = iframesTimeout;
        }
        createClass(DOMIterator2, [{
          key: "getContexts",
          value: function getContexts() {
            var ctx = void 0, filteredCtx = [];
            if (typeof this.ctx === "undefined" || !this.ctx) {
              ctx = [];
            } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
              ctx = Array.prototype.slice.call(this.ctx);
            } else if (Array.isArray(this.ctx)) {
              ctx = this.ctx;
            } else if (typeof this.ctx === "string") {
              ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
            } else {
              ctx = [this.ctx];
            }
            ctx.forEach(function(ctx2) {
              var isDescendant = filteredCtx.filter(function(contexts) {
                return contexts.contains(ctx2);
              }).length > 0;
              if (filteredCtx.indexOf(ctx2) === -1 && !isDescendant) {
                filteredCtx.push(ctx2);
              }
            });
            return filteredCtx;
          }
        }, {
          key: "getIframeContents",
          value: function getIframeContents(ifr, successFn) {
            var errorFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
            };
            var doc = void 0;
            try {
              var ifrWin = ifr.contentWindow;
              doc = ifrWin.document;
              if (!ifrWin || !doc) {
                throw new Error("iframe inaccessible");
              }
            } catch (e) {
              errorFn();
            }
            if (doc) {
              successFn(doc);
            }
          }
        }, {
          key: "isIframeBlank",
          value: function isIframeBlank(ifr) {
            var bl = "about:blank", src = ifr.getAttribute("src").trim(), href = ifr.contentWindow.location.href;
            return href === bl && src !== bl && src;
          }
        }, {
          key: "observeIframeLoad",
          value: function observeIframeLoad(ifr, successFn, errorFn) {
            var _this = this;
            var called = false, tout = null;
            var listener = function listener2() {
              if (called) {
                return;
              }
              called = true;
              clearTimeout(tout);
              try {
                if (!_this.isIframeBlank(ifr)) {
                  ifr.removeEventListener("load", listener2);
                  _this.getIframeContents(ifr, successFn, errorFn);
                }
              } catch (e) {
                errorFn();
              }
            };
            ifr.addEventListener("load", listener);
            tout = setTimeout(listener, this.iframesTimeout);
          }
        }, {
          key: "onIframeReady",
          value: function onIframeReady(ifr, successFn, errorFn) {
            try {
              if (ifr.contentWindow.document.readyState === "complete") {
                if (this.isIframeBlank(ifr)) {
                  this.observeIframeLoad(ifr, successFn, errorFn);
                } else {
                  this.getIframeContents(ifr, successFn, errorFn);
                }
              } else {
                this.observeIframeLoad(ifr, successFn, errorFn);
              }
            } catch (e) {
              errorFn();
            }
          }
        }, {
          key: "waitForIframes",
          value: function waitForIframes(ctx, done) {
            var _this2 = this;
            var eachCalled = 0;
            this.forEachIframe(ctx, function() {
              return true;
            }, function(ifr) {
              eachCalled++;
              _this2.waitForIframes(ifr.querySelector("html"), function() {
                if (!--eachCalled) {
                  done();
                }
              });
            }, function(handled) {
              if (!handled) {
                done();
              }
            });
          }
        }, {
          key: "forEachIframe",
          value: function forEachIframe(ctx, filter, each) {
            var _this3 = this;
            var end = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : function() {
            };
            var ifr = ctx.querySelectorAll("iframe"), open = ifr.length, handled = 0;
            ifr = Array.prototype.slice.call(ifr);
            var checkEnd = function checkEnd2() {
              if (--open <= 0) {
                end(handled);
              }
            };
            if (!open) {
              checkEnd();
            }
            ifr.forEach(function(ifr2) {
              if (DOMIterator2.matches(ifr2, _this3.exclude)) {
                checkEnd();
              } else {
                _this3.onIframeReady(ifr2, function(con) {
                  if (filter(ifr2)) {
                    handled++;
                    each(con);
                  }
                  checkEnd();
                }, checkEnd);
              }
            });
          }
        }, {
          key: "createIterator",
          value: function createIterator(ctx, whatToShow, filter) {
            return document.createNodeIterator(ctx, whatToShow, filter, false);
          }
        }, {
          key: "createInstanceOnIframe",
          value: function createInstanceOnIframe(contents) {
            return new DOMIterator2(contents.querySelector("html"), this.iframes);
          }
        }, {
          key: "compareNodeIframe",
          value: function compareNodeIframe(node, prevNode, ifr) {
            var compCurr = node.compareDocumentPosition(ifr), prev = Node.DOCUMENT_POSITION_PRECEDING;
            if (compCurr & prev) {
              if (prevNode !== null) {
                var compPrev = prevNode.compareDocumentPosition(ifr), after = Node.DOCUMENT_POSITION_FOLLOWING;
                if (compPrev & after) {
                  return true;
                }
              } else {
                return true;
              }
            }
            return false;
          }
        }, {
          key: "getIteratorNode",
          value: function getIteratorNode(itr) {
            var prevNode = itr.previousNode();
            var node = void 0;
            if (prevNode === null) {
              node = itr.nextNode();
            } else {
              node = itr.nextNode() && itr.nextNode();
            }
            return {
              prevNode,
              node
            };
          }
        }, {
          key: "checkIframeFilter",
          value: function checkIframeFilter(node, prevNode, currIfr, ifr) {
            var key = false, handled = false;
            ifr.forEach(function(ifrDict, i) {
              if (ifrDict.val === currIfr) {
                key = i;
                handled = ifrDict.handled;
              }
            });
            if (this.compareNodeIframe(node, prevNode, currIfr)) {
              if (key === false && !handled) {
                ifr.push({
                  val: currIfr,
                  handled: true
                });
              } else if (key !== false && !handled) {
                ifr[key].handled = true;
              }
              return true;
            }
            if (key === false) {
              ifr.push({
                val: currIfr,
                handled: false
              });
            }
            return false;
          }
        }, {
          key: "handleOpenIframes",
          value: function handleOpenIframes(ifr, whatToShow, eCb, fCb) {
            var _this4 = this;
            ifr.forEach(function(ifrDict) {
              if (!ifrDict.handled) {
                _this4.getIframeContents(ifrDict.val, function(con) {
                  _this4.createInstanceOnIframe(con).forEachNode(whatToShow, eCb, fCb);
                });
              }
            });
          }
        }, {
          key: "iterateThroughNodes",
          value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
            var _this5 = this;
            var itr = this.createIterator(ctx, whatToShow, filterCb);
            var ifr = [], elements = [], node = void 0, prevNode = void 0, retrieveNodes = function retrieveNodes2() {
              var _getIteratorNode = _this5.getIteratorNode(itr);
              prevNode = _getIteratorNode.prevNode;
              node = _getIteratorNode.node;
              return node;
            };
            while (retrieveNodes()) {
              if (this.iframes) {
                this.forEachIframe(ctx, function(currIfr) {
                  return _this5.checkIframeFilter(node, prevNode, currIfr, ifr);
                }, function(con) {
                  _this5.createInstanceOnIframe(con).forEachNode(whatToShow, function(ifrNode) {
                    return elements.push(ifrNode);
                  }, filterCb);
                });
              }
              elements.push(node);
            }
            elements.forEach(function(node2) {
              eachCb(node2);
            });
            if (this.iframes) {
              this.handleOpenIframes(ifr, whatToShow, eachCb, filterCb);
            }
            doneCb();
          }
        }, {
          key: "forEachNode",
          value: function forEachNode(whatToShow, each, filter) {
            var _this6 = this;
            var done = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : function() {
            };
            var contexts = this.getContexts();
            var open = contexts.length;
            if (!open) {
              done();
            }
            contexts.forEach(function(ctx) {
              var ready = function ready2() {
                _this6.iterateThroughNodes(whatToShow, ctx, each, filter, function() {
                  if (--open <= 0) {
                    done();
                  }
                });
              };
              if (_this6.iframes) {
                _this6.waitForIframes(ctx, ready);
              } else {
                ready();
              }
            });
          }
        }], [{
          key: "matches",
          value: function matches(element, selector) {
            var selectors = typeof selector === "string" ? [selector] : selector, fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
            if (fn) {
              var match = false;
              selectors.every(function(sel) {
                if (fn.call(element, sel)) {
                  match = true;
                  return false;
                }
                return true;
              });
              return match;
            } else {
              return false;
            }
          }
        }]);
        return DOMIterator2;
      })();
      var Mark$1 = (function() {
        function Mark3(ctx) {
          classCallCheck(this, Mark3);
          this.ctx = ctx;
          this.ie = false;
          var ua = window.navigator.userAgent;
          if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
            this.ie = true;
          }
        }
        createClass(Mark3, [{
          key: "log",
          value: function log(msg) {
            var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "debug";
            var log2 = this.opt.log;
            if (!this.opt.debug) {
              return;
            }
            if ((typeof log2 === "undefined" ? "undefined" : _typeof(log2)) === "object" && typeof log2[level] === "function") {
              log2[level]("mark.js: " + msg);
            }
          }
        }, {
          key: "escapeStr",
          value: function escapeStr(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          }
        }, {
          key: "createRegExp",
          value: function createRegExp(str) {
            if (this.opt.wildcards !== "disabled") {
              str = this.setupWildcardsRegExp(str);
            }
            str = this.escapeStr(str);
            if (Object.keys(this.opt.synonyms).length) {
              str = this.createSynonymsRegExp(str);
            }
            if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
              str = this.setupIgnoreJoinersRegExp(str);
            }
            if (this.opt.diacritics) {
              str = this.createDiacriticsRegExp(str);
            }
            str = this.createMergedBlanksRegExp(str);
            if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
              str = this.createJoinersRegExp(str);
            }
            if (this.opt.wildcards !== "disabled") {
              str = this.createWildcardsRegExp(str);
            }
            str = this.createAccuracyRegExp(str);
            return str;
          }
        }, {
          key: "createSynonymsRegExp",
          value: function createSynonymsRegExp(str) {
            var syn = this.opt.synonyms, sens = this.opt.caseSensitive ? "" : "i", joinerPlaceholder = this.opt.ignoreJoiners || this.opt.ignorePunctuation.length ? "\0" : "";
            for (var index in syn) {
              if (syn.hasOwnProperty(index)) {
                var value = syn[index], k1 = this.opt.wildcards !== "disabled" ? this.setupWildcardsRegExp(index) : this.escapeStr(index), k2 = this.opt.wildcards !== "disabled" ? this.setupWildcardsRegExp(value) : this.escapeStr(value);
                if (k1 !== "" && k2 !== "") {
                  str = str.replace(new RegExp("(" + this.escapeStr(k1) + "|" + this.escapeStr(k2) + ")", "gm" + sens), joinerPlaceholder + ("(" + this.processSynomyms(k1) + "|") + (this.processSynomyms(k2) + ")") + joinerPlaceholder);
                }
              }
            }
            return str;
          }
        }, {
          key: "processSynomyms",
          value: function processSynomyms(str) {
            if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
              str = this.setupIgnoreJoinersRegExp(str);
            }
            return str;
          }
        }, {
          key: "setupWildcardsRegExp",
          value: function setupWildcardsRegExp(str) {
            str = str.replace(/(?:\\)*\?/g, function(val) {
              return val.charAt(0) === "\\" ? "?" : "";
            });
            return str.replace(/(?:\\)*\*/g, function(val) {
              return val.charAt(0) === "\\" ? "*" : "";
            });
          }
        }, {
          key: "createWildcardsRegExp",
          value: function createWildcardsRegExp(str) {
            var spaces = this.opt.wildcards === "withSpaces";
            return str.replace(/\u0001/g, spaces ? "[\\S\\s]?" : "\\S?").replace(/\u0002/g, spaces ? "[\\S\\s]*?" : "\\S*");
          }
        }, {
          key: "setupIgnoreJoinersRegExp",
          value: function setupIgnoreJoinersRegExp(str) {
            return str.replace(/[^(|)\\]/g, function(val, indx, original) {
              var nextChar = original.charAt(indx + 1);
              if (/[(|)\\]/.test(nextChar) || nextChar === "") {
                return val;
              } else {
                return val + "\0";
              }
            });
          }
        }, {
          key: "createJoinersRegExp",
          value: function createJoinersRegExp(str) {
            var joiner = [];
            var ignorePunctuation = this.opt.ignorePunctuation;
            if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
              joiner.push(this.escapeStr(ignorePunctuation.join("")));
            }
            if (this.opt.ignoreJoiners) {
              joiner.push("\\u00ad\\u200b\\u200c\\u200d");
            }
            return joiner.length ? str.split(/\u0000+/).join("[" + joiner.join("") + "]*") : str;
          }
        }, {
          key: "createDiacriticsRegExp",
          value: function createDiacriticsRegExp(str) {
            var sens = this.opt.caseSensitive ? "" : "i", dct = this.opt.caseSensitive ? ["a\xE0\xE1\u1EA3\xE3\u1EA1\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD\xE4\xE5\u0101\u0105", "A\xC0\xC1\u1EA2\xC3\u1EA0\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC\xC4\xC5\u0100\u0104", "c\xE7\u0107\u010D", "C\xC7\u0106\u010C", "d\u0111\u010F", "D\u0110\u010E", "e\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\xEB\u011B\u0113\u0119", "E\xC8\xC9\u1EBA\u1EBC\u1EB8\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6\xCB\u011A\u0112\u0118", "i\xEC\xED\u1EC9\u0129\u1ECB\xEE\xEF\u012B", "I\xCC\xCD\u1EC8\u0128\u1ECA\xCE\xCF\u012A", "l\u0142", "L\u0141", "n\xF1\u0148\u0144", "N\xD1\u0147\u0143", "o\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9\u01A1\u1EDF\u1EE1\u1EDB\u1EDD\u1EE3\xF6\xF8\u014D", "O\xD2\xD3\u1ECE\xD5\u1ECC\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8\u01A0\u1EDE\u1EE0\u1EDA\u1EDC\u1EE2\xD6\xD8\u014C", "r\u0159", "R\u0158", "s\u0161\u015B\u0219\u015F", "S\u0160\u015A\u0218\u015E", "t\u0165\u021B\u0163", "T\u0164\u021A\u0162", "u\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1\xFB\xFC\u016F\u016B", "U\xD9\xDA\u1EE6\u0168\u1EE4\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0\xDB\xDC\u016E\u016A", "y\xFD\u1EF3\u1EF7\u1EF9\u1EF5\xFF", "Y\xDD\u1EF2\u1EF6\u1EF8\u1EF4\u0178", "z\u017E\u017C\u017A", "Z\u017D\u017B\u0179"] : ["a\xE0\xE1\u1EA3\xE3\u1EA1\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD\xE4\xE5\u0101\u0105A\xC0\xC1\u1EA2\xC3\u1EA0\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC\xC4\xC5\u0100\u0104", "c\xE7\u0107\u010DC\xC7\u0106\u010C", "d\u0111\u010FD\u0110\u010E", "e\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\xEB\u011B\u0113\u0119E\xC8\xC9\u1EBA\u1EBC\u1EB8\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6\xCB\u011A\u0112\u0118", "i\xEC\xED\u1EC9\u0129\u1ECB\xEE\xEF\u012BI\xCC\xCD\u1EC8\u0128\u1ECA\xCE\xCF\u012A", "l\u0142L\u0141", "n\xF1\u0148\u0144N\xD1\u0147\u0143", "o\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9\u01A1\u1EDF\u1EE1\u1EDB\u1EDD\u1EE3\xF6\xF8\u014DO\xD2\xD3\u1ECE\xD5\u1ECC\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8\u01A0\u1EDE\u1EE0\u1EDA\u1EDC\u1EE2\xD6\xD8\u014C", "r\u0159R\u0158", "s\u0161\u015B\u0219\u015FS\u0160\u015A\u0218\u015E", "t\u0165\u021B\u0163T\u0164\u021A\u0162", "u\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1\xFB\xFC\u016F\u016BU\xD9\xDA\u1EE6\u0168\u1EE4\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0\xDB\xDC\u016E\u016A", "y\xFD\u1EF3\u1EF7\u1EF9\u1EF5\xFFY\xDD\u1EF2\u1EF6\u1EF8\u1EF4\u0178", "z\u017E\u017C\u017AZ\u017D\u017B\u0179"];
            var handled = [];
            str.split("").forEach(function(ch) {
              dct.every(function(dct2) {
                if (dct2.indexOf(ch) !== -1) {
                  if (handled.indexOf(dct2) > -1) {
                    return false;
                  }
                  str = str.replace(new RegExp("[" + dct2 + "]", "gm" + sens), "[" + dct2 + "]");
                  handled.push(dct2);
                }
                return true;
              });
            });
            return str;
          }
        }, {
          key: "createMergedBlanksRegExp",
          value: function createMergedBlanksRegExp(str) {
            return str.replace(/[\s]+/gmi, "[\\s]+");
          }
        }, {
          key: "createAccuracyRegExp",
          value: function createAccuracyRegExp(str) {
            var _this = this;
            var chars = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\xA1\xBF";
            var acc = this.opt.accuracy, val = typeof acc === "string" ? acc : acc.value, ls = typeof acc === "string" ? [] : acc.limiters, lsJoin = "";
            ls.forEach(function(limiter) {
              lsJoin += "|" + _this.escapeStr(limiter);
            });
            switch (val) {
              case "partially":
              default:
                return "()(" + str + ")";
              case "complementary":
                lsJoin = "\\s" + (lsJoin ? lsJoin : this.escapeStr(chars));
                return "()([^" + lsJoin + "]*" + str + "[^" + lsJoin + "]*)";
              case "exactly":
                return "(^|\\s" + lsJoin + ")(" + str + ")(?=$|\\s" + lsJoin + ")";
            }
          }
        }, {
          key: "getSeparatedKeywords",
          value: function getSeparatedKeywords(sv) {
            var _this2 = this;
            var stack = [];
            sv.forEach(function(kw) {
              if (!_this2.opt.separateWordSearch) {
                if (kw.trim() && stack.indexOf(kw) === -1) {
                  stack.push(kw);
                }
              } else {
                kw.split(" ").forEach(function(kwSplitted) {
                  if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
                    stack.push(kwSplitted);
                  }
                });
              }
            });
            return {
              "keywords": stack.sort(function(a, b) {
                return b.length - a.length;
              }),
              "length": stack.length
            };
          }
        }, {
          key: "isNumeric",
          value: function isNumeric(value) {
            return Number(parseFloat(value)) == value;
          }
        }, {
          key: "checkRanges",
          value: function checkRanges(array) {
            var _this3 = this;
            if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== "[object Object]") {
              this.log("markRanges() will only accept an array of objects");
              this.opt.noMatch(array);
              return [];
            }
            var stack = [];
            var last = 0;
            array.sort(function(a, b) {
              return a.start - b.start;
            }).forEach(function(item) {
              var _callNoMatchOnInvalid = _this3.callNoMatchOnInvalidRanges(item, last), start = _callNoMatchOnInvalid.start, end = _callNoMatchOnInvalid.end, valid = _callNoMatchOnInvalid.valid;
              if (valid) {
                item.start = start;
                item.length = end - start;
                stack.push(item);
                last = end;
              }
            });
            return stack;
          }
        }, {
          key: "callNoMatchOnInvalidRanges",
          value: function callNoMatchOnInvalidRanges(range, last) {
            var start = void 0, end = void 0, valid = false;
            if (range && typeof range.start !== "undefined") {
              start = parseInt(range.start, 10);
              end = start + parseInt(range.length, 10);
              if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
                valid = true;
              } else {
                this.log("Ignoring invalid or overlapping range: " + ("" + JSON.stringify(range)));
                this.opt.noMatch(range);
              }
            } else {
              this.log("Ignoring invalid range: " + JSON.stringify(range));
              this.opt.noMatch(range);
            }
            return {
              start,
              end,
              valid
            };
          }
        }, {
          key: "checkWhitespaceRanges",
          value: function checkWhitespaceRanges(range, originalLength, string) {
            var end = void 0, valid = true, max = string.length, offset = originalLength - max, start = parseInt(range.start, 10) - offset;
            start = start > max ? max : start;
            end = start + parseInt(range.length, 10);
            if (end > max) {
              end = max;
              this.log("End range automatically set to the max value of " + max);
            }
            if (start < 0 || end - start < 0 || start > max || end > max) {
              valid = false;
              this.log("Invalid range: " + JSON.stringify(range));
              this.opt.noMatch(range);
            } else if (string.substring(start, end).replace(/\s+/g, "") === "") {
              valid = false;
              this.log("Skipping whitespace only range: " + JSON.stringify(range));
              this.opt.noMatch(range);
            }
            return {
              start,
              end,
              valid
            };
          }
        }, {
          key: "getTextNodes",
          value: function getTextNodes(cb) {
            var _this4 = this;
            var val = "", nodes = [];
            this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function(node) {
              nodes.push({
                start: val.length,
                end: (val += node.textContent).length,
                node
              });
            }, function(node) {
              if (_this4.matchesExclude(node.parentNode)) {
                return NodeFilter.FILTER_REJECT;
              } else {
                return NodeFilter.FILTER_ACCEPT;
              }
            }, function() {
              cb({
                value: val,
                nodes
              });
            });
          }
        }, {
          key: "matchesExclude",
          value: function matchesExclude(el) {
            return DOMIterator.matches(el, this.opt.exclude.concat(["script", "style", "title", "head", "html"]));
          }
        }, {
          key: "wrapRangeInTextNode",
          value: function wrapRangeInTextNode(node, start, end) {
            var hEl = !this.opt.element ? "mark" : this.opt.element, startNode = node.splitText(start), ret = startNode.splitText(end - start);
            var repl = document.createElement(hEl);
            repl.setAttribute("data-markjs", "true");
            if (this.opt.className) {
              repl.setAttribute("class", this.opt.className);
            }
            repl.textContent = startNode.textContent;
            startNode.parentNode.replaceChild(repl, startNode);
            return ret;
          }
        }, {
          key: "wrapRangeInMappedTextNode",
          value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
            var _this5 = this;
            dict.nodes.every(function(n, i) {
              var sibl = dict.nodes[i + 1];
              if (typeof sibl === "undefined" || sibl.start > start) {
                if (!filterCb(n.node)) {
                  return false;
                }
                var s = start - n.start, e = (end > n.end ? n.end : end) - n.start, startStr = dict.value.substr(0, n.start), endStr = dict.value.substr(e + n.start);
                n.node = _this5.wrapRangeInTextNode(n.node, s, e);
                dict.value = startStr + endStr;
                dict.nodes.forEach(function(k, j) {
                  if (j >= i) {
                    if (dict.nodes[j].start > 0 && j !== i) {
                      dict.nodes[j].start -= e;
                    }
                    dict.nodes[j].end -= e;
                  }
                });
                end -= e;
                eachCb(n.node.previousSibling, n.start);
                if (end > n.end) {
                  start = n.end;
                } else {
                  return false;
                }
              }
              return true;
            });
          }
        }, {
          key: "wrapMatches",
          value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
            var _this6 = this;
            var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
            this.getTextNodes(function(dict) {
              dict.nodes.forEach(function(node) {
                node = node.node;
                var match = void 0;
                while ((match = regex.exec(node.textContent)) !== null && match[matchIdx] !== "") {
                  if (!filterCb(match[matchIdx], node)) {
                    continue;
                  }
                  var pos = match.index;
                  if (matchIdx !== 0) {
                    for (var i = 1; i < matchIdx; i++) {
                      pos += match[i].length;
                    }
                  }
                  node = _this6.wrapRangeInTextNode(node, pos, pos + match[matchIdx].length);
                  eachCb(node.previousSibling);
                  regex.lastIndex = 0;
                }
              });
              endCb();
            });
          }
        }, {
          key: "wrapMatchesAcrossElements",
          value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
            var _this7 = this;
            var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
            this.getTextNodes(function(dict) {
              var match = void 0;
              while ((match = regex.exec(dict.value)) !== null && match[matchIdx] !== "") {
                var start = match.index;
                if (matchIdx !== 0) {
                  for (var i = 1; i < matchIdx; i++) {
                    start += match[i].length;
                  }
                }
                var end = start + match[matchIdx].length;
                _this7.wrapRangeInMappedTextNode(dict, start, end, function(node) {
                  return filterCb(match[matchIdx], node);
                }, function(node, lastIndex) {
                  regex.lastIndex = lastIndex;
                  eachCb(node);
                });
              }
              endCb();
            });
          }
        }, {
          key: "wrapRangeFromIndex",
          value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
            var _this8 = this;
            this.getTextNodes(function(dict) {
              var originalLength = dict.value.length;
              ranges.forEach(function(range, counter) {
                var _checkWhitespaceRange = _this8.checkWhitespaceRanges(range, originalLength, dict.value), start = _checkWhitespaceRange.start, end = _checkWhitespaceRange.end, valid = _checkWhitespaceRange.valid;
                if (valid) {
                  _this8.wrapRangeInMappedTextNode(dict, start, end, function(node) {
                    return filterCb(node, range, dict.value.substring(start, end), counter);
                  }, function(node) {
                    eachCb(node, range);
                  });
                }
              });
              endCb();
            });
          }
        }, {
          key: "unwrapMatches",
          value: function unwrapMatches(node) {
            var parent = node.parentNode;
            var docFrag = document.createDocumentFragment();
            while (node.firstChild) {
              docFrag.appendChild(node.removeChild(node.firstChild));
            }
            parent.replaceChild(docFrag, node);
            if (!this.ie) {
              parent.normalize();
            } else {
              this.normalizeTextNode(parent);
            }
          }
        }, {
          key: "normalizeTextNode",
          value: function normalizeTextNode(node) {
            if (!node) {
              return;
            }
            if (node.nodeType === 3) {
              while (node.nextSibling && node.nextSibling.nodeType === 3) {
                node.nodeValue += node.nextSibling.nodeValue;
                node.parentNode.removeChild(node.nextSibling);
              }
            } else {
              this.normalizeTextNode(node.firstChild);
            }
            this.normalizeTextNode(node.nextSibling);
          }
        }, {
          key: "markRegExp",
          value: function markRegExp(regexp, opt) {
            var _this9 = this;
            this.opt = opt;
            this.log('Searching with expression "' + regexp + '"');
            var totalMatches = 0, fn = "wrapMatches";
            var eachCb = function eachCb2(element) {
              totalMatches++;
              _this9.opt.each(element);
            };
            if (this.opt.acrossElements) {
              fn = "wrapMatchesAcrossElements";
            }
            this[fn](regexp, this.opt.ignoreGroups, function(match, node) {
              return _this9.opt.filter(node, match, totalMatches);
            }, eachCb, function() {
              if (totalMatches === 0) {
                _this9.opt.noMatch(regexp);
              }
              _this9.opt.done(totalMatches);
            });
          }
        }, {
          key: "mark",
          value: function mark(sv, opt) {
            var _this10 = this;
            this.opt = opt;
            var totalMatches = 0, fn = "wrapMatches";
            var _getSeparatedKeywords = this.getSeparatedKeywords(typeof sv === "string" ? [sv] : sv), kwArr = _getSeparatedKeywords.keywords, kwArrLen = _getSeparatedKeywords.length, sens = this.opt.caseSensitive ? "" : "i", handler = function handler2(kw) {
              var regex = new RegExp(_this10.createRegExp(kw), "gm" + sens), matches = 0;
              _this10.log('Searching with expression "' + regex + '"');
              _this10[fn](regex, 1, function(term, node) {
                return _this10.opt.filter(node, kw, totalMatches, matches);
              }, function(element) {
                matches++;
                totalMatches++;
                _this10.opt.each(element);
              }, function() {
                if (matches === 0) {
                  _this10.opt.noMatch(kw);
                }
                if (kwArr[kwArrLen - 1] === kw) {
                  _this10.opt.done(totalMatches);
                } else {
                  handler2(kwArr[kwArr.indexOf(kw) + 1]);
                }
              });
            };
            if (this.opt.acrossElements) {
              fn = "wrapMatchesAcrossElements";
            }
            if (kwArrLen === 0) {
              this.opt.done(totalMatches);
            } else {
              handler(kwArr[0]);
            }
          }
        }, {
          key: "markRanges",
          value: function markRanges(rawRanges, opt) {
            var _this11 = this;
            this.opt = opt;
            var totalMatches = 0, ranges = this.checkRanges(rawRanges);
            if (ranges && ranges.length) {
              this.log("Starting to mark with the following ranges: " + JSON.stringify(ranges));
              this.wrapRangeFromIndex(ranges, function(node, range, match, counter) {
                return _this11.opt.filter(node, range, match, counter);
              }, function(element, range) {
                totalMatches++;
                _this11.opt.each(element, range);
              }, function() {
                _this11.opt.done(totalMatches);
              });
            } else {
              this.opt.done(totalMatches);
            }
          }
        }, {
          key: "unmark",
          value: function unmark(opt) {
            var _this12 = this;
            this.opt = opt;
            var sel = this.opt.element ? this.opt.element : "*";
            sel += "[data-markjs]";
            if (this.opt.className) {
              sel += "." + this.opt.className;
            }
            this.log('Removal selector "' + sel + '"');
            this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function(node) {
              _this12.unwrapMatches(node);
            }, function(node) {
              var matchesSel = DOMIterator.matches(node, sel), matchesExclude = _this12.matchesExclude(node);
              if (!matchesSel || matchesExclude) {
                return NodeFilter.FILTER_REJECT;
              } else {
                return NodeFilter.FILTER_ACCEPT;
              }
            }, this.opt.done);
          }
        }, {
          key: "opt",
          set: function set$$1(val) {
            this._opt = _extends({}, {
              "element": "",
              "className": "",
              "exclude": [],
              "iframes": false,
              "iframesTimeout": 5e3,
              "separateWordSearch": true,
              "diacritics": true,
              "synonyms": {},
              "accuracy": "partially",
              "acrossElements": false,
              "caseSensitive": false,
              "ignoreJoiners": false,
              "ignoreGroups": 0,
              "ignorePunctuation": [],
              "wildcards": "disabled",
              "each": function each() {
              },
              "noMatch": function noMatch() {
              },
              "filter": function filter() {
                return true;
              },
              "done": function done() {
              },
              "debug": false,
              "log": window.console
            }, val);
          },
          get: function get$$1() {
            return this._opt;
          }
        }, {
          key: "iterator",
          get: function get$$1() {
            return new DOMIterator(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout);
          }
        }]);
        return Mark3;
      })();
      function Mark2(ctx) {
        var _this = this;
        var instance = new Mark$1(ctx);
        this.mark = function(sv, opt) {
          instance.mark(sv, opt);
          return _this;
        };
        this.markRegExp = function(sv, opt) {
          instance.markRegExp(sv, opt);
          return _this;
        };
        this.markRanges = function(sv, opt) {
          instance.markRanges(sv, opt);
          return _this;
        };
        this.unmark = function(opt) {
          instance.unmark(opt);
          return _this;
        };
        return this;
      }
      return Mark2;
    }));
  }
});

// lib/highlight.ts
var import_mark = __toESM(require_mark(), 1);
var PagefindHighlight = class {
  constructor(options = {
    markContext: null,
    highlightParam: "pagefind-highlight",
    markOptions: {
      className: "pagefind-highlight",
      exclude: ["[data-pagefind-ignore]", "[data-pagefind-ignore] *"]
    },
    addStyles: true
  }) {
    __publicField(this, "highlightParam");
    __publicField(this, "markContext");
    __publicField(this, "markOptions");
    __publicField(this, "addStyles");
    var _a, _b;
    const { highlightParam, markContext, markOptions, addStyles } = options;
    this.highlightParam = highlightParam ?? "pagefind-highlight";
    this.addStyles = addStyles ?? true;
    this.markContext = markContext !== void 0 ? markContext : null;
    this.markOptions = markOptions !== void 0 ? markOptions : {
      className: "pagefind-highlight",
      exclude: ["[data-pagefind-ignore]", "[data-pagefind-ignore] *"]
    };
    (_a = this.markOptions).className ?? (_a.className = "pagefind__highlight");
    (_b = this.markOptions).exclude ?? (_b.exclude = [
      "[data-pagefind-ignore]",
      "[data-pagefind-ignore] *"
    ]);
    this.markOptions.separateWordSearch = false;
    this.highlight();
  }
  getHighlightParams(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.getAll(paramName);
  }
  // Inline styles might be too hard to override
  addHighlightStyles(className) {
    if (!className) return;
    const styleElement = document.createElement("style");
    styleElement.innerText = `:where(.${className}) { background-color: yellow; color: black; }`;
    document.head.appendChild(styleElement);
  }
  createMarkInstance() {
    if (this.markContext) {
      return new import_mark.default(this.markContext);
    }
    const pagefindBody = document.querySelectorAll("[data-pagefind-body]");
    if (pagefindBody.length !== 0) {
      return new import_mark.default(pagefindBody);
    } else {
      return new import_mark.default(document.body);
    }
  }
  markText(instance, text) {
    instance.mark(text, this.markOptions);
  }
  highlight() {
    const params = this.getHighlightParams(this.highlightParam);
    if (!params || params.length === 0) return;
    this.addStyles && this.addHighlightStyles(this.markOptions.className);
    const markInstance = this.createMarkInstance();
    this.markText(markInstance, params);
  }
};
window.PagefindHighlight = PagefindHighlight;
export {
  PagefindHighlight as default
};
/*! Bundled license information:

mark.js/dist/mark.js:
  (*!***************************************************
  * mark.js v8.11.1
  * https://markjs.io/
  * Copyright (c) 2014–2018, Julian Kühnel
  * Released under the MIT license https://git.io/vwTVl
  *****************************************************)
*/
