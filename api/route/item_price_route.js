const express = require('express');
const router = express.Router();
const itemPriceController = require('../controller/item_price_controller');

/**
 * @swagger
 * /api/v1/itemPrice:
 *   post:
 *     summary: Create a new item price
 *     description: Creates a new price entry for an item in a specific market.
 *     tags: [ItemPrice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: The ID of the item
 *               marketId:
 *                 type: string
 *                 example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 description: The ID of the market
 *               price:
 *                 type: number
 *                 example: 99.99
 *                 description: The price of the item
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-03T10:00:00Z"
 *                 description: The date and time of the price entry
 *     responses:
 *       201:
 *         description: Item price created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "456e7890-f12b-34d5-a678-426614174000"
 *                 itemId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 marketId:
 *                   type: string
 *                   example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 price:
 *                   type: number
 *                   example: 99.99
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-03T10:00:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route('/itemPrice').post(itemPriceController.createItemPrice);

/**
 * @swagger
 * /api/v1/itemPrice:
 *   put:
 *     summary: Update an existing item price
 *     description: Updates the price or date of an existing item price entry.
 *     tags: [ItemPrice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemPriceId:
 *                 type: string
 *                 example: "456e7890-f12b-34d5-a678-426614174000"
 *                 description: The ID of the item price to update
 *               price:
 *                 type: number
 *                 example: 109.99
 *                 description: The updated price of the item
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-03T12:00:00Z"
 *                 description: The updated date and time of the price entry
 *     responses:
 *       200:
 *         description: Item price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "456e7890-f12b-34d5-a678-426614174000"
 *                 itemId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 marketId:
 *                   type: string
 *                   example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 price:
 *                   type: number
 *                   example: 109.99
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-03T12:00:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item price not found
 *       500:
 *         description: Internal server error
 */
router.route('/itemPrice').put(itemPriceController.updateItemPrice);

/**
 * @swagger
 * /api/v1/itemPrice/{itemPriceId}:
 *   get:
 *     summary: Get a specific item price
 *     description: Retrieves a single item price entry by its ID.
 *     tags: [ItemPrice]
 *     parameters:
 *       - in: path
 *         name: itemPriceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item price to retrieve
 *     responses:
 *       200:
 *         description: Item price retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "456e7890-f12b-34d5-a678-426614174000"
 *                 itemId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 marketId:
 *                   type: string
 *                   example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                 price:
 *                   type: number
 *                   example: 99.99
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-03T10:00:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item price not found
 *       500:
 *         description: Internal server error
 */
router.route('/itemPrice/:itemPriceId').get(itemPriceController.getOneItemPrice);

/**
 * @swagger
 * /api/v1/itemPriceHistory/{itemId}:
 *   get:
 *     summary: Get price history of an item
 *     description: Retrieves the price history of a specific item across all markets.
 *     tags: [ItemPrice]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to retrieve price history for
 *     responses:
 *       200:
 *         description: Price history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "456e7890-f12b-34d5-a678-426614174000"
 *                   itemId:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   marketId:
 *                     type: string
 *                     example: "987fcdeb-12d3-4e5b-a789-426614174000"
 *                   price:
 *                     type: number
 *                     example: 99.99
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-03T10:00:00Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item not found or no price history available
 *       500:
 *         description: Internal server error
 */
router.route('/itemPriceHistory/:itemId').get(itemPriceController.getPriceHistoryOfAItem);

/**
 * @swagger
 * /api/v1/itemPrice/{itemPriceId}:
 *   post:
 *     summary: Delete an item price
 *     description: |
 *       Deletes a specific item price entry by its ID.
 *       Note: This uses POST instead of DELETE for legacy reasons.
 *     tags: [ItemPrice]
 *     parameters:
 *       - in: path
 *         name: itemPriceId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item price to delete
 *     responses:
 *       200:
 *         description: Item price deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item price deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Item price not found
 *       500:
 *         description: Internal server error
 */
router.route('/itemPrice/:itemPriceId').post(itemPriceController.deleteItemPrice);

module.exports = router;