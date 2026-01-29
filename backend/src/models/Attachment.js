const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attachment = sequelize.define('Attachment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'file_name'
    },
    originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'original_name'
    },
    filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'file_path'
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'file_size',
        comment: 'File size in bytes'
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'mime_type'
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
    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'uploaded_by',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'attachments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Attachment;
