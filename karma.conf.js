module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    files: [
        {pattern: 'dist/assets/css/normalize.css', watched: true, served: true, included: true},
        {pattern: 'dist/assets/css/foundation.css', watched: true, served: true, included: true},
        {pattern: 'vendor/modernizr/modernizr.js', watched: true, served: true, included: true},
        {pattern: 'vendor/fastclick/lib/fastclick.js', watched: true, served: true, included: true},
        {pattern: 'vendor/jquery/dist/jquery.js', watched: true, served: true, included: true},
        {pattern: 'vendor/jquery-placeholder/jquery.placeholder.js', watched: true, served: true, included: true},
        {pattern: 'vendor/jquery.cookie/jquery.cookie.js', watched: true, served: true, included: true},
        {pattern: 'dist/assets/js/foundation/foundation.js', watched: true, served: true, included: true},
        {pattern: 'dist/assets/js/foundation/foundation.*.js', watched: true, served: true, included: true},
        {pattern: 'spec/**/*.html', watched: true, served: true, included: true},
        {pattern: 'node_modules/jasmine-jquery/lib/jasmine-jquery.js', watched: true, served: true, included: true},
        {pattern: 'spec/helpers.js', watched: true, served: true, included: true},
        {pattern: 'spec/**/*.js', watched: true, served: true, included: true},
        {pattern: 'spec/**/*.gif', watched: true, served: true, included: false}
    ],

    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['SmallPhantomJS', 'LargePhantomJS', 'LargeChrome', 'Firefox'],

    customLaunchers: {
        SmallChrome: {
            base: 'Chrome',
            flags: ['--window-size=320,400']
        },
        LargeChrome: {
            base: 'Chrome',
            flags: ['--window-size=1025,400']
        },
        SmallPhantomJS: {
            base: 'PhantomJS',
            options: {
                viewportSize: { width: 320, height: 400 }
            }
        },
        LargePhantomJS: {
            base: 'PhantomJS',
            options: {
                viewportSize: { width: 1025, height: 400 }
            }
        },
        bs_iphone5: {
                base: 'BrowserStack',
                device: 'iPhone 5',
                os: 'ios',
                os_version: '6.0'
        },
        bs_ie9: {
            base: 'BrowserStack',
            os: 'Windows',
            os_version: '7',
            browser: 'IE',
            browser_version: '9.0'
        },
        bs_ie10: {
            base: 'BrowserStack',
            os: 'Windows',
            os_version: '7',
            browser: 'IE',
            browser_version: '10.0'
        },
        bs_android41: {
            base: 'BrowserStack',
            os: 'android',
            os_version: '4.1',
            device: 'Samsung Galaxy S III'
        }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
