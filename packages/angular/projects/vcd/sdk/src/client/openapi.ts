/**
 * Entity reference used to describe VCD entities
 */
export class EntityReference {
    'name': string;
    'id': string;
}

/**
 * Session
 */
export class Session {
    /**
     * ID of session
     */
    'id': string;
    /**
     * User of this session
     */
    'user': EntityReference;
    /**
     * Organization user is logged into for this session
     */
    'org': EntityReference;
    /**
     * The accessible location this session is valid for
     */
    'location': string;
    /**
     * User's roles for this session
     */
    'roles': Array<string>;
    /**
     * References to user's roles
     */
    'roleRefs': Array<EntityReference>;
    /**
     * The session idle timeout in minutes
     */
    'sessionIdleTimeoutMinutes': number;
}

/**
 * A list of locations accessible to this session.
 */
export interface AccessibleLocations {
    /**
     * How many results there are in total (i.e., considering all pages).
     */
    resultTotal?: number;

    /**
     * How many pages there are in total.
     */
    pageCount?: number;

    /**
     * The page that was fetched, 1-indexed.
     */
    page?: number;

    /**
     * Result count for page that was fetched.
     */
    pageSize?: number;

    /**
     * The current page of accessible locations.
     */
    values?: Array<AccessibleLocation>;

}

/**
 * A location accessible to this session.
 */
export class AccessibleLocation {
    'locationId': string;
    'site': EntityReference;
    'org': EntityReference;
    'restApiEndpoint': string;
    'uiEndpoint': string;
    'apiVersion': string;
}
