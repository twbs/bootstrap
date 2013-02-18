# Formidable

[![Build Status](https://secure.travis-ci.org/felixge/node-formidable.png?branch=master)](http://travis-ci.org/felixge/node-formidable)

## Purpose

A node.js module for parsing form data, especially file uploads.

## Current status

This module was developed for [Transloadit](http://transloadit.com/), a service focused on uploading
and encoding images and videos. It has been battle-tested against hundreds of GB of file uploads from
a large variety of clients and is considered production-ready.

## Features

* Fast (~500mb/sec), non-buffering multipart parser
* Automatically writing file uploads to disk
* Low memory footprint
* Graceful error handling
* Very high test coverage

## Changelog

### v1.0.9

* Emit progress when content length header parsed (Tim Koschützki)
* Fix Readme syntax due to GitHub changes (goob)
* Replace references to old 'sys' module in Readme with 'util' (Peter Sugihara)

### v1.0.8

* Strip potentially unsafe characters when using `keepExtensions: true`.
* Switch to utest / urun for testing
* Add travis build

### v1.0.7

* Remove file from package that was causing problems when installing on windows. (#102)
* Fix typos in Readme (Jason Davies).

### v1.0.6

* Do not default to the default to the field name for file uploads where
  filename="".

### v1.0.5

* Support filename="" in multipart parts
* Explain unexpected end() errors in parser better

**Note:** Starting with this version, formidable emits 'file' events for empty
file input fields. Previously those were incorrectly emitted as regular file
input fields with value = "".

### v1.0.4

* Detect a good default tmp directory regardless of platform. (#88)

### v1.0.3

* Fix problems with utf8 characters (#84) / semicolons in filenames (#58)
* Small performance improvements
* New test suite and fixture system

### v1.0.2

* Exclude node\_modules folder from git
* Implement new `'aborted'` event
* Fix files in example folder to work with recent node versions
* Make gently a devDependency

[See Commits](https://github.com/felixge/node-formidable/compare/v1.0.1...v1.0.2)

### v1.0.1

* Fix package.json to refer to proper main directory. (#68, Dean Landolt)

[See Commits](https://github.com/felixge/node-formidable/compare/v1.0.0...v1.0.1)

### v1.0.0

* Add support for multipart boundaries that are quoted strings. (Jeff Craig)

This marks the beginning of development on version 2.0 which will include
several architectural improvements.

[See Commits](https://github.com/felixge/node-formidable/compare/v0.9.11...v1.0.0)

### v0.9.11

* Emit `'progress'` event when receiving data, regardless of parsing it. (Tim Koschützki)
* Use [W3C FileAPI Draft](http://dev.w3.org/2006/webapi/FileAPI/) properties for File class

**Important:** The old property names of the File class will be removed in a
future release.

[See Commits](https://github.com/felixge/node-formidable/compare/v0.9.10...v0.9.11)

### Older releases

These releases were done before starting to maintain the above Changelog:

* [v0.9.10](https://github.com/felixge/node-formidable/compare/v0.9.9...v0.9.10)
* [v0.9.9](https://github.com/felixge/node-formidable/compare/v0.9.8...v0.9.9)
* [v0.9.8](https://github.com/felixge/node-formidable/compare/v0.9.7...v0.9.8)
* [v0.9.7](https://github.com/felixge/node-formidable/compare/v0.9.6...v0.9.7)
* [v0.9.6](https://github.com/felixge/node-formidable/compare/v0.9.5...v0.9.6)
* [v0.9.5](https://github.com/felixge/node-formidable/compare/v0.9.4...v0.9.5)
* [v0.9.4](https://github.com/felixge/node-formidable/compare/v0.9.3...v0.9.4)
* [v0.9.3](https://github.com/felixge/node-formidable/compare/v0.9.2...v0.9.3)
* [v0.9.2](https://github.com/felixge/node-formidable/compare/v0.9.1...v0.9.2)
* [v0.9.1](https://github.com/felixge/node-formidable/compare/v0.9.0...v0.9.1)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.9.0](https://github.com/felixge/node-formidable/compare/v0.8.0...v0.9.0)
* [v0.1.0](https://github.com/felixge/node-formidable/commits/v0.1.0)

## Installation

Via [npm](http://github.com/isaacs/npm):

    npm install formidable@latest

Manually:

    git clone git://github.com/felixge/node-formidable.git formidable
    vim my.js
    # var formidable = require('./formidable');

Note: Formidable requires [gently](http://github.com/felixge/node-gently) to run the unit tests, but you won't need it for just using the library.

## Example

Parse an incoming file upload.

    var formidable = require('formidable'),
        http = require('http'),

        util = require('util');

    http.createServer(function(req, res) {
      if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received upload:\n\n');
          res.end(util.inspect({fields: fields, files: files}));
        });
        return;
      }

      // show a file upload form
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
      );
    }).listen(80);

## API

### formidable.IncomingForm

__new formidable.IncomingForm()__

Creates a new incoming form.

__incomingForm.encoding = 'utf-8'__

The encoding to use for incoming form fields.

__incomingForm.uploadDir = process.env.TMP || '/tmp' || process.cwd()__

The directory for placing file uploads in. You can move them later on using
`fs.rename()`. The default directory is picked at module load time depending on
the first existing directory from those listed above.

__incomingForm.keepExtensions = false__

If you want the files written to `incomingForm.uploadDir` to include the extensions of the original files, set this property to `true`.

__incomingForm.type__

Either 'multipart' or 'urlencoded' depending on the incoming request.

__incomingForm.maxFieldsSize = 2 * 1024 * 1024__

Limits the amount of memory a field (not file) can allocate in bytes.
If this value is exceeded, an `'error'` event is emitted. The default
size is 2MB.

__incomingForm.bytesReceived__

The amount of bytes received for this form so far.

__incomingForm.bytesExpected__

The expected number of bytes in this form.

__incomingForm.parse(request, [cb])__

Parses an incoming node.js `request` containing form data. If `cb` is provided, all fields an files are collected and passed to the callback:

    incomingForm.parse(req, function(err, fields, files) {
      // ...
    });

__incomingForm.onPart(part)__

You may overwrite this method if you are interested in directly accessing the multipart stream. Doing so will disable any `'field'` / `'file'` events  processing which would occur otherwise, making you fully responsible for handling the processing.

    incomingForm.onPart = function(part) {
      part.addListener('data', function() {
        // ...
      });
    }

If you want to use formidable to only handle certain parts for you, you can do so:

    incomingForm.onPart = function(part) {
      if (!part.filename) {
        // let formidable handle all non-file parts
        incomingForm.handlePart(part);
      }
    }

Check the code in this method for further inspiration.

__Event: 'progress' (bytesReceived, bytesExpected)__

Emitted after each incoming chunk of data that has been parsed. Can be used to roll your own progress bar.

__Event: 'field' (name, value)__

Emitted whenever a field / value pair has been received.

__Event: 'fileBegin' (name, file)__

Emitted whenever a new file is detected in the upload stream. Use this even if
you want to stream the file to somewhere else while buffering the upload on
the file system.

__Event: 'file' (name, file)__

Emitted whenever a field / file pair has been received. `file` is an instance of `File`.

__Event: 'error' (err)__

Emitted when there is an error processing the incoming form. A request that experiences an error is automatically paused, you will have to manually call `request.resume()` if you want the request to continue firing `'data'` events.

__Event: 'aborted'__

Emitted when the request was aborted by the user. Right now this can be due to a 'timeout' or 'close' event on the socket. In the future there will be a separate 'timeout' event (needs a change in the node core).

__Event: 'end' ()__

Emitted when the entire request has been received, and all contained files have finished flushing to disk. This is a great place for you to send your response.

### formidable.File

__file.size = 0__

The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'` event), this property says how many bytes of the file have been written to disk yet.

__file.path = null__

The path this file is being written to. You can modify this in the `'fileBegin'` event in
case you are unhappy with the way formidable generates a temporary path for your files.

__file.name = null__

The name this file had according to the uploading client.

__file.type = null__

The mime type of this file, according to the uploading client.

__file.lastModifiedDate = null__

A date object (or `null`) containing the time this file was last written to. Mostly
here for compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).

## License

Formidable is licensed under the MIT license.

## Ports

* [multipart-parser](http://github.com/FooBarWidget/multipart-parser): a C++ parser based on formidable

## Credits

* [Ryan Dahl](http://twitter.com/ryah) for his work on [http-parser](http://github.com/ry/http-parser) which heavily inspired multipart_parser.js
