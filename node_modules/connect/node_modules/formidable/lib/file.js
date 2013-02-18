if (global.GENTLY) require = GENTLY.hijack(require);

var util = require('./util'),
    WriteStream = require('fs').WriteStream,
    EventEmitter = require('events').EventEmitter;

function File(properties) {
  EventEmitter.call(this);

  this.size = 0;
  this.path = null;
  this.name = null;
  this.type = null;
  this.lastModifiedDate = null;

  this._writeStream = null;

  for (var key in properties) {
    this[key] = properties[key];
  }

  this._backwardsCompatibility();
}
module.exports = File;
util.inherits(File, EventEmitter);

// @todo Next release: Show error messages when accessing these
File.prototype._backwardsCompatibility = function() {
  var self = this;
  this.__defineGetter__('length', function() {
    return self.size;
  });
  this.__defineGetter__('filename', function() {
    return self.name;
  });
  this.__defineGetter__('mime', function() {
    return self.type;
  });
};

File.prototype.open = function() {
  this._writeStream = new WriteStream(this.path);
};

File.prototype.write = function(buffer, cb) {
  var self = this;
  this._writeStream.write(buffer, function() {
    self.lastModifiedDate = new Date();
    self.size += buffer.length;
    self.emit('progress', self.size);
    cb();
  });
};

File.prototype.end = function(cb) {
  var self = this;
  this._writeStream.end(function() {
    self.emit('end');
    cb();
  });
};
