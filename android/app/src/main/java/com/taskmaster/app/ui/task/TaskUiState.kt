package com.taskmaster.app.ui.task

import com.taskmaster.core.network.model.TaskDto

data class TaskState(
    val tasks: List<TaskDto> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isCreating: Boolean = false,
    val selectedStatus: String? = null
)

enum class TaskStatus(val value: String, val displayName: String) {
    TODO("TODO", "To Do"),
    IN_PROGRESS("IN_PROGRESS", "In Progress"),
    DONE("DONE", "Done")
}

enum class TaskPriority(val value: String, val displayName: String) {
    LOW("LOW", "Low"),
    MEDIUM("MEDIUM", "Medium"),
    HIGH("HIGH", "High")
}
