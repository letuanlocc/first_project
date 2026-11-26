import {
    DataTypes, Model,
    type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes
} from 'sequelize';
import sequelize from '../config/database.js';
import type User from './User.js';

// Sổ địa chỉ giao hàng của khách hàng (1 user có nhiều địa chỉ).
class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare name: string;
    declare phone: string;
    declare city: string | null;
    declare district: string | null;
    declare ward: string | null;
    declare street: string;
    declare is_default: CreationOptional<boolean>;
    // Địa chỉ ghép sẵn để view dùng (address.address), không lưu vào DB.
    declare address: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Address.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100)
    },
    district: {
        type: DataTypes.STRING(100)
    },
    ward: {
        type: DataTypes.STRING(100)
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    address: {
        type: DataTypes.VIRTUAL,
        get(this: Address) {
            return [this.street, this.ward, this.district, this.city]
                .filter(Boolean)
                .join(', ');
        }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true
});

export default Address;
