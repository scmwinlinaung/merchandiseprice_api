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
    tableName: 'market'
} );

module.exports = Market;
