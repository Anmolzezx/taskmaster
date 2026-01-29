package com.taskmaster.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.taskmaster.core.data.local.TokenManager
import com.taskmaster.core.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _authState.update { it.copy(isLoading = true, errorMessage = null) }
            
            if (email.isBlank() || password.isBlank()) {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = "Email and password are required"
                    )
                }
                return@launch
            }
            
            authRepository.login(email, password)
                .onSuccess { response ->
                    tokenManager.saveTokens(
                        accessToken = response.data.accessToken,
                        refreshToken = response.data.refreshToken,
                        userId = response.data.user.id
                    )
                    _authState.update {
                        it.copy(
                            isLoading = false,
                            isAuthenticated = true,
                            errorMessage = null
                        )
                    }
                }
                .onFailure { error ->
                    _authState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = error.message ?: "Login failed"
                        )
                    }
                }
        }
    }

    fun register(email: String, password: String, fullName: String) {
        viewModelScope.launch {
            _authState.update { it.copy(isLoading = true, errorMessage = null) }
            
            if (email.isBlank() || password.isBlank() || fullName.isBlank()) {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = "All fields are required"
                    )
                }
                return@launch
            }
            
            if (password.length < 6) {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = "Password must be at least 6 characters"
                    )
                }
                return@launch
            }
            
            authRepository.register(email, password, fullName)
                .onSuccess { response ->
                    tokenManager.saveTokens(
                        accessToken = response.data.accessToken,
                        refreshToken = response.data.refreshToken,
                        userId = response.data.user.id
                    )
                    _authState.update {
                        it.copy(
                            isLoading = false,
                            isAuthenticated = true,
                            errorMessage = null
                        )
                    }
                }
                .onFailure { error ->
                    _authState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = error.message ?: "Registration failed"
                        )
                    }
                }
        }
    }

    fun clearError() {
        _authState.update { it.copy(errorMessage = null) }
    }

    fun logout() {
        viewModelScope.launch {
            tokenManager.clearTokens()
            _authState.update {
                AuthState(
                    isLoading = false,
                    isAuthenticated = false,
                    errorMessage = null
                )
            }
        }
    }
}
