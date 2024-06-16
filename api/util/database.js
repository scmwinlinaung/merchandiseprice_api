const { Sequelize } = require( 'sequelize' );
const database = 'merchandiseprice';
const sequelize = new Sequelize( 'merchandiseprice', 'postgres', 'root', {
    host: '127.0.0.1',
    dialect: 'postgres',
    username: 'postgres',
    database: database,
    password: 'root',
    port: 5432
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
