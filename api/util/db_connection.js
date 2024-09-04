const { Client, Pool } = require( 'pg' );
const database = require( './database' );
const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_URL, DATABASE_PORT, DATABASE_HOST } = require( '../constant/database_constant' );
const databaseName = 'merchandiseprice';

const newDatabaseClient = new Client( {
    user: DATABASE_USERNAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
} );

const createDatabase = async () =>
{
    try
    {
        // Connect to the PostgreSQL server
        await newDatabaseClient.connect();
        // Check if the database already exists
        const checkDbQuery = `SELECT datname FROM pg_database`;
        const res = await newDatabaseClient.query( checkDbQuery );

        if ( res.rows.some( ( e ) => e[ 'datname' ] == databaseName ) )
        {
            console.log( `Database ${ databaseName } already exists.` );
        } else
        {
            // Create the new database
            const createDbQuery = `CREATE DATABASE ${ databaseName }`;
            await newDatabaseClient.query( createDbQuery );
            console.log( `Database ${ databaseName } created successfully.` );
        }
    } catch ( err )
    {
        console.error( 'Error creating database:', err );
    } finally
    {
        await newDatabaseClient.end();
        // await database.connectDB();
        // Close the databaseClient connection
        // await databaseClient.end();
    }
};
module.exports = { createDatabase }