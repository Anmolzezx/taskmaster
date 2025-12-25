const Comment = require('../models/Comment');
const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

/**
 * Create a comment on a task
 */
const createComment = async (taskId, userId, content) => {
    try {
        // Get task to check project membership
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied: Not a project member');
        }

        const comment = await Comment.create({
            taskId,
            userId,
            content
        });

        // Return comment with user info
        return await Comment.findByPk(comment.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Get all comments for a task
 */
const getTaskComments = async (taskId, userId) => {
    try {
        // Get task to check project membership
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied: Not a project member');
        }

        const comments = await Comment.findAll({
            where: { taskId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        return comments;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a comment
 */
const deleteComment = async (commentId, userId) => {
    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Only comment author can delete
        if (comment.userId !== userId) {
            throw new Error('Only comment author can delete comment');
        }

        await comment.destroy();

        return { message: 'Comment deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createComment,
    getTaskComments,
    deleteComment
};
