const { DataTypes, Sequelize } = require( 'sequelize' );
const database = require( '../util/database' );
const { STATE_CONSTANT } = require( '../constant/location_constant' );

const Location = database.sequelize.define( 'location', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    state: {
        type: DataTypes.ENUM,
        values: STATE_CONSTANT
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subdistrict: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
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
    tableName: 'location'
} );

module.exports = Location;
