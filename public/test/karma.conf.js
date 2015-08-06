// Karma configuration
// Generated on Wed Aug 05 2015 17:55:34 GMT+0200 (CEST)

module.exports = function(config) {
  'use strict';
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    //<script src="assets/libs/ngstorage/ngStorage.js"></script>


    files: [
      'assets/libs/jquery/dist/jquery.js',
      'assets/libs/angular/angular.js',
      'assets/libs/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      "assets/libs/angular-bootstrap/ui-bootstrap-tpls.min.js",
      'assets/libs/angular-animate/angular-animate.js',
      'assets/libs/angular-cookies/angular-cookies.js',
      'assets/libs/angular-resource/angular-resource.js',
      'assets/libs/angular-route/angular-route.js',
      'assets/libs/angular-sanitize/angular-sanitize.js',
      "assets/libs/angular-multiple-transclusion/src/angular-multiple-transclusion.js",
      "assets/libs/angular-ui-router/release/angular-ui-router.js",
      'assets/libs/satellizer/satellizer.min.js',
      "assets/libs/javascript-detect-element-resize/jquery.resize.js",
      "assets/libs/angular-gridster/dist/angular-gridster.min.js",
      "assets/libs/ng-foobar/ng-foobar.js",
      'assets/libs/angular-mocks/angular-mocks.js',
      'app/app.js',
      'app/routes.js',
      'app/**/*.js',
      'test/specs/**/*spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
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

    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine",
      "mocha"
    ],
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
