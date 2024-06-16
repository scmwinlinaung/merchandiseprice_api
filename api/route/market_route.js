const express = require( 'express' );
const router = express.Router();
const marketController = require( '../controller/market_controller' );
router
    .route( '/market' )
    .get( marketController.listAllMarket )
    .post( marketController.createMarket )

router.route( '/market/:marketId' )
    .get( marketController.getOneMarket )


module.exports = router;
