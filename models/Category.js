const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: false
});

module.exports = Category;