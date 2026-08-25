package com.taskmaster.core.network.auth

/**
 * Supplies the current access token to [com.taskmaster.core.network.interceptor.AuthInterceptor].
 *
 * Declared here rather than in :core:data so the interceptor does not have to reach
 * across the module boundary — :core:data depends on :core:network, not the reverse.
 * Keeping a single owner of the token DataStore also avoids creating a second
 * DataStore instance over the same file, which throws at runtime.
 */
interface TokenProvider {
    suspend fun accessToken(): String?
}
