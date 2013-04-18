if (global.GENTLY) require = GENTLY.hijack(require);

var fs = require('fs');
var util = require('./util'),
    path = require('path'),
    File = require('./file'),
    MultipartParser = require('./multipart_parser').MultipartParser,
    QuerystringParser = require('./querystring_parser').QuerystringParser,
    StringDecoder = require('string_decoder').StringDecoder,
    EventEmitter = require('events').EventEmitter;

function IncomingForm() {
  if (!(this instanceof IncomingForm)) return new IncomingForm;
  EventEmitter.call(this);

  this.error = null;
  this.ended = false;

  this.maxFieldsSize = 2 * 1024 * 1024;
  this.keepExtensions = false;
  this.uploadDir = IncomingForm.UPLOAD_DIR;
  this.encoding = 'utf-8';
  this.headers = null;
  this.type = null;

  this.bytesReceived = null;
  this.bytesExpected = null;

  this._parser = null;
  this._flushing = 0;
  this._fieldsSize = 0;
};
util.inherits(IncomingForm, EventEmitter);
exports.IncomingForm = IncomingForm;

IncomingForm.UPLOAD_DIR = (function() {
  var dirs = [process.env.TMP, '/tmp', process.cwd()];
  for (var i = 0; i < dirs.length; i++) {
    var dir = dirs[i];
    var isDirectory = false;

    try {
      isDirectory = fs.statSync(dir).isDirectory();
    } catch (e) {}

    if (isDirectory) return dir;
  }
})();

IncomingForm.prototype.parse = function(req, cb) {
  this.pause = function() {
    try {
      req.pause();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
    }
    return true;
  };

  this.resume = function() {
    try {
      req.resume();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
    }

    return true;
  };

  this.writeHeaders(req.headers);

  var self = this;
  req
    .on('error', function(err) {
      self._error(err);
    })
    .on('aborted', function() {
      self.emit('aborted');
    })
    .on('data', function(buffer) {
      self.write(buffer);
    })
    .on('end', function() {
      if (self.error) {
        return;
      }

      var err = self._parser.end();
      if (err) {
        self._error(err);
      }
    });

  if (cb) {
    var fields = {}, files = {};
    this
      .on('field', function(name, value) {
        fields[name] = value;
      })
      .on('file', function(name, file) {
        files[name] = file;
      })
      .on('error', function(err) {
        cb(err, fields, files);
      })
      .on('end', function() {
        cb(null, fields, files);
      });
  }

  return this;
};

IncomingForm.prototype.writeHeaders = function(headers) {
  this.headers = headers;
  this._parseContentLength();
  this._parseContentType();
};

IncomingForm.prototype.write = function(buffer) {
  if (!this._parser) {
    this._error(new Error('unintialized parser'));
    return;
  }

  this.bytesReceived += buffer.length;
  this.emit('progress', this.bytesReceived, this.bytesExpected);

  var bytesParsed = this._parser.write(buffer);
  if (bytesParsed !== buffer.length) {
    this._error(new Error('parser error, '+bytesParsed+' of '+buffer.length+' bytes parsed'));
  }

  return bytesParsed;
};

IncomingForm.prototype.pause = function() {
  // this does nothing, unless overwritten in IncomingForm.parse
  return false;
};

IncomingForm.prototype.resume = function() {
  // this does nothing, unless overwritten in IncomingForm.parse
  return false;
};

IncomingForm.prototype.onPart = function(part) {
  // this method can be overwritten by the user
  this.handlePart(part);
};

IncomingForm.prototype.handlePart = function(part) {
  var self = this;

  if (part.filename === undefined) {
    var value = ''
      , decoder = new StringDecoder(this.encoding);

    part.on('data', function(buffer) {
      self._fieldsSize += buffer.length;
      if (self._fieldsSize > self.maxFieldsSize) {
        self._error(new Error('maxFieldsSize exceeded, received '+self._fieldsSize+' bytes of field data'));
        return;
      }
      value += decoder.write(buffer);
    });

    part.on('end', function() {
      self.emit('field', part.name, value);
    });
    return;
  }

  this._flushing++;

  var file = new File({
    path: this._uploadPath(part.filename),
    name: part.filename,
    type: part.mime,
  });

  this.emit('fileBegin', part.name, file);

  file.open();

  part.on('data', function(buffer) {
    self.pause();
    file.write(buffer, function() {
      self.resume();
    });
  });

  part.on('end', function() {
    file.end(function() {
      self._flushing--;
      self.emit('file', part.name, file);
      self._maybeEnd();
    });
  });
};

IncomingForm.prototype._parseContentType = function() {
  if (!this.headers['content-type']) {
    this._error(new Error('bad content-type header, no content-type'));
    return;
  }

  if (this.headers['content-type'].match(/urlencoded/i)) {
    this._initUrlencoded();
    return;
  }

  if (this.headers['content-type'].match(/multipart/i)) {
    var m;
    if (m = this.headers['content-type'].match(/boundary=(?:"([^"]+)"|([^;]+))/i)) {
      this._initMultipart(m[1] || m[2]);
    } else {
      this._error(new Error('bad content-type header, no multipart boundary'));
    }
    return;
  }

  this._error(new Error('bad content-type header, unknown content-type: '+this.headers['content-type']));
};

IncomingForm.prototype._error = function(err) {
  if (this.error) {
    return;
  }

  this.error = err;
  this.pause();
  this.emit('error', err);
};

IncomingForm.prototype._parseContentLength = function() {
  if (this.headers['content-length']) {
    this.bytesReceived = 0;
    this.bytesExpected = parseInt(this.headers['content-length'], 10);
    this.emit('progress', this.bytesReceived, this.bytesExpected);
  }
};

IncomingForm.prototype._newParser = function() {
  return new MultipartParser();
};

IncomingForm.prototype._initMultipart = function(boundary) {
  this.type = 'multipart';

  var parser = new MultipartParser(),
      self = this,
      headerField,
      headerValue,
      part;

  parser.initWithBoundary(boundary);

  parser.onPartBegin = function() {
    part = new EventEmitter();
    part.headers = {};
    part.name = null;
    part.filename = null;
    part.mime = null;
    headerField = '';
    headerValue = '';
  };

  parser.onHeaderField = function(b, start, end) {
    headerField += b.toString(self.encoding, start, end);
  };

  parser.onHeaderValue = function(b, start, end) {
    headerValue += b.toString(self.encoding, start, end);
  };

  parser.onHeaderEnd = function() {
    headerField = headerField.toLowerCase();
    part.headers[headerField] = headerValue;

    var m;
    if (headerField == 'content-disposition') {
      if (m = headerValue.match(/name="([^"]+)"/i)) {
        part.name = m[1];
      }

      part.filename = self._fileName(headerValue);
    } else if (headerField == 'content-type') {
      part.mime = headerValue;
    }

    headerField = '';
    headerValue = '';
  };

  parser.onHeadersEnd = function() {
    self.onPart(part);
  };

  parser.onPartData = function(b, start, end) {
    part.emit('data', b.slice(start, end));
  };

  parser.onPartEnd = function() {
    part.emit('end');
  };

  parser.onEnd = function() {
    self.ended = true;
    self._maybeEnd();
  };

  this._parser = parser;
};

IncomingForm.prototype._fileName = function(headerValue) {
  var m = headerValue.match(/filename="(.*?)"($|; )/i)
  if (!m) return;

  var filename = m[1].substr(m[1].lastIndexOf('\\') + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#([\d]{4});/g, function(m, code) {
    return String.fromCharCode(code);
  });
  return filename;
};

IncomingForm.prototype._initUrlencoded = function() {
  this.type = 'urlencoded';

  var parser = new QuerystringParser()
    , self = this;

  parser.onField = function(key, val) {
    self.emit('field', key, val);
  };

  parser.onEnd = function() {
    self.ended = true;
    self._maybeEnd();
  };

  this._parser = parser;
};

IncomingForm.prototype._uploadPath = function(filename) {
  var name = '';
  for (var i = 0; i < 32; i++) {
    name += Math.floor(Math.random() * 16).toString(16);
  }

  if (this.keepExtensions) {
    var ext = path.extname(filename);
    ext     = ext.replace(/(\.[a-z0-9]+).*/, '$1')

    name += ext;
  }

  return path.join(this.uploadDir, name);
};

IncomingForm.prototype._maybeEnd = function() {
  if (!this.ended || this._flushing) {
    return;
  }

  this.emit('end');
};
