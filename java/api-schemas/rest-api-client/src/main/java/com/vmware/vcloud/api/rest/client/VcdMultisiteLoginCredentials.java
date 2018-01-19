/* *********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.client;

import java.io.IOException;
import java.io.StringReader;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.text.MessageFormat;
import java.util.Base64;
import java.util.Objects;
import java.util.UUID;

import javax.ws.rs.ProcessingException;

import com.vmware.vcloud.api.rest.client.filters.MultisiteAuthorizationFilter;

import org.apache.cxf.message.Message;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

/**
 *
 * Certificate based credentials for signing the body of a multisite request. Unlike most
 * {@link ClientCredentials}, the credentials here are inserted by the
 * {@link MultisiteAuthorizationFilter} when we also know the body of the message. Signature
 * string created in partial compliance with
 * https://tools.ietf.org/html/draft-cavage-http-signatures-06
 *
 * Steps for signature:\n
 *
 * 1. During creation of the request {@link #getHeaderValue()} is used to add
 * {@value VcdMultisiteLoginCredentials#AUTH_TYPE} to the {@code Authorization} header.\n
 *
 * 2. When sending the request, the {@link MultisiteAuthorizationFilter} intercepts the request.
 *
 * 3. The authorization header is crafted using {@link #createMultisiteAuthorizationHeader(String, String, String, String, byte[])
 *  and inserted by the filter.
 *
 * @since 8.22
 */
public class VcdMultisiteLoginCredentials implements ClientCredentials {

    public static final String AUTH_TYPE = "Multisite";

    public static final String MULTISITE_BASIC_AUTH_HEADER_TEMPLATE = "{0} {1}:{2} {3}; {4}";
    public static final String MULTISITE_SSO_AUTH_HEADER_TEMPLATE = "{0} {1}:{2} {3}, {4}";
    public static final String MULTISITE_BASIC_AUTH_USERORG_TEMPLATE = "{0}@{1}";

    private static final String SIGNING_STRING_TEMPLATE = "(request-target): {0} {1}\n"
            + "date: {2}\n" + "digest: {3}\n" + "content-length: {4}";
    private static final String DIGEST_ALG = "SHA-256";
    private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";

    private final String delegateCredentials;

    private final PrivateKey privateKey;

    private final String authTemplate;

    private final UUID localSiteId;

    private final UUID localOrgId;

    /**
     * Construct the multisite credentials with the key to sign with and basic credentials of the
     * user the multisite request is made on behalf of
     *
     * @param localSiteId
     *            local site UUID
     * @param localOrgId
     *            local Org UUID
     * @param userName
     *            UserName to login with
     * @param orgName
     *            org to log into
     * @param privateKey
     *            Private key to sign the contents with
     * @throws IOException
     */
    public VcdMultisiteLoginCredentials(final UUID localSiteId, final UUID localOrgId,
            final String userName, final String orgName, final String pemEncodedKey)
            throws IOException {
        this.delegateCredentials = MessageFormat.format(MULTISITE_BASIC_AUTH_USERORG_TEMPLATE,
                Objects.requireNonNull(userName, "username id is required"),
                Objects.requireNonNull(orgName, "org name is required"));
        this.privateKey = getPrivateKeyFromPemEncoding(Objects.requireNonNull(pemEncodedKey, "private key is required"));
        this.localSiteId = Objects.requireNonNull(localSiteId, "local site id is required");
        this.localOrgId = Objects.requireNonNull(localOrgId, "local org id is required");
        this.authTemplate = MULTISITE_BASIC_AUTH_HEADER_TEMPLATE;
    }

    /**
     * Construct the multisite credentials with the key to sign with and the SSO credentials of the
     * user the multisite request is made on behalf of
     *
     * @param localSiteId
     *            local site UUID
     * @param localOrgId
     *            local Org UUID
     * @param ssoCredentials
     *            User sso credentials for whom the multi-site request is being made
     * @param privateKey
     *            Private key to sign the contents with
     * @throws IOException
     */
    public VcdMultisiteLoginCredentials(final UUID localSiteId, final UUID localOrgId,
            final String ssoCredentials, final String pemEncodedKey) throws IOException {
        this.delegateCredentials = Objects.requireNonNull(ssoCredentials, "SSO credentials is required");
        this.privateKey = getPrivateKeyFromPemEncoding(Objects.requireNonNull(pemEncodedKey, "private key is required"));
        this.localSiteId = Objects.requireNonNull(localSiteId, "local site id is required");
        this.localOrgId = Objects.requireNonNull(localOrgId, "local org id is required");
        this.authTemplate = MULTISITE_SSO_AUTH_HEADER_TEMPLATE;
    }

    @Override
    public String getHeaderName() {
        return "Authorization";
    }

    @Override
    public String getHeaderValue() {
        /*
         * Simply specify the authentication type for now, to be replaced by the real authentication
         * header in the filter when we have access to the message body.
         */
        return AUTH_TYPE;
    }

    @Override
    public boolean supportsSessionless() {
        return true;
    }

    /**
     * Create the multisite authorization header from the provided information
     *
     * @param date
     *            Current date in RFC_1123_DATE_TIME format
     * @param method
     *            Rest method
     * @param path
     *            path of the request (e.g. '/cloud/org')
     * @param host
     *            Destination of the request
     * @param contentBytes
     *            Byte array of the content
     * @return Authorization header string
     */
    public String createMultisiteAuthorizationHeader(final String date, final String method,
            final String path, final byte[] contentBytes) {
        try {
            final String signingString =
                    constructSignatureString(date, method, path, contentBytes);
            final String signature = signMessage(signingString);

            return MessageFormat.format(authTemplate, AUTH_TYPE, localSiteId, localOrgId,
                    signature, delegateCredentials);
        } catch (final Exception e) {
            throw new ProcessingException(e);
        }
    }

    private String signMessage(final String signingString) throws SignatureException {

        try {
            Signature sig = Signature.getInstance(SIGNATURE_ALGORITHM);
            sig.initSign(privateKey);
            sig.update(signingString.getBytes());
            return Base64.getEncoder().encodeToString(sig.sign());
        } catch (Exception e) {
            throw new SignatureException(e);
        }
    }

    private String constructSignatureString(final String date, final String method,
            final String path, byte[] contentBytes)
            throws NoSuchAlgorithmException, IOException {

        if (contentBytes == null) {
            contentBytes = new byte[0];
        }

        final String digest = createDigest(contentBytes);
        final int contentLength = contentBytes.length;

        //Construct the string of details to sign
        final String signingString =
                MessageFormat.format(SIGNING_STRING_TEMPLATE, method, path, date, digest,
                        contentLength);
        return signingString;
    }

    /**
     * Creates a digest of the message contents using the specified {@code DIGEST_ALG}
     *
     * @param message
     *            {@link Message} to get the content from
     * @return Base64 encoded digest
     * @throws NoSuchAlgorithmException
     * @throws IOException
     */
    private String createDigest(final byte[] contentBytes) throws NoSuchAlgorithmException,
            IOException {
        final MessageDigest md = MessageDigest.getInstance(DIGEST_ALG);
        md.update(contentBytes);
        final byte[] digestBytes = md.digest();
        return Base64.getEncoder().encodeToString(digestBytes);
    }

    /**
     * Converts a PEM encoded string representation of a private key to a {@link PrivateKey}
     *
     * @param pemString
     *            Pem encoded string
     * @return {@link PrivateKey}
     * @throws IOException
     */
    private PrivateKey getPrivateKeyFromPemEncoding(String pemString) throws IOException {

        if (pemString != null) {
            try (final StringReader reader = new StringReader(pemString);
                    final PEMParser pemParser = new PEMParser(reader)) {
                final Object object = pemParser.readObject();
                if (object instanceof PrivateKeyInfo) {
                    final JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                    return converter.getPrivateKey((PrivateKeyInfo) object);
                }
                if (object instanceof PEMKeyPair) {
                    final JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                    return converter.getKeyPair((PEMKeyPair) object).getPrivate();
                }
            }
        }
        throw new IllegalArgumentException("Supplied key string is not a valid PEM encoded private key");
    }

}
