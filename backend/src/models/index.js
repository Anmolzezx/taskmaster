const { sequelize } = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');
const Comment = require('./Comment');

// Define model associations

// User <-> Project (One-to-Many: User owns many Projects)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User <-> Project (Many-to-Many through ProjectMember)
User.belongsToMany(Project, {
    through: ProjectMember,
    foreignKey: 'userId',
    otherKey: 'projectId',
    as: 'projects'
});

Project.belongsToMany(User, {
    through: ProjectMember,
    foreignKey: 'projectId',
    otherKey: 'userId',
    as: 'members'
});

// Direct associations for easier queries
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Project <-> Task (One-to-Many)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User <-> Task (One-to-Many: assignee)
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

// User <-> Task (One-to-Many: creator)
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Task <-> Comment (One-to-Many)
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User <-> Comment (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const models = {
    User,
    Project,
    ProjectMember,
    Task,
    Comment,
    sequelize
};

module.exports = models;
