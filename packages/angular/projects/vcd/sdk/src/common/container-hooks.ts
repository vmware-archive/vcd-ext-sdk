/**
 * This is the currently supported - albeit very minimal - public SDK.
 */
import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

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

export type ExtensionNavRegistrationActionCtor = new(payload: ExtensionNavRegistration) => ExtensionNavRegistrationAction;

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
// tslint:disable-next-line:class-name
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

// tslint:disable-next-line:class-name
export abstract class _WizardExtensionComponent<P, R, E> {
    /**
     * Define method which will be executed by the Extension Point Orchestrator,
     * when certain event is triggered.
     * @param payload - the payload of the request triggered by the Core UI.
     * @param response - the response from the request triggered by the Core UI.
     * @param error - the Core UI will reprot any error that may appear during execution.
     */
    abstract performAction(payload: P, response: R, error: E): void;
}

export const WizardExtensionComponent: typeof _WizardExtensionComponent = containerHooks.WizardExtensionComponent;

export interface WizardExtensionState {
    isValid: boolean;
}

// tslint:disable-next-line:class-name
export abstract class _WizardExtensionWithValidationComponent<P, R, E> extends _WizardExtensionComponent<P, R, E> {
    /**
     * Get extension point state.
     */
    abstract getState(): Observable<WizardExtensionState>;
}

// tslint:disable-next-line:max-line-length
export const WizardExtensionWithValidationComponent: typeof _WizardExtensionWithValidationComponent = containerHooks.WizardExtensionWithValidationComponent;
