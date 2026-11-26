import {
    DataTypes, Model,
    type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes, type NonAttribute
} from 'sequelize';
import sequelize from '../config/database.js';
import type Category from './Category.js';
import type ProductDescription from './ProductDescription.js';

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare slug: CreationOptional<string | null>;
    // DECIMAL: Postgres trả về dạng chuỗi, khi ghi có thể truyền số.
    declare price: number | string;
    declare stock: number;
    declare image_url: CreationOptional<string | null>;
    declare public_id: CreationOptional<string | null>;
    declare category_id: ForeignKey<Category['id']> | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare Category?: NonAttribute<Category | null>;
    declare descriptions?: NonAttribute<ProductDescription[]>;
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
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
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
});

export default Product;
