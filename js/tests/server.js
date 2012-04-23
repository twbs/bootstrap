/*
 * Simple connect server for phantom.js
 * Adapted from Modernizr
 */

var connect = require('connect')
  , args = process.argv.slice(2)
  , fs = require('fs')
  , folder = '/../../'
  , port = '3000'

var server = connect.createServer(
    connect.static(__dirname + folder)
).listen(port)

fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8')

console.log("Server started on port %s in %s", port, folder)