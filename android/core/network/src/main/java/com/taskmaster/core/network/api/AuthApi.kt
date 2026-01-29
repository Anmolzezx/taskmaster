package com.taskmaster.core.network.api

import com.taskmaster.core.network.model.AuthResponse
import com.taskmaster.core.network.model.LoginRequest
import com.taskmaster.core.network.model.RegisterRequest
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/logout")
    suspend fun logout(): Unit
}
