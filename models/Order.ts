import {
    DataTypes, Model,
    type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes, type NonAttribute
} from 'sequelize';
import sequelize from '../config/database.js';
import type User from './User.js';
import type OrderItem from './OrderItem.js';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    // DECIMAL: Postgres trả về dạng chuỗi, khi ghi có thể truyền số.
    declare total_amount: number | string;
    declare status: CreationOptional<string>;
    declare shipping_address: CreationOptional<string | null>;
    declare phone: CreationOptional<string | null>;
    declare receiver_name: CreationOptional<string | null>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare OrderItems?: NonAttribute<OrderItem[]>;
    declare User?: NonAttribute<User>;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
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
    },
    receiver_name: { type: DataTypes.STRING(100) },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true
});

export default Order;
