package com.taskmaster.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.taskmaster.app.ui.auth.AuthViewModel
import com.taskmaster.app.ui.auth.LoginScreen
import com.taskmaster.app.ui.auth.RegisterScreen

@Composable
fun TaskMasterNavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Login.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Splash.route) {
            // SplashScreen()
        }
        
        composable(Screen.Login.route) {
            val viewModel: AuthViewModel = hiltViewModel()
            val authState by viewModel.authState.collectAsState()
            
            LaunchedEffect(authState.isAuthenticated) {
                if (authState.isAuthenticated) {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            }
            
            LoginScreen(
                onLoginClick = { email, password ->
                    viewModel.login(email, password)
                },
                onRegisterClick = {
                    navController.navigate(Screen.Register.route)
                },
                onForgotPasswordClick = {
                    // TODO: Navigate to forgot password screen
                },
                isLoading = authState.isLoading,
                errorMessage = authState.errorMessage
            )
        }
        
        composable(Screen.Register.route) {
            val viewModel: AuthViewModel = hiltViewModel()
            val authState by viewModel.authState.collectAsState()
            
            LaunchedEffect(authState.isAuthenticated) {
                if (authState.isAuthenticated) {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                }
            }
            
            RegisterScreen(
                onRegisterClick = { email, password, fullName ->
                    viewModel.register(email, password, fullName)
                },
                onLoginClick = {
                    navController.popBackStack()
                },
                isLoading = authState.isLoading,
                errorMessage = authState.errorMessage
            )
        }
        
        composable(Screen.Home.route) {
            // HomeScreen(navController)
        }
        
        composable(Screen.ProjectList.route) {
            // ProjectListScreen(navController)
        }
        
        composable(Screen.ProjectDetail.route) { backStackEntry ->
            val projectId = backStackEntry.arguments?.getString("projectId")
            // ProjectDetailScreen(navController, projectId)
        }
        
        composable(Screen.TaskBoard.route) { backStackEntry ->
            val projectId = backStackEntry.arguments?.getString("projectId")
            // TaskBoardScreen(navController, projectId)
        }
        
        composable(Screen.TaskDetail.route) { backStackEntry ->
            val taskId = backStackEntry.arguments?.getString("taskId")
            // TaskDetailScreen(navController, taskId)
        }
        
        composable(Screen.Profile.route) {
            // ProfileScreen(navController)
        }
    }
}
