import {
    DataTypes, Model,
    type CreationOptional, type InferAttributes, type InferCreationAttributes, type NonAttribute
} from 'sequelize';
import sequelize from '../config/database.js';
import type Product from './Product.js';

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare Products?: NonAttribute<Product[]>;
}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false
});

export default Category;
