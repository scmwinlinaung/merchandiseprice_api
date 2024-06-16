const Market = require( '../model/market' );
exports.createMarket = async ( req, res, next ) =>
{

    const { name, description } = req.body;
    try
    {
        const market = {
            id: uuidv4(),
            name: name,
            description: description,
            created_datetime: new Date(),
            modified_datetime: new Date(),
        }
        const result = await Market.create( market )
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}