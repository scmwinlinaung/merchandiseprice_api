const { QueryTypes } = require( 'sequelize' );
const ItemPrice = require( '../model/item_price' );
const { v4: uuidv4 } = require( 'uuid' );

exports.createItemPrice = async ( req, res, next ) =>
{

    try
    {
        const { locationId, itemId, buyPrice, sellPrice, buyPriceChanges, sellPriceChanges, status } = req.body;
        const itemPrice = {
            id: uuidv4(),
            locationId: locationId,
            itemId: itemId,
            buyPrice: buyPrice,
            sellPrice: sellPrice,
            buyPriceChanges: buyPriceChanges,
            sellPriceChanges: sellPriceChanges,
            status: status
        }
        const result = await ItemPrice.create( itemPrice );
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.updateItemPrice = async ( req, res, next ) =>
{
    try
    {
        const { id, locationId, itemId, buyPrice, sellPrice, buyPriceChanges, sellPriceChanges, status } = req.body;
        const itemPrice = {
            id: id,
            locationId: locationId,
            itemId: itemId,
            buyPrice: buyPrice,
            sellPrice: sellPrice,
            buyPriceChanges: buyPriceChanges,
            sellPriceChanges: sellPriceChanges,
            status: status,
            modifiedDatetime: new Date()
        }
        const result = await ItemPrice.update( itemPrice, {
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

exports.deleteItemPrice = async ( req, res, next ) =>
{
    try
    {
        await ItemPrice.sequelize.query( `delete from item where id = '${ req.params.itemPriceId }'`, { type: QueryTypes.DELETE } )
        res.status( 200 ).json( {
            "status": "Success"
        } )
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}


exports.getOneItemPrice = async ( req, res, next ) =>
{
    try
    {
        const id = req.params.itemPriceId
        const result = await ItemPrice.findOne( {
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