const express = require( 'express' );
const router = express.Router();
const jwtController = require( '../controller/jwt_controller' );

router
    .route( "/generateToken" )
    .get( jwtController.generateToken )
router.route( "/validateToken" )
    .get( jwtController.validateToken )

module.exports = router