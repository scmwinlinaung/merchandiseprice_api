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
router.route( '/summaryOfAllLatestItem' )
    .get( itemController.summaryOfAllLatestItem )
router.route( '/item_name' )
    .get( itemController.listOfItemName )
module.exports = router;