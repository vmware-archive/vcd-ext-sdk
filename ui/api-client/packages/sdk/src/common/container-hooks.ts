/**
 * This is the currently supported - albeit very minimal - public SDK.
 */

import {OpaqueToken, InjectionToken, NgModule} from '@angular/core';

// Bind straight into the hooks provided by the container.
if (!window["System"] || !window["System"]["registry"] || !window["System"]["registry"]["get"]) {
    throw new Error("SystemJS registry not found");
}

let containerHooks: any = window["System"]["registry"]["get"]("@vcd/common");
if (!containerHooks) {
    containerHooks = window["System"]["registry"]["get"]("@vcd-ui/common");
}

if (!containerHooks) {
    throw new Error("VCD UI container hooks not present in SystemJS registry");
}

/**
 * Wire in as a string.  Gives the root URL for API access (for example, the load balancer URL
 * or the single-cell URL).
 */
export const API_ROOT_URL: OpaqueToken = containerHooks.API_ROOT_URL;

/**
 * Wire in as a string.  Gives the root URL for the legacy Flex application.
 */
export const FLEX_APP_URL: OpaqueToken = containerHooks.API_ROOT_URL;

/**
 * Wire in as a string.  Gives the current scope of the VCD-UI.  As of current, this will be
 * either 'tenant' for the tenant portal, or 'service-provider' for the service-provider portal.
 */
export const SESSION_SCOPE: OpaqueToken = containerHooks.SESSION_SCOPE;

/**
 * Wire in as a string.  Gives the unique name (not the display name) of the current tenant
 * organization that the VCD-UI is being used for.
 */
export const SESSION_ORGANIZATION: OpaqueToken = containerHooks.SESSION_ORGANIZATION;

/**
 * Wire in as a string.  Gives the full root path for module assets (e.g. images, scripts, text files)
 */
export const EXTENSION_ASSET_URL: OpaqueToken = containerHooks.EXTENSION_ASSET_URL;

/**
 * Wire in as a string.  Gives the Angular 2 route that the module is registered under.
 */
export const EXTENSION_ROUTE: OpaqueToken = containerHooks.EXTENSION_ROUTE;

/**
 * Wire in as a boolean.  True if running under the SDK, false if running in production.
 */
export const SDK_MODE: OpaqueToken = containerHooks.SDK_MODE;

/**
 * Wire in as an ExtensionPointManifest type.  Provided to components/services used by extension points.
 */
export const EXTENSION_POINT_MANIFEST: InjectionToken<ExtensionPointManifest> = containerHooks.EXTENSION_POINT_MANIFEST;

/**
 * Supported extension point types.
 */
export type ExtensionPointType = "dashboard-section";

/**
 * This defines a formal extension point.  An extension point is a declarative way for an extension manifest
 * to describe how the VCD application behaviour is extended or modified by the extension.
 */
export interface ExtensionPointManifest {
    /**
     * Universally unique URN that identifies this Extension Point.  It is suggested to preprend the extension's URN.
     */
    readonly urn: string;

    /**
     * The type of Extension Point being defined from a supported list.  This list will increase over time.
     */
    readonly type: ExtensionPointType;

    /**
     * The name of the Extension Point, intended for display in extension management interfaces.
     */
    readonly name: string;

    /**
     * An overview of the Extension Point, intended for display in extension management interfaces.
     */
    readonly description: string;
}

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
export interface ExtensionNavRegistrationAction {
    payload: ExtensionNavRegistration;
    readonly type: string;
}

export interface ExtensionNavRegistrationActionCtor {
    new(payload: ExtensionNavRegistration): ExtensionNavRegistrationAction;
}

export const ExtensionNavRegistrationAction: ExtensionNavRegistrationActionCtor = containerHooks.ExtensionNavRegistrationAction;

/**
 * Inject this to access the authentication token.
 */
export interface AuthTokenHolderService {
    /**
     * The authentication token.
     */
    token: string;
}

export const AuthTokenHolderService: {} = containerHooks.AuthTokenHolderService;