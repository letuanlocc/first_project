const { Product, Category, ProductDescription } = require('../models');
const cloudinary = require('../config/cloudinary');
const { Op } = require('sequelize');

const parseSpecifications = (input) => {
    if (input == null || input === '') return [];

    const specifications = typeof input === 'string' ? JSON.parse(input) : input;
    if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)) {
        throw new Error('Thông số kỹ thuật phải là một object JSON');
    }

    return Object.entries(specifications).map(([key, value]) => ({
        key: key.trim(),
        value: String(value ?? '')
    })).filter(specification => specification.key);
};

const addProduct = async (req, res) => {
    try {
        const {name, price, category_id, stock} = req.body;
        let specifications;
        try {
            specifications = parseSpecifications(req.body.specifications);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const product = await Product.create({
            name,
            price,
            category_id,
            stock,
            image_url: req.imageUrl,
            public_id: req.publicId
        });
        if (specifications.length > 0) {
            await ProductDescription.bulkCreate(specifications.map(specification => ({
                ...specification,
                product_id: product.id
            })));
        }
        return res.status(201).json({
            message: "Thêm sản phẩm thành công!",
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            error: "Lỗi hệ thống"
        })
    }
}

const addCategory = async (req, res) => {
    const name = req.body.name?.trim();
    if(!name) {
        return res.status(400).json({
            error: "Tên danh mục không dược để trống"
        })
    }

    const find = await Category.findOne({where: {name}});
    if(find){
        return res.status(400).json({
            error: "Tên danh mục đã tồn tại"
        })
    }
    try {
        const category = await Category.create({ name });
        return res.status(201).json({
            message: "Thêm danh mục thành công",
            data: category
        })
    } catch (error) {
         return res.status(500).json({
            error: "Lỗi hệ thống"
        })
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['id', 'ASC']] });
        return res.status(200).json({ categories });
    } catch (error) {
        console.error("Lỗi lấy danh sách danh mục:", error);
        return res.status(500).json({ error: "Lỗi lấy danh sách danh mục" });
    }
};

const detailCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Danh mục không tồn tại" });
        }
        return res.status(200).json({ category });
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        return res.status(500).json({ error: "Lỗi lấy danh mục" });
    }
};

const listProducts = async (req, res) => {
    try {
        const name = req.query.name?.trim();
        const search = req.query.search?.trim();
        const where = {};

        if (name) {
            where.name = name;
        } else if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        const records = await Product.findAll({
            where,
            include: [{
                model: ProductDescription,
                as: 'descriptions',
                attributes: ['key', 'value'],
                required: false
            }],
            order: [['id', 'ASC']]
        });
        const products = records.map(record => {
            const product = record.toJSON();
            product.specifications = Object.fromEntries(
                (product.descriptions || []).map(specification => [specification.key, specification.value])
            );
            delete product.descriptions;
            return product;
        });
        return res.status(200).json({ products });
    } catch(error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        return res.status(500).json({ error: "Lỗi lấy danh sách sản phẩm" });
    }
};

const updateProduct = async (req, res) => {
    try{
        const data = await Product.findByPk(req.params.id);
        if(!data){
            return res.status(404).json({
                error: "Không tìm thấy sản phẩm"
            })
        }
        const productData = req.body;
        let specifications;
        try {
            specifications = parseSpecifications(productData.specifications);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        const transaction = await Product.sequelize.transaction();
        try {
            await data.update({
                name: productData.name,
                price: productData.price,
                category_id: productData.category_id,
                stock: productData.stock
            }, { transaction });
            await ProductDescription.destroy({
                where: { product_id: data.id },
                transaction
            });
            if (specifications.length > 0) {
                await ProductDescription.bulkCreate(specifications.map(specification => ({
                    ...specification,
                    product_id: data.id
                })), { transaction });
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            product: data
        });
    }catch(err){
        console.error("Lỗi cập nhật sản phẩm:", err);

        return res.status(500).json({
            error: "Lỗi cập nhật sản phẩm"
        });
    }
};

const deleteProduct = async(req,res) => {
    const productId = req.params.id
    try{
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }
        if (product.public_id) {
            const cloudinaryResult = await cloudinary.uploader.destroy(product.public_id);
            if (!['ok', 'not found'].includes(cloudinaryResult.result)) {
                throw new Error(`Không thể xóa ảnh Cloudinary: ${cloudinaryResult.result}`);
            }
        }
        await product.destroy();
        return res.status(200).json({
            message: "Xóa thành công"
        })
    }catch(error){
        return res.status(500).json({
            error: "Lỗi hệ thống khi xóa sản phẩm"
        })
    }
}

const deleteCategory = async(req,res) => {
    try{
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                error: "Danh mục không tồn tại"
            });
        }
        await category.destroy();
        return res.status(200).json({
            message: "Xóa thành công"
        })
    }catch(error){
        return res.status(500).json({
            error: "Lỗi hệ thống khi xóa danh mục"
        })
    }
};

const detailProduct = async(req,res) => {
    try{
        const productId = req.params.id
        const Categories = await Category.findAll();
        const product = await Product.findByPk(productId)

        if(!product){
            return res.status(404).json({
                error: "Not found"
            })
        }

        const productDescriptions = await ProductDescription.findAll({
            where: { product_id: product.id },
            attributes: ['key', 'value']
        });
        res.render('product-detail', { product, Categories, user: req.user, productDescriptions });
    }catch(error){
         return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }
}

const detailProductById = async(req,res) =>{
    const productId = req.params.id
    try{
        const data = await Product.findByPk(productId)
        if(!data){
            return res.status(404).json({
                error: "Không có dữ liệu nào được tìm thấy"
            })
        }

      const specifications = await ProductDescription.findAll({
          where: { product_id: data.id },
          attributes: ['key', 'value']
       });
      res.json({
          ...data.toJSON(),
          specifications: Object.fromEntries(specifications.map(specification => [specification.key, specification.value]))
      });
    }catch(error){
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }



}
module.exports = { addProduct, addCategory, listCategories, detailCategoryById, listProducts, updateProduct, deleteProduct, deleteCategory, detailProduct, detailProductById};