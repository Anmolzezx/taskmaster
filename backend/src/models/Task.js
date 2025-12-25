const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'done', 'archived'),
        allowNull: false,
        defaultValue: 'todo'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date'
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id',
        references: {
            model: 'projects',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    assigneeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assignee_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Task;
