/**
 * This is the currently supported - albeit very minimal - public SDK.
 */

import {OpaqueToken} from '@angular/core';
import {Action} from "@ngrx/store";

/**
 * Wire in as a string.  Gives the root URL for API access (for example, the load balancer URL
 * or the single-cell URL).
 */
export const API_ROOT_URL: OpaqueToken;

/**
 * Wire in as a string.  Gives the root URL for the legacy Flex application.
 */
export const FLEX_APP_URL: OpaqueToken;

/**
 * Wire in as a string.  Gives the current scope of the VCD-UI.  As of current, this will be
 * either 'tenant' for the tenant portal, or 'service-provider' for the service-provider portal.
 */
export const SESSION_SCOPE: OpaqueToken;

/**
 * Wire in as a string.  Gives the unique name (not the display name) of the current tenant
 * organization that the VCD-UI is being used for.
 */
export const SESSION_ORGANIZATION: OpaqueToken;

/**
 * Wire in as a string.  Gives the full root path for module assets (e.g. images, scripts, text files)
 */
export const EXTENSION_ASSET_URL: OpaqueToken;

/**
 * Wire in as a string.  Gives the Angular 2 route that the module is registered under.
 */
export const EXTENSION_ROUTE: OpaqueToken;

/**
 * Wire in as a boolean.  True if running under the SDK, false if running in production.
 */
export const SDK_MODE: OpaqueToken;

/**
 * Payload for registering a navigation menu entry.
 */
export interface ExtensionNavRegistration {
    /**
     * The router path to navigate to when selected.
     */
    path: string;
    /**
     * The name of the clarity icon to use. If Clarity doesn't support it, it must be added.
     * See https://vmware.github.io/clarity/documentation/iconography
     */
    icon: string;

    /**
     * i18 key for name of extension, to be used as text for links
     */
    nameCode: string;

    /**
     * i18n key for description of extension, to be used on hover for links
     */
    descriptionCode: string;
}

/**
 * Dispatch this to the redux store to register a navigation menu.
 */
export declare class ExtensionNavRegistrationAction implements Action {
    payload: ExtensionNavRegistration;
    readonly type: string;

    constructor(payload: ExtensionNavRegistration);
}

/**
 * Inject this to access the authentication token.
 */
export declare abstract class AuthTokenHolderService {
    /**
     * The authentication token.
     */
    abstract token: string;
}
