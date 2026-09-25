const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// 1. Category 1 - N Product
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// 2. User 1 - N Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// 3. Order 1 - N OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// 4. Product 1 - N OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  Category,
  Product,
  User,
  Order,
  OrderItem
};