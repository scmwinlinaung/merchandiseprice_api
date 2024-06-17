const express = require( 'express' );
const liquibase = require( './api/util/liquibase' )
const dbConnection = require( './api/util/db_connection' )
const marketRoute = require( './api/route/market_route' );
const locationRoute = require( './api/route/location_route' );
const itemRoute = require( './api/route/item_route' );
const app = express();
const port = 7000;

liquibase.updateLiquibase();
dbConnection.createDatabase();
// Middleware to parse JSON bodies
app.use( express.json() );


app.use( '/api/v1', marketRoute );
app.use( '/api/v1/', locationRoute );
app.use( '/api/v1/', itemRoute );
// Start the server
app.listen( port, () =>
{
    console.log( `Server is running on http://localhost:${ port }` );
} );

// Properly close the Sequelize connection when the process is terminated
process.on( 'SIGTERM', () =>
{
    sequelize.close().then( () =>
    {
        console.log( 'Database connection closed.' );
        process.exit( 0 );
    } );
} );