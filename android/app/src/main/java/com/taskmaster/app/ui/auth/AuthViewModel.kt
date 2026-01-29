package com.taskmaster.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    // TODO: Inject AuthRepository when data layer is ready
) : ViewModel() {

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _authState.update { it.copy(isLoading = true, errorMessage = null) }
            
            try {
                // TODO: Call repository login method
                // For now, simulate API call
                kotlinx.coroutines.delay(1500)
                
                // Validate input
                if (email.isBlank() || password.isBlank()) {
                    _authState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = "Email and password are required"
                        )
                    }
                    return@launch
                }
                
                // Simulate successful login
                _authState.update {
                    it.copy(
                        isLoading = false,
                        isAuthenticated = true,
                        errorMessage = null
                    )
                }
            } catch (e: Exception) {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Login failed"
                    )
                }
            }
        }
    }

    fun register(email: String, password: String, fullName: String) {
        viewModelScope.launch {
            _authState.update { it.copy(isLoading = true, errorMessage = null) }
            
            try {
                // TODO: Call repository register method
                // For now, simulate API call
                kotlinx.coroutines.delay(1500)
                
                // Validate input
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
                
                // Simulate successful registration
                _authState.update {
                    it.copy(
                        isLoading = false,
                        isAuthenticated = true,
                        errorMessage = null
                    )
                }
            } catch (e: Exception) {
                _authState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Registration failed"
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
