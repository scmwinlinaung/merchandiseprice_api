const { Sequelize } = require( 'sequelize' );
const { DATABASE_USERNAME, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_HOST } = require( '../constant/database_constant' );

const sequelize = new Sequelize( DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'postgres',
    username: DATABASE_USERNAME,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    dialectOptions: {
        ssl: {
            require: true,           // Enforces SSL connection
            rejectUnauthorized: false // Disables strict SSL validation (set to true if you have the certificate)
        }
    },
} );
const connectDB = async () =>
{
    try
    {
        await sequelize.authenticate();
        console.log( 'Connection has been established successfully.' );
    } catch ( error )
    {
        console.error( 'Unable to connect to the database:', error );
    }
};
module.exports = { connectDB, sequelize };
