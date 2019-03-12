/**
 * This is the currently supported - albeit very minimal - public SDK.
 */
import {OpaqueToken, NgModule} from '@angular/core';
import {Observable} from 'rxjs';

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
 * Payload for registering a navigation menu entry.
 */
export interface ExtensionNavRegistration {
    /**
     * The router path to navigate to when selected.
     */
    path: string;

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

export const AuthTokenHolderService: {token: string} = containerHooks.AuthTokenHolderService;

/**
 * This represents a menu item that can be clicked to perform an action on an entity (e.g. VM).
 */
export interface EntityActionExtensionMenuItem {
    /**
     * This is a unique URN identifying the action. This is so the component can be notified which action was requested.
     */
    urn: string;

    /**
     * This is the label for the menu item. It is not automatically translated.
     */
    text: string;

    /**
     * This is the enabled state for the menu item.
     */
    enabled: boolean;

    /**
     * This is the busy state for the menu item.
     */
    busy: boolean;
}

/**
 * This represents a sub-menu that contains other sub-menus or menu actions.
 */
export interface EntityActionExtensionSubmenu {
    /**
     * This is the label for the sub-menu. It is not automatically translated.
     */
    text: string;

    /**
     * This is an arbitrary, ordered list of EntityActionMenuItem.
     */
    children: EntityActionExtensionMenuItem[];
}

/**
 * This represents menu information for an entity action.
 */
export type EntityActionExtensionMenuEntry = EntityActionExtensionMenuItem | EntityActionExtensionSubmenu;

/**
 * Every component referenced by an entity action extension point must inherit from this.
 */
export abstract class _EntityActionExtensionComponent {
    /**
     * This returns is an Observable that defines the menu entry for this component. This is actively bound -
     * the component is able to change it in order to have the menu change (for example, to change busy
     * or enabled states).
     */
    abstract getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry>;

    /**
     * This field is a method that is called if a menu item is clicked while enabled. It will be called with the menu
     * item's URN and the URN of the entity that the action is being called for (e.g. the URN of the VM being edited).
     * It must return a single-shot (e.g. of, fromPromise or .first) Observable on completion. This Observable returns
     * a single value, refreshRequested. If this is true, the entity being edited will be immediately refreshed.
     * @param menuItemUrn the URN of the clicked menu item
     * @param entityUrnThe URN of the entity that the action is being called for
     */
     abstract performAction(menuItemUrn: string, entityUrn: string): Observable<{ refreshRequested: boolean }>;
}
export const EntityActionExtensionComponent: typeof _EntityActionExtensionComponent = containerHooks.EntityActionExtensionComponent;
