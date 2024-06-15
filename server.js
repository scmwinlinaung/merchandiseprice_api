const express = require( 'express' );
const liquibase = require( './api/util/liquibase' )
const dbConnection = require( './api/util/db_connection' )
const app = express();
const port = 7000;

liquibase.updateLiquibase();
dbConnection.createDatabase();
// Middleware to parse JSON bodies
app.use( express.json() );

// Route to get all users
app.get( '/users', async ( req, res ) =>
{
    try
    {

        const result = await dbConnection.databasePool.query( 'SELECT * FROM users' );
        res.status( 200 ).json( result.rows );

    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} );

// Route to create a new user
app.post( '/users', async ( req, res ) =>
{
    const { name, email } = req.body;
    try
    {

        const result = await dbConnection.databasePool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [ name, email ]
        );
        res.status( 201 ).json( result.rows[ 0 ] );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    } finally
    {
    }
} );

// Start the server
app.listen( port, () =>
{
    console.log( `Server is running on http://localhost:${ port }` );
} );
