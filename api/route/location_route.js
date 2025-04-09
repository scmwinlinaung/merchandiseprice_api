/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: API for managing locations
 */

/**
 * @swagger
 * /location:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Successfully retrieved locations
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               subdistrict:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Invalid input data
 * 
 *   put:
 *     summary: Update a location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               subdistrict:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /location/{locationId}:
 *   get:
 *     summary: Get a single location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The location ID
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *       404:
 *         description: Location not found
 * 
 *   post:
 *     summary: Delete a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 */

const express = require('express');
const router = express.Router();
const locationController = require('../controller/location_controller');

router
    .route('/location')
    .get(locationController.listAllLocation)
    .post(locationController.createLocation)
    .put(locationController.updateLocation);

router.route('/location/:locationId')
    .get(locationController.getOneLocation)
    .post(locationController.deleteLocation);

module.exports = router;
