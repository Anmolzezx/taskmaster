package com.taskmaster.core.network.api

import com.taskmaster.core.network.model.CreateProjectRequest
import com.taskmaster.core.network.model.ProjectListResponse
import com.taskmaster.core.network.model.ProjectResponse
import com.taskmaster.core.network.model.UpdateProjectRequest
import retrofit2.http.*

interface ProjectApi {
    @GET("projects")
    suspend fun getProjects(): ProjectListResponse

    @GET("projects/{id}")
    suspend fun getProject(@Path("id") projectId: String): ProjectResponse

    @POST("projects")
    suspend fun createProject(@Body request: CreateProjectRequest): ProjectResponse

    @PUT("projects/{id}")
    suspend fun updateProject(
        @Path("id") projectId: String,
        @Body request: UpdateProjectRequest
    ): ProjectResponse

    @DELETE("projects/{id}")
    suspend fun deleteProject(@Path("id") projectId: String): Unit
}
