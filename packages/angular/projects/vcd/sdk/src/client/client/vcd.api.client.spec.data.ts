import { AccessibleLocations, Session } from '../openapi';

export const CLOUDAPI_SESSION: Session = Object.freeze({
    id: 'cloudapi_session_id',
    user: { name: 'cloudapi_user', id: 'cloudapi_user_id'},
    org: { name: 'cloudapi_org', id: 'cloudapi_org_id'},
    location: 'cloudapi_session_location',
    roles: [],
    roleRefs: [],
    sessionIdleTimeoutMinutes: 123456789
});

export const ACCESSIBLE_LOCATIONS: AccessibleLocations = Object.freeze({
    resultTotal: 2,
    pageCount: 1,
    page: 1,
    pageSize: 2,
    values: [
        {
            locationId: `${CLOUDAPI_SESSION.location}`,
            site: {
                name: 'cassini',
                id: 'urn:vcloud:site:4f569ca4-2a1f-457c-b587-21339358a38a'
            },
            org: {
                name: 'System',
                id: 'urn:vcloud:org:a93c9db9-7471-3192-8d09-a8f7eeda85f9'
            },
            restApiEndpoint: 'https://cassini.eng.vmware.com',
            uiEndpoint: 'https://cassini.eng.vmware.com',
            apiVersion: '36.0'
        },
        {
            locationId: 'a93c9db9-7471-3192-8d09-a8f7eeda85f9@92bed505-c2ac-4e76-892b-105dbe47b6bb',
            site: {
                name: 'juno',
                id: 'urn:vcloud:site:92bed505-c2ac-4e76-892b-105dbe47b6bb'
            },
            org: {
                name: 'System',
                id: 'urn:vcloud:org:a93c9db9-7471-3192-8d09-a8f7eeda85f9'
            },
            restApiEndpoint: 'https://juno.eng.vmware.com',
            uiEndpoint: 'https://juno.eng.vmware.com',
            apiVersion: '36.0'
        }
    ]
});
