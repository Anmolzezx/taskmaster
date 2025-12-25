const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', projectController.createProject);

/**
 * @route   GET /api/projects
 * @desc    Get all projects for current user
 * @access  Private
 */
router.get('/', projectController.getProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', projectController.getProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Owner/Admin only)
 */
router.put('/:id', projectController.updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Owner only)
 */
router.delete('/:id', projectController.deleteProject);

/**
 * @route   POST /api/projects/:id/members
 * @desc    Add member to project
 * @access  Private (Owner/Admin only)
 */
router.post('/:id/members', projectController.addMember);

/**
 * @route   DELETE /api/projects/:id/members/:userId
 * @desc    Remove member from project
 * @access  Private (Owner/Admin only)
 */
router.delete('/:id/members/:userId', projectController.removeMember);

module.exports = router;
