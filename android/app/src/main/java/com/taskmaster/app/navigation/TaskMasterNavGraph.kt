package com.taskmaster.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
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
                onForgotPasswordClick = {},
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
            com.taskmaster.app.ui.home.HomeScreen(
                onProjectsClick = {
                    navController.navigate(Screen.ProjectList.route)
                },
                onLogoutClick = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.ProjectList.route) {
            val viewModel: com.taskmaster.app.ui.project.ProjectViewModel = hiltViewModel()
            val projectState by viewModel.projectState.collectAsState()
            
            com.taskmaster.app.ui.project.ProjectListScreen(
                projectState = projectState,
                onProjectClick = { projectId ->
                    navController.navigate(Screen.ProjectDetail.createRoute(projectId))
                },
                onCreateProject = { name, description ->
                    viewModel.createProject(name, description)
                },
                onDeleteProject = { projectId ->
                    viewModel.deleteProject(projectId)
                },
                onLogoutClick = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable(
            route = Screen.ProjectDetail.route,
            arguments = listOf(navArgument("projectId") { type = NavType.StringType })
        ) { backStackEntry ->
            val projectId = backStackEntry.arguments?.getString("projectId") ?: return@composable
            val viewModel: com.taskmaster.app.ui.task.TaskViewModel = hiltViewModel()
            val taskState by viewModel.taskState.collectAsState()
            
            com.taskmaster.app.ui.task.TaskListScreen(
                projectId = projectId,
                projectName = "Project Tasks",
                taskState = taskState,
                onBackClick = { navController.popBackStack() },
                onCreateTask = { title, description, status, priority ->
                    viewModel.createTask(title, description, status, priority)
                },
                onUpdateTaskStatus = { taskId, newStatus ->
                    viewModel.updateTaskStatus(taskId, newStatus)
                },
                onDeleteTask = { taskId ->
                    viewModel.deleteTask(taskId)
                }
            )
        }
    }
}
