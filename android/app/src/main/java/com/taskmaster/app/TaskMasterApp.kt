package com.taskmaster.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class TaskMasterApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
