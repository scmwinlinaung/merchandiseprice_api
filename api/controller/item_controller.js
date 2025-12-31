const { QueryTypes } = require('sequelize');
const Item = require('../model/item');
const { v4: uuidv4 } = require('uuid');
const logger = require('../util/logger'); // Import the logger

exports.listOfItemByMarketId = async (req, res) => {
  const { marketId, locationId } = req.body;
  if (!marketId) {
    return res.status(400).json({ message: 'Market ID is required' });
  }
  if (!locationId) {
    return res.status(400).json({ message: 'Location ID is required' });
  }
  try {
    const query = `
    SELECT
      item.id,
      item.name,
      item.unit,
      latest_price.location_id AS "locationId",
      item.market_id AS "marketId",
      COALESCE(latest_price.buy_price, 0) AS "buyPrice",
      COALESCE(latest_price.sell_price, 0) AS "sellPrice"
    FROM myan_market.item
    LEFT JOIN LATERAL (
      SELECT buy_price, sell_price, location_id
      FROM myan_market.item_price
      WHERE item_price.item_id = item.id
        AND item_price.location_id = :locationId
      ORDER BY created_datetime DESC
      LIMIT 1
    ) AS latest_price ON true
    WHERE
      item.market_id = :marketId
    ORDER BY item.name ASC;
  `;
    const items = await Item.sequelize.query(query, {
      replacements: { marketId: marketId.trim(), locationId: locationId.trim() },
      type: QueryTypes.SELECT,
    });
    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No items found for the given market and location' });
    }
    res.status(200).json(items);
  } catch (err) {
    logger.error("Error in listOfItemByMarketId:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listOfItemName = async (req, res, next) => {
  try {
    const marketId = req.params.marketId;
    const items = await Item.sequelize.query(
      `SELECT DISTINCT name FROM item WHERE market_id = :marketId ORDER BY name DESC;`,
      {
        replacements: { marketId: marketId.trim() },
        type: QueryTypes.SELECT,
      }
    );
    res.status(201).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res, next) => {
  const { name, marketId, unit } = req.body;

  try {
    // Add new name to ENUM if not exists
    const nameEnumType = 'myan_market.item_name';
    const unitEnumType = 'myan_market.item_unit';

    // Check and add new name to ENUM
    const [nameEnum] = await Item.sequelize.query(`SELECT unnest(enum_range(NULL::${nameEnumType}))`);
    const nameExists = nameEnum.some(row => row.unnest === name);

    if (!nameExists) {
      await Item.sequelize.query(`ALTER TYPE ${nameEnumType} ADD VALUE IF NOT EXISTS :name`, {
        replacements: { name },
      });
    }

    // Check and add new unit to ENUM
    const [unitEnum] = await Item.sequelize.query(`SELECT unnest(enum_range(NULL::${unitEnumType}))`);
    const unitExists = unitEnum.some(row => row.unnest === unit);

    if (!unitExists) {
      await Item.sequelize.query(`ALTER TYPE ${unitEnumType} ADD VALUE IF NOT EXISTS :unit`, {
        replacements: { unit },
      });
    }

    // Now create the item
    const item = {
      id: uuidv4(),
      name,
      marketId,
      unit,
    };

    const result = await Item.create(item);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id, name, marketId, unit } = req.body;
    const item = {
      id: id,
      name: name,
      marketId: marketId,
      unit: unit,
      modifiedDatetime: new Date(),
    };
    const result = await Item.update(item, {
      where: {
        id: id,
      },
    });
    res.status(200).json({
      "status": "Success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await Item.sequelize.query(`DELETE FROM myan_market.item WHERE id = :itemId`, {
      replacements: { itemId: req.params.itemId },
      type: QueryTypes.DELETE,
    });
    res.status(200).json({
      "status": "Success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneItem = async (req, res, next) => {
  try {
    const id = req.params.itemId;
    const result = await Item.findOne({
      where: {
        id: id,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.summaryOfAItemPrice = async (req, res, next) => {
  try {
    const { itemId, locationId, startDate, endDate } = req.query;
    const query = `
      SELECT 
        Item.name,
        Item.unit,
        TO_CHAR(ItemPrice.created_datetime, 'YYYY-MM-DD') AS date,
        json_agg(
          json_build_object(
            'buyPrice', ItemPrice.buy_price,
            'sellPrice', ItemPrice.sell_price,
            'buyPriceChanges', ItemPrice.buy_price_changes,
            'sellPriceChanges', ItemPrice.sell_price_changes,
            'status', ItemPrice.status,
            'time', ItemPrice.created_datetime
          ) ORDER BY ItemPrice.created_datetime DESC
        ) AS "priceHistory"
      FROM myan_market.item_price ItemPrice
      LEFT JOIN myan_market.item Item ON Item.id = ItemPrice.item_id 
      WHERE 
        Item.id = :itemId
        AND ItemPrice.location_id = :locationId
        AND ItemPrice.created_datetime BETWEEN :startDate AND :endDate
      GROUP BY 
        Item.name,
        Item.unit,
        TO_CHAR(ItemPrice.created_datetime, 'YYYY-MM-DD')
      ORDER BY 
        TO_CHAR(ItemPrice.created_datetime, 'YYYY-MM-DD') DESC;
    `;
    const result = await Item.sequelize.query(query, {
      replacements: { itemId: itemId?.trim(), locationId: locationId?.trim(), startDate, endDate },
      type: QueryTypes.SELECT,
    });
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listOfAllItemWithLatestPrice = async (req, res, next) => {
  const { marketId, locationId } = req.query;

  let query = `
    SELECT DISTINCT ON (item.id) item.id, item.name, item.unit,
      itemPrice.location_id AS "locationId",
      COALESCE(itemPrice.buy_price, 0) AS "buyPrice",
      COALESCE(itemPrice.sell_price, 0) AS "sellPrice",
      itemPrice.status AS status,
      COALESCE(market.name, '') AS "marketName",
      itemPrice.created_datetime AS "createdDatetime",
      itemPrice.modified_datetime AS "modifiedDatetime"
    FROM myan_market.item
    LEFT JOIN LATERAL (
      SELECT item_price.item_id, item_price.location_id, item_price.buy_price, item_price.sell_price,
             item_price.status, item_price.created_datetime, item_price.modified_datetime
      FROM myan_market.item_price
      WHERE item_price.item_id = item.id
      ORDER BY item_price.created_datetime DESC
      LIMIT 1
    ) itemPrice ON true
    LEFT JOIN myan_market.market Market ON market.id = item.market_id
  `;

  const replacements = {};
  const conditions = [];

  // Null-safe marketId validation
  if (marketId && typeof marketId === 'string') {
    const trimmedMarketId = marketId.trim();
    if (trimmedMarketId.length > 0) {
      conditions.push(`item.market_id = :marketId`);
      replacements.marketId = trimmedMarketId;
    }
  }

  // Null-safe locationId validation
  if (locationId && typeof locationId === 'string') {
    const trimmedLocationId = locationId.trim();
    if (trimmedLocationId.length > 0) {
      conditions.push(`itemPrice.location_id = :locationId`);
      replacements.locationId = trimmedLocationId;
    }
  }

  // Add WHERE clause if there are any conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
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

exports.listOfAll = async (req, res, next) => {
  try {
    const result = await Item.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error : ', error);
  }
};