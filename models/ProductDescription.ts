import {
    DataTypes, Model,
    type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes
} from 'sequelize';
import sequelize from '../config/database.js';
import type Product from './Product.js';

class ProductDescription extends Model<InferAttributes<ProductDescription>, InferCreationAttributes<ProductDescription>> {
    declare id: CreationOptional<number>;
    declare product_id: ForeignKey<Product['id']>;
    declare key: string;
    declare value: string | null;
}

ProductDescription.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    key: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'ProductDescription',
    tableName: 'product_descriptions',
    timestamps: false
});

export default ProductDescription;
