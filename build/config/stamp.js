module.exports = {
  banner: '/*!\n' +
    ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
    ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' +
    ' */\n',
  jqueryCheck: 'if (typeof jQuery === \'undefined\') {\n' +
    '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\\'s JavaScript.\')\n' +
    '}\n',
  jqueryVersionCheck: '+function ($) {\n' +
    '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n' +
    '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {\n' +
    '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0\')\n' +
    '  }\n' +
    '}(jQuery);\n\n',
}
