/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const mapData = (() => {
  const storeData    = {}
  return {
    set(element, key, data) {
      let id
      if (element.key === undefined) {
        element.key = {
          key,
          id
        }
      }

      storeData[id] = data
    },
    get(element, key) {
      if (element.key === undefined || element.key !== key) {
        return null
      }
      const keyProperties = element.key
      return storeData[keyProperties.id]
    },
    delete(element, key) {
      if (element.key === undefined || element.key !== key) {
        return
      }
      const keyProperties = element.key
      delete storeData[keyProperties.id]
    }
  }
})()

const Data = {
  setData(instance, key, data) {
    mapData.set(instance, key, data)
  },
  getData(instance, key) {
    mapData.get(instance, key)
  },
  removeData(instance, key) {
    mapData.delete(instance, key)
  }
}

export default Data
