const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/projects/:projectId/tasks
 * @desc    Create a new task
 * @access  Private (Project members only)
 */
router.post('/projects/:projectId/tasks', taskController.createTask);

/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    Get all tasks for a project
 * @access  Private (Project members only)
 */
router.get('/projects/:projectId/tasks', taskController.getProjectTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private (Project members only)
 */
router.get('/tasks/:id', taskController.getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private (Project members only)
 */
router.put('/tasks/:id', taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private (Creator/Assignee/Admin only)
 */
router.delete('/tasks/:id', taskController.deleteTask);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status (Kanban)
 * @access  Private (Project members only)
 */
router.patch('/tasks/:id/status', taskController.updateTaskStatus);

/**
 * @route   PATCH /api/tasks/:id/position
 * @desc    Update task position (Kanban drag & drop)
 * @access  Private (Project members only)
 */
router.patch('/tasks/:id/position', taskController.updateTaskPosition);

module.exports = router;
