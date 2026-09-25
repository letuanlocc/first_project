const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  shipping_address: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;