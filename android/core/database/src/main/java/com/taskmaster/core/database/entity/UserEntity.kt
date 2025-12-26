package com.taskmaster.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,
    
    @ColumnInfo(name = "email")
    val email: String,
    
    @ColumnInfo(name = "full_name")
    val fullName: String?,
    
    @ColumnInfo(name = "avatar_url")
    val avatarUrl: String?,
    
    @ColumnInfo(name = "created_at")
    val createdAt: Long
)
