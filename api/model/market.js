const { DataTypes, Sequelize } = require( 'sequelize' );
const database = require( '../util/database' );

const Market = database.sequelize.define( 'market', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    createdDatetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        field: "created_datetime"

    },
    modifiedDatetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn("NOW"),
        field: "modified_datetime"
    }
}, {
	schema:'myan_market',
    timestamps: false,
    tableName: 'market'
} );

module.exports = Market;
