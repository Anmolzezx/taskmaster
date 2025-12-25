const Joi = require('joi');

/**
 * Validation schemas for authentication
 */
const authSchemas = {
    register: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),
        fullName: Joi.string().optional().allow('')
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

/**
 * Validation schemas for projects
 */
const projectSchemas = {
    create: Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.empty': 'Project name is required',
            'any.required': 'Project name is required'
        }),
        description: Joi.string().optional().allow(''),
        color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
            'string.pattern.base': 'Color must be a valid hex code (e.g., #3B82F6)'
        })
    }),

    update: Joi.object({
        name: Joi.string().min(1).max(255).optional(),
        description: Joi.string().optional().allow(''),
        color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional()
    })
};

/**
 * Validation schemas for tasks
 */
const taskSchemas = {
    create: Joi.object({
        title: Joi.string().min(1).max(255).required().messages({
            'string.empty': 'Task title is required',
            'any.required': 'Task title is required'
        }),
        description: Joi.string().optional().allow(''),
        status: Joi.string().valid('todo', 'in_progress', 'done', 'archived').optional(),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
        assigneeId: Joi.string().uuid().optional().allow(null),
        dueDate: Joi.date().optional().allow(null)
    }),

    update: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        description: Joi.string().optional().allow(''),
        status: Joi.string().valid('todo', 'in_progress', 'done', 'archived').optional(),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
        assigneeId: Joi.string().uuid().optional().allow(null),
        dueDate: Joi.date().optional().allow(null)
    })
};

/**
 * Validation schemas for comments
 */
const commentSchemas = {
    create: Joi.object({
        content: Joi.string().min(1).required().messages({
            'string.empty': 'Comment content is required',
            'any.required': 'Comment content is required'
        })
    })
};

module.exports = {
    authSchemas,
    projectSchemas,
    taskSchemas,
    commentSchemas
};
