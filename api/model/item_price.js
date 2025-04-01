const { DataTypes, Sequelize } = require( "sequelize" );
const database = require( "../util/database" );
const { ITEM_PRICE_STATUS } = require( "../constant/item_constant" );
const ItemPrice = database.sequelize.define( "item_price", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "id"
    },
    locationId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "location_id"
    },
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "item_id"
    },
    buyPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "buy_price"
    },
    sellPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "sell_price"
    },
    buyPriceChanges: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "buy_price_changes"
    },
    sellPriceChanges: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "sell_price_changes"
    },
    status: {
        type: DataTypes.ENUM,
        values: ITEM_PRICE_STATUS,
        allowNull: false,

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
	schema:'myan_market',
    timestamps: false,
    tableName: "item_price"
} );

module.exports = ItemPrice;
