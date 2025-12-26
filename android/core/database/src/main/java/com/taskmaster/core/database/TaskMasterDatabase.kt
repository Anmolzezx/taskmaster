package com.taskmaster.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.taskmaster.core.database.dao.UserDao
import com.taskmaster.core.database.entity.UserEntity
import com.taskmaster.core.database.util.Converters

@Database(
    entities = [
        UserEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class TaskMasterDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
