/**
 * This is the currently supported - albeit very minimal - public SDK.
 */

import {OpaqueToken} from '@angular/core';

// Bind straight into the hooks provided by the container.
if (!window["System"] || !window["System"]["registry"] || !window["System"]["registry"]["get"]) {
    throw new Error("SystemJS registry not found");
}

const containerHooks: any = window["System"]["registry"]["get"]("@vcd/common");
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

/**
 * The I18nModule.  Inject this to have access to TranslationService and TranslationPipe.
 */
export interface I18nModule {
}

export const I18nModule: {} = containerHooks.I18nModule;

/**
 * Translation helper functions.  Inject this to perform runtime i18n.
 */
export interface TranslationService {
    /**
     * Translate a key with params.
     * @param key translation key
     * @param params array of substitutions.
     * @return translated string.
     */
    translate(key: string, params?: any[]): string;

    /**
     * Format a date with current locale.
     * @param date date
     * @param options to specify the format of the date string.
     * @return formatted date.
     */
    formatDate(date: Date, options?: Object): string;

    /**
     * Format a time with current locale.
     * @param date date
     * @param options to specify the format of the time string.
     * @return formatted time.
     */
    formatTime(date: Date, options?: Object): string;

    /**
     * Format a date and time with current locale.
     * @param date date
     * @param options to specify the format of the date and time string.
     * @return formatted date and time.
     */
    formatDateTime(date: Date, options?: Object): string;
}

export const TranslationService: {} = containerHooks.TranslationService;

/**
 * Translation pipe.  Provides the `|translate` pipe.  Pipe in the i18n string
 * and provide the parameters to the translation, if any, as the parameter.
 */
export interface TranslationPipe {

    /**
     * Pipe the translation key into the pipe, and give translation parameters as a parameter.
     * @param key translation key
     * @param params any translation parameters
     * @return {string} translated string
     */
    transform(key: string, ...params: any[]);

}

export const TranslationPipe: {} = containerHooks.TranslationPipe;
