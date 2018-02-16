/* ***************************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2011-2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 * **************************************************************************/

package com.vmware.vcloud.api.rest.version;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import com.vmware.vcloud.api.annotation.Supported;

/**
 * <p>
 * Enum with supported API version.
 * <p>
 * <b>IMPORTANT!</b> Versions are compared using the natural enum order, so keep them in ascending
 * order!
 * </p>
 * @since 1.5.0
 */
public enum ApiVersion {

    /** Introduced in product version 1.0 */
    @Deprecated
    VERSION_1_0("1.0", true),

    /** Introduced in product version 1.5 */
    @Deprecated
    VERSION_1_5("1.5", true),

    /** Introduced in product version 5.1 */
    @Deprecated
    VERSION_5_1("5.1", true),

    /** Introduced in product version 5.5 */
    VERSION_5_5("5.5"),

    /** Introduced in product version 5.6 */
    VERSION_5_6("5.6"),

    /** Introduced in product version 5.7 */
    VERSION_5_7("5.7", true),

    /** Introduced in product version 5.8 */
    VERSION_5_8("5.8", true),

    /** Introduced in product version 5.9 */
    VERSION_5_9("5.9", true),

    /** Introduced in product version 6.1 */
    VERSION_5_10("5.10", true),

    /** Introduced in product version 6.2 */
    VERSION_5_11("5.11", true),

    /** Introduced in product version 6.3 */
    VERSION_5_12("5.12", true),

    /** Introduced in product version 6.4 */
    VERSION_6_0("6.0", true),

    /** Introduced in product version 6.5 */
    VERSION_7_0("7.0", true),

    /** Skipped */
    //VERSION_8_0("8.0"),

    /** Introduced in product version 7.1 */
    VERSION_9_0("9.0"),

    /** Introduced in product version 8.1 */
    VERSION_11_0("11.0", true),

    /** Introduced in product version 8.2 */
    VERSION_12_0("12.0", true),

    /** Introduced in product version 8.3 */
    VERSION_13_0("13.0"),

    /** Introduced in product version 8.4 */
    VERSION_14_0("14.0", true),

    /** Introduced in product version 8.6 */
    VERSION_16_0("16.0", true),

    /** Introduced in product version 8.7 */
    VERSION_17_0("17.0"),

    /** Introduced in product version 8.8 */
    VERSION_18_0("18.0", true),

    /** Introduced in product version 8.9 */
    VERSION_19_0("19.0", true),

    /** Introduced in product version 8.10 */
    VERSION_20_0("20.0"),

    /** Introduced in product version 8.11 */
    VERSION_21_0("21.0"),

    /** Introduced in product version 8.12 */
    VERSION_22_0("22.0"),

    /** Introduced in product version 8.13 */
    VERSION_23_0("23.0"),

    /** Introduced in product version 8.14 */
    VERSION_24_0("24.0"),

    /** Introduced in product version 8.15 */
    VERSION_25_0("25.0"),

    /** Introduced in product version 8.16 */
    VERSION_26_0("26.0"),

    /** Introduced in product version 8.17 */
    VERSION_27_0("27.0"),

    /** Introduced in product version 8.21 */
    VERSION_28_0("28.0"),

    /** Introduced in product version 8.22 */
    VERSION_29_0("29.0"),

    /** Introduced in product version 9.0.0 */
    VERSION_30_0("30.0"),

    /** Larger than all versions. Keep last! */
    VERSION_MAX("");

    /**
     * This enum will help manage all API version alias mappings.
     */
    public enum Alias {
        MIN_SUPPORTED(ApiVersion.VERSION_5_5),
        OBJECT_EXTENSIBILITY(ApiVersion.VERSION_16_0),
        VM_AFFINITY_RULES(ApiVersion.VERSION_20_0),
        MAX_SUPPORTED(ApiVersion.VERSION_30_0),
        VAPP_AUTO_NATURE(ApiVersion.VERSION_22_0),
        VDC_ADOPT_RP(ApiVersion.VERSION_22_0),
        PERSIST_TABLE_ACCESS(ApiVersion.VERSION_22_0),
        VDC_PERMISSIONS(ApiVersion.VERSION_11_0),
        OPTIMIZED_REVERT_VAPP_WORKFLOW(ApiVersion.VERSION_14_0),
        VDC_TEMPLATES(ApiVersion.VERSION_5_7),
        FUTURE(ApiVersion.VERSION_MAX),
        ORG_RIGHTS_ROLES(ApiVersion.VERSION_27_0),
        MULTI_SITE(ApiVersion.VERSION_29_0),
        MULTI_SITE_NETWORKING(ApiVersion.VERSION_30_0),
        VM_HOST_AFFINITY(ApiVersion.VERSION_27_0),
        ORG_LEASE_EXPIRE(ApiVersion.VERSION_25_0),
        AUTO_DISCOVER_VM_SETTINGS(ApiVersion.VERSION_27_0),
        DYNAMIC_HW_VERSION_SUPPORT(ApiVersion.VERSION_29_0),
        REGENERATE_BIOS_UUID(ApiVersion.VERSION_29_0),
        TENANT_STORAGE_MIGRATION(ApiVersion.VERSION_29_0),
        CREATE_BLANK_VM(ApiVersion.VERSION_29_0),
        INSTANTIATE_VM_TEMPLATE(ApiVersion.VERSION_29_0),
        VXLAN_NETWORK_POOL(ApiVersion.VERSION_29_0),
        PORTAL_BRANDING(ApiVersion.VERSION_30_0),
        RECOMPOSE_BLANK_VM(ApiVersion.VERSION_30_0),
        REMOVED_VERSION_15_51(ApiVersion.VERSION_30_0),
        VRO_WORKFLOW_SUPPORT(ApiVersion.VERSION_30_0),
        JWT_LOGIN_SUPPORT(ApiVersion.VERSION_30_0),
        ENABLE_OVA_DOWNLOAD(ApiVersion.VERSION_30_0),
        ORG_VDC_ROLLUP(ApiVersion.VERSION_30_0),
        IMPORT_VM_STANDALONE(ApiVersion.VERSION_30_0),
        IMPROVED_SITE_NAME(ApiVersion.VERSION_30_0),
        ;

        private final ApiVersion mapping;

        private final Alias parentAlias;

        private Alias(ApiVersion mapping) {
            this.mapping = mapping;
            this.parentAlias = null;
        }

        private Alias(Alias alias) {
            this.mapping = null;
            this.parentAlias = alias;
        }

        /**
         * @return the aliased API Version
         */
        public ApiVersion getMapping() {
            if (parentAlias != null) {
                return parentAlias.getMapping();
            }

            return mapping;
        }
    }

    private final String version;

    private final boolean isDeprecated;

    ApiVersion(String version) {
        this.version = version;
        this.isDeprecated = false;
    }

    ApiVersion(String version, boolean isDeprecated) {
        this.version = version;
        this.isDeprecated = isDeprecated;
    }

    /**
     * @return the version as string
     */
    public String value() {
        return version;
    }

    /**
     * @return flag indicating if the API version is marked for deprecation
     */
    public boolean isDeprecated() {
        return isDeprecated;
    }

    /**
     * @param v version as string
     * @return version as enum item
     * @throws IllegalArgumentException if the version is not recognized
     */
    public static ApiVersion fromValue(String v) {
        if (!ApiVersionCacheHelper.instance.isCached(v)) {
            if (!ApiVersionCacheHelper.instance.isAliasCached(v)) {
                throw new IllegalArgumentException("Unknown API version: " + v);
            }
            return ApiVersionCacheHelper.instance.getAliasValue(v);
        }
        return ApiVersionCacheHelper.instance.getValue(v);
    }

    /**
     * Checks if the version is in the range supported by <b>s</b>.
     *
     * @param s the supported range
     * @return {@code true} if s.addedIn <= this < s.removedIn or if s is {@code null}
     */
    public boolean isInRange(Supported s) {
        return s == null || isInRange(fromValue(s.addedIn()), fromValue(s.removedIn()));
    }

    /**
     * Checks if the current version is in range [min..max).
     *
     * @param min
     * @param max
     * @return {@code true} if min <= this < max
     */
    public boolean isInRange(final ApiVersion min, final ApiVersion max) {
        if (max == VERSION_MAX) {
            return min.compareTo(this) <= 0;
        }

        return min.compareTo(this) <= 0 && this.compareTo(max) < 0;
    }

    /**
     * Tests if this {@code ApiVersion} is greater than or equal to the given one.
     *
     * @param version
     *            the version to compare this version to
     * @return true if this {@code ApiVersion} is greater than or equal to {@code version}, false
     *         otherwise
     */
    public boolean isAtLeast(final ApiVersion version) {
        return this.compareTo(version) >= 0;
    }

    /**
     * Tests if this {@code ApiVersion} is less than or equal to the given one.
     *
     * @param version
     *            the version to compare this version to
     * @return true if this {@code ApiVersion} is less than or equal to {@code version}, false
     *         otherwise
     */
    public boolean isAtMost(final ApiVersion version) {
        return this.compareTo(version) <= 0;
    }

    /**
     * @return the set of keys used in the cache.
     */
    public static Set<String> getAllKeys() {
        return ApiVersionCacheHelper.instance.getAllKeys();
    }

    /**
     * @param aliasStr
     *            alias string
     * @return true if an Alias, false otherwise
     */
    public static boolean isAnAlias(String aliasStr) {
        return ApiVersionCacheHelper.instance.isAliasCached(aliasStr);
    }

    /**
     * Gets a list of ApiVersion between the min and max apiVersions (Inclusive).
     *
     * @param minApiVersion
     *            Min version
     * @param maxApiVersion
     *            Max version
     * @return List of ApiVersion
     */
    public static List<ApiVersion> getRange(final ApiVersion minApiVersion,
            final ApiVersion maxApiVersion) {

        final int startIndex = minApiVersion.ordinal();
        final int endIndex = maxApiVersion.ordinal() + 1;

        final ApiVersion[] values = ApiVersion.values();

        return Arrays.asList(Arrays.copyOfRange(values, startIndex, endIndex));
    }

    /**
     * Gets a list of ApiVersion from the min version to the max supported version for this vCD
     * instance. (Inclusive)
     *
     * @param minApiVersion
     *            Min version
     * @return List of ApiVersion
     */
    public static List<ApiVersion> getRangeAbove(final ApiVersion minApiVersion) {
        return getRange(minApiVersion, Alias.MAX_SUPPORTED.getMapping());
    }
}
