const express = require( 'express' );
const router = express.Router();
const marketController = require( '../controller/market_controller' );
router
    .route( '/market' )
    .post( marketController.createMarket )

module.exports = router;
