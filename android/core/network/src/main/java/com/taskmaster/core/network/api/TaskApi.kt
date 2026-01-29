package com.taskmaster.core.network.api

import com.taskmaster.core.network.model.CreateTaskRequest
import com.taskmaster.core.network.model.TaskListResponse
import com.taskmaster.core.network.model.TaskResponse
import com.taskmaster.core.network.model.UpdateTaskRequest
import retrofit2.http.*

interface TaskApi {
    @GET("tasks")
    suspend fun getTasks(@Query("projectId") projectId: String? = null): TaskListResponse

    @GET("tasks/{id}")
    suspend fun getTask(@Path("id") taskId: String): TaskResponse

    @POST("tasks")
    suspend fun createTask(@Body request: CreateTaskRequest): TaskResponse

    @PUT("tasks/{id}")
    suspend fun updateTask(
        @Path("id") taskId: String,
        @Body request: UpdateTaskRequest
    ): TaskResponse

    @DELETE("tasks/{id}")
    suspend fun deleteTask(@Path("id") taskId: String): Unit
}
