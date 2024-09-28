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
        type: DataTypes.ENUM,
        values: [ ...CURRENCY_UNIT, ...OIL_UNIT, ...GOLD_UNIT, ...VEGETABLE_UNIT ]
    },
    createdDatetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: "created_datetime"

    },
    modifiedDatetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
        field: "modified_datetime"
    }
}, {
    timestamps: false,
    tableName: 'item'
} );

module.exports = Item;
