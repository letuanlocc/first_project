import {
    DataTypes, Model,
    type CreationOptional, type InferAttributes, type InferCreationAttributes
} from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'customer'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

export default User;
