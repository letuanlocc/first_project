const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Sổ địa chỉ giao hàng của khách hàng (1 user có nhiều địa chỉ).
const Address = sequelize.define('Address', {
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
    // Địa chỉ ghép sẵn để view dùng (address.address), không lưu vào DB.
    address: {
        type: DataTypes.VIRTUAL,
        get() {
            return [this.street, this.ward, this.district, this.city]
                .filter(Boolean)
                .join(', ');
        }
    }
}, {
    tableName: 'addresses',
    timestamps: true
});

module.exports = Address;
