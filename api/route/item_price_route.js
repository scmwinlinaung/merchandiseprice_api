const express = require( 'express' );
const router = express.Router();
const itemPriceController = require( '../controller/item_price_controller' );
router
    .route( '/itemPrice' )
    .post( itemPriceController.createItemPrice )
    .put( itemPriceController.updateItemPrice )
router.route( '/itemPrice/:itemPriceId' )
    .get( itemPriceController.getOneItemPrice )
router.route( '/itemPrice/:itemPriceId' )
    .post( itemPriceController.deleteItemPrice )
module.exports = router;