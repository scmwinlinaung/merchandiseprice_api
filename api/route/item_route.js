const express = require('express');
const router = express.Router();
const itemController = require('../controller/item_controller');

/**
 * @swagger
 * /api/v1/item:
 *   post:
 *     summary: Create a new item
 *     description: Creates a new item in a specific market.
 *     tags: [Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gold"
 *                 description: The name of the item
 *               marketId:
 *                 type: string
 *                 example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 description: The ID of the market the item belongs to
 *               unit:
 *                 type: string
 *                 example: "gram"
 *                 description: The unit of measurement for the item
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Gold"
 *                 marketId:
 *                   type: string
 *                   example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 unit:
 *                   type: string
 *                   example: "gram"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/item').post(itemController.createItem);

/**
 * @swagger
 * /api/v1/item:
 *   put:
 *     summary: Update an existing item
 *     description: Updates the details of an existing item, including its name, market ID, and unit.
 *     tags: [Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: The ID of the item to update
 *               name:
 *                 type: string
 *                 example: "Gold Updated"
 *                 description: The updated name of the item
 *               marketId:
 *                 type: string
 *                 example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 description: The updated ID of the market the item belongs to
 *               unit:
 *                 type: string
 *                 example: "ounce"
 *                 description: The updated unit of measurement for the item
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/item').put(itemController.updateItem);

/**
 * @swagger
 * /api/v1/item/{itemId}:
 *   get:
 *     summary: Get a specific item
 *     description: Retrieves a single item by its ID.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to retrieve
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Gold"
 *                 marketId:
 *                   type: string
 *                   example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 unit:
 *                   type: string
 *                   example: "gram"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.route('/item/:itemId').get(itemController.getOneItem);

/**
 * @swagger
 * /api/v1/item/{itemId}:
 *   post:
 *     summary: Delete an item
 *     description: |
 *       Deletes a specific item by its ID.
 *       Note: This uses POST instead of DELETE for legacy reasons.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/item/:itemId').post(itemController.deleteItem);

/**
 * @swagger
 * /api/v1/summaryOfAItemPrice:
 *   get:
 *     summary: Get a summary of an item's price history
 *     description: Retrieves a summary of an item's price history (buy/sell prices, changes, status) between a start and end date, grouped by date, for a specific location.
 *     tags: [Item]
 *     parameters:
 *       - in: query
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to summarize
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the location to filter the price history
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: The start date for the price history (e.g., "2024-06-17T00:00:00Z")
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: The end date for the price history (e.g., "2024-06-18T23:59:59Z")
 *     responses:
 *       200:
 *         description: Price history summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Gold"
 *                   unit:
 *                     type: string
 *                     example: "gram"
 *                   date:
 *                     type: string
 *                     example: "2024-06-17"
 *                   priceHistory:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         buyPrice:
 *                           type: number
 *                           example: 99.99
 *                         sellPrice:
 *                           type: number
 *                           example: 101.99
 *                         buyPriceChanges:
 *                           type: number
 *                           example: 0.5
 *                         sellPriceChanges:
 *                           type: number
 *                           example: -0.3
 *                         status:
 *                           type: string
 *                           example: "active"
 *                         time:
 *                           type: string
 *                           example: "14:30:00"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item or location not found, or no price data available
 *       500:
 *         description: Internal server error
 */
router.route('/summaryOfAItemPrice').get(itemController.summaryOfAItemPrice);

/**
 * @swagger
 * /api/v1/itemName/{marketId}:
 *   get:
 *     summary: Get a list of item names in a market
 *     description: Retrieves a list of distinct item names available in a specific market, ordered by name in descending order.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: marketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the market to retrieve item names from
 *     responses:
 *       201:
 *         description: List of item names retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Gold"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/itemName/:marketId').get(itemController.listOfItemName);

/**
 * @swagger
 * /api/v1/allItemWithLatestPrice/{marketId}:
 *   get:
 *     summary: Get all items with their latest prices in a market
 *     description: Retrieves a list of all items in a specific market along with their latest prices, including buy/sell prices, status, and timestamps.
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: marketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the market to retrieve items from
 *     responses:
 *       200:
 *         description: List of items with latest prices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Gold"
 *                   unit:
 *                     type: string
 *                     example: "gram"
 *                   locationId:
 *                     type: string
 *                     example: "456e7890-f12b-34d5-a678-426614174000"
 *                   buyPrice:
 *                     type: number
 *                     example: 99.99
 *                   sellPrice:
 *                     type: number
 *                     example: 101.99
 *                   status:
 *                     type: string
 *                     example: "active"
 *                   createdDatetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-03T10:00:00Z"
 *                   modifiedDatetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-03T10:00:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Market not found or no items available
 *       500:
 *         description: Internal server error
 */
router.route('/allItemWithLatestPrice').get(itemController.listOfAllItemWithLatestPrice);

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Get a list of all items
 *     description: Retrieves a list of all items across all markets, ordered by name in ascending order.
 *     tags: [Item]
 *     responses:
 *       200:
 *         description: List of all items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Gold"
 *                   marketId:
 *                     type: string
 *                     example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                   unit:
 *                     type: string
 *                     example: "gram"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/item').get(itemController.listOfAll);
router.route('/itemByMarketId/:marketId').get(itemController.listOfItemByMarketId);
module.exports = router;