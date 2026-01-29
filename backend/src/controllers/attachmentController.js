const path = require('path');
const fs = require('fs');
const { Attachment, Task } = require('../models');
const { ApiResponse } = require('../utils/ApiResponse');

/**
 * Upload file to task
 */
const uploadFile = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.userId;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json(
                ApiResponse.error('No file uploaded', 400)
            );
        }

        // Verify task exists
        const task = await Task.findByPk(taskId);
        if (!task) {
            // Delete uploaded file if task doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json(
                ApiResponse.error('Task not found', 404)
            );
        }

        // Create attachment record
        const attachment = await Attachment.create({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            taskId: taskId,
            uploadedBy: userId
        });

        res.status(201).json(
            ApiResponse.success(
                {
                    id: attachment.id,
                    fileName: attachment.fileName,
                    originalName: attachment.originalName,
                    fileSize: attachment.fileSize,
                    mimeType: attachment.mimeType,
                    uploadedAt: attachment.createdAt
                },
                'File uploaded successfully'
            )
        );
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

/**
 * Get all attachments for a task
 */
const getTaskAttachments = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Verify task exists
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json(
                ApiResponse.error('Task not found', 404)
            );
        }

        // Get all attachments for this task
        const attachments = await Attachment.findAll({
            where: { taskId },
            attributes: ['id', 'fileName', 'originalName', 'fileSize', 'mimeType', 'createdAt'],
            include: [{
                model: require('../models/User'),
                as: 'uploader',
                attributes: ['id', 'fullName', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(
            ApiResponse.success(
                attachments,
                `Retrieved ${attachments.length} attachment(s)`
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Download/get attachment file
 */
const getAttachment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const attachment = await Attachment.findByPk(id);
        if (!attachment) {
            return res.status(404).json(
                ApiResponse.error('Attachment not found', 404)
            );
        }

        // Check if file exists
        if (!fs.existsSync(attachment.filePath)) {
            return res.status(404).json(
                ApiResponse.error('File not found on server', 404)
            );
        }

        // Send file
        res.download(attachment.filePath, attachment.originalName);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete attachment
 */
const deleteAttachment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const attachment = await Attachment.findByPk(id);
        if (!attachment) {
            return res.status(404).json(
                ApiResponse.error('Attachment not found', 404)
            );
        }

        // Only uploader can delete (or you can add admin check)
        if (attachment.uploadedBy !== userId) {
            return res.status(403).json(
                ApiResponse.error('You do not have permission to delete this attachment', 403)
            );
        }

        // Delete file from filesystem
        if (fs.existsSync(attachment.filePath)) {
            fs.unlinkSync(attachment.filePath);
        }

        // Delete database record
        await attachment.destroy();

        res.json(
            ApiResponse.success(null, 'Attachment deleted successfully')
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile,
    getTaskAttachments,
    getAttachment,
    deleteAttachment
};
