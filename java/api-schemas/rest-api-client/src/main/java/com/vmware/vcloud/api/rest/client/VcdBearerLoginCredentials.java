/* *****************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * ****************************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.text.MessageFormat;

/**
 * Bearer Token credentials suitable for use in authenticating with a vCD server using the
 * vCloud API.
 *
 * @since 9.0
 */
public final class VcdBearerLoginCredentials implements ClientCredentials {

    private final String bearerAuthenticationHeader;

    /**
     * Construct a {@link VcdBearerLoginCredentials} object using an OAuth Bearer token and VCD org name
     *
     * @param oAuthBearerToken
     *            Bearer Token supplied by an OAuth IDP
     * @param org
     *            The VCD organization name.
     */
    public VcdBearerLoginCredentials(final String oAuthBearerToken, final String org) {
        bearerAuthenticationHeader =
                MessageFormat.format("Bearer {0};org={1}", oAuthBearerToken, org);
    }

    @Override
    public String getHeaderValue() {
        return bearerAuthenticationHeader;
    }

    @Override
    public String getHeaderName() {
        return "Authorization";
    }

    @Override
    public boolean supportsSessionless() {
        return true;
    }


}
