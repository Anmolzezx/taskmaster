package com.taskmaster.app.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object Home : Screen("home")
    data object ProjectList : Screen("projects")
    data object ProjectDetail : Screen("projects/{projectId}") {
        fun createRoute(projectId: String) = "projects/$projectId"
    }
    data object TaskBoard : Screen("projects/{projectId}/tasks") {
        fun createRoute(projectId: String) = "projects/$projectId/tasks"
    }
    data object TaskDetail : Screen("tasks/{taskId}") {
        fun createRoute(taskId: String) = "tasks/$taskId"
    }
    data object Profile : Screen("profile")
}
