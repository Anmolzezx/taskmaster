const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectMember = sequelize.define('ProjectMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    role: {
        type: DataTypes.ENUM('owner', 'admin', 'member'),
        allowNull: false,
        defaultValue: 'member'
    }
}, {
    tableName: 'project_members',
    timestamps: true,
    underscored: true,
    createdAt: 'joined_at',
    updatedAt: false
});

module.exports = ProjectMember;
