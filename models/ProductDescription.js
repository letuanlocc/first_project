const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductDescription = sequelize.define('ProductDescription', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  key: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'product_descriptions',
  timestamps: false
});

module.exports = ProductDescription;