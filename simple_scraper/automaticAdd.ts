import fs from 'node:fs';
import path from 'node:path';
import type { UploadApiResponse } from 'cloudinary';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ProductDescription from '../models/ProductDescription.js';
import cloudinary from '../config/cloudinary.js';
import { errorMessage } from '../utils/http.js';

const dataDir = path.join(import.meta.dirname, '../data');

const readJson = <T>(fileName: string): T =>
    JSON.parse(fs.readFileSync(path.join(dataDir, fileName), 'utf8')) as T;

const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const addCategory = async () => {
    const categories = readJson<{ name: string }[]>('categoryALL.json');
    console.log("Số category:", categories.length);

    categories.forEach(item => {
        const name = item.name;
        Category.create({ name });
    });
    return;
};

const uploadImage = async () => {
    const products = readJson<{ name: string; price: string; image_url: string; name_category: string }[]>('data.json');

    for (const item of products) {
        let resultImage: UploadApiResponse | undefined;
        try {
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
            resultImage = await cloudinary.uploader.upload(
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
        } catch (error) {
            if (resultImage) {
                await cloudinary.uploader.destroy(resultImage.public_id);
                console.log(`Đã xóa ảnh Cloudinary của ${item.name}`);
            }
            console.log(errorMessage(error));
        }
    }
};

const automaticAddDescription = async () => {
    const descriptions = readJson<{ name: string; description?: Record<string, unknown> }[]>('data_description.json');

    try {
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
                const newSpecs: { product_id: number; key: string; value: string }[] = [];

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
    } catch (error) {
        console.log(errorMessage(error));
    }
};

const automaticPublicId = async () => {
    try {
        const data = await Product.findAll();
        const publicIds: { product_id: number; public_id: string }[] = [];

        for (const item of data) {
            if (!item.image_url) continue;

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
            path.join(dataDir, 'publicId.json'),
            JSON.stringify(publicIds, null, 2)
        );
    } catch (error) {
        console.log(errorMessage(error));
    }
};

const updatePublicId = async () => {
    try {
        const publicIds = readJson<{ product_id: number; public_id: string }[]>('publicId.json');

        for (const item of publicIds) {
            const product = await Product.findByPk(item.product_id);
            if (product) {
                await product.update({ public_id: item.public_id });
                console.log("Cập nhật public_id cho sản phẩm:", product.name);
            }
        }
    } catch (error) {
        console.log(errorMessage(error));
    }
};

const addSlug = async () => {
    try {
        const data = await Product.findAll();

        for (const product of data) {
            const slug = `${createSlug(product.name)}-${product.id}`;
            await product.update({ slug });
        }
    } catch (error) {
        console.log(errorMessage(error));
    }
};

// Các hàm còn lại giữ lại để chạy tay khi cần.
void [addCategory, uploadImage, automaticPublicId, updatePublicId, addSlug];

automaticAddDescription();
