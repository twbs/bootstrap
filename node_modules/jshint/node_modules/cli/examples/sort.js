#!/usr/bin/env node

var cli = require('cli');

var options = cli.parse({
    numeric: ['n', 'Compare using a numeric sort'],
    reverse: ['r', 'Reverse the results']
});

cli.withStdinLines(function (lines, newline) {
    lines.sort(!options.numeric ? null : function (a, b) {
        return parseInt(a) > parseInt(b);
    });
    if (options.reverse) {
        lines.reverse();
    }
    this.output(lines.join(newline));
});