const Location = require( '../model/location' );
const { v4: uuidv4 } = require( 'uuid' );
exports.createLocation = async ( req, res, next ) =>
{
    const { state, district, subdistrict, city } = req.body;
    try
    {
        const location = {
            id: uuidv4(),
            state: state,
            district: district,
            subdistrict: subdistrict,
            city: city,
        }
        const result = await Location.create( location );
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}
exports.getOneLocation = async ( req, res, next ) =>
{
    try
    {
        const id = req.params.locationId
        console.log( `Find a Location Record ${ req.params.marketId }` );
        const result = await Location.findOne( {
            where: {
                id: id
            }
        } )
        res.status( 200 ).json( result );
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.listAllLocation = async ( req, res, next ) =>
{
    const result = await Location.findAll();
    return res.status( 200 ).json( result )
}


exports.updateLocation = async ( req, res, next ) =>
{
    try
    {
        const { id, state, district, subdistrict, city } = req.body;
        const location = {
            id: id,
            state: state,
            district: district,
            subdistrict: subdistrict,
            city: city,
            modified_datetime: new Date(),
        }
        const result = await Location.update( location, {
            where: {
                id: id
            }
        } );
        res.status( 200 ).json( {
            "status": "Success"
        } );
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}

exports.deleteLocation = async ( req, res, next ) =>
{
    try
    {
        await Location.sequelize.query( `delete from location where id = '${ req.params.marketId }'`, { type: QueryTypes.DELETE } )
        res.status( 200 ).json( {
            "status": "Success"
        } )
    }
    catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} 