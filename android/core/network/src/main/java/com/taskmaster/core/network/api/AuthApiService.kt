package com.taskmaster.core.network.api

import com.taskmaster.core.network.model.ApiResponse
import com.taskmaster.core.network.model.AuthResponseDto
import com.taskmaster.core.network.model.LoginRequest
import com.taskmaster.core.network.model.RefreshTokenRequest
import com.taskmaster.core.network.model.RefreshTokenResponse
import com.taskmaster.core.network.model.RegisterRequest
import com.taskmaster.core.network.model.UserDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT

interface AuthApiService {
    
    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): ApiResponse<AuthResponseDto>
    
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): ApiResponse<AuthResponseDto>
    
    @POST("auth/refresh")
    suspend fun refreshToken(
        @Body request: RefreshTokenRequest
    ): ApiResponse<RefreshTokenResponse>
    
    @POST("auth/logout")
    suspend fun logout(): ApiResponse<Unit>
    
    @GET("users/me")
    suspend fun getCurrentUser(): ApiResponse<UserDto>
    
    @PUT("users/me")
    suspend fun updateProfile(
        @Body user: UserDto
    ): ApiResponse<UserDto>
}
