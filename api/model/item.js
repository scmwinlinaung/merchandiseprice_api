const { DataTypes, Sequelize } = require( 'sequelize' );
const database = require( '../util/database' );
const Item = database.sequelize.define( 'item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.ENUM,
        values: [ 'USD', 'EUR', 'SGD', 'THB', 'JPY', 'MYR', 'CNY', 'WON', 'GBP', 'AUD', 'CAD', 'NTD', 'AED', 'INR', 'HKD', 'MOP', '92 RON OCTANE', '95 RON OCTANE', '97 RON OCTANE', 'DISEAL', 'PREMIUM DISEAL' ],
    },
    marketId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "market_id"
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdDatetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: "created_datetime"

    },
    modifiedDatetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        field: "modified_datetime"
    }
}, {
    timestamps: false,
    tableName: 'item'
} );

module.exports = Item;
