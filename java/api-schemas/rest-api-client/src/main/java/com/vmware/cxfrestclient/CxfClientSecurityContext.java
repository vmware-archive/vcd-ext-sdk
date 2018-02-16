/* *****************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * ****************************************************************************/

package com.vmware.cxfrestclient;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.crypto.Cipher;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509KeyManager;
import javax.net.ssl.X509TrustManager;

/**
 * A security context for {@link AbstractCxfRestClient} to control select SSL connection and https verification parameters
 * <P>
 * An object of this class can be created using one of the public factory methods:
 * <ul>
 *   <li>{@link #getCxfClientSecurityContext(KeyStore, char[], KeyStore, Collection, boolean)}</li>
 *   <li>{@link #getDefaultCxfClientSecurityContext()}</li>
 * </ul>
 *
 * {@code AbstractCxfRestClient} uses an object of this class to determine:
 * <ul>
 *   <li>Overriding {@link KeyManager}s, if any</li>
 *   <li>Overriding {@link TrustManager}s, if any</li>
 *   <li>Overriding {@link Collection} of {@code Protocol}s, if any</li>
 *   <li>Overriding {@link Collection} of {@link Cipher}s, if any</li>
 *   <li>Whether hostname must be verified when initiating an HTTPS session. If yes, hostname will be verified using platform {@link HostnameVerifier}</li>
 * </ul>
 *
 */
public final class CxfClientSecurityContext {
    // 'null' causes JRE's default trust manager/key manager/protocols/cipher suites to be used.
    private static final X509TrustManager[] DEFAULT_TRUST_MANAGER = null;
    private static final X509KeyManager[] DEFAULT_KEY_MANAGER = null;
    public static final Collection<String> DEFAULT_PROTOCOL_LIST = null;
    public static final Collection<String> DEFAULT_CIPHER_LIST = null;

    private final boolean enableHostnameVerification;
    private final SSLSocketFactory sslSocketFactory;

    private CxfClientSecurityContext() {
        sslSocketFactory = (SSLSocketFactory)SSLSocketFactory.getDefault();
        this.enableHostnameVerification = true;
    }

    private CxfClientSecurityContext(final KeyManager[] keyManagers, final TrustManager[] trustManagers,
            final Collection<String> protocols, final Collection<String> ciphers,
            final boolean enableHostnameVerification) throws GeneralSecurityException {
        this.enableHostnameVerification = enableHostnameVerification;
        this.sslSocketFactory = createRestrictedSocketFactory(keyManagers, trustManagers, protocols, ciphers);
    }

    private CxfClientSecurityContext(final SSLSocketFactory sslSocketFactory, final boolean enableHostnameVerification) {
        this.enableHostnameVerification = enableHostnameVerification;
        this.sslSocketFactory = sslSocketFactory;
    }

    /**
     * Factory method to get a context that will configure {@link AbstractCxfRestClient} to use
     * system default key managers, trust managers and cipher suites for SSL Handshake and system
     * default hostname verifier for https
     */
    public static CxfClientSecurityContext getDefaultCxfClientSecurityContext() {
            return new CxfClientSecurityContext();
    }

    /**
     * Factory method to get a context that will configure {@link AbstractCxfRestClient}'s SSL
     * Handshake context and hostname verifier as specified by the input provided
     *
     * @param keystore
     *            {@link KeyStore} that contains key material to configure client's
     *            {@link KeyManager}. <code>null</code> input means use system default key manager
     * @param keyPassword
     *            Password to decrypt information in provided {@code keystore}. Ignored if no
     *            keystore provided
     * @param truststore
     *            {@link KeyStore} that contains trust material to configure client's
     *            {@link TrustManager}. <code>null</code> means use system default trust manager
     * @param ciphers
     *            List of ciphers that are permitted for use by the client during SSL Handshake.
     *            {@link #DEFAULT_CIPHER_LIST} means use system default cipher suite
     * @param enableHostnameVerification
     *            <code>true</code> would indicate using system default hostname verifier for https.
     *            <code>false</code> indicates do not use an all-permitting hostname verifier
     * @return {@link CxfClientSecurityContext} that will help {@link AbstractCxfRestClient} to pick
     *         up configuration as described.
     * @throws GeneralSecurityException
     *             if either the keystore or the truststore could not be used to set up necessary
     *             managers
     */
    public static CxfClientSecurityContext getCxfClientSecurityContext(final KeyStore keystore,
            final char[] keyPassword, final KeyStore truststore, final Collection<String> ciphers,
            final boolean enableHostnameVerification) throws GeneralSecurityException {
        return getCxfClientSecurityContext(keystore, keyPassword, truststore,
                DEFAULT_PROTOCOL_LIST, ciphers, enableHostnameVerification);
    }

    /**
     * Factory method to get a context that will configure {@link AbstractCxfRestClient}'s SSL
     * Handshake context and hostname verifier as specified by the input provided
     *
     * @param keystore
     *            {@link KeyStore} that contains key material to configure client's
     *            {@link KeyManager}. <code>null</code> input means use system default key manager
     * @param keyPassword
     *            Password to decrypt information in provided {@code keystore}. Ignored if no
     *            keystore provided
     * @param truststore
     *            {@link KeyStore} that contains trust material to configure client's
     *            {@link TrustManager}. <code>null</code> means use system default trust manager
     * @param protocols
     *            List of protocols that are permitted for use by the client during SSL Handshake.
     *            {@link #DEFAULT_PROTOCOL_LIST} means use system default cipher suite
     * @param ciphers
     *            List of ciphers that are permitted for use by the client during SSL Handshake.
     *            {@link #DEFAULT_CIPHER_LIST} means use system default cipher suite
     * @param enableHostnameVerification
     *            <code>true</code> would indicate using system default hostname verifier for https.
     *            <code>false</code> indicates do not use an all-permitting hostname verifier
     * @return {@link CxfClientSecurityContext} that will help {@link AbstractCxfRestClient} to pick
     *         up configuration as described.
     * @throws GeneralSecurityException
     *             if either the keystore or the truststore could not be used to set up necessary
     *             managers
     */
    public static CxfClientSecurityContext getCxfClientSecurityContext(final KeyStore keystore,
            final char[] keyPassword, final KeyStore truststore, final Collection<String> protocols,
            final Collection<String> ciphers, final boolean enableHostnameVerification) throws GeneralSecurityException {
        final KeyManager[] keyManagers = getKeyManagers(keystore, keyPassword);
        final TrustManager[] trustManagers = getTrustManagers(truststore);

        return new CxfClientSecurityContext(keyManagers, trustManagers, protocols, ciphers, enableHostnameVerification);
    }

    /**
     * Factory method to get a context that will configure {@link AbstractCxfRestClient}'s SSL
     * Handshake context and hostname verifier as specified by the input provided
     *
     * @param sslSocketFactory
     *            {@link SSLSocketFactory} to use when connecting to vCD/vCTA
     * @param enableHostnameVerification
     *            whether hostname verification should be enabled or disabled
     * @return {@link CxfClientSecurityContext} that will help {@link AbstractCxfRestClient} to pick
     *         up the {@link SSLSocketFactory} provided and configure hostname verification as
     *         specified.
     */
    public static CxfClientSecurityContext getCxfClientSecurityContext(
            final SSLSocketFactory sslSocketFactory, final boolean enableHostnameVerification) {
        return new CxfClientSecurityContext(sslSocketFactory, enableHostnameVerification);
    }

    /**
     * If a truststore is provided, initializes a new {@link TrustManager} that will be configured
     * to trust certificates and CA's present in the truststore
     *
     * @param truststore
     *            {@link KeyStore} containing trust material; <code>null</code> chooses default
     *            Trust Manager
     * @return a newly created {@link TrustManager} or <code>null</code> if default trust manager
     *         must be used.
     * @throws KeyStoreException
     *             If {@code truststore} contents cannot be accessed for some reason.
     */
    private static TrustManager[] getTrustManagers(KeyStore truststore) throws KeyStoreException {
        if (truststore == null) {
            return DEFAULT_TRUST_MANAGER;
        }

        final TrustManagerFactory trustManagerFactory;
        try {
            trustManagerFactory = TrustManagerFactory.getInstance("PKIX");
        } catch (NoSuchAlgorithmException nsae) {
           throw new AssertionError("Required Trust Manager algorithm PKIX unavailable on this system", nsae);
        }
        trustManagerFactory.init(truststore);

        return trustManagerFactory.getTrustManagers();
    }

    /**
     * If a keystore is provided, initializes a new {@link KeyManager} that will be configured with
     * key and certificates present in the keystore
     *
     * @param keystore
     *            {@link KeyStore} containing key material; <code>null</code> chooses default Key
     *            Manager
     * @param keyPassword
     *            password to decode key material. Ignored if {@code keystore} is null
     * @return a newly created {@link KeyManager} or <code>null</code> if default key manager must
     *         be used.
     * @throws GeneralSecurityException
     *             If keystore contents cannot be accessed for some reason.
     */
    private static KeyManager[] getKeyManagers(final KeyStore keystore, final char[] keyPassword)
            throws GeneralSecurityException {
        if (keystore == null) {
            return DEFAULT_KEY_MANAGER;
        }

        final KeyManagerFactory keyManagerFactory;
        try {
            keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
        } catch (NoSuchAlgorithmException nsae) {
            throw new AssertionError("Required Key Manager algorithm SunX509 unavailable on this system", nsae);
        }

        keyManagerFactory.init(keystore, keyPassword);
        return keyManagerFactory.getKeyManagers();
    }

    final boolean isHostnameVerificationEnabled() {
        return enableHostnameVerification;
    }

    public final SSLSocketFactory getSSLSocketFactory() {
        return sslSocketFactory;
    }

    private static String getTLSVersionForJava() {
        String javaVersionStr = System.getProperty("java.version");
        final String[] versionParts = javaVersionStr.split("\\.");
        if (Integer.parseInt(versionParts[0]) == 1) {
            final int javaMajorVersion = Integer.parseInt(versionParts[1]);
            if (javaMajorVersion >= 8) {
                return "TLS";
            } else if (javaMajorVersion == 7) {
                return "TLSv1.2";
            }
        }
        throw new UnsupportedOperationException("Java version " + javaVersionStr + " is not supported." +
                                                " Java 1.7 or later required");
    }

    private SSLSocketFactory createRestrictedSocketFactory(final KeyManager[] keyManagers, final TrustManager[] trustManagers,
            final Collection<String> protocols, final Collection<String> ciphers) throws GeneralSecurityException {
        final SSLContext restrictedSSLContext;
        restrictedSSLContext = SSLContext.getInstance(getTLSVersionForJava());
        restrictedSSLContext.init(keyManagers, trustManagers, new SecureRandom());
        return new RestrictedSSLSocketFactory(restrictedSSLContext.getSocketFactory(), protocols, ciphers);
    }

    @Override
    public int hashCode() {
        return Objects.hash(enableHostnameVerification, sslSocketFactory);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof CxfClientSecurityContext)) {
            return false;
        }
        CxfClientSecurityContext other = (CxfClientSecurityContext) obj;
        return Objects.equals(enableHostnameVerification, other.enableHostnameVerification) &&
               Objects.equals(sslSocketFactory, other.sslSocketFactory);
    }

    @Override
    public String toString() {
        return String
                .format("[CxfClientSecurityContext] " +
                        "SSLSocketFactory = %s,\n" +
                        "Hostname verification is %s.",
                        sslSocketFactory,
                        enableHostnameVerification ? "enabled" : "disabled");
    }

    /**
     * Wraps a {@link SSLSocketFactory} to ensure newly created sockets enforce preferred ciphers
     * and protocol use only.
     *
     * (This class is mostly similar to one in common-crypto, but due to project isolation, is
     * repeated here)
     */
    private static final class RestrictedSSLSocketFactory extends SSLSocketFactory {
        private final SSLSocketFactory sslSocketFactory;
        private final Set<String> protocols;
        private final String[] ciphers;

        public RestrictedSSLSocketFactory(final SSLSocketFactory sslSocketFactory,
                final Collection<String> protocols, final Collection<String> ciphers) {
            this.sslSocketFactory = sslSocketFactory;
            this.protocols = (protocols == null) ? null : new HashSet<>(protocols);
            this.ciphers = intersectionOf(ciphers, sslSocketFactory.getSupportedCipherSuites());
        }

        @Override
        public String[] getDefaultCipherSuites() {
            return ciphers;
        }

        @Override
        public String[] getSupportedCipherSuites() {
            return ciphers;
        }

        @Override
        public Socket createSocket(Socket s, String host, int port, boolean autoClose)
                throws IOException {
            return restrict((SSLSocket) sslSocketFactory.createSocket(s, host, port, autoClose));
        }

        @Override
        public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
            return restrict((SSLSocket) sslSocketFactory.createSocket(host, port));
        }

        @Override
        public Socket createSocket(InetAddress host, int port) throws IOException {
            return restrict((SSLSocket) sslSocketFactory.createSocket(host, port));
        }

        @Override
        public Socket createSocket(String host, int port, InetAddress localHost, int localPort)
                throws IOException, UnknownHostException {
            return restrict((SSLSocket) sslSocketFactory.createSocket(host, port, localHost, localPort));
        }

        @Override
        public Socket createSocket(InetAddress address, int port, InetAddress localAddress,
                int localPort) throws IOException {
            return restrict((SSLSocket) sslSocketFactory.createSocket(address, port, localAddress, localPort));
        }

        private SSLSocket restrict(final SSLSocket socket) {
            socket.setEnabledProtocols(intersectionOf(protocols, socket.getEnabledProtocols()));
            socket.setEnabledCipherSuites(ciphers);
            return socket;
        }

        private static String[] intersectionOf(final Collection<String> configured, final String[] supported) {
            if (configured == null) {
                return supported;
            }
            final Set<String> resultSet = new HashSet<>(Arrays.asList(supported));
            resultSet.retainAll(configured);
            return resultSet.toArray(new String[resultSet.size()]);
        }
    }
}
