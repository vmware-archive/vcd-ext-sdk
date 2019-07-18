// CoreJS intialization
import "core-js/es6/symbol";
import "core-js/es6/object";
import "core-js/es6/function";
import "core-js/es6/parse-int";
import "core-js/es6/parse-float";
import "core-js/es6/number";
import "core-js/es6/math";
import "core-js/es6/string";
import "core-js/es6/date";
import "core-js/es6/array";
import "core-js/es6/regexp";
import "core-js/es6/map";
import "core-js/es6/set";
import "core-js/es6/reflect";

import "core-js/es7/reflect";

// ZoneJS initialization
import "zone.js";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";

// TestBed initialization
import { TestBed } from "@angular/core/testing";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(
    [
        BrowserDynamicTestingModule
    ],
    platformBrowserDynamicTesting([])
);

// Mock representation of SystemJS registry needed for testing VcdApiClient
window["System"] = {
    registry: {}
};
window["System"]["registry"]["get"] = function(s: string): any { 
    return {
        API_ROOT_URL: "$API_ROOT_URL",
        AuthTokenHolderService: {
            token: "$token"
        },
        SESSION_ORG_ID: "$SESSION_ORG_ID",
        SESSION_SCOPE: "$SESSION_SCOPE"
    };
};

// load all specs in ./src
declare const require: any;
const context = require.context("./", true, /\.spec\.ts$/);
context.keys().map(context);
