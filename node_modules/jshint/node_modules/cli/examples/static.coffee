#!/usr/bin/env coffee

cli = require 'cli'

cli.enable('daemon','status')
   .setUsage('static.coffee [OPTIONS]')

cli.parse {
    log:   ['l', 'Enable logging']
    port:  ['p', 'Listen on this port', 'number', 8080]
    serve: [false, 'Serve static files from PATH', 'path', './public']
}

middleware = []

cli.main (args, options) ->

    if options.log
        @debug 'Enabling logging'
        middleware.push require('creationix/log')()

    @debug 'Serving files from ' + options.serve
    middleware.push require('creationix/static')('/', options.serve, 'index.html')
    
    server = @createServer(middleware).listen options.port
    
    @ok 'Listening on port ' + options.port