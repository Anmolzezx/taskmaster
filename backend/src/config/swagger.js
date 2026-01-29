const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskMaster API',
            version: '1.0.0',
            description: 'A comprehensive project and task management API built with Node.js, Express, and PostgreSQL',
            contact: {
                name: 'API Support',
                email: 'support@taskmaster.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.taskmaster.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        fullName: { type: 'string' },
                        avatarUrl: { type: 'string', format: 'uri', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        ownerId: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['todo', 'in_progress', 'done', 'archived'] },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                        position: { type: 'integer' },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        projectId: { type: 'string', format: 'uuid' },
                        assigneeId: { type: 'string', format: 'uuid', nullable: true },
                        createdBy: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                        taskId: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Attachment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        fileName: { type: 'string' },
                        originalName: { type: 'string' },
                        fileSize: { type: 'integer' },
                        mimeType: { type: 'string' },
                        taskId: { type: 'string', format: 'uuid' },
                        uploadedBy: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        statusCode: { type: 'integer' }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' },
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            { name: 'Authentication', description: 'User authentication endpoints' },
            { name: 'Users', description: 'User profile management' },
            { name: 'Projects', description: 'Project management' },
            { name: 'Tasks', description: 'Task management' },
            { name: 'Comments', description: 'Task comments' },
            { name: 'Attachments', description: 'File attachments' }
        ]
    },
    apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
