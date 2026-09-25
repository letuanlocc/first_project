const sequelize  = require('./database')

const connectDB = async() =>{
    try{
        await sequelize.authenticate()
        console.log('Kết nối PostgreSQL qua Sequelize thành công!');
        await sequelize.sync({ alter: true });
    }catch(error){
        console.error('Không thể kết nối cơ sở dữ liệu:', error);
        process.exit(1);
    }
}

module.exports = connectDB