package com.taskmaster.core.network.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TaskDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val status: String,
    val priority: String,
    @SerialName("projectId")
    val projectId: String,
    @SerialName("assigneeId")
    val assigneeId: String? = null,
    @SerialName("dueDate")
    val dueDate: String? = null,
    @SerialName("createdAt")
    val createdAt: String,
    @SerialName("updatedAt")
    val updatedAt: String
)

@Serializable
data class CreateTaskRequest(
    val title: String,
    val description: String? = null,
    val status: String = "TODO",
    val priority: String = "MEDIUM",
    @SerialName("projectId")
    val projectId: String,
    @SerialName("assigneeId")
    val assigneeId: String? = null,
    @SerialName("dueDate")
    val dueDate: String? = null
)

@Serializable
data class UpdateTaskRequest(
    val title: String? = null,
    val description: String? = null,
    val status: String? = null,
    val priority: String? = null,
    @SerialName("assigneeId")
    val assigneeId: String? = null,
    @SerialName("dueDate")
    val dueDate: String? = null
)

@Serializable
data class TaskResponse(
    val success: Boolean,
    val data: TaskDto,
    val message: String? = null
)

@Serializable
data class TaskListResponse(
    val success: Boolean,
    val data: List<TaskDto>,
    val message: String? = null
)
