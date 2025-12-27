package com.taskmaster.core.domain.model

data class User(
    val id: String,
    val email: String,
    val fullName: String?,
    val avatarUrl: String?,
    val createdAt: Long
)
