const { DataTypes, Sequelize } = require( 'sequelize' );
const database = require( '../util/database' );

const Market = database.sequelize.define( 'Market', {
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
    created_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,

    },
    modified_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
    }
}, {
    timestamps: false,
    tableName: 'market'
} );

module.exports = Market;
