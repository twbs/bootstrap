// file2.js

/**
 * Class representing NABU.
 */
class NABU {
    /**
     * Inserts the provided dataCode into the head element.
     * @param {Array} dataCode - The data code to be inserted.
     * @param {Object} attributes - The attributes to be added to the parent element.
     * @returns {void}
     */
    static head(dataCode, attributes='') {
        const parentElement = document.head;
        NABU.import(dataCode, parentElement, 'create')
    }
  
    /**
     * Inserts the provided dataCode into the body element.
     * @param {Array} dataCode - The data code to be inserted.
     * @param {Object} attributes - The attributes to be added to the parent element.
     * @returns {void}
     */
    static body(dataCode, attributes) {
        const parentElement = document.body;
        if (attributes !== '') {
            NABU.import(attributes, parentElement, 'attributes');
        }
        NABU.import(dataCode, parentElement, 'create')
    }
  
    /**
     * Handles the pages based on the fragment.
     * @param {Object} dataPages - The data for the pages.
     * @returns {void}
     */
    static pages(dataPages) {
        var fragment = window.location.hash.substr(1);
        if (fragment === '') {
            this.importPages(dataPages, 'home')
        } else {
            const valueCh = dataPages[fragment] ? dataPages[fragment][0] : 'null';
            if (valueCh !== 'null') {
                this.importPages(dataPages, fragment);
            } else {
                const valueError = dataPages['page404'] ? dataPages['page404'][0] : 'null';
                if (valueError !== 'null') {
                    console.log('1---');
                    this.importPages(dataPages, 'page404');
                } else {
                    console.log('2---');
                    this.importPages({ page404: ['./404.js', 'page404'] }, 'page404');
                }
            }

        }
    }
  
    /**
     * Imports the specified page based on the fragment.
     * @param {Object} dataPages - The data for the pages.
     * @param {string} fragment - The fragment value.
     * @returns {void}
     */
    static importPages(dataPages, fragment) {
        for (const key in dataPages) {
            if (key === fragment) {
                var path = dataPages[key][0];
                var nameFun = dataPages[key][1];
                import(path).then(module => {
                    for (const key in module) {
                        if (nameFun === key) {
                            module[key]();
                        } else {
                            console.log(nameFun, 'This function not found...!');
                        }
                    }
                });

            }
        }
    }
  
    /**
     * Retrieves the data from the specified module and function.
     * @param {string} path - The path to the module.
     * @param {string} nameFun - The name of the function.
     * @returns {Promise} - A promise that resolves to the retrieved data.
     */
    static async getFiler(path, nameFun) {
        const module = await import(path);
        return module[nameFun]();
    }
  
    /**
     * Returns the provided data.
     * @param {*} data - The data to be returned.
     * @returns {*} - The provided data.
     */
    static child(data) {
      return data;
    }
  
    /**
     * Returns the provided data.
     * @param {*} data - The data to be returned.
     * @returns {*} - The provided data.
     */
    static style(data) {
      return data;
    }
  
    /**
     * Returns the provided data.
     * @param {*} data - The data to be returned.
     * @returns {*} - The provided data.
     */
    static element(data) {
      return data;
    }
  
    /**
     * Imports the NJSCreateElements module and inserts the dataCode into the parentElement.
     * @param {Array} dataCode - The data code to be inserted.
     * @param {HTMLElement} parentElement - The parent element.
     * @param {string} typeData - The type of data being inserted.
     * @returns {void}
     */
    static import(dataCode, parentElement, typeData) {
        import('./NJSCreateElements.js').then(module => {

            const MyElementCreator = module.ElementCreator;


            if (typeData === 'attributes') {
                MyElementCreator.NJS_setAttributes(dataCode, parentElement);
            } else {
                MyElementCreator.createElements(dataCode, parentElement);
            }
        });

    }
  }
  