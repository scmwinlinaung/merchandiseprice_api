const express = require( 'express' );
const router = express.Router();
const itemController = require( '../controller/item_controller' );
router
    .route( '/item' )
    .post( itemController.createItem )
    .put( itemController.updateItem )
router.route( '/item/:itemId' )
    .get( itemController.getOneItem )
router.route( '/item/:itemId' )
    .post( itemController.deleteItem )
router.route( '/summaryOfLatestItem' )
    .get( itemController.summaryOfLatestItem )

module.exports = router;