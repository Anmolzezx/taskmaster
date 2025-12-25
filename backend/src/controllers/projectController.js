const projectService = require('../services/projectService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Create a new project
 * POST /api/projects
 */
const createProject = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        if (!name) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Project name is required' })
            );
        }

        const project = await projectService.createProject(req.user.userId, {
            name,
            description,
            color
        });

        res.status(201).json(
            ApiResponse.success(project, 'Project created successfully', 201)
        );
    } catch (error) {
        res.status(500).json(
            ApiResponse.error('Failed to create project: ' + error.message, 500)
        );
    }
};

/**
 * Get all projects for current user
 * GET /api/projects
 */
const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getUserProjects(req.user.userId);

        res.status(200).json(
            ApiResponse.success(projects, 'Projects retrieved successfully')
        );
    } catch (error) {
        res.status(500).json(
            ApiResponse.error('Failed to retrieve projects', 500)
        );
    }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
const getProject = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            req.params.id,
            req.user.userId
        );

        res.status(200).json(
            ApiResponse.success(project, 'Project retrieved successfully')
        );
    } catch (error) {
        if (error.message === 'Project not found') {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message === 'Access denied') {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to retrieve project', 500)
        );
    }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        const project = await projectService.updateProject(
            req.params.id,
            req.user.userId,
            { name, description, color }
        );

        res.status(200).json(
            ApiResponse.success(project, 'Project updated successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to update project', 500)
        );
    }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
    try {
        const result = await projectService.deleteProject(
            req.params.id,
            req.user.userId
        );

        res.status(200).json(
            ApiResponse.success(result, 'Project deleted successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to delete project', 500)
        );
    }
};

/**
 * Add member to project
 * POST /api/projects/:id/members
 */
const addMember = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Member email is required' })
            );
        }

        const result = await projectService.addMember(
            req.params.id,
            req.user.userId,
            email,
            role
        );

        res.status(200).json(
            ApiResponse.success(result, 'Member added successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('already')) {
            return res.status(409).json(ApiResponse.error(error.message, 409));
        }
        if (error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to add member', 500)
        );
    }
};

/**
 * Remove member from project
 * DELETE /api/projects/:id/members/:userId
 */
const removeMember = async (req, res) => {
    try {
        const result = await projectService.removeMember(
            req.params.id,
            req.user.userId,
            req.params.userId
        );

        res.status(200).json(
            ApiResponse.success(result, 'Member removed successfully')
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json(ApiResponse.notFound(error.message));
        }
        if (error.message.includes('Cannot')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        if (error.message.includes('Only')) {
            return res.status(403).json(ApiResponse.error(error.message, 403));
        }
        res.status(500).json(
            ApiResponse.error('Failed to remove member', 500)
        );
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember
};
