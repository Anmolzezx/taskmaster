package com.taskmaster.core.data.repository

import com.taskmaster.core.network.api.TaskApi
import com.taskmaster.core.network.model.CreateTaskRequest
import com.taskmaster.core.network.model.TaskDto
import com.taskmaster.core.network.model.UpdateTaskRequest
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TaskRepository @Inject constructor(
    private val taskApi: TaskApi
) {
    suspend fun getTasks(projectId: String? = null): Result<List<TaskDto>> {
        return try {
            val response = taskApi.getTasks(projectId)
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getTask(taskId: String): Result<TaskDto> {
        return try {
            val response = taskApi.getTask(taskId)
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createTask(
        title: String,
        description: String?,
        projectId: String,
        status: String = "TODO",
        priority: String = "MEDIUM",
        assigneeId: String? = null,
        dueDate: String? = null
    ): Result<TaskDto> {
        return try {
            val response = taskApi.createTask(
                CreateTaskRequest(
                    title = title,
                    description = description,
                    projectId = projectId,
                    status = status,
                    priority = priority,
                    assigneeId = assigneeId,
                    dueDate = dueDate
                )
            )
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateTask(
        taskId: String,
        title: String? = null,
        description: String? = null,
        status: String? = null,
        priority: String? = null,
        assigneeId: String? = null,
        dueDate: String? = null
    ): Result<TaskDto> {
        return try {
            val response = taskApi.updateTask(
                taskId,
                UpdateTaskRequest(
                    title = title,
                    description = description,
                    status = status,
                    priority = priority,
                    assigneeId = assigneeId,
                    dueDate = dueDate
                )
            )
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteTask(taskId: String): Result<Unit> {
        return try {
            taskApi.deleteTask(taskId)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
