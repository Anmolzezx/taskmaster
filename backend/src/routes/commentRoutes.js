const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/tasks/:taskId/comments
 * @desc    Create a comment on a task
 * @access  Private (Project members only)
 */
router.post('/tasks/:taskId/comments', commentController.createComment);

/**
 * @route   GET /api/tasks/:taskId/comments
 * @desc    Get all comments for a task
 * @access  Private (Project members only)
 */
router.get('/tasks/:taskId/comments', commentController.getTaskComments);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Comment author only)
 */
router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;
