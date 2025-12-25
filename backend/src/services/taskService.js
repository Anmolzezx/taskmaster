const Task = require('../models/Task');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

/**
 * Create a new task
 */
const createTask = async (projectId, userId, taskData) => {
    try {
        // Check if user is a member of the project
        const isMember = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied: Not a project member');
        }

        // Get the highest position for the status column
        const maxPosition = await Task.max('position', {
            where: { projectId, status: taskData.status || 'todo' }
        });

        const task = await Task.create({
            ...taskData,
            projectId,
            createdBy: userId,
            position: (maxPosition || 0) + 1
        });

        return task;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all tasks for a project
 */
const getProjectTasks = async (projectId, userId) => {
    try {
        // Check if user is a member
        const isMember = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied: Not a project member');
        }

        const tasks = await Task.findAll({
            where: { projectId },
            include: [
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                }
            ],
            order: [['position', 'ASC']]
        });

        return tasks;
    } catch (error) {
        throw error;
    }
};

/**
 * Get task by ID
 */
const getTaskById = async (taskId, userId) => {
    try {
        const task = await Task.findOne({
            where: { id: taskId },
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                }
            ]
        });

        if (!task) {
            throw new Error('Task not found');
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied');
        }

        return task;
    } catch (error) {
        throw error;
    }
};

/**
 * Update task
 */
const updateTask = async (taskId, userId, updates) => {
    try {
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied');
        }

        await task.update(updates);

        // Fetch updated task with associations
        return await getTaskById(taskId, userId);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete task
 */
const deleteTask = async (taskId, userId) => {
    try {
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check if user is project member
        const member = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!member) {
            throw new Error('Access denied');
        }

        // Only creator, assignee, or project owner/admin can delete
        const project = await Project.findByPk(task.projectId);
        const canDelete =
            task.createdBy === userId ||
            task.assigneeId === userId ||
            project.ownerId === userId ||
            member.role === 'admin';

        if (!canDelete) {
            throw new Error('Only task creator, assignee, or project admin can delete task');
        }

        await task.destroy();

        return { message: 'Task deleted successfully' };
    } catch (error) {
        throw error;
    }
};

/**
 * Update task status (for Kanban drag & drop)
 */
const updateTaskStatus = async (taskId, userId, newStatus) => {
    try {
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check access
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied');
        }

        // Update status
        await task.update({ status: newStatus });

        return task;
    } catch (error) {
        throw error;
    }
};

/**
 * Update task position (for Kanban drag & drop)
 */
const updateTaskPosition = async (taskId, userId, newPosition, newStatus) => {
    try {
        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check access
        const isMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied');
        }

        // Update position and status if changed
        const updates = { position: newPosition };
        if (newStatus && newStatus !== task.status) {
            updates.status = newStatus;
        }

        await task.update(updates);

        return task;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPosition
};
