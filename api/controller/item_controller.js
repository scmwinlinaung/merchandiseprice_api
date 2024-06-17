const { QueryTypes } = require( 'sequelize' );
const Item = require( '../model/item' );
const { v4: uuidv4 } = require( 'uuid' );
exports.createItem = async ( req, res, next ) =>
{

    try
    {
        const { name, market_id, location_id, buy_price, sell_price, buy_price_changes, sell_price_changes, unit, status } = req.body;
        const item = {
            id: uuidv4(),
            name: name,
            market_id: market_id,
            location_id: location_id,
            buy_price: buy_price,
            sell_price: sell_price,
            buy_price_changes: buy_price_changes,
            sell_price_changes: sell_price_changes,
            unit: unit,
            status: status,
            created_datetime: new Date(),
            modified_datetime: new Date(),
        }
        const result = await Item.create( item );
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.updateItem = async ( req, res, next ) =>
{
    try
    {
        const { id, name, market_id, location_id, buy_price, sell_price, buy_price_changes, sell_price_changes, unit, status } = req.body;
        const item = {
            id: id,
            name: name,
            market_id: market_id,
            location_id: location_id,
            buy_price: buy_price,
            sell_price: sell_price,
            buy_price_changes: buy_price_changes,
            sell_price_changes: sell_price_changes,
            unit: unit,
            status: status,
            modified_datetime: new Date(),
        }
        const result = await Item.update( item, {
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

exports.deleteItem = async ( req, res, next ) =>
{
    try
    {
        await Item.sequelize.query( `delete from item where id = '${ req.params.itemId }'`, { type: QueryTypes.DELETE } )
        res.status( 200 ).json( {
            "status": "Success"
        } )
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}


exports.getOneItem = async ( req, res, next ) =>
{
    try
    {
        const id = req.params.itemId
        const result = await Item.findOne( {
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

exports.summaryOfLatestItem = async ( req, res, next ) =>
{
    try
    {
        const result = await Item.sequelize.query( `select Item.name, Item.buy_price, Item.sell_price, Item.created_datetime from item Item
            where Item.created_datetime = (
            SELECT MAX(created_datetime) 
            FROM item AS subitem 
            WHERE subitem.name = Item.name
            ) group by Item.name, Item.buy_price, Item.sell_price, Item.created_datetime;`, {
            type: QueryTypes.SELECT
        } )
        res.status( 200 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}