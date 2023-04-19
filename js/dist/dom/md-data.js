/*!
  * Bootstrap md-data.js v5.3.0-alpha3 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MdData = factory());
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.0-beta2): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const mapData = (() => {
    const storeData = {};
    let id = 1;
    return {
      set(element, key, data) {
        if (typeof element[key] === 'undefined') {
          element[key] = {
            key,
            id
          };
          id++;
        }
        storeData[element[key].id] = data;
      },
      get(element, key) {
        if (!element || typeof element[key] === 'undefined') {
          return null;
        }
        const keyProperties = element[key];
        if (keyProperties.key === key) {
          return storeData[keyProperties.id];
        }
        return null;
      },
      delete(element, key) {
        if (typeof element[key] === 'undefined') {
          return;
        }
        const keyProperties = element[key];
        if (keyProperties.key === key) {
          delete storeData[keyProperties.id];
          delete element[key];
        }
      }
    };
  })();
  const Data = {
    setData(instance, key, data) {
      mapData.set(instance, key, data);
    },
    getData(instance, key) {
      return mapData.get(instance, key);
    },
    removeData(instance, key) {
      mapData.delete(instance, key);
    }
  };

  return Data;

}));
//# sourceMappingURL=md-data.js.map
