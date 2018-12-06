// This is the karma configuration for the dev build.
const path = require('path');
const puppeteer = require('puppeteer');
const webpackConfig = require('./webpack.test.config');

// Download a recent Chrome version
process.env.CHROME_BIN = process.env.CHROME_BIN || puppeteer.executablePath();

module.exports = function (config) {
    config.set({
        // Allow for the browser basically locking up
        browserNoActivityTimeout: 300000,

        // Load jasmine globals
        frameworks: ['jasmine'],

        files: [
            // This is the equivalent of `scripts.bundle.js`
            "./node_modules/jasmine-ajax/lib/mock-ajax.js",
            "./node_modules/systemjs/dist/system.js",
            "./node_modules/core-js/client/shim.min.js",
            "./node_modules/mutationobserver-shim/dist/mutationobserver.min.js",
            "./node_modules/@webcomponents/custom-elements/custom-elements.min.js",
            "./node_modules/web-animations-js/web-animations.min.js",

            // This is our actual test harness
            "./src/test.ts"
        ],
        exclude: [
        ],
        preprocessors: {
            // Invoke webpack on our test harness, and provide sourcemaps if requested.
            './src/test.ts': ['webpack', 'sourcemap']
        },
        mime: {
            // There's a bit of a glitch with karma if this isn't set
            'text/x-typescript': ['ts', 'tsx']
        },

        // Use the webpack configuration (webpack.test.config.ts)
        webpack: webpackConfig,

        // Make it seem like something is going on
        reporters: ['progress'],

        // Doesn't really matter as long as it's above 1024.
        port: 9876,

        // Attract raccoons
        colors: true,

        // Debug all the things!
        logLevel: config.LOG_DEBUG,

        // Do not watch
        autoWatch: false,

        // Use Chrome headlessly unless requested.  Less RAM, more reliable.
        browsers: ['ChromeHeadless'],

        // Quit after one run of the tests
        singleRun: true,

        // Default setting - allow unlimited browser windows
        concurrency: Infinity
    })
};
