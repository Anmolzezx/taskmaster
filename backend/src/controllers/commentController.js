const commentService = require('../services/commentService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Create a comment on a task
 * POST /api/tasks/:taskId/comments
 */
const createComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Comment content is required' })
            );
        }

        const comment = await commentService.createComment(
            req.params.taskId,
            req.user.userId,
            content
        );

        res.status(201).json(
            ApiResponse.success(comment, 'Comment created successfully', 201)
        );
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to create comment: ' + error.message, 500)
        );
    }
};

/**
 * Get all comments for a task
 * GET /api/tasks/:taskId/comments
 */
const getTaskComments = async (req, res) => {
    try {
        const comments = await commentService.getTaskComments(
            req.params.taskId,
            req.user.userId
        );

        res.status(200).json(
            ApiResponse.success(comments, 'Comments retrieved successfully')
        );
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to retrieve comments', 500)
        );
    }
};

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
    try {
        const result = await commentService.deleteComment(
            req.params.id,
            req.user.userId
        );

        res.status(200).json(
            ApiResponse.success(result, 'Comment deleted successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to delete comment', 500)
        );
    }
};

module.exports = {
    createComment,
    getTaskComments,
    deleteComment
};
