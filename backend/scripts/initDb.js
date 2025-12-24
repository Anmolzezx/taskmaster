const { sequelize } = require('./src/config/database');
const { syncDatabase } = require('./src/utils/dbSync');

/**
 * Initialize database
 * Run this script to create tables in development
 */
const initDb = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        console.log('🔄 Synchronizing database models...');
        // Use { force: true } to drop and recreate tables (DEVELOPMENT ONLY!)
        // Use { alter: true } to alter tables to match models
        await syncDatabase({ alter: true });

        console.log('✅ Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
