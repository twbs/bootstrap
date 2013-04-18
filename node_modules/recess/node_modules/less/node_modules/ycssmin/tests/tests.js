var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    exists = fs.existsSync || path.existsSync,
    base = path.join(__dirname, './files'),
    cssmin = require('../cssmin').cssmin,
    files = fs.readdirSync(base),
    tests = {
        'should be loaded': {
            topic: function() {
                return require('../cssmin').cssmin;
            },
            'should be a function': function(topic) {
                assert.isFunction(topic);
            }
        }
    };

files.forEach(function(file) {
    if (path.extname(file) === '.css') {
        var comp = path.join(base, file + '.min');
        if (exists(comp)) {
            tests['should be loaded'][file] = (function(file) {
                var expected = (fs.readFileSync(path.join(base, file + '.min'), 'utf8')).trim(),
                    str = (fs.readFileSync(path.join(base, file), 'utf8')).trim();
                return function(topic) {
                    var out = topic(str);
                    assert.equal(expected, out);
                };
            }(file));
        }
    }
});

//Line Break Test
(function() {
    var file = 'linebreakpos.css';
    tests['should be loaded']['and should handle linebreak'] = (function(file) {
        var expected = (fs.readFileSync(path.join(base, 'special', file + '.min'), 'utf8')).trim(),
            str = (fs.readFileSync(path.join(base, 'special', file), 'utf8')).trim();
        return function(topic) {
            var out = topic(str, 100);
            assert.equal(expected, out);
        };
    }(file));
}());

vows.describe('cssmin tests').addBatch(tests).export(module);
