#!/usr/bin/env node

var cli = require('cli');

var output_file = function (file) {
    cli.withInput(file, function (line, sep, eof) {
        if (!eof) {
            cli.output(line + sep);
        } else if (cli.args.length) {
            output_file(cli.args.shift());
        }
    });
};

if (cli.args.length) {
    output_file(cli.args.shift());
}