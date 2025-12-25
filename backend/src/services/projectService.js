const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

/**
 * Create a new project
 */
const createProject = async (userId, { name, description, color }) => {
    try {
        // Create project
        const project = await Project.create({
            name,
            description,
            color: color || '#3B82F6',
            ownerId: userId
        });

        // Add owner as a member with 'owner' role
        await ProjectMember.create({
            projectId: project.id,
            userId: userId,
            role: 'owner'
        });

        return project;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all projects for a user
 */
const getUserProjects = async (userId) => {
    try {
        // Get projects where user is a member
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    as: 'members',
                    where: { id: userId },
                    attributes: [],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return projects;
    } catch (error) {
        throw error;
    }
};

/**
 * Get project by ID
 */
const getProjectById = async (projectId, userId) => {
    try {
        const project = await Project.findOne({
            where: { id: projectId },
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl']
                },
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'email', 'fullName', 'avatarUrl'],
                    through: {
                        attributes: ['role', 'joinedAt']
                    }
                }
            ]
        });

        if (!project) {
            throw new Error('Project not found');
        }

        // Check if user is a member
        const isMember = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!isMember) {
            throw new Error('Access denied');
        }

        return project;
    } catch (error) {
        throw error;
    }
};

/**
 * Update project
 */
const updateProject = async (projectId, userId, updates) => {
    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        // Check if user is owner or admin
        const member = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
            throw new Error('Only project owner or admin can update project');
        }

        // Update project
        await project.update(updates);

        return project;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete project
 */
const deleteProject = async (projectId, userId) => {
    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        // Only owner can delete
        if (project.ownerId !== userId) {
            throw new Error('Only project owner can delete project');
        }

        await project.destroy();

        return { message: 'Project deleted successfully' };
    } catch (error) {
        throw error;
    }
};

/**
 * Add member to project
 */
const addMember = async (projectId, userId, memberEmail, role = 'member') => {
    try {
        // Check if requester is owner or admin
        const requester = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
            throw new Error('Only project owner or admin can add members');
        }

        // Find user by email
        const newMember = await User.findOne({ where: { email: memberEmail } });

        if (!newMember) {
            throw new Error('User not found');
        }

        // Check if already a member
        const existing = await ProjectMember.findOne({
            where: { projectId, userId: newMember.id }
        });

        if (existing) {
            throw new Error('User is already a member');
        }

        // Add member
        await ProjectMember.create({
            projectId,
            userId: newMember.id,
            role
        });

        return { message: 'Member added successfully', user: newMember };
    } catch (error) {
        throw error;
    }
};

/**
 * Remove member from project
 */
const removeMember = async (projectId, userId, memberIdToRemove) => {
    try {
        // Check if requester is owner or admin
        const requester = await ProjectMember.findOne({
            where: { projectId, userId }
        });

        if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
            throw new Error('Only project owner or admin can remove members');
        }

        // Cannot remove owner
        const project = await Project.findByPk(projectId);
        if (project.ownerId === memberIdToRemove) {
            throw new Error('Cannot remove project owner');
        }

        // Remove member
        const deleted = await ProjectMember.destroy({
            where: { projectId, userId: memberIdToRemove }
        });

        if (!deleted) {
            throw new Error('Member not found in project');
        }

        return { message: 'Member removed successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember
};
