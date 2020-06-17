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
        id++
      }

      storeData[element.key.id] = data
    },
    get(element, key) {
      if (!element || typeof element.key === 'undefined') {
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

const Data = {
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

export default Data
