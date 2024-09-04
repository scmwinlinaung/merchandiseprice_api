const { Sequelize } = require( 'sequelize' );
const { DATABASE_USERNAME, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_URL, DATABASE_HOST } = require( '../constant/database_constant' );
const database = 'merchandiseprice';
const sequelize = new Sequelize( 'merchandiseprice', 'postgres', 'root', {
    host: DATABASE_HOST,
    dialect: 'postgres',
    username: DATABASE_USERNAME,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT
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
