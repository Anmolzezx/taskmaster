const { sequelize } = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');

/**
 * Sync database models
 * WARNING: Use { force: true } only in development to drop and recreate tables
 */
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.sync(options);
        console.log('✅ Database models synchronized successfully');
    } catch (error) {
        console.error('❌ Error synchronizing database:', error.message);
        throw error;
    }
};

module.exports = { syncDatabase };
