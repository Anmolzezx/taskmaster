const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'task_id',
        references: {
            model: 'tasks',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'comments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Comment;
