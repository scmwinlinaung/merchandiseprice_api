const express = require( 'express' );
const router = express.Router();
const marketController = require( '../controller/market_controller' );
router
    .route( '/market' )
    .get( marketController.listAllMarket )
    .post( marketController.createMarket )
    .put( marketController.updateMarket )

router.route( '/market/:marketId' )
    .get( marketController.getOneMarket )
router.route( '/market/:marketId' )
    .post( marketController.deleteMarket )


module.exports = router;
