/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/
package com.vmware.vcloud.api.rest.client.constants;

import com.vmware.vcloud.api.rest.schema_v1_5.AdminOrgType;
import com.vmware.vcloud.api.rest.schema_v1_5.ApiExtensibilityType;
import com.vmware.vcloud.api.rest.schema_v1_5.OrgListType;
import com.vmware.vcloud.api.rest.schema_v1_5.OrgType;
import com.vmware.vcloud.api.rest.schema_v1_5.ReferencesType;
import com.vmware.vcloud.api.rest.schema_v1_5.SessionType;
import com.vmware.vcloud.api.rest.schema_v1_5.UserType;
import com.vmware.vcloud.api.rest.schema_v1_5.extension.VMWExtensionType;

/**
 * A variety of vCloud REST API constants
 */
public interface RestConstants {

    public static interface Uri {

    	public static final String VERSIONS = "/versions";
    	public static final String SESSIONS = "/sessions";
    	public static final String SESSION = "/session";
    }

    public interface MediaType {
        public static final String XML_FORMAT_SUFFIX = "+xml";
        public static final String JSON_FORMAT_SUFFIX = "+json";

        public static final String ENTITY = com.vmware.vcloud.api.rest.schema_v1_5.EntityType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String ORGANIZATION = OrgType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String ADMIN_ORGANIZATION = AdminOrgType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String ORGANIZATION_LIST = OrgListType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String USER = UserType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String REFERENCES = ReferencesType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String RECORDS = "application/vnd.vmware.vcloud.query.records" + XML_FORMAT_SUFFIX;
        public static final String IDRECORDS = "application/vnd.vmware.vcloud.query.idrecords" + XML_FORMAT_SUFFIX;
        public static final String QUERY_LIST = "application/vnd.vmware.vcloud.query.queryList" + XML_FORMAT_SUFFIX;
        public static final String SESSION = SessionType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String API_EXTENSIBILITY = ApiExtensibilityType.CONTENT_TYPE + XML_FORMAT_SUFFIX;
        public static final String VMW_EXTENSION = VMWExtensionType.CONTENT_TYPE + XML_FORMAT_SUFFIX;

        // Open API
        public static final String APPLICATION_JSON = "application/json";
    }

    public static interface QueryParams {
        public static final String PAGE = "page";
        public static final String PAGE_SIZE = "pageSize";
        public static final int DEFAULT_PAGE = 1;
        public static final int DEFAULT_PAGE_SIZE = 25;
        public static final String OFFSET = "offset";
        public static final String FIELDS = "fields";
        public static final String FILTER = "filter";
        public static final String LINKS = "links";
        public static final String DEFAULT_LINKS = "false";
        public static final String SORT_ASC = "sortAsc";
        public static final String SORT_DESC = "sortDesc";
        public static final String TYPE = "type";
        public static final String QUERY_FIELDS_SEPARATOR = ",";
        public static final String QUERY_PARAMS_SEPARATOR = "&";
        public static final int MAX_PAGE_SIZE = 128;
    }

    public static interface HttpStatusCodes {
        public static final int SC_OK = 200;
        public static final int SC_CREATED = 201;
        public static final int SC_ACCEPTED = 202;
        public static final int SC_NO_CONTENT = 204;
        public static final int SC_PARTIAL_CONTENT = 206;
        public static final int SC_MOVED_PERMANENTLY = 301;
        /**
         * HTTP BAD REQUEST status code
         */
        public static final int SC_BAD_REQUEST = 400;

        /**
         * HTTP UNAUTHORIZED status code
         */
        public static final int SC_UNAUTHORIZED = 401;

        /**
         * HTTP Forbidden status code
         */
        public static final int SC_FORBIDDEN = 403;

        /**
         * HTTP NOT FOUND status code
         */
        public static final int SC_NOT_FOUND = 404;

        /**
         * HTTP Method not allowed status code
         */
        public static final int SC_METHOD_NOT_ALLOWED = 405;

        /**
         * HTTP Not Acceptable status code
         */
        public static final int SC_NOT_ACCEPTABLE = 406;

        /**
         * HTTP Conflict status code
         */
        public static final int SC_CONFLICT = 409;

        /**
         * HTTP Unsupported Media Type
         */
        public static final int SC_UNSUPPORTED_MEDIA_TYPE = 415;

        /**
         * HTTP Internal server error status code
         */
        public static final int SC_INTERNAL_SERVER_ERROR = 500;

        public static final int SC_SERVICE_NOT_AVAILABLE = 503;

        /**
         * HTTP Gateway Timeout
         */
        public static final int SC_GATEWAY_TIMEOUT_ERROR = 504;
    }

    public static interface DeleteParameters {

        /**
         * Forced deletion
         */
        public static final String FORCE = "force";

        /**
         * Recursive deletion of child objects
         */
        public static final String RECURSIVE = "recursive";
    }

    public static final String VCLOUD_AUTHENTICATION_HEADER = "x-vcloud-authorization";

    public static final String VCLOUD_ORG_CONTEXT_HEADER = "X-VMWARE-VCLOUD-ORG-ID";

    public static final String VCLOUD_CLIENT_REQUEST_ID_HEADER = "X-VMWARE-VCLOUD-CLIENT-REQUEST-ID";

    public static final String VCLOUD_REQUEST_ID_HEADER = "X-VMWARE-VCLOUD-REQUEST-ID";

    public static final String VCLOUD_TASK_ID_HEADER = "X-VMWARE-VCLOUD-TASK-ID";

    public static final String VCLOUD_TASK_HREF_HEADER = "X-VMWARE-VCLOUD-TASK-HREF";

    public static final String MULTISITE_QUERY_HEADER = "X-VMWARE-VCLOUD-MULTISITE-QUERY";

    public static final String VCLOUD_COOKIE_NAME = "vcloud-token";

    public static final String SESSION_COOKIE_NAME = "vcloud_session_id";

    public static final String JWT_COOKIE_NAME = "vcloud_jwt";

    public static final String VCLOUD_AUTH_CONTEXT_HEADER = "X-VMWARE-VCLOUD-AUTH-CONTEXT";

    public static final String VCLOUD_ACCESS_TOKEN_HEADER = "X-VMWARE-VCLOUD-ACCESS-TOKEN";

    public static final String VCLOUD_TOKEN_TYPE_HEADER = "X-VMWARE-VCLOUD-TOKEN-TYPE";

    public static final String API_VERSION_5_7 = "5.7";

    //public static final String API_VERSION_ATTR = AcceptHeader.VERSION_PARAMETER_NAME + "=";
    public static final String API_VERSION_ATTR = "version" + "=";

    //public static final String MULTISITE_ATTR = AcceptHeader.MULTISITE_PARAMETER_NAME + "=";
    public static final String MULTISITE_ATTR = "multisite" + "=";

    //public static final String MULTISITE_ATTR_GLOBAL = AcceptHeader.MULTISISTE_ACCEPT_GLOBAL;
    public static final String MULTISITE_ATTR_GLOBAL = "global";

    //public static final String MULTISITE_ATTR_LOCAL = AcceptHeader.MULTISISTE_ACCEPT_LOCAL;
    public static final String MULTISITE_ATTR_LOCAL = "local";

    public static final String OPENAPI_BASE_PATH = "/cloudapi";
}
