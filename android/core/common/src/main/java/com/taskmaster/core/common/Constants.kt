package com.taskmaster.core.common

object Constants {
    // API Configuration
    const val BASE_URL = "https://taskmaster-api-092n.onrender.com/api/"
    
    // Network
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
    
    // Preferences
    const val PREFS_NAME = "taskmaster_prefs"
    const val KEY_ACCESS_TOKEN = "access_token"
    const val KEY_REFRESH_TOKEN = "refresh_token"
    const val KEY_USER_ID = "user_id"
    const val KEY_USER_EMAIL = "user_email"
    
    // Database
    const val DATABASE_NAME = "taskmaster_db"
    const val DATABASE_VERSION = 1
}
