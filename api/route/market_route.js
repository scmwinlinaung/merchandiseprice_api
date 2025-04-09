/**
 * @swagger
 * tags:
 *   name: Markets
 *   description: API for managing markets
 */

/**
 * @swagger
 * /market:
 *   get:
 *     summary: Get all markets
 *     tags: [Markets]
 *     responses:
 *       200:
 *         description: Successfully retrieved markets
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new market
 *     tags: [Markets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Market created successfully
 *       400:
 *         description: Invalid input data
 * 
 *   put:
 *     summary: Update a market
 *     tags: [Markets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Market updated successfully
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /market/{marketId}:
 *   get:
 *     summary: Get a single market by ID
 *     tags: [Markets]
 *     parameters:
 *       - in: path
 *         name: marketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The market ID
 *     responses:
 *       200:
 *         description: Market retrieved successfully
 *       404:
 *         description: Market not found
 * 
 *   post:
 *     summary: Delete a market by ID
 *     tags: [Markets]
 *     parameters:
 *       - in: path
 *         name: marketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The market ID
 *     responses:
 *       200:
 *         description: Market deleted successfully
 *       404:
 *         description: Market not found
 */

const express = require('express');
const router = express.Router();
const marketController = require('../controller/market_controller');

router
    .route('/market')
    .get(marketController.listAllMarket)
    .post(marketController.createMarket)
    .put(marketController.updateMarket);

router.route('/market/:marketId')
    .get(marketController.getOneMarket)
    .post(marketController.deleteMarket);

module.exports = router;
