// Copyright 2010-2011 Mikeal Rogers
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

var sys = require('util')
  , fs = require('fs')
  , path = require('path')
  , events = require('events')
  ;

function walk (dir, options, callback) { 
  if (!callback) {callback = options; options = {}}
  if (!callback.files) callback.files = {};
  if (!callback.pending) callback.pending = 0;
  callback.pending += 1;
  fs.stat(dir, function (err, stat) {
    if (err) return callback(err);
    callback.files[dir] = stat;
    fs.readdir(dir, function (err, files) {
      if (err) return callback(err);
      callback.pending -= 1;
      files.forEach(function (f, index) {
        f = path.join(dir, f);
        callback.pending += 1;
        fs.stat(f, function (err, stat) {
          var enoent = false;
          if (err) {
            if (err.code !== 'ENOENT') {
              return callback(err);
            } else {
              enoent = true;
            }
          }
          callback.pending -= 1;
          if (!enoent) {
            if (options.ignoreDotFiles && path.basename(f)[0] === '.') return;
            if (options.filter && options.filter(f, stat)) return;
            callback.files[f] = stat;
            if (stat.isDirectory()) walk(f, options, callback);
            if (callback.pending === 0) callback(null, callback.files);
          }
        })
      })
      if (callback.pending === 0) callback(null, callback.files);
    })
    if (callback.pending === 0) callback(null, callback.files);
  })
  
}
exports.watchTree = function ( root, options, callback ) {
  if (!callback) {callback = options; options = {}}
  walk(root, options, function (err, files) {
    if (err) throw err;
    var fileWatcher = function (f) {
      fs.watchFile(f, options, function (c, p) {
        // Check if anything actually changed in stat
        if (files[f] && !files[f].isDirectory() && c.nlink !== 0 && files[f].mtime.getTime() == c.mtime.getTime()) return;
        files[f] = c;
        if (!files[f].isDirectory()) callback(f, c, p);
        else {
          fs.readdir(f, function (err, nfiles) {
            if (err) return;
            nfiles.forEach(function (b) {
              var file = path.join(f, b);
              if (!files[file]) {
                fs.stat(file, function (err, stat) {
                  callback(file, stat, null);
                  files[file] = stat;
                  fileWatcher(file);
                })
              }
            })
          })
        }
        if (c.nlink === 0) {
          // unwatch removed files.
          delete files[f]
          fs.unwatchFile(f);
        }
      })
    }
    fileWatcher(root);
    for (var i in files) {
      fileWatcher(i);
    }
    callback(files, null, null);
  })
}

exports.createMonitor = function (root, options, cb) {
  if (!cb) {cb = options; options = {}}
  var monitor = new events.EventEmitter();
  exports.watchTree(root, options, function (f, curr, prev) {
    if (typeof f == "object" && prev == null && curr === null) {
      monitor.files = f;
      return cb(monitor);
    }
    if (prev === null) {
      return monitor.emit("created", f, curr);
    }
    if (curr.nlink === 0) {
      return monitor.emit("removed", f, curr);
    }
    monitor.emit("changed", f, curr, prev);
  })
}

exports.walk = walk;
