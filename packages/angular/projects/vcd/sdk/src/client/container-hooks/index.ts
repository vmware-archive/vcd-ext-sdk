/**
 * This is the currently supported - albeit very minimal - public SDK.
 */
import {InjectionToken} from '@angular/core';

// Bind straight into the hooks provided by the container.
if (!(window as any).System || !(window as any).System.registry || !(window as any).System.registry.get) {
    throw new Error('SystemJS registry not found');
}

let containerHooks: any = (window as any).System.registry.get('@vcd/common');
if (!containerHooks) {
    containerHooks = (window as any).System.registry.get('@vcd-ui/common');
}

if (!containerHooks) {
    throw new Error('VCD UI container hooks not present in SystemJS registry');
}

/**
 * Wire in as a string.  Gives the root URL for API access (for example, the load balancer URL
 * or the single-cell URL).
 */
export const API_ROOT_URL: InjectionToken<string> = containerHooks.API_ROOT_URL;

/**
 * Wire in as a string.  Gives the root URL for the legacy Flex application.
 */
export const FLEX_APP_URL: InjectionToken<string> = containerHooks.API_ROOT_URL;

/**
 * Wire in as a string.  Gives the current scope of the VCD-UI.  As of current, this will be
 * either 'tenant' for the tenant portal, or 'service-provider' for the service-provider portal.
 */
export const SESSION_SCOPE: InjectionToken<string> = containerHooks.SESSION_SCOPE;

/**
 * Wire in as a string.  Gives the unique name (not the display name) of the current tenant
 * organization that the VCD-UI is being used for.
 */
export const SESSION_ORGANIZATION: InjectionToken<string> = containerHooks.SESSION_ORGANIZATION;

/**
 * Wire in as a string.  Gives the UUID identifier of the current tenant
 * organization that the VCD-UI is being used for.
 */
export const SESSION_ORG_ID: InjectionToken<string> = containerHooks.SESSION_ORG_ID ? containerHooks.SESSION_ORG_ID : '';

/**
 * Wire in as a string.  Gives the full root path for module assets (e.g. images, scripts, text files)
 *
 * ATTENTION!
 * Add || new InjectionToken to workaround the Angular security mechanics which prevent use of injection tokens
 * which potentially are not defiend. The same fix can be applied for the rest tokens if needed.
 */
export const EXTENSION_ASSET_URL: InjectionToken<string> = containerHooks.EXTENSION_ASSET_URL || new InjectionToken('EXTENSION_ASSET_URL');

/**
 * Wire in as a string.  Gives the Angular 2 route that the module is registered under.
 */
export const EXTENSION_ROUTE: InjectionToken<string> = containerHooks.EXTENSION_ROUTE;

/**
 * Wire in as a boolean.  True if running under the SDK, false if running in production.
 */
export const SDK_MODE: InjectionToken<boolean> = containerHooks.SDK_MODE;

/**
 * Inject this to access the authentication token.
 */
export interface AuthTokenHolderService {
    /**
     * The authentication token.
     */
    token: string;

    /**
     * JWT token
     */
    jwt?: string;
}

export const AuthTokenHolderService: AuthTokenHolderService = containerHooks.AuthTokenHolderService;

