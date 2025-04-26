const { QueryTypes } = require( 'sequelize' );
const Item = require( '../model/item' );
const { v4: uuidv4 } = require( 'uuid' );
const logger = require('../util/logger');  // Import the logger


exports.listOfItemByMarketId = async (req, res) => {
	logger.info("listOfItemByMarketId")
	const marketId = req.params.marketId;
	if (!marketId) {
	  return res.status(400).json({ message: 'Market ID is required' });
	}
  
	try {
	  const items = await Item.findAll({ where: { market_id: marketId } });
	  res.status(200).json(items);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Server error' });
	}
  };
  
exports.listOfItemName = async ( req, res, next ) =>
{
    try
    {
        const marketId = req.params.marketId;
        const items = await Item.sequelize.query( `select distinct name from item where market_id = '${ marketId.trim() }' order by name desc;`, {
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
        await Item.sequelize.query( `delete from myan_market.item where id = '${ req.params.itemId }'`, { type: QueryTypes.DELETE } )
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

exports.summaryOfAItemPrice = async ( req, res, next ) =>
{
    try
    {
        // this endpoint will query all item between start date and end date and then aggregate item per specified date
        // 2024-06-17 00:00:00 (start date) 
        // 2024-06-18 23:59:59

        const { itemId, locationId, startDate, endDate } = req.query;
        console.log( itemId );
        console.log( locationId );
        console.log( startDate );
        console.log( endDate )
        const query = `SELECT Item.name,Item.unit,TO_CHAR(ItemPrice.created_datetime, 'YYYY-MM-DD') as date,(json_agg(json_build_object(
            'buyPrice', ItemPrice.buy_price,
            'sellPrice', ItemPrice.sell_price,
            'buyPriceChanges', ItemPrice.buy_price_changes,
            'sellPriceChanges', ItemPrice.sell_price_changes,
            'status', ItemPrice.status,
            'time', ItemPrice.created_datetime
    ))) as "priceHistory"
        FROM myan_market.item_price ItemPrice
        left join myan_market.item Item on Item.id = ItemPrice.item_id 
        WHERE Item.id = '${ itemId.trim() }'
        AND ItemPrice.location_id = '${ locationId.trim() }'
        AND ItemPrice.created_datetime BETWEEN '${ startDate }' AND '${ endDate }'
        GROUP BY 
            Item.name,
            Item.unit,
            TO_CHAR(ItemPrice.created_datetime, 'YYYY-MM-DD')
      ;`

        const result = await Item.sequelize.query( query, {
            type: QueryTypes.SELECT
        } )
        console.log( result );
        res.status( 200 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}


exports.listOfAllItemWithLatestPrice = async (req, res, next) => {
  const {marketId, locationId} = req.query

  let query = `
    SELECT DISTINCT ON (item.id) item.id, item.name, item.unit, 
      itemPrice.location_id AS "locationId", 
      itemPrice.buy_price AS "buyPrice", 
      itemPrice.sell_price AS "sellPrice", 
      itemPrice.status, 
	  market.name as "marketName",
      itemPrice.created_datetime AS "createdDatetime",
      itemPrice.modified_datetime AS "modifiedDatetime"
    FROM myan_market.item 
    JOIN (
      SELECT itemPrice.item_id, itemPrice.location_id, itemPrice.buy_price, itemPrice.sell_price, 
             itemPrice.status, itemPrice.created_datetime, itemPrice.modified_datetime
      FROM myan_market.item_price itemPrice
      WHERE itemPrice.created_datetime = (
        SELECT MAX(innerItemPrice.created_datetime)
        FROM myan_market.item_price innerItemPrice
        WHERE innerItemPrice.item_id = itemPrice.item_id
        LIMIT 1
      )
    ) 
	itemPrice ON itemPrice.item_id = item.id
	left join myan_market.market Market on market.id = Item.market_id 
  `;

  const replacements = {};

  if (marketId?.trim().length > 2) {
    query += ` WHERE item.market_id = :marketId`;
    replacements.marketId = marketId;
  }
  if(locationId?.trim().length > 2) {
	query += ` AND itemPrice.location_id = :locationId`;
	replacements.locationId = locationId;
  }

  try {
    const result = await Item.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ SQL Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.listOfAll = async ( req, res, next ) =>
{
	
	try
	{
		const result = await Item.findAll()		
		res.status( 200 ).json( result );
	} catch ( error )
	{
		console.error( 'Error : ', error );
	}	
}

