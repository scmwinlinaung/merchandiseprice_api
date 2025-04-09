const express = require('express');
const router = express.Router();
const jwtController = require('../controller/jwt_controller');

/**
 * @swagger
 * /generateToken:
 *   get:
 *     summary: Generate a new JWT token
 *     description: Generates a new JWT token for authentication. This endpoint does not require prior authentication.
 *     tags: [JWT]
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: The generated JWT token
 *       500:
 *         description: Internal server error
 *     security: [] # No authentication required for this endpoint
 */
router.route("/generateToken").get(jwtController.generateToken);

/**
 * @swagger
 * /validateToken:
 *   get:
 *     summary: Validate a JWT token
 *     description: Validates a JWT token provided in the request header. Returns the token's status.
 *     tags: [JWT]
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                   description: Indicates whether the token is valid
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.route("/validateToken").get(jwtController.validateToken);

module.exports = router;