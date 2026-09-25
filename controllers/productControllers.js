const Product  = require('../models/Product');
const Category  = require('../models/Category');

const addProduct = async (req, res) => {
    try {
        const {name, price, description, category, stock} = req.body
        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            image: req.imageUrl
        });
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
    const { name} = req.body;
    console.log(name)
    if(!name || name.trim() === "") {
        return res.status(400).json({
            error: "Tên danh mục không dược để trống"
        })
    }

    const find = await Category.findOne({where: {name: name}});
    
    if(find){
        return res.status(400).json({
            error: "Tên danh mục đã tồn tại"
        })
    }
    try {
        const category = await Category.create( req.body );   
        return res.status(201).json({
            message: "Thêm danh mục thành công",
        })
    } catch (error) {
         return res.status(500).json({
            error: "Lỗi hệ thống"
        })
    }
};

const findProductByName = async (req, res) => {
    const { name } = req.query;
    try {
        if (!name || name.trim() === "") {
            return res.status(400).json({
                error: "Tên sản phẩm không được để trống"
            });
        }
        const find = await Product.findOne({where: {name: name} })
        
        if(!find) {
            return res.status(404).json({
                error: "Tên sản phẩm không tồn tại"
            });
        }
        res.json(find);
    }catch(err){
            console.error("Lỗi tìm kiếm sản phẩm:", err);
            res.status(500).json({ error: "Lỗi tìm kiếm sản phẩm" });
        };
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
        
        const isSame =
            data.name === productData.name &&
            data.price == productData.price &&
            data.description === productData.description &&
            data.image === productData.image &&
            data.category.toString() === productData.category &&
            data.stock == productData.stock;
        
        if(isSame){
            return res.status(404).json({
                error: "Không có dòng nào bị thay đổi"
            });
        }

        const updatedProduct = data.update(productData)

        return res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            product: updatedProduct
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
    const { name } = req.query
    try{
        const deletedCategory = await Category.destroy({where: {name: name}})
        
        if (!deletedCategory) {
            return res.status(404).json({
                error: "Danh mục này không tồn tại hoặc đã bị xóa trước đó!"
            });
        }
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

        const product = await Product.findByPk(productId)

        if(!product){
            return res.status(404).json({
                error: "Not found"
            })
        }

        res.render('product-detail', { product });
    }catch(error){
         return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }
}

const viewProduct = async(req,res) => {
    console.log("=== ĐÃ CHẠY VÀO ĐƯỢC CONTROLLER XEM SẢN PHẨM ===");
    try{
        const data = await Product.findAll()
        if(!data){
            return res.status(404).json({
                error: "Không có dữ liệu nào được tìm thấy"
            })
        }

        return res.status(200).json({
            message: "Tìm các sản phẩm thành công",
            products: data
        })
    }catch(error){
        console.error("LỖI CHI TIẾT TẠI VIEW PRODUCT:", error.message); 
        console.error(error);
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

       res.json(data)
    }catch(error){
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }



}
module.exports = { addProduct, addCategory, findProductByName, updateProduct, deleteProduct, deleteCategory, detailProduct, viewProduct, detailProductById};