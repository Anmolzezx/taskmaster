package com.taskmaster.core.database.di

import android.content.Context
import androidx.room.Room
import com.taskmaster.core.common.Constants
import com.taskmaster.core.database.TaskMasterDatabase
import com.taskmaster.core.database.dao.UserDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(
        @ApplicationContext context: Context
    ): TaskMasterDatabase {
        return Room.databaseBuilder(
            context,
            TaskMasterDatabase::class.java,
            Constants.DATABASE_NAME
        )
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    @Singleton
    fun provideUserDao(database: TaskMasterDatabase): UserDao {
        return database.userDao()
    }
}
