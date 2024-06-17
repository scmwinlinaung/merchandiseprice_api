const express = require( 'express' );
const router = express.Router();
const itemController = require( '../controller/item_controller' );
router
    .route( '/item' )
    .post( itemController.createItem )

module.exports = router;