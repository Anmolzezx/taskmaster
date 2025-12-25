package com.taskmaster.core.network.interceptor

import android.content.Context
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.taskmaster.core.common.Constants
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = Constants.PREFS_NAME)

@Singleton
class AuthInterceptor @Inject constructor(
    @ApplicationContext private val context: Context
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        
        // Skip auth for login/register endpoints
        if (request.url.encodedPath.contains("/auth/login") ||
            request.url.encodedPath.contains("/auth/register")
        ) {
            return chain.proceed(request)
        }

        // Get access token from DataStore
        val token = runBlocking {
            context.dataStore.data.map { preferences ->
                preferences[stringPreferencesKey(Constants.KEY_ACCESS_TOKEN)]
            }.first()
        }

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
