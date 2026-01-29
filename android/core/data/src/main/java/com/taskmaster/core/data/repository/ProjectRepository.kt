package com.taskmaster.core.data.repository

import com.taskmaster.core.network.api.ProjectApi
import com.taskmaster.core.network.model.CreateProjectRequest
import com.taskmaster.core.network.model.ProjectDto
import com.taskmaster.core.network.model.UpdateProjectRequest
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProjectRepository @Inject constructor(
    private val projectApi: ProjectApi
) {
    suspend fun getProjects(): Result<List<ProjectDto>> {
        return try {
            val response = projectApi.getProjects()
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProject(projectId: String): Result<ProjectDto> {
        return try {
            val response = projectApi.getProject(projectId)
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createProject(name: String, description: String?): Result<ProjectDto> {
        return try {
            val response = projectApi.createProject(CreateProjectRequest(name, description))
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateProject(
        projectId: String,
        name: String?,
        description: String?
    ): Result<ProjectDto> {
        return try {
            val response = projectApi.updateProject(
                projectId,
                UpdateProjectRequest(name, description)
            )
            Result.success(response.data)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteProject(projectId: String): Result<Unit> {
        return try {
            projectApi.deleteProject(projectId)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
