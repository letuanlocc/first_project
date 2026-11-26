import sequelize from '../config/database.js';
import Category from './Category.js';
import Product from './Product.js';
import User from './User.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import ProductDescription from './ProductDescription.js';
import Address from './Address.js';

// 1. Category 1 - N Product
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// 2. User 1 - N Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// 2b. User 1 - N Address
User.hasMany(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// 3. Order 1 - N OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// 4. Product 1 - N OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// 5. Product 1 - N ProductDescription
Product.hasMany(ProductDescription, { foreignKey: 'product_id', as: 'descriptions', onDelete: 'CASCADE' });
ProductDescription.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export {
    sequelize,
    Category,
    Product,
    User,
    Order,
    OrderItem,
    ProductDescription,
    Address
};
