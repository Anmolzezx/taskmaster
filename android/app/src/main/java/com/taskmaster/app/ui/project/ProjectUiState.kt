package com.taskmaster.app.ui.project

import com.taskmaster.core.network.model.ProjectDto

sealed interface ProjectUiState {
    data object Loading : ProjectUiState
    data class Success(val projects: List<ProjectDto>) : ProjectUiState
    data class Error(val message: String) : ProjectUiState
}

data class ProjectState(
    val projects: List<ProjectDto> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isCreating: Boolean = false
)
