/*if not async then phantomjs fails to run the webserver and the test concurrently*/
var less = { async: true };

var testLessEqualsInDocument = function() {
    var links = document.getElementsByTagName('link'),
        typePattern = /^text\/(x-)?less$/;

    for (var i = 0; i < links.length; i++) {
        if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
           (links[i].type.match(typePattern)))) {
            testSheet(links[i]);
        }
    }
};

var testSheet = function(sheet) {
    it(sheet.id + " should match the expected output", function() {
        var lessOutputId =  sheet.id.replace("original-", ""),
            expectedOutputId = "expected-" + lessOutputId,
            lessOutput = document.getElementById(lessOutputId).innerText,
            expectedOutputHref = document.getElementById(expectedOutputId).href,
            expectedOutput = loadFile(expectedOutputHref);

        waitsFor(function() {
            return expectedOutput.loaded;
        }, "failed to load expected outout", 10000);
        
        runs(function() {
            // use sheet to do testing
            expect(lessOutput).toEqual(expectedOutput.text);
        });
    });
};

var loadFile = function(href) {
    var request = new XMLHttpRequest(),
        response = { loaded: false, text: ""};
    request.open('GET', href, true);
    request.onload = function(e) {
        response.text = request.response;
        response.loaded = true;
    }
    request.send();
    return response;
};

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    execJasmine();
  };

  function execJasmine() {
    setTimeout(function() {
        jasmineEnv.execute();
    }, 3000);
  }

})();