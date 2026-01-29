package com.taskmaster.core.data.repository

import com.taskmaster.core.network.api.AuthApi
import com.taskmaster.core.network.model.LoginRequest
import com.taskmaster.core.network.model.RegisterRequest
import com.taskmaster.core.network.model.AuthResponse
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi
) {
    suspend fun login(email: String, password: String): Result<AuthResponse> {
        return try {
            val response = authApi.login(LoginRequest(email, password))
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(email: String, password: String, fullName: String): Result<AuthResponse> {
        return try {
            val response = authApi.register(RegisterRequest(email, password, fullName))
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout(): Result<Unit> {
        return try {
            authApi.logout()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
