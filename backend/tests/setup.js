const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');

// Test database setup
beforeAll(async () => {
    // Sync database for tests
    await sequelize.sync({ force: true });
});

// Clean up after each test
afterEach(async () => {
    // Clear all tables
    const models = Object.keys(sequelize.models);
    for (const modelName of models) {
        await sequelize.models[modelName].destroy({ where: {}, force: true });
    }
});

// Close database connection after all tests
afterAll(async () => {
    await sequelize.close();
});

module.exports = {
    request,
    app
};
