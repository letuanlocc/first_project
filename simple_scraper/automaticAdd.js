const Product  = require('../models/Product');
const Category  = require('../models/Category');
const fs = require('fs');
const path = require('path')
const cloudinary = require("../config/cloudinary")

const addCategory = async () => {
    const filePath = path.join(__dirname, '../data/categoryALL.json');
    const rawDataCategory = fs.readFileSync(filePath, 'utf8')
    const categories = JSON.parse(rawDataCategory);
    console.log("Số category:", categories.length);

    categories.forEach(item => {
        const name = item.name
        const add = Category.create({name})
    })
    return
}

const uploadImage = async () => {
    const filePath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(rawData);

    for (const item of products) {
        try{
            const name_category = item.name_category;

            const category = await Category.findOne({
                where: { name: name_category }
            });

            if (!category) {
                console.log(`Không tìm thấy category: ${name_category}`);
                continue;
            }

            const price = Number(
                    item.price
                        .replace(/\./g, '')
                        .replace('đ', '')
            );
            const resultImage = await cloudinary.uploader.upload(
                item.image_url,
                {
                    folder: "phone_shop/products"
                }
            );

            const product = await Product.create({
                name: item.name,
                price,
                stock: 20,
                image_url: resultImage.secure_url,
                category_id: category.id
            });

            console.log("Thêm sản phẩm thành công:", product.name);
        }catch(error){
            await cloudinary.uploader.destroy(resultImage.public_id);
            console.log(`Đã xóa ảnh Cloudinary của ${item.name}`);
            console.log(error.message);
        }
    }
};

const automaticAddDescription = async () => {
    const filePath = path.join(__dirname, '../data/data_description.json');
    const rawData = fs.readFileSync(filePath, 'utf8');

    const descriptions = JSON.parse(rawData);

    try{
        for (const item of descriptions) {
            const product = await Product.findOne({
                where: { name: item.name }
            });
            if (product) {
                await product.update({ description: item.description });
                console.log("Cập nhật mô tả cho sản phẩm:", product.name);
            } else {
                console.log("Không tìm thấy sản phẩm:", item.name);
            }
        }
    } catch(error){
        console.log(error.message);
    }
}

automaticAddDescription();