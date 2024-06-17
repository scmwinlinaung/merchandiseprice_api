const express = require( 'express' );
const router = express.Router();
const locationController = require( '../controller/location_controller' );
router
    .route( '/location' )
    .get( locationController.listAllLocation )
    .post( locationController.createLocation )
    .put( locationController.updateLocation )

router.route( '/location/:locationId' )
    .get( locationController.getOneLocation )
router.route( '/location/:locationId' )
    .post( locationController.deleteLocation )


module.exports = router;
