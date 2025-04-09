
const { QueryTypes } = require( 'sequelize' );
const Market = require( '../model/market' );
const { v4: uuidv4 } = require( 'uuid' );
exports.createMarket = async ( req, res, next ) =>
{

    const { name, description } = req.body;
    try
    {
        const market = {
            id: uuidv4(),
            name: name,
            description: description,
        }
        const result = await Market.create( market )
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.getOneMarket = async ( req, res, next ) =>
{
    try
    {
        const id = req.params.marketId
        console.log( `Find a Market Record ${ req.params.marketId }` );
        const result = await Market.findOne( {
            where: {
                id: id
            }
        } )
        res.status( 200 ).json( result );
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.listAllMarket = async ( req, res, next ) =>
{
    const result = await Market.findAll();
    return res.status( 200 ).json( result )
}

exports.updateMarket = async ( req, res, next ) =>
{
    try
    {
        const { id, name, description } = req.body;
        const market = {
            id: id,
            name: name,
            description: description,
            // created_datetime: new Date(),
            modifiedDatetime: new Date(),
        }
        const result = await Market.update( market, {
            where: {
                id: id
            }
        } );
        res.status( 200 ).json( {
            "status": "Success"
        } );
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.deleteMarket = async ( req, res, next ) =>
{
    try
    {
        await Market.sequelize.query( `delete from myan_market.market where id = '${ req.params.marketId }'`, { type: QueryTypes.DELETE } )
        res.status( 200 ).json( {
            "status": "Success"
        } )
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} 