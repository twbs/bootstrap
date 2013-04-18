var watch = require('../main')
  , assert = require('assert')
  ;

watch.watchTree(__dirname, function (f, curr, prev) {
  // console.log('file '+f+' prev '+prev+' curr '+curr);
  // console.dir(curr)
  // console.dir(prev)
});