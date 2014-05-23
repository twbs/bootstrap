# Performance Metrics
The performance of various components can measured by running [browser-perf](http://github.com/axemclion/browser-perf). Running these benchmarks over time tells us about commits that may slow down certain components.   

## Usage
To run the performance metrics, run `grunt perf`. The SAUCE_USERNAME and SAUCE_ACCESS_KEY need to be set as environment variables to enable the runs.

## What does it do
The `perf` task is defined in the `perf.js` file and does the following things.

1. Generate the HTML files that are required for performance testing. The HTML files have the markup of the component added multiple times to enable scrolling. 
2. The HTML pages are loaded and scrolled in Sauce browsers. Performance Metrics like first paint, mean frame time, etc are measured
3. All the results are stored in a CouchDB database. 
4. There results can be viewed using a corresponding CouchApp on the same CouchDB database at http:/couchdbserver.com/database/_design/site/index.html 