var util = require('util'),
    exec = require('child_process').exec,
    child;

var total = 0;
var start = new(Date);
child = exec('lessc bootstrap.scss', function (error, stdout, stderr) {
	var end = new(Date);
	total = end - start;
	console.log(total)
});