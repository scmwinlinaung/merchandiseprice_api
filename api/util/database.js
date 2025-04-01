const { Sequelize } = require('sequelize');
const {
  DATABASE_USERNAME,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_HOST,
} = require('../constant/database_constant');

// Initialize Sequelize instance
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'postgres',
  port: DATABASE_PORT,
  // Optional: Uncomment if SSL is needed
  // dialectOptions: {
  //   ssl: {
  //     require: false,
  //     rejectUnauthorized: false,
  //   },
  // },
  logging: console.log, // Optional: Enable for debugging
});

// Function to connect and create database if it doesn’t exist
const connectDB = async () => {
  const rootSequelize = new Sequelize({
    dialect: 'postgres',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    // Optional: Uncomment if SSL is needed
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
  });

  try {
    // Connect to PostgreSQL server (no specific database yet)
    await rootSequelize.authenticate();
    console.log('Connected to PostgreSQL server successfully.');

    // Check if the database exists
    const [results] = await rootSequelize.query(
      `SELECT datname FROM pg_database WHERE datname = '${DATABASE_NAME}'`
    );

    if (results.length === 0) {
      // Create the database if it doesn’t exist
      await rootSequelize.query(`CREATE DATABASE ${DATABASE_NAME}`);
      console.log(`Database ${DATABASE_NAME} created successfully.`);
    } else {
      console.log(`Database ${DATABASE_NAME} already exists.`);
    }

    // Authenticate with the specific database
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
  }
};

// Export sequelize instance and connectDB function
module.exports = { connectDB, sequelize };