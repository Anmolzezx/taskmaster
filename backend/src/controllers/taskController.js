const taskService = require('../services/taskService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Create a new task
 * POST /api/projects/:projectId/tasks
 */
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, assigneeId, dueDate } = req.body;

        if (!title) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Task title is required' })
            );
        }

        const task = await taskService.createTask(
            req.params.projectId,
            req.user.userId,
            { title, description, status, priority, assigneeId, dueDate }
        );

        res.status(201).json(
            ApiResponse.success(task, 'Task created successfully', 201)
        );
    } catch (error) {
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to create task: ' + error.message, 500)
        );
    }
};

/**
 * Get all tasks for a project
 * GET /api/projects/:projectId/tasks
 */
const getProjectTasks = async (req, res) => {
    try {
        const tasks = await taskService.getProjectTasks(
            req.params.projectId,
            req.user.userId
        );

        res.status(200).json(
            ApiResponse.success(tasks, 'Tasks retrieved successfully')
        );
    } catch (error) {
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to retrieve tasks', 500)
        );
    }
};

/**
 * Get task by ID
 * GET /api/tasks/:id
 */
const getTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user.userId);

        res.status(200).json(
            ApiResponse.success(task, 'Task retrieved successfully')
        );
    } catch (error) {
        if (error.message === 'Task not found') {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message === 'Access denied') {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to retrieve task', 500)
        );
    }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, assigneeId, dueDate } = req.body;

        const task = await taskService.updateTask(
            req.params.id,
            req.user.userId,
            { title, description, status, priority, assigneeId, dueDate }
        );

        res.status(200).json(
            ApiResponse.success(task, 'Task updated successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to update task', 500)
        );
    }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user.userId);

        res.status(200).json(
            ApiResponse.success(result, 'Task deleted successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied') || error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to delete task', 500)
        );
    }
};

/**
 * Update task status (Kanban drag & drop)
 * PATCH /api/tasks/:id/status
 */
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Status is required' })
            );
        }

        const task = await taskService.updateTaskStatus(
            req.params.id,
            req.user.userId,
            status
        );

        res.status(200).json(
            ApiResponse.success(task, 'Task status updated successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to update task status', 500)
        );
    }
};

/**
 * Update task position (Kanban drag & drop)
 * PATCH /api/tasks/:id/position
 */
const updateTaskPosition = async (req, res) => {
    try {
        const { position, status } = req.body;

        if (position === undefined) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Position is required' })
            );
        }

        const task = await taskService.updateTaskPosition(
            req.params.id,
            req.user.userId,
            position,
            status
        );

        res.status(200).json(
            ApiResponse.success(task, 'Task position updated successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Access denied')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to update task position', 500)
        );
    }
};

module.exports = {
    createTask,
    getProjectTasks,
    getTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPosition
};
