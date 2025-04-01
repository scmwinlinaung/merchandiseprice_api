'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create schema
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS myan_market');

    // Create ENUM types
    await queryInterface.sequelize.query(`
      CREATE TYPE myan_market.item_unit AS ENUM ('$', '€', 'S$', '฿', '¥', 'RM', 'CN¥', '₩', '£', 'AU$', 'Can$', 'NT$', 'د.إ', '₹', 'HK$', 'MOP$', '1 litre', '1 oz', '15 pae ye', '16 pae ye', '1 kg');
      CREATE TYPE myan_market.status AS ENUM ('UP', 'DOWN', 'UNCHANGE');
      CREATE TYPE myan_market.item_name AS ENUM ('USD', 'EUR', 'SGD', 'THB', 'JPY', 'MYR', 'CNY', 'WON', 'GBP', 'AUD', 'CAD', 'NTD', 'AED', 'INR', 'HKD', 'MOP', '92 RON OCTANE', '95 RON OCTANE', '97 RON OCTANE', 'DISEAL', 'PREMIUM DISEAL', 'WORLD GOLD PRICE', 'MYANMAR GOLD PRICE 16', 'MYANMAR GOLD PRICE 15', 'CONE', 'PALM OIL');
      CREATE TYPE myan_market.state AS ENUM ('YANGON', 'MANDALAY', 'NAYPYITAW', 'AYARWADDY', 'BAGO', 'MAGWAY', 'SAGAING', 'TANINTHARYI', 'CHIN', 'KACHIN', 'KAYAH', 'KAYIN', 'MON', 'RAKHINE', 'SHAN');
    `);

    // Create market table
    await queryInterface.createTable('market', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      name: Sequelize.STRING(100),
      description: Sequelize.TEXT,
      created_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      modified_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, { schema: 'myan_market' });

    // Create location table
    await queryInterface.createTable('location', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      state: {
        type: 'myan_market.state', // Use the existing ENUM type
      },
      district: Sequelize.STRING(255),
      subdistrict: Sequelize.STRING(255),
      city: Sequelize.STRING(255),
      created_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      modified_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, { schema: 'myan_market' });

    // Create item table
    await queryInterface.createTable('item', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      name: {
        type: 'myan_market.item_name', // Use the existing ENUM type
      },
      market_id: {
        type: Sequelize.STRING(255),
        references: { model: { tableName: 'market', schema: 'myan_market' }, key: 'id' },
        onDelete: 'CASCADE',
      },
      unit: {
        type: 'myan_market.item_unit', // Use the existing ENUM type
      },
      created_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      modified_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, { schema: 'myan_market' });

    // Create index on item.name
    await queryInterface.addIndex({ tableName: 'item', schema: 'myan_market' }, ['name'], { name: 'item_name' });

    // Create item_price table
    await queryInterface.createTable('item_price', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.STRING(255),
        references: { model: { tableName: 'item', schema: 'myan_market' }, key: 'id' },
        onDelete: 'CASCADE',
      },
      buy_price: Sequelize.DOUBLE,
      sell_price: Sequelize.DOUBLE,
      buy_price_changes: Sequelize.DOUBLE,
      sell_price_changes: Sequelize.DOUBLE,
      status: {
        type: 'myan_market.status', // Use the existing ENUM type
      },
      location_id: {
        type: Sequelize.STRING(255),
        references: { model: { tableName: 'location', schema: 'myan_market' }, key: 'id' },
        onDelete: 'CASCADE',
      },
      created_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      modified_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, { schema: 'myan_market' });
  },

  down: async (queryInterface) => {
    // Rollback: Drop tables and ENUMs
    await queryInterface.dropTable({ tableName: 'item_price', schema: 'myan_market' });
    await queryInterface.dropTable({ tableName: 'item', schema: 'myan_market' });
    await queryInterface.dropTable({ tableName: 'location', schema: 'myan_market' });
    await queryInterface.dropTable({ tableName: 'market', schema: 'myan_market' });
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS myan_market.item_unit;
      DROP TYPE IF EXISTS myan_market.status;
      DROP TYPE IF EXISTS myan_market.item_name;
      DROP TYPE IF EXISTS myan_market.state;
      DROP SCHEMA IF EXISTS myan_market;
    `);
  },
};