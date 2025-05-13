const { DataTypes, Sequelize } = require( 'sequelize' );
const database = require( '../util/database' );
const { CURRENCY_CONSTANT, OIL_CONSTANT, GOLD_CONSTANT, VEGETABLE_CONSTANT, CURRENCY_UNIT, OIL_UNIT, GOLD_UNIT, VEGETABLE_UNIT } = require( '../constant/item_constant' );
const Item = database.sequelize.define( 'item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.ENUM,
        values: [ ...CURRENCY_CONSTANT, ...OIL_CONSTANT, ...GOLD_CONSTANT, ...VEGETABLE_CONSTANT ]
    },
    marketId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "market_id"
    },
    unit: {
		type: 'myan_market.item_unit',
    },
    createdDatetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn( 'NOW' ),
        field: "created_datetime"

    },
    modifiedDatetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn( 'NOW' ),
        field: "modified_datetime"
    }
}, {
	schema:'myan_market',
    timestamps: false,
    tableName: 'item'
} );

module.exports = Item;
