package com.taskmaster.app.ui.task

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.taskmaster.core.data.repository.TaskRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TaskViewModel @Inject constructor(
    private val taskRepository: TaskRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val projectId: String = checkNotNull(savedStateHandle["projectId"])

    private val _taskState = MutableStateFlow(TaskState())
    val taskState: StateFlow<TaskState> = _taskState.asStateFlow()

    init {
        loadTasks()
    }

    fun loadTasks(status: String? = null) {
        viewModelScope.launch {
            _taskState.update { it.copy(isLoading = true, errorMessage = null, selectedStatus = status) }
            
            taskRepository.getTasks(projectId)
                .onSuccess { allTasks ->
                    val filteredTasks = if (status != null) {
                        allTasks.filter { it.status == status }
                    } else {
                        allTasks
                    }
                    _taskState.update {
                        it.copy(
                            tasks = filteredTasks,
                            isLoading = false,
                            errorMessage = null
                        )
                    }
                }
                .onFailure { error ->
                    _taskState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = error.message ?: "Failed to load tasks"
                        )
                    }
                }
        }
    }

    fun createTask(
        title: String,
        description: String?,
        status: String,
        priority: String
    ) {
        viewModelScope.launch {
            _taskState.update { it.copy(isCreating = true, errorMessage = null) }
            
            if (title.isBlank()) {
                _taskState.update {
                    it.copy(
                        isCreating = false,
                        errorMessage = "Task title is required"
                    )
                }
                return@launch
            }
            
            taskRepository.createTask(
                title = title,
                description = description,
                projectId = projectId,
                status = status,
                priority = priority
            )
                .onSuccess {
                    _taskState.update { it.copy(isCreating = false) }
                    loadTasks(_taskState.value.selectedStatus)
                }
                .onFailure { error ->
                    _taskState.update {
                        it.copy(
                            isCreating = false,
                            errorMessage = error.message ?: "Failed to create task"
                        )
                    }
                }
        }
    }

    fun updateTaskStatus(taskId: String, newStatus: String) {
        viewModelScope.launch {
            taskRepository.updateTask(taskId, status = newStatus)
                .onSuccess {
                    loadTasks(_taskState.value.selectedStatus)
                }
                .onFailure { error ->
                    _taskState.update {
                        it.copy(errorMessage = error.message ?: "Failed to update task")
                    }
                }
        }
    }

    fun deleteTask(taskId: String) {
        viewModelScope.launch {
            taskRepository.deleteTask(taskId)
                .onSuccess {
                    loadTasks(_taskState.value.selectedStatus)
                }
                .onFailure { error ->
                    _taskState.update {
                        it.copy(errorMessage = error.message ?: "Failed to delete task")
                    }
                }
        }
    }

    fun clearError() {
        _taskState.update { it.copy(errorMessage = null) }
    }
}
