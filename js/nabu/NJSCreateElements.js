/**
 * Library for creating elements based on provided data.
 */
export class ElementCreator {
    /**
     * Create elements based on the provided data and append them to the parent element.
     * @param {Object} data - The data describing the elements to be created.
     * @param {HTMLElement} parentElement - The parent element to append the created elements to.
     */
    static createElements(data, parentElement) {
      for (const key in data) {
        const element = document.createElement(key);
  
        for (const key2 in data[key]) {
          if (typeof data[key][key2] === 'object') {
            switch (key2) {
              case 'child':
                for (const nChild in data[key][key2]) {
                  ElementCreator.createElements(data[key][key2][nChild], element);
                }
                break;
              case 'style':
                ElementCreator.setStyles(data[key][key2], element);
                break;
              default:
                break;
            }
          } else {
            ElementCreator.setAttributes(key2, data[key], element);
          }
        }
        parentElement.appendChild(element);
      }
    }
  
    /**
     * Set attributes to the given element based on the provided data.
     * @param {string} key - The key for the attribute.
     * @param {Object} attributes - The attributes data.
     * @param {HTMLElement} element - The element to set the attributes to.
     */
    static setAttributes(key, attributes, element) {
      switch (key) {
        case 'style':
          ElementCreator.setStyles(attributes[key], element);
          break;
        case 'text':
          element.innerHTML = attributes[key];
          break;
        default:
          element.setAttribute(key, attributes[key]);
          break;
      }
    }
  
    /**
     * Set styles to the given element based on the provided data.
     * @param {Object} styles - The styles data.
     * @param {HTMLElement} element - The element to set the styles to.
     */
    static setStyles(styles, element) {
      const styleString = Object.keys(styles)
        .map((key) => `${key}:${styles[key]};`)
        .join('');
      element.setAttribute('style', styleString);
    }
  
    /**
     * Create child elements based on the provided data and append them to the parent element.
     * @param {Object} params - The data describing the child elements to be created.
     * @param {HTMLElement} parentElement - The parent element to append the created child elements to.
     */
    child(params, parentElement) {
      for (const key in params) {
        return ElementCreator.createElements(params[key], parentElement);
      }
    }
  
    /**
     * Set attributes to the given element based on the provided data.
     * @param {Object} attributes - The attributes data.
     * @param {HTMLElement} element - The element to set the attributes to.
     */
    static NJS_setAttributes(attributes, element) {
      for (const key in attributes) {
        if (typeof attributes[key] === 'object') {
          ElementCreator.setStyles(attributes[key], element);
        } else {
          ElementCreator.setAttributes(key, attributes, element);
        }
      }
    }
  }
  