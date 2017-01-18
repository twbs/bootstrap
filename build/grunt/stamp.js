module.exports = {
  options: {
    banner: '<%= stampConf.banner %>\n<%= stampConf.jqueryCheck %>\n<%= stampConf.jqueryVersionCheck %>\n+function () {\n',
    footer: '\n}();'
  },
  js: {
    files: {
      src: '<%= concat.js.dest %>'
    }
  }
}
