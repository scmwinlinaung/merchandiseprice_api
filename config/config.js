const fs = require('fs');
require('dotenv').config();
module.exports = {
  development: {
    username: 'postgres',
    password: 'root',
    database: 'merchandiseprice',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
  test: {
    username: 'postgres',
    password: 'root',
    database: 'merchandiseprice',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
  production: {
    username: process.env.DATABASE_USERNAME || 'your_production_username',  // Use environment variable or fallback
    password: process.env.DATABASE_PASSWORD || 'your_production_password',
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST || 'your_production_host',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,  // Set to true if using a CA certificate
        // Uncomment the following if you have a CA certificate
        // ca: fs.readFileSync('path/to/rds-ca.pem'),  // Path to the CA certificate
      },
    },
    logging: false,
  },
};