const Item = require( '../model/item' );
const { v4: uuidv4 } = require( 'uuid' );
exports.createItem = async ( req, res, next ) =>
{
    const { name, market_id, location_id, buy_price, sell_price, buy_price_changes, sell_price_changes, unit, status } = req.body;
    try
    {
        const item = {
            id: uuidv4(),
            name: name,
            market_id: market_id,
            location_id: location_id,
            buy_price: buy_price,
            sell_price: sell_price,
            buy_price_changes: buy_price_changes,
            sell_price_changes: sell_price_changes,
            unit: unit,
            status: status,
            created_datetime: new Date(),
            modified_datetime: new Date(),
        }
        const result = await Item.create( item );
        res.status( 201 ).json( result );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
}