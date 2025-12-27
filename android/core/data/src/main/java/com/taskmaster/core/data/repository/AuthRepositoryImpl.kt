package com.taskmaster.core.data.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.taskmaster.core.common.Constants
import com.taskmaster.core.common.Result
import com.taskmaster.core.data.mapper.toDomain
import com.taskmaster.core.data.mapper.toEntity
import com.taskmaster.core.database.dao.UserDao
import com.taskmaster.core.domain.model.User
import com.taskmaster.core.domain.repository.AuthRepository
import com.taskmaster.core.network.api.AuthApiService
import com.taskmaster.core.network.model.LoginRequest
import com.taskmaster.core.network.model.RefreshTokenRequest
import com.taskmaster.core.network.model.RegisterRequest
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = Constants.PREFS_NAME)

@Singleton
class AuthRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val authApiService: AuthApiService,
    private val userDao: UserDao
) : AuthRepository {

    private val accessTokenKey = stringPreferencesKey(Constants.KEY_ACCESS_TOKEN)
    private val refreshTokenKey = stringPreferencesKey(Constants.KEY_REFRESH_TOKEN)
    private val userIdKey = stringPreferencesKey(Constants.KEY_USER_ID)

    override suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = authApiService.login(LoginRequest(email, password))
            if (response.success && response.data != null) {
                val authData = response.data
                saveTokens(authData.accessToken, authData.refreshToken)
                saveUserId(authData.user.id)
                userDao.insertUser(authData.user.toEntity())
                Result.Success(authData.user.toDomain())
            } else {
                Result.Error(Exception(response.message))
            }
        } catch (e: Exception) {
            Result.Error(e, e.message)
        }
    }

    override suspend fun register(
        email: String,
        password: String,
        fullName: String?
    ): Result<User> {
        return try {
            val response = authApiService.register(
                RegisterRequest(email, password, fullName)
            )
            if (response.success && response.data != null) {
                val authData = response.data
                saveTokens(authData.accessToken, authData.refreshToken)
                saveUserId(authData.user.id)
                userDao.insertUser(authData.user.toEntity())
                Result.Success(authData.user.toDomain())
            } else {
                Result.Error(Exception(response.message))
            }
        } catch (e: Exception) {
            Result.Error(e, e.message)
        }
    }

    override suspend fun logout(): Result<Unit> {
        return try {
            authApiService.logout()
            clearTokens()
            userDao.clearAll()
            Result.Success(Unit)
        } catch (e: Exception) {
            // Clear local data even if API call fails
            clearTokens()
            userDao.clearAll()
            Result.Success(Unit)
        }
    }

    override suspend fun getCurrentUser(): Flow<User?> {
        return context.dataStore.data.map { preferences ->
            val userId = preferences[userIdKey]
            userId?.let {
                userDao.getUser(it).map { entity -> entity?.toDomain() }
            }
        }.map { it?.let { flow -> flow.map { user -> user } } }
            .map { null } // Simplified - needs proper implementation
    }

    override suspend fun refreshToken(): Result<String> {
        return try {
            val refreshToken = getRefreshToken()
            if (refreshToken != null) {
                val response = authApiService.refreshToken(
                    RefreshTokenRequest(refreshToken)
                )
                if (response.success && response.data != null) {
                    saveAccessToken(response.data.accessToken)
                    Result.Success(response.data.accessToken)
                } else {
                    Result.Error(Exception(response.message))
                }
            } else {
                Result.Error(Exception("No refresh token available"))
            }
        } catch (e: Exception) {
            Result.Error(e, e.message)
        }
    }

    override fun isLoggedIn(): Flow<Boolean> {
        return context.dataStore.data.map { preferences ->
            preferences[accessTokenKey] != null
        }
    }

    private suspend fun saveTokens(accessToken: String, refreshToken: String) {
        context.dataStore.edit { preferences ->
            preferences[accessTokenKey] = accessToken
            preferences[refreshTokenKey] = refreshToken
        }
    }

    private suspend fun saveAccessToken(accessToken: String) {
        context.dataStore.edit { preferences ->
            preferences[accessTokenKey] = accessToken
        }
    }

    private suspend fun saveUserId(userId: String) {
        context.dataStore.edit { preferences ->
            preferences[userIdKey] = userId
        }
    }

    private suspend fun getRefreshToken(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[refreshTokenKey]
        }.map { it }
            .map { null } // Simplified
    }

    private suspend fun clearTokens() {
        context.dataStore.edit { preferences ->
            preferences.remove(accessTokenKey)
            preferences.remove(refreshTokenKey)
            preferences.remove(userIdKey)
        }
    }
}
