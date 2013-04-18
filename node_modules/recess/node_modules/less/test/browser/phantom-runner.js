var webpage = require('webpage');
var server = require('webserver').create();
var system = require('system');
var fs = require('fs');
var host, port = 8081;

var listening = server.listen(port, function (request, response) {
    //console.log("Requested "+request.url);
    
    var filename = ("test/" + request.url.slice(1)).replace(/[\\\/]/g, fs.separator);
    
    if (!fs.exists(filename) || !fs.isFile(filename)) {
        response.statusCode = 404;
        response.write("<html><head></head><body><h1>File Not Found</h1><h2>File:"+filename+"</h2></body></html>");
        response.close();
        return;
    }

    // we set the headers here
    response.statusCode = 200;
    response.headers = {"Cache": "no-cache", "Content-Type": "text/html"};
   
    response.write(fs.read(filename));
    
    response.close();
});
if (!listening) {
    console.log("could not create web server listening on port " + port);
    phantom.exit();
}

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10001, //< Default Max Timeout is 10s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};

function testPage(url) {
    var page = webpage.create();
    page.open(url, function (status) {
        if (status !== "success") {
            console.log("Unable to access network - " + status);
            phantom.exit();
        } else {
            waitFor(function(){
                return page.evaluate(function(){
                    return document.body && document.body.querySelector && 
                        document.body.querySelector('.symbolSummary .pending') === null &&
                        document.body.querySelector('.results') !== null;
                });
            }, function(){
                page.onConsoleMessage = function (msg) {
                    console.log(msg);
                };
                var exitCode = page.evaluate(function(){
                    console.log('');
                    console.log(document.body.querySelector('.description').innerText);
                    var list = document.body.querySelectorAll('.results > #details > .specDetail.failed');
                    if (list && list.length > 0) {
                      console.log('');
                      console.log(list.length + ' test(s) FAILED:');
                      for (i = 0; i < list.length; ++i) {
                          var el = list[i],
                              desc = el.querySelector('.description'),
                              msg = el.querySelector('.resultMessage.fail');
                          console.log('');
                          console.log(desc.innerText);
                          console.log(msg.innerText);
                          console.log('');
                      }
                      return 1;
                    } else {
                      console.log(document.body.querySelector('.alert > .passingAlert.bar').innerText);
                      return 0;
                    }
                });
                testFinished(exitCode);
            });
        }
    });
}

function scanDirectory(path, regex) {
    var files = [];
    fs.list(path).forEach(function (file) {
        if (file.match(regex)) {
            files.push(file);
        }
    });
    return files;
};

var totalTests = 0,
    totalFailed = 0,
    totalDone = 0;

function testFinished(failed) {
    if (failed) { totalFailed++; }
    totalDone++;
    if (totalDone === totalTests) { phantom.exit(totalFailed > 0 ? 1 : 0); }
}

if (system.args.length != 2 && system.args[1] != "--no-tests") {
    var files = scanDirectory("test/browser/", /^test-runner-.+\.htm$/);
    totalTests = files.length;
    console.log("found " + files.length + " tests");
    files.forEach(function(file) {
        testPage("http://localhost:8081/browser/" + file);
        });
}