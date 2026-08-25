package com.taskmaster.core.network.interceptor

import com.taskmaster.core.network.auth.TokenProvider
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    private val tokenProvider: TokenProvider
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        // Skip auth for login/register endpoints
        if (request.url.encodedPath.contains("/auth/login") ||
            request.url.encodedPath.contains("/auth/register")
        ) {
            return chain.proceed(request)
        }

        // Get access token from the single token store owned by :core:data
        val token = runBlocking { tokenProvider.accessToken() }

        // Add Authorization header if token exists
        val newRequest = if (token != null) {
            request.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            request
        }

        return chain.proceed(newRequest)
    }
}
