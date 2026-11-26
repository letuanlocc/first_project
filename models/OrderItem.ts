import {
    DataTypes, Model,
    type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes, type NonAttribute
} from 'sequelize';
import sequelize from '../config/database.js';
import type Order from './Order.js';
import type Product from './Product.js';

class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
    declare id: CreationOptional<number>;
    declare order_id: ForeignKey<Order['id']>;
    declare product_id: ForeignKey<Product['id']> | null;
    declare quantity: number;
    // DECIMAL: Postgres trả về dạng chuỗi, khi ghi có thể truyền số.
    declare price_at_that_time: number | string;

    declare Product?: NonAttribute<Product | null>;
}

OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
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
    sequelize,
    modelName: 'OrderItem',
    tableName: 'orderitems',
    timestamps: false
});

export default OrderItem;
