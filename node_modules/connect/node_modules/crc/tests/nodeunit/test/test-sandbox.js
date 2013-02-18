var nodeunit = require('../lib/nodeunit');
var sandbox = require('../lib/utils').sandbox;
var testCase = nodeunit.testCase;

exports.testSimpleSandbox = function (test) {
    var raw_jscode1 = sandbox(__dirname + '/fixtures/raw_jscode1.js');
    test.equal(raw_jscode1.hello_world('foo'), '_foo_', 'evaluation ok');
    test.done();
};

exports.testSandboxContext = function (test) {
    var a_variable = 42; // should not be visible in the sandbox
    var raw_jscode2 = sandbox(__dirname + '/fixtures/raw_jscode2.js');
    a_variable = 42; // again for the win
    test.equal(
        raw_jscode2.get_a_variable(),
        'undefined',
        'the variable should not be defined'
    );
    test.done();
};

exports.testSandboxMultiple = function (test) {
    var raw_jscode3 = sandbox([
        __dirname + '/fixtures/raw_jscode3.js',
        __dirname + '/fixtures/raw_jscode3.js',
        __dirname + '/fixtures/raw_jscode3.js'
    ]);
    test.equal(raw_jscode3.t, 3, 'two files loaded');
    test.done();
};
