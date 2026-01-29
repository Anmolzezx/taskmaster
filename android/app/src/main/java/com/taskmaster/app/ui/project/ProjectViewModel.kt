package com.taskmaster.app.ui.project

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.taskmaster.core.data.repository.ProjectRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProjectViewModel @Inject constructor(
    private val projectRepository: ProjectRepository
) : ViewModel() {

    private val _projectState = MutableStateFlow(ProjectState())
    val projectState: StateFlow<ProjectState> = _projectState.asStateFlow()

    init {
        loadProjects()
    }

    fun loadProjects() {
        viewModelScope.launch {
            _projectState.update { it.copy(isLoading = true, errorMessage = null) }
            
            projectRepository.getProjects()
                .onSuccess { projects ->
                    _projectState.update {
                        it.copy(
                            projects = projects,
                            isLoading = false,
                            errorMessage = null
                        )
                    }
                }
                .onFailure { error ->
                    _projectState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = error.message ?: "Failed to load projects"
                        )
                    }
                }
        }
    }

    fun createProject(name: String, description: String?) {
        viewModelScope.launch {
            _projectState.update { it.copy(isCreating = true, errorMessage = null) }
            
            if (name.isBlank()) {
                _projectState.update {
                    it.copy(
                        isCreating = false,
                        errorMessage = "Project name is required"
                    )
                }
                return@launch
            }
            
            projectRepository.createProject(name, description)
                .onSuccess {
                    _projectState.update { it.copy(isCreating = false) }
                    loadProjects()
                }
                .onFailure { error ->
                    _projectState.update {
                        it.copy(
                            isCreating = false,
                            errorMessage = error.message ?: "Failed to create project"
                        )
                    }
                }
        }
    }

    fun deleteProject(projectId: String) {
        viewModelScope.launch {
            projectRepository.deleteProject(projectId)
                .onSuccess {
                    loadProjects()
                }
                .onFailure { error ->
                    _projectState.update {
                        it.copy(errorMessage = error.message ?: "Failed to delete project")
                    }
                }
        }
    }

    fun clearError() {
        _projectState.update { it.copy(errorMessage = null) }
    }
}
