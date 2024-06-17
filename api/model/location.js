const { DataTypes } = require( 'sequelize' );
const database = require( '../util/database' );

const Location = database.sequelize.define( 'Location', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'location'
} );

module.exports = Location;
