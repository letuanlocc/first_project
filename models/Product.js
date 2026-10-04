const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: true,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255)
  },
  public_id: {
  type: DataTypes.STRING(255),
  allowNull: true
},
  category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;