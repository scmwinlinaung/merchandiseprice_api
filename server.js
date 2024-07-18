const express = require( "express" );
const dotenv = require( "dotenv" )
const liquibase = require( "./api/util/liquibase" )
const dbConnection = require( "./api/util/db_connection" )
const marketRoute = require( "./api/route/market_route" );
const locationRoute = require( "./api/route/location_route" );
const itemRoute = require( "./api/route/item_route" );
const itemPriceRoute = require( "./api/route/item_price_route" );
const jwtRoute = require( "./api/route/jwt_route" );
const Market = require( "./api/model/market" )
const app = express();
const port = 7000;

const { v4: uuidv4 } = require( "uuid" );
const { sequelize } = require( "./api/util/database" )
async function main ()
{
    dotenv.config();
    await dbConnection.createDatabase();
    await liquibase.updateLiquibase();
    const markets = [
        {
            "name": "Vegetable",
            "description": "Vegetable"
        },
        {
            "name": "Currency",
            "description": "Fiat Currency"
        }, {
            "name": "Gold Price",
            "description": "Gold Price"
        }, {
            "name": "Diseal And Petrol Price",
            "description": "Diseal And Petrol Price"
        } ]

    const marketLength = await Market.count();
    // create markets
    if ( marketLength == 0 )
    {
        for ( let i = 0; i < markets.length; i++ )
        {
            console.log( markets[ i ][ "name" ] )
            await Market.create( {
                "id": uuidv4(),
                "name": markets[ i ][ "name" ],
                "description": markets[ i ][ "description" ],
                "created_datetime": new Date(),
                "modified_datetime": new Date(),
            } )
        }
    }

    // Middleware to parse JSON bodies
    app.use( express.json() );


    app.use( "/api/v1/", marketRoute );
    app.use( "/api/v1/", locationRoute );
    app.use( "/api/v1/", itemRoute );
    app.use( "/api/v1/", itemPriceRoute );
    app.use( "/api/v1/", jwtRoute );
    // Start the server
    app.listen( port, () =>
    {
        console.log( `Server is running on http://localhost:${ port }` );
    } );

    // Properly close the Sequelize connection when the process is terminated
    process.on( "SIGTERM", () =>
    {
        sequelize.close().then( () =>
        {
            console.log( "Database connection closed." );
            process.exit( 0 );
        } );
    } );
}
main().catch( console.log )