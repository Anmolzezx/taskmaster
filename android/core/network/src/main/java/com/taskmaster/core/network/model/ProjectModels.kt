package com.taskmaster.core.network.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ProjectDto(
    val id: String,
    val name: String,
    val description: String? = null,
    @SerialName("ownerId")
    val ownerId: String,
    @SerialName("createdAt")
    val createdAt: String,
    @SerialName("updatedAt")
    val updatedAt: String
)

@Serializable
data class CreateProjectRequest(
    val name: String,
    val description: String? = null
)

@Serializable
data class UpdateProjectRequest(
    val name: String? = null,
    val description: String? = null
)

@Serializable
data class ProjectResponse(
    val success: Boolean,
    val data: ProjectDto,
    val message: String? = null
)

@Serializable
data class ProjectListResponse(
    val success: Boolean,
    val data: List<ProjectDto>,
    val message: String? = null
)
