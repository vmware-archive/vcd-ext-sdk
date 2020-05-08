// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mock representation of SystemJS registry needed for testing VcdApiClient
(window as any).System = {
  registry: {}
};
(window as any).System.registry.get = (s: string) => {
  return {
      API_ROOT_URL: '$API_ROOT_URL',
      AuthTokenHolderService: {
          token: '$token'
      },
      SESSION_ORG_ID: '$SESSION_ORG_ID',
      SESSION_SCOPE: '$SESSION_SCOPE'
  };
};

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
