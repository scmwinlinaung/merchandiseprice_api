const { Client, Pool } = require( 'pg' );
const databaseName = 'merchandiseprice';
const databasePool = new Pool( {
    user: 'postgres',
    host: 'localhost',
    database: databaseName,
    password: 'root',
    port: 5432,
} );

const newDatabaseClient = new Client( {
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    port: 5432,
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
        await databasePool.connect();
        // Close the databaseClient connection
        // await databaseClient.end();
    }
};
module.exports = { createDatabase, databasePool }