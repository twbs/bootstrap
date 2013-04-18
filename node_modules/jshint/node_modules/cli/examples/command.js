#!/usr/bin/env node

var cli = require('cli');

//The second (optional) argument of cli.parse() is a command list 
//Type `./command.js --help` for usage info

//cli enables auto-completion of commands (similiar to npm), e.g. all of
//the following are equivalent and result in "Command is: install":
//    $ ./command.js install
//    $ ./command.js inst
//    $ ./command.js i

cli.parse(null, ['install', 'test', 'edit', 'remove', 'uninstall', 'ls']);

console.log('Command is: ' + cli.command);
