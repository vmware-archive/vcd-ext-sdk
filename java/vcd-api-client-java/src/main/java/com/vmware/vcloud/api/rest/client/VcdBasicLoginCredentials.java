/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import org.apache.cxf.common.util.Base64Utility;

/**
 * Username@Org/password Credentials suitable for use in authenticating with a vCD server using the
 * vCloud API
 */
public class VcdBasicLoginCredentials implements ClientCredentials {

    private final String authorizationHeader;

    /**
     * Construct credentials from a valid vCD organization qualified username  (username@orgname)
     * and a password.
     */
    public VcdBasicLoginCredentials(String userNameAtOrg, String password) {
        this(userNameAtOrg + ":" + password);
    }

    /**
     * Construct credentials from a valid vCD user and org names and a password.
     */
    public VcdBasicLoginCredentials(String userName, String orgName, String password) {
        this(userName + "@" + orgName + ":" + password);
    }

    private VcdBasicLoginCredentials(String userString) {
        authorizationHeader = "Basic " + Base64Utility.encode(userString.getBytes());
    }

    @Override
    public boolean equals(Object obj) {
        return authorizationHeader.equals(obj);
    }

    @Override
    public int hashCode() {
        return authorizationHeader.hashCode();
    }

    @Override
    public String getHeaderValue() {
        return authorizationHeader;
    }

    @Override
    public String getHeaderName() {
        return "Authorization";
    }

    @Override
    public boolean supportsSessionless() {
        return false;
    }


}
