/**
 * This is the currently supported - albeit very minimal - public SDK.
 */

import {OpaqueToken} from '@angular/core';
import {Action} from "@ngrx/store";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

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

/**
 * Import this to access the global I18n system.
 */
export declare class I18nModule {   
}

/**
 * Basic translations.
 */
export interface Translations {
    [key: string]: string;
}

/**
 * A set of translations.
 */
export interface TranslationSet {
    [locale: string]: Translations;
}

/**
 * Inject this to access the global I18n system.
 */
export declare abstract class TranslationService {   
    /**
     * Options to format Date.
     * @type {{year: string; month: string; day: string}}
     */
    protected readonly defaultDateFormat: DateTimeFormatOptions;

    /**
     * Options to format Time.
     * @type {{hour: string; minute: string; second: string; hour12: boolean}}
     */
    protected readonly defaultTimeFormat: DateTimeFormatOptions;

    /**
     * Options to format Date and Time.
     */
    protected readonly defaultDateTimeFormat: DateTimeFormatOptions;

    /**
     * Register translations (used by modules)
     * @param translations
     */
    abstract registerTranslations(set: TranslationSet): void;

    /**
     * Translate a key with params.
     * @param key translation key
     * @param params array of substitutions.
     * @return translated string.
     */
    abstract translate(key: string, params?: any[]): string;

    /**
     * Format a date with current locale.
     * @param date date
     * @param options to specify the format of the date string.
     * @return formatted date.
     */
    abstract formatDate(date: Date, options?: Object): string;

    /**
     * Format a time with current locale.
     * @param date date
     * @param options to specify the format of the time string.
     * @return formatted time.
     */
    abstract formatTime(date: Date, options?: Object): string;

    /**
     * Format a date and time with current locale.
     * @param date date
     * @param options to specify the format of the date and time string.
     * @return formatted date and time.
     */
    abstract formatDateTime(date: Date, options?: Object): string;

}