#!/usr/bin/env node

var cli = require('cli').enable('status', 'daemon');

cli.parse({
    log:   ['l', 'Enable logging'],
    port:  ['p', 'Listen on this port', 'number', 8080],
    serve: [false, 'Serve static files from PATH', 'path', './public']
});

cli.main(function (args, options) {
    var server, middleware = [];
    
    if (options.log) {
        this.debug('Enabling logging');
        middleware.push(require('creationix/log')());
    }

    this.debug('Serving files from ' + options.serve);
    middleware.push(require('creationix/static')('/', options.serve, 'index.html'));
    
    server = this.createServer(middleware).listen(options.port);
    
    this.ok('Listening on port ' + options.port);
});