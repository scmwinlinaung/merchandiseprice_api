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
const { validateToken } = require( "./api/controller/jwt_controller" );
const { STATE_CONSTANT } = require( "./api/constant/location_constant" );
const Location = require( "./api/model/location" );
async function main ()
{
    dotenv.config();
    await dbConnection.createDatabase();
    await liquibase.updateLiquibase();
    await createDefaultMarketAndItems();
    await createLocation();
    // Middleware to parse JSON bodies
    app.use( express.json() );
    // check jwt token
    // middleware
    app.use( async ( req, res, next ) =>
    {
        const generateTokenRouteName = "/api/v1/generateToken";
        // if route name is generateTokenRouteName, we don't need to check token is valid
        if ( !( req.originalUrl == generateTokenRouteName ) )
        {
            const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
            const token = req.header( tokenHeaderKey );
            const tokenStatus = await validateToken( token );
            if ( tokenStatus ) return next()
            else res.status( 401 ).send( "Unauthorized Exception" )
        } else
        {
            next();
        }
    } )
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
    const itemLegnth = await Item.count();
    // create markets
    if ( marketLength == 0 && itemLegnth == 0 )
    {
        for ( let i = 0; i < MARKETS_CONSTANT.length; i++ )
        {
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

            for ( let j = 0; j < allItems[ i ].length; j++ )
            {
                const item = {
                    id: uuidv4(),
                    name: allItems[ i ][ j ],
                    marketId: marketId,
                    unit: allUnits[ i ][ j ] == null ? allUnits[ i ][ 0 ] : allUnits[ i ][ j ],
                }
                await Item.create( item );
            }

        }
    }

}
async function createLocation ()
{
    for ( let i = 0; i < STATE_CONSTANT.length; i++ )
    {

        const location = {
            id: uuidv4(),
            state: STATE_CONSTANT[ i ],
            district: '',
            subdistrict: '',
            city: '',
        }
        await Location.create( location );
    }
}

main().catch( console.log )