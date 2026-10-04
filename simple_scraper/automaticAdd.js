const Product  = require('../models/Product');
const Category  = require('../models/Category');
const fs = require('fs');
const path = require('path')
const cloudinary = require("../config/cloudinary")
const ProductDescription = require('../models/ProductDescription');
const createSlug = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

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
                public_id: resultImage.public_id,
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
            const products = await Product.findAll({
                where: { name: item.name },
                attributes: ['id', 'name']
            });

            if (products.length === 0) {
                console.log("Không tìm thấy sản phẩm:", item.name);
                continue;
            }

            const specs = Object.entries(item.description || {});
            for (const product of products) {
                const existingSpecs = await ProductDescription.findAll({
                    where: { product_id: product.id }
                });
                const specsByKey = new Map(existingSpecs.map(spec => [spec.key, spec]));
                const newSpecs = [];

                for (const [key, value] of specs) {
                    const existingSpec = specsByKey.get(key);
                    if (existingSpec) {
                        await existingSpec.update({ value: String(value) });
                    } else {
                        newSpecs.push({
                            product_id: product.id,
                            key,
                            value: String(value)
                        });
                    }
                }

                if (newSpecs.length > 0) {
                    await ProductDescription.bulkCreate(newSpecs);
                }
            }
            console.log(`Cập nhật spec cho ${products.length} sản phẩm:`, item.name);
        }
    } catch(error){
        console.log(error.message);
    }
}

const automaticPublicId  = async () => {
    try{
        const data = await Product.findAll();
        const publicIds = [];

        const urlImage = data.map(product => product.image_url)

        for (const item of data) {

            // const product = await Product.findOne({
            //     where: { image_url: urls }
            // });

            const url = new URL(item.image_url);

            const publicId = url.pathname
                .substring(url.pathname.indexOf("phone_shop"))
                .replace(/\.[^/.]+$/, "");

            publicIds.push({
                product_id: item.id,
                public_id: publicId
            });
        }
        fs.writeFileSync(
                path.join(__dirname, '../data/publicId.json'),
                JSON.stringify(publicIds, null, 2)
        );
    }catch(error){
        console.log(error.message);
    }
}

const updatePublicId = async () => {
    try{
        const filePath = path.join(__dirname, '../data/publicId.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const publicIds = JSON.parse(rawData);

        for (const item of publicIds) {
            const product = await Product.findByPk(item.product_id);
            if (product) {
                await product.update({ public_id: item.public_id });
                console.log("Cập nhật public_id cho sản phẩm:", product.name);
            }
        }
    }catch(error){
        console.log(error.message);
    }
}

const addSlug = async () => {
    try{
        const data = await Product.findAll()

        for (const product of data) {
            const slug = `${createSlug(product.name)}-${product.id}`;
            await product.update({ slug });
        }
    } catch(error){
        console.log(error.message);
    }
}

automaticAddDescription();