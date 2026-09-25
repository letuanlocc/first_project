const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {                             
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true                       
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'customer'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;