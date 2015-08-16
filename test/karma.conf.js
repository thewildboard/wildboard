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
      'public/assets/libs/jquery/dist/jquery.js',
      'public/assets/libs/angular/angular.js',
      'public/assets/libs/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      "public/assets/libs/angular-bootstrap/ui-bootstrap-tpls.min.js",
      'public/assets/libs/angular-animate/angular-animate.js',
      'public/assets/libs/angular-cookies/angular-cookies.js',
      'public/assets/libs/angular-resource/angular-resource.js',
      'public/assets/libs/angular-route/angular-route.js',
      'public/assets/libs/angular-sanitize/angular-sanitize.js',
      "public/assets/libs/angular-multiple-transclusion/src/angular-multiple-transclusion.js",
      "public/assets/libs/angular-ui-router/release/angular-ui-router.js",
      'public/assets/libs/satellizer/satellizer.min.js',
      "public/assets/libs/javascript-detect-element-resize/jquery.resize.js",
      "public/assets/libs/angular-gridster/dist/angular-gridster.min.js",
      "public/assets/libs/ng-foobar/ng-foobar.js",
      'public/assets/libs/angular-mocks/angular-mocks.js',
      'public/app/app.js',
      'public/app/routes.js',
      'public/app/scripts/services/*.js',
      'public/app/scripts/controllers/*.js',
      'public/app/scripts/directives/*.js',
      'public/app/scripts/modules/dashboards/dashboardsApp.js',
      'public/app/scripts/modules/dashboards/dashboardsApi.js',
      'public/app/scripts/modules/dashboards/dashboards.js',
      'public/app/scripts/modules/dashboards/directives/dashboardPanelCtrl.js',
      'public/app/scripts/modules/dashboards/directives/dashboardPanel.js',

      'public/app/scripts/modules/widgets/widgetsApp.js',
      'public/app/scripts/modules/widgets/WidgetsApi.js',
      'public/app/scripts/modules/widgets/widgets.js',
      'public/app/scripts/modules/widgets/directives/createWidgetCtrl.js',
      'public/app/scripts/modules/widgets/directives/createWidget.js',
      'public/app/scripts/modules/widgets/directives/editWidgetCtrl.js',
      'public/app/scripts/modules/widgets/directives/numberTemplate.js',
      'public/app/scripts/modules/widgets/directives/widgetBodyCtrl.js',
      'public/app/scripts/modules/widgets/directives/widgetBody.js',
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
