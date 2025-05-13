const { QueryTypes } = require( 'sequelize' );
const ItemPrice = require( '../model/item_price' );
const { v4: uuidv4 } = require( 'uuid' );

exports.createItemPrice = async ( req, res, next ) =>
{

    try
    {
        const { locationId, itemId, buyPrice, sellPrice, buyPriceChanges, sellPriceChanges, status, createdDatetime, modifiedDatetime } = req.body;
        const itemPrice = {
            id: uuidv4(),
            locationId: locationId,
            itemId: itemId,
            buyPrice: buyPrice,
            sellPrice: sellPrice,
            buyPriceChanges: buyPriceChanges,
            sellPriceChanges: sellPriceChanges,
            status: status,
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
        await ItemPrice.sequelize.query( `delete from myan_market.item where id = '${ req.params.itemPriceId }'`, { type: QueryTypes.DELETE } )
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

exports.getPriceHistoryOfAItem = async ( req, res, next ) =>
{
    try
    {
        const itemId = req.params.itemId
        const query = `SELECT item.name, item.unit, itemPrice.buy_price AS "buyPrice", 
        itemPrice.sell_price AS "sellPrice",itemPrice.buy_price_changes as "buyPriceChanges", itemPrice.sell_price_changes as "sellPriceChanges", itemPrice.status, itemPrice.created_datetime AS "createdDatetime",itemPrice.modified_datetime AS "modifiedDatetime"
        from myan_market.item left join item_price itemPrice on itemPrice.item_id = item.id
        where item.id = '${ itemId }'
        `;
        const result = await ItemPrice.sequelize.query( query, {
            type: QueryTypes.SELECT
        } );
        res.status( 200 ).json( result );
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}