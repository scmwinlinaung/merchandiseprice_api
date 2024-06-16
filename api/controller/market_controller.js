const { raw } = require( 'express' );
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
            created_datetime: new Date(),
            modified_datetime: new Date(),
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