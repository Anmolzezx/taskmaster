package com.taskmaster.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

@Composable
fun TaskMasterNavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Splash.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Splash.route) {
            // SplashScreen()
        }
        
        composable(Screen.Login.route) {
            // LoginScreen(navController)
        }
        
        composable(Screen.Register.route) {
            // RegisterScreen(navController)
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
