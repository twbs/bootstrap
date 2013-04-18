var nodeunit = require('../lib/nodeunit');
var httputil = require('../lib/utils').httputil;

exports.testHttpUtilBasics = function (test) {

    test.expect(6);
    
    httputil(function (req, resp) {
        test.equal(req.method, 'PUT');
        test.equal(req.url, '/newpair');
        test.equal(req.headers.foo, 'bar');
        
        resp.writeHead(500, {'content-type': 'text/plain'});
        resp.end('failed');
    }, function (server, client) {
        client.fetch('PUT', '/newpair', {'foo': 'bar'}, function (resp) {
            test.equal(resp.statusCode, 500);
            test.equal(resp.headers['content-type'], 'text/plain');
            test.equal(resp.body, 'failed');            
              
            server.close();
            test.done();
        });
    });
};

exports.testHttpUtilJsonHandling = function (test) {

    test.expect(9);
    
    httputil(function (req, resp) {
        test.equal(req.method, 'GET');
        test.equal(req.url, '/');
        test.equal(req.headers.foo, 'bar');
        
        var testdata = {foo1: 'bar', foo2: 'baz'};
        
        resp.writeHead(200, {'content-type': 'application/json'});
        resp.end(JSON.stringify(testdata));
        
    }, function (server, client) {
        client.fetch('GET', '/', {'foo': 'bar'}, function (resp) {
            test.equal(resp.statusCode, 200);
            test.equal(resp.headers['content-type'], 'application/json');
            
            test.ok(resp.bodyAsObject);
            test.equal(typeof resp.bodyAsObject, 'object');
            test.equal(resp.bodyAsObject.foo1, 'bar');
            test.equal(resp.bodyAsObject.foo2, 'baz');
            
            server.close();
            test.done();
        });
    });
};
