const { QueryTypes } = require( 'sequelize' );
const Item = require( '../model/item' );
const { v4: uuidv4 } = require( 'uuid' );
exports.listOfItemName = async ( req, res, next ) =>
{
    try
    {
        const items = await Item.sequelize.query( "select distinct name from item order by name desc;", {
            type: QueryTypes.SELECT
        } );

        res.status( 201 ).json( items );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}
exports.createItem = async ( req, res, next ) =>
{

    try
    {
        const { name, marketId, unit } = req.body;
        const item = {
            id: uuidv4(),
            name: name,
            marketId: marketId,
            unit: unit,
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
        const { id, name, marketId, unit } = req.body;
        const item = {
            id: id,
            name: name,
            marketId: marketId,
            unit: unit,
            modifiedDatetime: new Date(),
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

exports.summaryOfAllLatestItem = async ( req, res, next ) =>
{
    try
    {
        // this endpoint will query all item between start date and end date and then aggregate item per specified date
        // 2024-06-17 00:00:00 (start date) 
        // 2024-06-18 23:59:59
        const { name, locationId, startDate, endDate } = req.body;
        const result = await Item.sequelize.query( `SELECT DISTINCT ON (Item.name, TO_CHAR(Item.created_datetime, 'DD-MM-YYYY'))
            Item.name,
            Item.unit,
            TO_CHAR(Item.created_datetime, 'DD-MM-YYYY') AS date,
            (
                SELECT json_agg(json_build_object(
                    'buy_price', ItemPrice.buy_price,
                    'sell_price', ItemPrice.sell_price,
                    'buy_price_changes', ItemPrice.buy_price_changes,
                    'sell_price_changes', ItemPrice.sell_price_changes,
                    'status', ItemPrice.status,
                    'time',TO_CHAR(ItemPrice.created_datetime, 'HH24:MI:SS')
                ))
                FROM item_price ItemPrice
                WHERE ItemPrice.item_id = Item.id
                AND ItemPrice.location_id = '${ locationId.trim() }'
                and ItemPrice.created_datetime BETWEEN '${ startDate }' AND '${ endDate }'
            ) AS item_list
            FROM item Item
            WHERE Item.name = '${ name.trim() }'
             
            ORDER BY Item.name,TO_CHAR(Item.created_datetime, 'DD-MM-YYYY') DESC;
`, {
            type: QueryTypes.SELECT
        } )
        res.status( 200 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.listOfAllItemWithLatestPrice = async ( req, res, next ) =>
{
    const marketId = req.params.marketId
    const query = `SELECT item.name, item.unit, itemPrice.buy_price AS "buyPrice", itemPrice.sell_price AS "sellPrice", itemPrice.status, itemPrice.created_datetime AS "createdDatetime",itemPrice.modified_datetime AS "modifiedDatetime"
            FROM item 
            JOIN (
                SELECT itemPrice.item_id, itemPrice.buy_price, itemPrice.sell_price, itemPrice.status,itemPrice.created_datetime,itemPrice.modified_datetime
                FROM item_price itemPrice
                WHERE itemPrice.created_datetime = (
                    SELECT MAX(innerItemPrice.created_datetime)
                    FROM item_price innerItemPrice
                    WHERE innerItemPrice.item_id = itemPrice.item_id
                    limit 1
                )
            ) itemPrice ON itemPrice.item_id = item.id where market_id = '${ marketId }'
    ;
    `;
    try
    {
        const result = await Item.sequelize.query( query, {
            type: QueryTypes.SELECT
        } );
        res.status( 200 ).json( result );
    } catch ( error )
    {
        console.error( 'Error : ', error );
    }
}


