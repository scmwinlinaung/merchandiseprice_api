const { Sequelize } = require('sequelize');
const {
  DATABASE_USERNAME,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_HOST,
} = require('../constant/database_constant');

// Initialize Sequelize instance for the specific database (myan_market)
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'postgres',
  port: DATABASE_PORT,
  dialectOptions: {
    ssl: {
      require: true,  // Enforce SSL as required by the server
      rejectUnauthorized: false,  // Allow self-signed certificates (common for cloud providers)
    },
  },
  logging: false,  // Disable logging in production (set to console.log for debugging)
});

// Function to connect and create database if it doesn’t exist
const connectDB = async () => {
  // Use a root Sequelize instance to connect to the PostgreSQL server (using the default 'postgres' database)
  const rootSequelize = new Sequelize({
    database: 'postgres',  // Connect to the default 'postgres' database first
    dialect: 'postgres',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    dialectOptions: {
      ssl: {
        require: true,  // Enforce SSL
        rejectUnauthorized: false,  // Allow self-signed certificates
      },
    },
    logging: false,  // Disable logging
  });

  try {
    // Connect to PostgreSQL server (using the default 'postgres' database)
    await rootSequelize.authenticate();
    console.log('Connected to PostgreSQL server successfully.');

    // Check if the database exists
    const [results] = await rootSequelize.query(
      `SELECT datname FROM pg_database WHERE datname = :dbName`,
      {
        replacements: { dbName: DATABASE_NAME },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (results.length === 0) {
      // Create the database if it doesn’t exist
      await rootSequelize.query(`CREATE DATABASE ${DATABASE_NAME}`);
      console.log(`Database ${DATABASE_NAME} created successfully.`);
    } else {
      console.log(`Database ${DATABASE_NAME} already exists.`);
    }

    // Authenticate with the specific database (myan_market)
    await sequelize.authenticate();
    console.log(`Connection to ${DATABASE_NAME} established successfully.`);

    // Optionally: Sync models (use with caution in production)
    // await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Unable to connect to or create the database:', error);
    throw error; // Re-throw to handle in the caller if needed
  } finally {
    // Close the root connection (not the main sequelize instance)
    await rootSequelize.close();
    console.log('Root connection closed.');
  }
};

// Export sequelize instance and connectDB function
module.exports = { connectDB, sequelize };