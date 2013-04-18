## Bug Reports

 - Please create a short test case
 - Test with the latest version
 - indicate how you use less - browser/lessc/external tool

## Feature Requests

 - Please search feature requests to see if something similar exists already
 - include a use-case - we do not add language features without a reason
 - consider whether your language feature would be better as a function

## Pull Requests

Thankyou! Please take the time to read these guidelines

 - Consider adding a feature request first to see if people are pro or con
 - do not change the dist/ folder - we do this when releasing
 - tests - please add tests for your work. use `make test` to see if they pass
 - spaces not tabs
 - end lines in semi-colons - loosely aim towards jslint standards

## Developing

1. install cygwin - http://cygwin.com/install.html 
 - default options +
	- Devel -> Make
                -> Git
2. install node.js - http://nodejs.org/
3. install phantomJS - http://phantomjs.org/download.html
	- copy to a directory of your choice
	- (windows) modify the path directory to include whereever you have copied it
4. clone the repository and download to local computer
5. run `npm install -g diff` to get diffs in your tests

`lessc or node bin/lessc`

to run the less compiler

`make test`

runs the node tests

`make browser-test`

runs the headless browser tests

`make browser-test-server`

sets up the server for the headless tests.. then go to http://localhost:8081/browser/test-runner-main.htm or one of the other test runner pages created in /test/browser/
