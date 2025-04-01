const { Client, Pool } = require( 'pg' );
const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_HOST, DATABASE_NAME } = require( '../constant/database_constant' );

const newDatabaseClient = new Client( {
    ssl: false,
    user: DATABASE_USERNAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    //ssl: {
    //    rejectUnauthorized: false,
    //    require: false,
    //},
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
        if ( res.rows.some( ( e ) => e[ 'datname' ] === DATABASE_NAME ) )
        {
            console.log( `Database ${ DATABASE_NAME } already exists.` );
        } else
        {
            // Create the new database
            const createDbQuery = `CREATE DATABASE ${ DATABASE_NAME }`;
            await newDatabaseClient.query( createDbQuery );
            console.log( `Database ${ DATABASE_NAME } created successfully.` );
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