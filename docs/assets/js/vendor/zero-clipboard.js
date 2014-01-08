/*!
* ZeroClipboard
* The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
* Copyright (c) 2014 Jon Rohan, James M. Greene
* Licensed MIT
* http://zeroclipboard.org/
* v1.3.2
*/
(function() {
  "use strict";
  var currentElement;
  var flashState = {
    bridge: null,
    version: "0.0.0",
    disabled: null,
    outdated: null,
    ready: null
  };
  var _clipData = {};
  var clientIdCounter = 0;
  var _clientMeta = {};
  var elementIdCounter = 0;
  var _elementMeta = {};
  var _amdModuleId = null;
  var _cjsModuleId = null;
  var _swfPath = function() {
    var i, jsDir, tmpJsPath, jsPath, swfPath = "ZeroClipboard.swf";
    if (document.currentScript && (jsPath = document.currentScript.src)) {} else {
      var scripts = document.getElementsByTagName("script");
      if ("readyState" in scripts[0]) {
        for (i = scripts.length; i--; ) {
          if (scripts[i].readyState === "interactive" && (jsPath = scripts[i].src)) {
            break;
          }
        }
      } else if (document.readyState === "loading") {
        jsPath = scripts[scripts.length - 1].src;
      } else {
        for (i = scripts.length; i--; ) {
          tmpJsPath = scripts[i].src;
          if (!tmpJsPath) {
            jsDir = null;
            break;
          }
          tmpJsPath = tmpJsPath.split("#")[0].split("?")[0];
          tmpJsPath = tmpJsPath.slice(0, tmpJsPath.lastIndexOf("/") + 1);
          if (jsDir == null) {
            jsDir = tmpJsPath;
          } else if (jsDir !== tmpJsPath) {
            jsDir = null;
            break;
          }
        }
        if (jsDir !== null) {
          jsPath = jsDir;
        }
      }
    }
    if (jsPath) {
      jsPath = jsPath.split("#")[0].split("?")[0];
      swfPath = jsPath.slice(0, jsPath.lastIndexOf("/") + 1) + swfPath;
    }
    return swfPath;
  }();
  var _camelizeCssPropName = function() {
    var matcherRegex = /\-([a-z])/g, replacerFn = function(match, group) {
      return group.toUpperCase();
    };
    return function(prop) {
      return prop.replace(matcherRegex, replacerFn);
    };
  }();
  var _getStyle = function(el, prop) {
    var value, camelProp, tagName, possiblePointers, i, len;
    if (window.getComputedStyle) {
      value = window.getComputedStyle(el, null).getPropertyValue(prop);
    } else {
      camelProp = _camelizeCssPropName(prop);
      if (el.currentStyle) {
        value = el.currentStyle[camelProp];
      } else {
        value = el.style[camelProp];
      }
    }
    if (prop === "cursor") {
      if (!value || value === "auto") {
        tagName = el.tagName.toLowerCase();
        if (tagName === "a") {
          return "pointer";
        }
      }
    }
    return value;
  };
  var _elementMouseOver = function(event) {
    if (!event) {
      event = window.event;
    }
    var target;
    if (this !== window) {
      target = this;
    } else if (event.target) {
      target = event.target;
    } else if (event.srcElement) {
      target = event.srcElement;
    }
    ZeroClipboard.activate(target);
  };
  var _addEventHandler = function(element, method, func) {
    if (!element || element.nodeType !== 1) {
      return;
    }
    if (element.addEventListener) {
      element.addEventListener(method, func, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + method, func);
    }
  };
  var _removeEventHandler = function(element, method, func) {
    if (!element || element.nodeType !== 1) {
      return;
    }
    if (element.removeEventListener) {
      element.removeEventListener(method, func, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + method, func);
    }
  };
  var _addClass = function(element, value) {
    if (!element || element.nodeType !== 1) {
      return element;
    }
    if (element.classList) {
      if (!element.classList.contains(value)) {
        element.classList.add(value);
      }
      return element;
    }
    if (value && typeof value === "string") {
      var classNames = (value || "").split(/\s+/);
      if (element.nodeType === 1) {
        if (!element.className) {
          element.className = value;
        } else {
          var className = " " + element.className + " ", setClass = element.className;
          for (var c = 0, cl = classNames.length; c < cl; c++) {
            if (className.indexOf(" " + classNames[c] + " ") < 0) {
              setClass += " " + classNames[c];
            }
          }
          element.className = setClass.replace(/^\s+|\s+$/g, "");
        }
      }
    }
    return element;
  };
  var _removeClass = function(element, value) {
    if (!element || element.nodeType !== 1) {
      return element;
    }
    if (element.classList) {
      if (element.classList.contains(value)) {
        element.classList.remove(value);
      }
      return element;
    }
    if (value && typeof value === "string" || value === undefined) {
      var classNames = (value || "").split(/\s+/);
      if (element.nodeType === 1 && element.className) {
        if (value) {
          var className = (" " + element.className + " ").replace(/[\n\t]/g, " ");
          for (var c = 0, cl = classNames.length; c < cl; c++) {
            className = className.replace(" " + classNames[c] + " ", " ");
          }
          element.className = className.replace(/^\s+|\s+$/g, "");
        } else {
          element.className = "";
        }
      }
    }
    return element;
  };
  var _getZoomFactor = function() {
    var rect, physicalWidth, logicalWidth, zoomFactor = 1;
    if (typeof document.body.getBoundingClientRect === "function") {
      rect = document.body.getBoundingClientRect();
      physicalWidth = rect.right - rect.left;
      logicalWidth = document.body.offsetWidth;
      zoomFactor = Math.round(physicalWidth / logicalWidth * 100) / 100;
    }
    return zoomFactor;
  };
  var _getDOMObjectPosition = function(obj, defaultZIndex) {
    var info = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      zIndex: _getSafeZIndex(defaultZIndex) - 1
    };
    if (obj.getBoundingClientRect) {
      var rect = obj.getBoundingClientRect();
      var pageXOffset, pageYOffset, zoomFactor;
      if ("pageXOffset" in window && "pageYOffset" in window) {
        pageXOffset = window.pageXOffset;
        pageYOffset = window.pageYOffset;
      } else {
        zoomFactor = _getZoomFactor();
        pageXOffset = Math.round(document.documentElement.scrollLeft / zoomFactor);
        pageYOffset = Math.round(document.documentElement.scrollTop / zoomFactor);
      }
      var leftBorderWidth = document.documentElement.clientLeft || 0;
      var topBorderWidth = document.documentElement.clientTop || 0;
      info.left = rect.left + pageXOffset - leftBorderWidth;
      info.top = rect.top + pageYOffset - topBorderWidth;
      info.width = "width" in rect ? rect.width : rect.right - rect.left;
      info.height = "height" in rect ? rect.height : rect.bottom - rect.top;
    }
    return info;
  };
  var _cacheBust = function(path, options) {
    var cacheBust = options == null || options && options.cacheBust === true && options.useNoCache === true;
    if (cacheBust) {
      return (path.indexOf("?") === -1 ? "?" : "&") + "noCache=" + new Date().getTime();
    } else {
      return "";
    }
  };
  var _vars = function(options) {
    var i, len, domain, str = [], domains = [], trustedOriginsExpanded = [];
    if (options.trustedOrigins) {
      if (typeof options.trustedOrigins === "string") {
        domains.push(options.trustedOrigins);
      } else if (typeof options.trustedOrigins === "object" && "length" in options.trustedOrigins) {
        domains = domains.concat(options.trustedOrigins);
      }
    }
    if (options.trustedDomains) {
      if (typeof options.trustedDomains === "string") {
        domains.push(options.trustedDomains);
      } else if (typeof options.trustedDomains === "object" && "length" in options.trustedDomains) {
        domains = domains.concat(options.trustedDomains);
      }
    }
    if (domains.length) {
      for (i = 0, len = domains.length; i < len; i++) {
        if (domains.hasOwnProperty(i) && domains[i] && typeof domains[i] === "string") {
          domain = _extractDomain(domains[i]);
          if (!domain) {
            continue;
          }
          if (domain === "*") {
            trustedOriginsExpanded = [ domain ];
            break;
          }
          trustedOriginsExpanded.push.apply(trustedOriginsExpanded, [ domain, "//" + domain, window.location.protocol + "//" + domain ]);
        }
      }
    }
    if (trustedOriginsExpanded.length) {
      str.push("trustedOrigins=" + encodeURIComponent(trustedOriginsExpanded.join(",")));
    }
    if (typeof options.jsModuleId === "string" && options.jsModuleId) {
      str.push("jsModuleId=" + encodeURIComponent(options.jsModuleId));
    }
    return str.join("&");
  };
  var _inArray = function(elem, array, fromIndex) {
    if (typeof array.indexOf === "function") {
      return array.indexOf(elem, fromIndex);
    }
    var i, len = array.length;
    if (typeof fromIndex === "undefined") {
      fromIndex = 0;
    } else if (fromIndex < 0) {
      fromIndex = len + fromIndex;
    }
    for (i = fromIndex; i < len; i++) {
      if (array.hasOwnProperty(i) && array[i] === elem) {
        return i;
      }
    }
    return -1;
  };
  var _prepClip = function(elements) {
    if (typeof elements === "string") throw new TypeError("ZeroClipboard doesn't accept query strings.");
    if (!elements.length) return [ elements ];
    return elements;
  };
  var _dispatchCallback = function(func, context, args, async) {
    if (async) {
      window.setTimeout(function() {
        func.apply(context, args);
      }, 0);
    } else {
      func.apply(context, args);
    }
  };
  var _getSafeZIndex = function(val) {
    var zIndex, tmp;
    if (val) {
      if (typeof val === "number" && val > 0) {
        zIndex = val;
      } else if (typeof val === "string" && (tmp = parseInt(val, 10)) && !isNaN(tmp) && tmp > 0) {
        zIndex = tmp;
      }
    }
    if (!zIndex) {
      if (typeof _globalConfig.zIndex === "number" && _globalConfig.zIndex > 0) {
        zIndex = _globalConfig.zIndex;
      } else if (typeof _globalConfig.zIndex === "string" && (tmp = parseInt(_globalConfig.zIndex, 10)) && !isNaN(tmp) && tmp > 0) {
        zIndex = tmp;
      }
    }
    return zIndex || 0;
  };
  var _deprecationWarning = function(deprecatedApiName, debugEnabled) {
    if (deprecatedApiName && debugEnabled !== false && typeof console !== "undefined" && console && (console.warn || console.log)) {
      var deprecationWarning = "`" + deprecatedApiName + "` is deprecated. See docs for more info:\n" + "    https://github.com/zeroclipboard/zeroclipboard/blob/master/docs/instructions.md#deprecations";
      if (console.warn) {
        console.warn(deprecationWarning);
      } else {
        console.log(deprecationWarning);
      }
    }
  };
  var _extend = function() {
    var i, len, arg, prop, src, copy, target = arguments[0] || {};
    for (i = 1, len = arguments.length; i < len; i++) {
      if ((arg = arguments[i]) != null) {
        for (prop in arg) {
          if (arg.hasOwnProperty(prop)) {
            src = target[prop];
            copy = arg[prop];
            if (target === copy) {
              continue;
            }
            if (copy !== undefined) {
              target[prop] = copy;
            }
          }
        }
      }
    }
    return target;
  };
  var _extractDomain = function(originOrUrl) {
    if (originOrUrl == null || originOrUrl === "") {
      return null;
    }
    originOrUrl = originOrUrl.replace(/^\s+|\s+$/g, "");
    if (originOrUrl === "") {
      return null;
    }
    var protocolIndex = originOrUrl.indexOf("//");
    originOrUrl = protocolIndex === -1 ? originOrUrl : originOrUrl.slice(protocolIndex + 2);
    var pathIndex = originOrUrl.indexOf("/");
    originOrUrl = pathIndex === -1 ? originOrUrl : protocolIndex === -1 || pathIndex === 0 ? null : originOrUrl.slice(0, pathIndex);
    if (originOrUrl && originOrUrl.slice(-4).toLowerCase() === ".swf") {
      return null;
    }
    return originOrUrl || null;
  };
  var _determineScriptAccess = function() {
    var _extractAllDomains = function(origins, resultsArray) {
      var i, len, tmp;
      if (origins != null && resultsArray[0] !== "*") {
        if (typeof origins === "string") {
          origins = [ origins ];
        }
        if (typeof origins === "object" && "length" in origins) {
          for (i = 0, len = origins.length; i < len; i++) {
            if (origins.hasOwnProperty(i)) {
              tmp = _extractDomain(origins[i]);
              if (tmp) {
                if (tmp === "*") {
                  resultsArray.length = 0;
                  resultsArray.push("*");
                  break;
                }
                if (_inArray(tmp, resultsArray) === -1) {
                  resultsArray.push(tmp);
                }
              }
            }
          }
        }
      }
    };
    var _accessLevelLookup = {
      always: "always",
      samedomain: "sameDomain",
      never: "never"
    };
    return function(currentDomain, configOptions) {
      var asaLower, allowScriptAccess = configOptions.allowScriptAccess;
      if (typeof allowScriptAccess === "string" && (asaLower = allowScriptAccess.toLowerCase()) && /^always|samedomain|never$/.test(asaLower)) {
        return _accessLevelLookup[asaLower];
      }
      var swfDomain = _extractDomain(configOptions.moviePath);
      if (swfDomain === null) {
        swfDomain = currentDomain;
      }
      var trustedDomains = [];
      _extractAllDomains(configOptions.trustedOrigins, trustedDomains);
      _extractAllDomains(configOptions.trustedDomains, trustedDomains);
      var len = trustedDomains.length;
      if (len > 0) {
        if (len === 1 && trustedDomains[0] === "*") {
          return "always";
        }
        if (_inArray(currentDomain, trustedDomains) !== -1) {
          if (len === 1 && currentDomain === swfDomain) {
            return "sameDomain";
          }
          return "always";
        }
      }
      return "never";
    };
  }();
  var _objectKeys = function(obj) {
    if (obj == null) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    var keys = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        keys.push(prop);
      }
    }
    return keys;
  };
  var _deleteOwnProperties = function(obj) {
    if (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          delete obj[prop];
        }
      }
    }
    return obj;
  };
  var _detectFlashSupport = function() {
    var hasFlash = false;
    if (typeof flashState.disabled === "boolean") {
      hasFlash = flashState.disabled === false;
    } else {
      if (typeof ActiveXObject === "function") {
        try {
          if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
            hasFlash = true;
          }
        } catch (error) {}
      }
      if (!hasFlash && navigator.mimeTypes["application/x-shockwave-flash"]) {
        hasFlash = true;
      }
    }
    return hasFlash;
  };
  function _parseFlashVersion(flashVersion) {
    return flashVersion.replace(/,/g, ".").replace(/[^0-9\.]/g, "");
  }
  function _isFlashVersionSupported(flashVersion) {
    return parseFloat(_parseFlashVersion(flashVersion)) >= 10;
  }
  var ZeroClipboard = function(elements, options) {
    if (!(this instanceof ZeroClipboard)) {
      return new ZeroClipboard(elements, options);
    }
    this.id = "" + clientIdCounter++;
    _clientMeta[this.id] = {
      instance: this,
      elements: [],
      handlers: {}
    };
    if (elements) {
      this.clip(elements);
    }
    if (typeof options !== "undefined") {
      _deprecationWarning("new ZeroClipboard(elements, options)", _globalConfig.debug);
      ZeroClipboard.config(options);
    }
    this.options = ZeroClipboard.config();
    if (typeof flashState.disabled !== "boolean") {
      flashState.disabled = !_detectFlashSupport();
    }
    if (flashState.disabled === false && flashState.outdated !== true) {
      if (flashState.bridge === null) {
        flashState.outdated = false;
        flashState.ready = false;
        _bridge();
      }
    }
  };
  ZeroClipboard.prototype.setText = function(newText) {
    if (newText && newText !== "") {
      _clipData["text/plain"] = newText;
      if (flashState.ready === true && flashState.bridge) {
        flashState.bridge.setText(newText);
      } else {}
    }
    return this;
  };
  ZeroClipboard.prototype.setSize = function(width, height) {
    if (flashState.ready === true && flashState.bridge) {
      flashState.bridge.setSize(width, height);
    } else {}
    return this;
  };
  var _setHandCursor = function(enabled) {
    if (flashState.ready === true && flashState.bridge) {
      flashState.bridge.setHandCursor(enabled);
    } else {}
  };
  ZeroClipboard.prototype.destroy = function() {
    this.unclip();
    this.off();
    delete _clientMeta[this.id];
  };
  var _getAllClients = function() {
    var i, len, client, clients = [], clientIds = _objectKeys(_clientMeta);
    for (i = 0, len = clientIds.length; i < len; i++) {
      client = _clientMeta[clientIds[i]].instance;
      if (client && client instanceof ZeroClipboard) {
        clients.push(client);
      }
    }
    return clients;
  };
  ZeroClipboard.version = "1.3.2";
  var _globalConfig = {
    swfPath: _swfPath,
    trustedDomains: window.location.host ? [ window.location.host ] : [],
    cacheBust: true,
    forceHandCursor: false,
    zIndex: 999999999,
    debug: true,
    title: null,
    autoActivate: true
  };
  ZeroClipboard.config = function(options) {
    if (typeof options === "object" && options !== null) {
      _extend(_globalConfig, options);
    }
    if (typeof options === "string" && options) {
      if (_globalConfig.hasOwnProperty(options)) {
        return _globalConfig[options];
      }
      return;
    }
    var copy = {};
    for (var prop in _globalConfig) {
      if (_globalConfig.hasOwnProperty(prop)) {
        if (typeof _globalConfig[prop] === "object" && _globalConfig[prop] !== null) {
          if ("length" in _globalConfig[prop]) {
            copy[prop] = _globalConfig[prop].slice(0);
          } else {
            copy[prop] = _extend({}, _globalConfig[prop]);
          }
        } else {
          copy[prop] = _globalConfig[prop];
        }
      }
    }
    return copy;
  };
  ZeroClipboard.destroy = function() {
    ZeroClipboard.deactivate();
    for (var clientId in _clientMeta) {
      if (_clientMeta.hasOwnProperty(clientId) && _clientMeta[clientId]) {
        var client = _clientMeta[clientId].instance;
        if (client && typeof client.destroy === "function") {
          client.destroy();
        }
      }
    }
    var htmlBridge = _getHtmlBridge(flashState.bridge);
    if (htmlBridge && htmlBridge.parentNode) {
      htmlBridge.parentNode.removeChild(htmlBridge);
      flashState.ready = null;
      flashState.bridge = null;
    }
  };
  ZeroClipboard.activate = function(element) {
    if (currentElement) {
      _removeClass(currentElement, _globalConfig.hoverClass);
      _removeClass(currentElement, _globalConfig.activeClass);
    }
    currentElement = element;
    _addClass(element, _globalConfig.hoverClass);
    _reposition();
    var newTitle = _globalConfig.title || element.getAttribute("title");
    if (newTitle) {
      var htmlBridge = _getHtmlBridge(flashState.bridge);
      if (htmlBridge) {
        htmlBridge.setAttribute("title", newTitle);
      }
    }
    var useHandCursor = _globalConfig.forceHandCursor === true || _getStyle(element, "cursor") === "pointer";
    _setHandCursor(useHandCursor);
  };
  ZeroClipboard.deactivate = function() {
    var htmlBridge = _getHtmlBridge(flashState.bridge);
    if (htmlBridge) {
      htmlBridge.style.left = "0px";
      htmlBridge.style.top = "-9999px";
      htmlBridge.removeAttribute("title");
    }
    if (currentElement) {
      _removeClass(currentElement, _globalConfig.hoverClass);
      _removeClass(currentElement, _globalConfig.activeClass);
      currentElement = null;
    }
  };
  var _bridge = function() {
    var flashBridge, len;
    var container = document.getElementById("global-zeroclipboard-html-bridge");
    if (!container) {
      var opts = ZeroClipboard.config();
      opts.jsModuleId = typeof _amdModuleId === "string" && _amdModuleId || typeof _cjsModuleId === "string" && _cjsModuleId || null;
      var allowScriptAccess = _determineScriptAccess(window.location.host, _globalConfig);
      var flashvars = _vars(opts);
      var swfUrl = _globalConfig.moviePath + _cacheBust(_globalConfig.moviePath, _globalConfig);
      var html = '      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">         <param name="movie" value="' + swfUrl + '"/>         <param name="allowScriptAccess" value="' + allowScriptAccess + '"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="' + flashvars + '"/>         <embed src="' + swfUrl + '"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-zeroclipboard-flash-bridge"           allowScriptAccess="' + allowScriptAccess + '"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="' + flashvars + '"           scale="exactfit">         </embed>       </object>';
      container = document.createElement("div");
      container.id = "global-zeroclipboard-html-bridge";
      container.setAttribute("class", "global-zeroclipboard-container");
      container.style.position = "absolute";
      container.style.left = "0px";
      container.style.top = "-9999px";
      container.style.width = "15px";
      container.style.height = "15px";
      container.style.zIndex = "" + _getSafeZIndex(_globalConfig.zIndex);
      document.body.appendChild(container);
      container.innerHTML = html;
    }
    flashBridge = document["global-zeroclipboard-flash-bridge"];
    if (flashBridge && (len = flashBridge.length)) {
      flashBridge = flashBridge[len - 1];
    }
    flashState.bridge = flashBridge || container.children[0].lastElementChild;
  };
  var _getHtmlBridge = function(flashBridge) {
    var isFlashElement = /^OBJECT|EMBED$/;
    var htmlBridge = flashBridge && flashBridge.parentNode;
    while (htmlBridge && isFlashElement.test(htmlBridge.nodeName) && htmlBridge.parentNode) {
      htmlBridge = htmlBridge.parentNode;
    }
    return htmlBridge || null;
  };
  var _reposition = function() {
    if (currentElement) {
      var pos = _getDOMObjectPosition(currentElement, _globalConfig.zIndex);
      var htmlBridge = _getHtmlBridge(flashState.bridge);
      if (htmlBridge) {
        htmlBridge.style.top = pos.top + "px";
        htmlBridge.style.left = pos.left + "px";
        htmlBridge.style.width = pos.width + "px";
        htmlBridge.style.height = pos.height + "px";
        htmlBridge.style.zIndex = pos.zIndex + 1;
      }
      if (flashState.ready === true && flashState.bridge) {
        flashState.bridge.setSize(pos.width, pos.height);
      }
    }
    return this;
  };
  ZeroClipboard.prototype.on = function(eventName, func) {
    var i, len, events, added = {}, handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers;
    if (typeof eventName === "string" && eventName) {
      events = eventName.toLowerCase().split(/\s+/);
    } else if (typeof eventName === "object" && eventName && typeof func === "undefined") {
      for (i in eventName) {
        if (eventName.hasOwnProperty(i) && typeof i === "string" && i && typeof eventName[i] === "function") {
          this.on(i, eventName[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventName = events[i].replace(/^on/, "");
        added[eventName] = true;
        if (!handlers[eventName]) {
          handlers[eventName] = [];
        }
        handlers[eventName].push(func);
      }
      if (added.noflash && flashState.disabled) {
        _receiveEvent.call(this, "noflash", {});
      }
      if (added.wrongflash && flashState.outdated) {
        _receiveEvent.call(this, "wrongflash", {
          flashVersion: flashState.version
        });
      }
      if (added.load && flashState.ready) {
        _receiveEvent.call(this, "load", {
          flashVersion: flashState.version
        });
      }
    }
    return this;
  };
  ZeroClipboard.prototype.off = function(eventName, func) {
    var i, len, foundIndex, events, perEventHandlers, handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers;
    if (arguments.length === 0) {
      events = _objectKeys(handlers);
    } else if (typeof eventName === "string" && eventName) {
      events = eventName.split(/\s+/);
    } else if (typeof eventName === "object" && eventName && typeof func === "undefined") {
      for (i in eventName) {
        if (eventName.hasOwnProperty(i) && typeof i === "string" && i && typeof eventName[i] === "function") {
          this.off(i, eventName[i]);
        }
      }
    }
    if (events && events.length) {
      for (i = 0, len = events.length; i < len; i++) {
        eventName = events[i].toLowerCase().replace(/^on/, "");
        perEventHandlers = handlers[eventName];
        if (perEventHandlers && perEventHandlers.length) {
          if (func) {
            foundIndex = _inArray(func, perEventHandlers);
            while (foundIndex !== -1) {
              perEventHandlers.splice(foundIndex, 1);
              foundIndex = _inArray(func, perEventHandlers, foundIndex);
            }
          } else {
            handlers[eventName].length = 0;
          }
        }
      }
    }
    return this;
  };
  ZeroClipboard.prototype.handlers = function(eventName) {
    var prop, copy = null, handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers;
    if (handlers) {
      if (typeof eventName === "string" && eventName) {
        return handlers[eventName] ? handlers[eventName].slice(0) : null;
      }
      copy = {};
      for (prop in handlers) {
        if (handlers.hasOwnProperty(prop) && handlers[prop]) {
          copy[prop] = handlers[prop].slice(0);
        }
      }
    }
    return copy;
  };
  var _dispatchClientCallbacks = function(eventName, context, args, async) {
    var handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers[eventName];
    if (handlers && handlers.length) {
      var i, len, func, originalContext = context || this;
      for (i = 0, len = handlers.length; i < len; i++) {
        func = handlers[i];
        context = originalContext;
        if (typeof func === "string" && typeof window[func] === "function") {
          func = window[func];
        }
        if (typeof func === "object" && func && typeof func.handleEvent === "function") {
          context = func;
          func = func.handleEvent;
        }
        if (typeof func === "function") {
          _dispatchCallback(func, context, args, async);
        }
      }
    }
    return this;
  };
  ZeroClipboard.prototype.clip = function(elements) {
    elements = _prepClip(elements);
    for (var i = 0; i < elements.length; i++) {
      if (elements.hasOwnProperty(i) && elements[i] && elements[i].nodeType === 1) {
        if (!elements[i].zcClippingId) {
          elements[i].zcClippingId = "zcClippingId_" + elementIdCounter++;
          _elementMeta[elements[i].zcClippingId] = [ this.id ];
          if (_globalConfig.autoActivate === true) {
            _addEventHandler(elements[i], "mouseover", _elementMouseOver);
          }
        } else if (_inArray(this.id, _elementMeta[elements[i].zcClippingId]) === -1) {
          _elementMeta[elements[i].zcClippingId].push(this.id);
        }
        var clippedElements = _clientMeta[this.id].elements;
        if (_inArray(elements[i], clippedElements) === -1) {
          clippedElements.push(elements[i]);
        }
      }
    }
    return this;
  };
  ZeroClipboard.prototype.unclip = function(elements) {
    var meta = _clientMeta[this.id];
    if (meta) {
      var clippedElements = meta.elements;
      var arrayIndex;
      if (typeof elements === "undefined") {
        elements = clippedElements.slice(0);
      } else {
        elements = _prepClip(elements);
      }
      for (var i = elements.length; i--; ) {
        if (elements.hasOwnProperty(i) && elements[i] && elements[i].nodeType === 1) {
          arrayIndex = 0;
          while ((arrayIndex = _inArray(elements[i], clippedElements, arrayIndex)) !== -1) {
            clippedElements.splice(arrayIndex, 1);
          }
          var clientIds = _elementMeta[elements[i].zcClippingId];
          if (clientIds) {
            arrayIndex = 0;
            while ((arrayIndex = _inArray(this.id, clientIds, arrayIndex)) !== -1) {
              clientIds.splice(arrayIndex, 1);
            }
            if (clientIds.length === 0) {
              if (_globalConfig.autoActivate === true) {
                _removeEventHandler(elements[i], "mouseover", _elementMouseOver);
              }
              delete elements[i].zcClippingId;
            }
          }
        }
      }
    }
    return this;
  };
  ZeroClipboard.prototype.elements = function() {
    var meta = _clientMeta[this.id];
    return meta && meta.elements ? meta.elements.slice(0) : [];
  };
  var _getAllClientsClippedToElement = function(element) {
    var elementMetaId, clientIds, i, len, client, clients = [];
    if (element && element.nodeType === 1 && (elementMetaId = element.zcClippingId) && _elementMeta.hasOwnProperty(elementMetaId)) {
      clientIds = _elementMeta[elementMetaId];
      if (clientIds && clientIds.length) {
        for (i = 0, len = clientIds.length; i < len; i++) {
          client = _clientMeta[clientIds[i]].instance;
          if (client && client instanceof ZeroClipboard) {
            clients.push(client);
          }
        }
      }
    }
    return clients;
  };
  _globalConfig.hoverClass = "zeroclipboard-is-hover";
  _globalConfig.activeClass = "zeroclipboard-is-active";
  _globalConfig.trustedOrigins = null;
  _globalConfig.allowScriptAccess = null;
  _globalConfig.useNoCache = true;
  _globalConfig.moviePath = "ZeroClipboard.swf";
  ZeroClipboard.detectFlashSupport = function() {
    _deprecationWarning("ZeroClipboard.detectFlashSupport", _globalConfig.debug);
    return _detectFlashSupport();
  };
  ZeroClipboard.dispatch = function(eventName, args) {
    if (typeof eventName === "string" && eventName) {
      var cleanEventName = eventName.toLowerCase().replace(/^on/, "");
      if (cleanEventName) {
        var clients = currentElement ? _getAllClientsClippedToElement(currentElement) : _getAllClients();
        for (var i = 0, len = clients.length; i < len; i++) {
          _receiveEvent.call(clients[i], cleanEventName, args);
        }
      }
    }
  };
  ZeroClipboard.prototype.setHandCursor = function(enabled) {
    _deprecationWarning("ZeroClipboard.prototype.setHandCursor", _globalConfig.debug);
    enabled = typeof enabled === "boolean" ? enabled : !!enabled;
    _setHandCursor(enabled);
    _globalConfig.forceHandCursor = enabled;
    return this;
  };
  ZeroClipboard.prototype.reposition = function() {
    _deprecationWarning("ZeroClipboard.prototype.reposition", _globalConfig.debug);
    return _reposition();
  };
  ZeroClipboard.prototype.receiveEvent = function(eventName, args) {
    _deprecationWarning("ZeroClipboard.prototype.receiveEvent", _globalConfig.debug);
    if (typeof eventName === "string" && eventName) {
      var cleanEventName = eventName.toLowerCase().replace(/^on/, "");
      if (cleanEventName) {
        _receiveEvent.call(this, cleanEventName, args);
      }
    }
  };
  ZeroClipboard.prototype.setCurrent = function(element) {
    _deprecationWarning("ZeroClipboard.prototype.setCurrent", _globalConfig.debug);
    ZeroClipboard.activate(element);
    return this;
  };
  ZeroClipboard.prototype.resetBridge = function() {
    _deprecationWarning("ZeroClipboard.prototype.resetBridge", _globalConfig.debug);
    ZeroClipboard.deactivate();
    return this;
  };
  ZeroClipboard.prototype.setTitle = function(newTitle) {
    _deprecationWarning("ZeroClipboard.prototype.setTitle", _globalConfig.debug);
    newTitle = newTitle || _globalConfig.title || currentElement && currentElement.getAttribute("title");
    if (newTitle) {
      var htmlBridge = _getHtmlBridge(flashState.bridge);
      if (htmlBridge) {
        htmlBridge.setAttribute("title", newTitle);
      }
    }
    return this;
  };
  ZeroClipboard.setDefaults = function(options) {
    _deprecationWarning("ZeroClipboard.setDefaults", _globalConfig.debug);
    ZeroClipboard.config(options);
  };
  ZeroClipboard.prototype.addEventListener = function(eventName, func) {
    _deprecationWarning("ZeroClipboard.prototype.addEventListener", _globalConfig.debug);
    return this.on(eventName, func);
  };
  ZeroClipboard.prototype.removeEventListener = function(eventName, func) {
    _deprecationWarning("ZeroClipboard.prototype.removeEventListener", _globalConfig.debug);
    return this.off(eventName, func);
  };
  ZeroClipboard.prototype.ready = function() {
    _deprecationWarning("ZeroClipboard.prototype.ready", _globalConfig.debug);
    return flashState.ready === true;
  };
  var _receiveEvent = function(eventName, args) {
    eventName = eventName.toLowerCase().replace(/^on/, "");
    var cleanVersion = args && args.flashVersion && _parseFlashVersion(args.flashVersion) || null;
    var element = currentElement;
    var performCallbackAsync = true;
    switch (eventName) {
     case "load":
      if (cleanVersion) {
        if (!_isFlashVersionSupported(cleanVersion)) {
          _receiveEvent.call(this, "onWrongFlash", {
            flashVersion: cleanVersion
          });
          return;
        }
        flashState.outdated = false;
        flashState.ready = true;
        flashState.version = cleanVersion;
      }
      break;

     case "wrongflash":
      if (cleanVersion && !_isFlashVersionSupported(cleanVersion)) {
        flashState.outdated = true;
        flashState.ready = false;
        flashState.version = cleanVersion;
      }
      break;

     case "mouseover":
      _addClass(element, _globalConfig.hoverClass);
      break;

     case "mouseout":
      if (_globalConfig.autoActivate === true) {
        ZeroClipboard.deactivate();
      }
      break;

     case "mousedown":
      _addClass(element, _globalConfig.activeClass);
      break;

     case "mouseup":
      _removeClass(element, _globalConfig.activeClass);
      break;

     case "datarequested":
      var targetId = element.getAttribute("data-clipboard-target"), targetEl = !targetId ? null : document.getElementById(targetId);
      if (targetEl) {
        var textContent = targetEl.value || targetEl.textContent || targetEl.innerText;
        if (textContent) {
          this.setText(textContent);
        }
      } else {
        var defaultText = element.getAttribute("data-clipboard-text");
        if (defaultText) {
          this.setText(defaultText);
        }
      }
      performCallbackAsync = false;
      break;

     case "complete":
      _deleteOwnProperties(_clipData);
      break;
    }
    var context = element;
    var eventArgs = [ this, args ];
    return _dispatchClientCallbacks.call(this, eventName, context, eventArgs, performCallbackAsync);
  };
  if (typeof define === "function" && define.amd) {
    define([ "require", "exports", "module" ], function(require, exports, module) {
      _amdModuleId = module && module.id || null;
      return ZeroClipboard;
    });
  } else if (typeof module === "object" && module && typeof module.exports === "object" && module.exports) {
    _cjsModuleId = module.id || null;
    module.exports = ZeroClipboard;
  } else {
    window.ZeroClipboard = ZeroClipboard;
  }
})();