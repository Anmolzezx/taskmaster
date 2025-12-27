package com.taskmaster.core.network.model

import kotlinx.serialization.Serializable

@Serializable
data class UserDto(
    val id: String,
    val email: String,
    val fullName: String? = null,
    val avatarUrl: String? = null,
    val createdAt: String? = null
)

@Serializable
data class AuthResponseDto(
    val user: UserDto,
    val accessToken: String,
    val refreshToken: String
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
    val fullName: String? = null
)

@Serializable
data class RefreshTokenRequest(
    val refreshToken: String
)

@Serializable
data class RefreshTokenResponse(
    val accessToken: String
)
