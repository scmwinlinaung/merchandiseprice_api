const { DataTypes } = require( 'sequelize' );
const database = require( '../util/database' );
const Item = database.sequelize.define( 'Item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.ENUM,
        values: [ 'USD', 'EUR', 'SGD', 'THB', 'JPY', 'MYR', 'CNY', 'WON', 'GBP', 'AUD', 'CAD', 'NTD', 'AED', 'INR', 'HKD', 'MOP' ],
    },
    market_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    buy_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    sell_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    buy_price_changes: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    sell_price_changes: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: [ "UP", "DOWN" ],
        allowNull: false,
    },
    created_datetime: {
        type: DataTypes.DATE,
        allowNull: false,

    },
    modified_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'item'
} );

module.exports = Item;
