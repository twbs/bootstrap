var path = require('path'),
    fs = require('fs'),
    sys = require('util');

var createTestRunnerPage = function(dir, exclude, testSuiteName, dir2) {
    var output = '<html><head>\n';

    fs.readdirSync(path.join("test", dir, 'less', dir2 || "")).forEach(function (file) {
        if (! /\.less/.test(file)) { return; }
        
        var name = path.basename(file, '.less'),
            id = (dir ? dir + '-' : "") + 'less-' + (dir2 ? dir2 + "-" : "") + name;
        
        if (exclude && name.match(exclude)) { return; }
        
        output += '<link id="original-less:' + id + '" rel="stylesheet/less" type="text/css" href="http://localhost:8081/' + path.join(dir, 'less', dir2 || "", name) + '.less' +'">\n';
        output += '<link id="expected-less:' + id + '" rel="stylesheet"  type="text/css" href="http://localhost:8081/' + path.join(dir, 'css', dir2 || "", name) + '.css' + '">\n';
    });

    output += String(fs.readFileSync(path.join('test/browser', 'template.htm'))).replace("{runner-name}", testSuiteName);

    fs.writeFileSync(path.join('test/browser', 'test-runner-'+testSuiteName+'.htm'), output);
};

createTestRunnerPage("", /javascript|urls/, "main");
createTestRunnerPage("browser", null, "browser");
createTestRunnerPage("browser", null, "relative-urls", "relative-urls");
createTestRunnerPage("browser", null, "rootpath", "rootpath");
createTestRunnerPage("browser", null, "rootpath-relative", "rootpath-relative");