package com.taskmaster.core.data.mapper

import com.taskmaster.core.database.entity.UserEntity
import com.taskmaster.core.domain.model.User
import com.taskmaster.core.network.model.UserDto

fun UserDto.toDomain(): User {
    return User(
        id = id,
        email = email,
        fullName = fullName,
        avatarUrl = avatarUrl,
        createdAt = System.currentTimeMillis() // Parse from createdAt string if needed
    )
}

fun UserDto.toEntity(): UserEntity {
    return UserEntity(
        id = id,
        email = email,
        fullName = fullName,
        avatarUrl = avatarUrl,
        createdAt = System.currentTimeMillis()
    )
}

fun UserEntity.toDomain(): User {
    return User(
        id = id,
        email = email,
        fullName = fullName,
        avatarUrl = avatarUrl,
        createdAt = createdAt
    )
}
