package com.taskmaster.core.domain.repository

import com.taskmaster.core.common.Result
import com.taskmaster.core.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<User>
    suspend fun register(email: String, password: String, fullName: String?): Result<User>
    suspend fun logout(): Result<Unit>
    suspend fun getCurrentUser(): Flow<User?>
    suspend fun refreshToken(): Result<String>
    fun isLoggedIn(): Flow<Boolean>
}
