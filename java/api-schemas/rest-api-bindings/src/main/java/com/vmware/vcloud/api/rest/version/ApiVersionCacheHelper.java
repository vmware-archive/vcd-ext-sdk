/* **********************************************************************
 * api-extension-template-vcloud-director
 * Copyright 2015-2018 VMware, Inc.  All rights reserved.
 * SPDX-License-Identifier: BSD-2-Clause
 * *********************************************************************/

package com.vmware.vcloud.api.rest.version;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.vmware.vcloud.api.rest.version.ApiVersion.Alias;

/**
 * This class helps with the lazy-init of the cached values of {@link ApiVersion} and
 * {@link ApiVersion.Alias}. Because an Alias enum references an ApiVersion enum, building a static
 * cache in the traditional pattern causes the Groovy compiler to throw an NPE at the declaration of
 * the Alias enum. This helper and its pattern solves that problem.
 */
class ApiVersionCacheHelper {

    /** Initialization-on-demand holder idiom */
    static final ApiVersionCache instance = new ApiVersionCache();

    /**
     * This inner static class builds the cache upon construction. It also provides a read-only
     * contract to the cache maps.
     */
    static class ApiVersionCache {

        private final Map<String, ApiVersion> cachedValues;
        private final Map<String, ApiVersion> cachedAliasValues;

        ApiVersionCache() {

            // Build alias cache
            final Map<String, ApiVersion> aliases = new HashMap<String, ApiVersion>();
            for (Alias v : Alias.values()) {
                String key = v.name();
                aliases.put(key, v.getMapping());
            }
            cachedAliasValues = Collections.unmodifiableMap(aliases);

            // Build ordinary cache
            final Map<String, ApiVersion> directVerions = new HashMap<String, ApiVersion>();
            for (ApiVersion v : ApiVersion.values()) {
                String key = v.value();
                directVerions.put(key, v);
            }
            cachedValues = Collections.unmodifiableMap(directVerions);
        }

        /**
         * @param key
         *            ordinary version string
         * @return true if version string is a key in cache, false otherwise
         */
        boolean isCached(String key) {
            return cachedValues.containsKey(key);
        }

        /**
         * @param key
         *            alias string
         * @return true if alias string is a key in cache, false otherwise
         */
        boolean isAliasCached(String key) {
            return cachedAliasValues.containsKey(key);
        }

        ApiVersion getValue(String key) {
            return cachedValues.get(key);
        }

        ApiVersion getAliasValue(String key) {
            return cachedAliasValues.get(key);
        }

        Set<String> getAllKeys() {
            final Set<String> keys = new HashSet<String>();
            keys.addAll(cachedValues.keySet());
            keys.addAll(cachedAliasValues.keySet());
            return keys;
        }
    }
}