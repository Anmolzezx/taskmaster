const { sequelize } = require('../config/database');
const User = require('./User');

// Define model associations here
// Example: User.hasMany(Project);

const models = {
    User,
    sequelize
};

module.exports = models;
