const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const attachmentController = require('../controllers/attachmentController');

/**
 * @route   POST /api/tasks/:taskId/attachments
 * @desc    Upload file to task
 * @access  Private
 */
router.post(
    '/tasks/:taskId/attachments',
    authenticate,
    upload.single('file'),
    attachmentController.uploadFile
);

/**
 * @route   GET /api/tasks/:taskId/attachments
 * @desc    Get all attachments for a task
 * @access  Private
 */
router.get(
    '/tasks/:taskId/attachments',
    authenticate,
    attachmentController.getTaskAttachments
);

/**
 * @route   GET /api/attachments/:id
 * @desc    Download attachment file
 * @access  Private
 */
router.get(
    '/attachments/:id',
    authenticate,
    attachmentController.getAttachment
);

/**
 * @route   DELETE /api/attachments/:id
 * @desc    Delete attachment
 * @access  Private
 */
router.delete(
    '/attachments/:id',
    authenticate,
    attachmentController.deleteAttachment
);

module.exports = router;
