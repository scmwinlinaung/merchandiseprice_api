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

exports.listOfEachItemWithPagination = async ( req, res, next ) =>
{
    const { startDate, endDate } = req.body;
    const startOfDay = new Date( startDate.setHours( 0, 0, 0, 0 ) );
    const endOfDay = new Date( endDate.setHours( 23, 59, 59, 999 ) );
    console.log( startOfDay );
    console.log( endOfDay );

    const query = `
        SELECT 
            DATE(created_datetime) AS day,
            ARRAY_AGG(id) AS ids,
            ARRAY_AGG(name) AS names,
            ARRAY_AGG(market_id) AS market_ids,
            ARRAY_AGG(location_id) AS location_ids,
            ARRAY_AGG(buy_price) AS buy_prices,
            ARRAY_AGG(sell_price) AS sell_prices,
            ARRAY_AGG(buy_price_changes) AS buy_price_changes,
            ARRAY_AGG(sell_price_changes) AS sell_price_changes,
            ARRAY_AGG(unit) AS units,
            ARRAY_AGG(status) AS statuses
        FROM item
        WHERE created_datetime BETWEEN :startOfDay AND :endOfDay
        GROUP BY DATE(created_datetime)
        ORDER BY DATE(created_datetime);
    `;

    try
    {
        const [ results, metadata ] = await Item.sequelize.query( query, {
            replacements: { startOfDay, endOfDay },
            type: sequelize.QueryTypes.SELECT
        } );
        return results;
    } catch ( error )
    {
        console.error( 'Error fetching items grouped by day:', error );
    }
}
