const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {

    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    price_at_that_time: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }

}, {
    tableName: 'orderitems',
    timestamps: false
});

module.exports = OrderItem