package com.taskmaster.core.network.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
    @SerialName("fullName")
    val fullName: String
)

@Serializable
data class AuthResponse(
    val success: Boolean,
    val data: AuthData,
    val message: String? = null
)

@Serializable
data class AuthData(
    val user: UserDto,
    @SerialName("accessToken")
    val accessToken: String,
    @SerialName("refreshToken")
    val refreshToken: String
)

@Serializable
data class UserDto(
    val id: String,
    val email: String,
    @SerialName("fullName")
    val fullName: String,
    @SerialName("avatarUrl")
    val avatarUrl: String? = null,
    @SerialName("createdAt")
    val createdAt: String
)

@Serializable
data class ErrorResponse(
    val success: Boolean = false,
    val message: String,
    val statusCode: Int? = null
)
