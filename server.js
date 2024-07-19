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
const { sequelize } = require( "./api/util/database" );
const { MARKETS_CONSTANT } = require( "./api/constant/market_constant" );
const { CURRENCY_CONSTANT, OIL_CONSTANT, GOLD_CONSTANT, VEGETABLE_CONSTANT, CURRENCY_UNIT, OIL_UNIT, GOLD_UNIT, VEGETABLE_UNIT } = require( "./api/constant/item_constant" );
const Item = require( "./api/model/item" );
async function main ()
{
    dotenv.config();
    await dbConnection.createDatabase();
    await liquibase.updateLiquibase();
    await createDefaultMarketAndItems();
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
async function createDefaultMarketAndItems ()
{


    const marketLength = await Market.count();
    // create markets
    if ( marketLength == 0 )
    {
        for ( let i = 0; i < MARKETS_CONSTANT.length; i++ )
        {
            console.log( "MARKET = " + MARKETS_CONSTANT[ i ][ "name" ] )
            const marketId = uuidv4();
            await Market.create( {
                "id": marketId,
                "name": MARKETS_CONSTANT[ i ][ "name" ],
                "description": MARKETS_CONSTANT[ i ][ "description" ],
                "created_datetime": new Date(),
                "modified_datetime": new Date(),
            } )
            const allItems = [ CURRENCY_CONSTANT, OIL_CONSTANT, GOLD_CONSTANT, VEGETABLE_CONSTANT ]
            const allUnits = [ CURRENCY_UNIT, OIL_UNIT, GOLD_UNIT, VEGETABLE_UNIT ]
            const itemLength = await Item.count();
            if ( itemLength == 0 )
            {
                for ( let j = 0; j < allItems[ i ].length; j++ )
                {
                    console.log( " j value is = " + j )
                    const item = {
                        id: uuidv4(),
                        name: allItems[ i ][ j ],
                        marketId: marketId,
                        unit: allUnits[ i ][ j ],
                    }
                    await Item.create( item );
                }
            }
        }
    }
}


main().catch( console.log )