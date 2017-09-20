/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Data = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  const mapData = (() => {
    const storeData = {}
    let id = 1
    return {
      set(element, key, data) {
        if (typeof element.key === 'undefined') {
          element.key = {
            key,
            id
          }
        }

        storeData[id] = data
        id++
      },
      get(element, key) {
        if (typeof element === 'undefined' || typeof element.key === 'undefined') {
          return null
        }

        const keyProperties = element.key
        if (keyProperties.key === key) {
          return storeData[keyProperties.id]
        }
        return null
      },
      delete(element, key) {
        if (typeof element.key === 'undefined') {
          return
        }

        const keyProperties = element.key
        if (keyProperties.key === key) {
          delete storeData[keyProperties.id]
          delete element.key
        }
      }
    }
  })()

  return {
    setData(instance, key, data) {
      mapData.set(instance, key, data)
    },
    getData(instance, key) {
      return mapData.get(instance, key)
    },
    removeData(instance, key) {
      mapData.delete(instance, key)
    }
  }
})()

export default Data
