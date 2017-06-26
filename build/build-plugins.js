const path = require('path')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')

const files = {
  Util: path.resolve(__dirname, '../js/src/util.js'),
  Alert: path.resolve(__dirname, '../js/src/alert.js'),
  Button: path.resolve(__dirname, '../js/src/button.js'),
  Carousel: path.resolve(__dirname, '../js/src/carousel.js'),
  Collapse: path.resolve(__dirname, '../js/src/collapse.js'),
  Dropdown: path.resolve(__dirname, '../js/src/dropdown.js'),
  Modal: path.resolve(__dirname, '../js/src/modal.js'),
  Popover: path.resolve(__dirname, '../js/src/popover.js'),
  Scrollspy: path.resolve(__dirname, '../js/src/scrollspy.js'),
  Tab: path.resolve(__dirname, '../js/src/tab.js'),
  Tooltip: path.resolve(__dirname, '../js/src/tooltip.js'),
  Index: path.resolve(__dirname, '../js/src/index.js')
}

const pathDest = path.resolve(__dirname, '../js/dist/')
const relativePathSrc = 'js/src/'
const relativePathDist = 'js/dist/'
const externalIndex = []

for (const plugin in files) {
  if (!Object.prototype.hasOwnProperty.call(files, plugin)) {
    continue
  }
  const file = `${plugin.toLowerCase()}.js`
  var externalArray = ['jquery', 'popper.js']
  if (files[plugin] !== files.Util) {
    externalArray.push(files.Util)
  }
  if (files[plugin] !== files.Tooltip) {
    externalArray.push(files.Tooltip)
  }
  if (files[plugin] !== files.Index) {
    externalIndex.push(files[plugin])
  }
  else {
    externalArray = externalIndex
  }
  rollup.rollup({
    entry: files[plugin],
    external: externalArray,
    plugins: [
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ],
    onwarn: function (warning) {
      // Avoid warning for Tooltip and Util imports
      if (warning.code === 'MISSING_GLOBAL_NAME') {
        return
      }
    }
  })
  .then(function (bundle) {
    bundle.write({
      dest: `${pathDest}/${file}`,
      format: 'umd',
      moduleName: plugin === 'Index' ? 'bootstrap' : plugin,
      sourceMap: true,
      globals: {
        jquery: '$',
        'popper.js': 'Popper'
      }
    })
    .then(function () {
      console.log(`${relativePathSrc}${file} -> ${relativePathDist}${file}`)
    })
  })
  .catch(console.error) // log errors
}
