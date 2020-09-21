/*!
  * Bootstrap data.js v5.0.0-alpha1 (https://getbootstrap.com/)
  * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Data = factory());
}(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-alpha1): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var mapData = function () {
    var storeData = {};
    var id = 1;
    return {
      set: function set(element, key, data) {
        if (typeof element.bsKey === 'undefined') {
          element.bsKey = {
            key: key,
            id: id
          };
          id++;
        }

        storeData[element.bsKey.id] = data;
      },
      get: function get(element, key) {
        if (!element || typeof element.bsKey === 'undefined') {
          return null;
        }

        var keyProperties = element.bsKey;

        if (keyProperties.key === key) {
          return storeData[keyProperties.id];
        }

        return null;
      },
      delete: function _delete(element, key) {
        if (typeof element.bsKey === 'undefined') {
          return;
        }

        var keyProperties = element.bsKey;

        if (keyProperties.key === key) {
          delete storeData[keyProperties.id];
          delete element.bsKey;
        }
      }
    };
  }();

  var Data = {
    setData: function setData(instance, key, data) {
      mapData.set(instance, key, data);
    },
    getData: function getData(instance, key) {
      return mapData.get(instance, key);
    },
    removeData: function removeData(instance, key) {
      mapData.delete(instance, key);
    }
  };

  return Data;

})));
//# sourceMappingURL=data.js.map
