
const { Category, Product } = require('../models/index');

const categoryDetailAndRender = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await Category.findByPk(categoryId, {
            include: Product
        });
        const Categories = await Category.findAll();
        if (!result) {
            return res.status(404).send("Không tìm thấy category");
        }
        res.render("category", {
            Categories,
            result,
            user: req.user
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
}


const getHome = async (req, res) => {
        const Categories = await Category.findAll();
        if (req.data?.role === "admin") {
            return res.redirect("/admin");
        }
        try{
            const products = await Product.findAll();

            res.render("user",{
                Categories,
                products,
                user: req.data
            });
        }catch(err){
            res.status(500).send("Internal Server Error");
        }
}

const detailProduct = async(req,res) => {
    try{
        const productSlug = req.params.slug;
        const Categories = await Category.findAll();
        const product = await Product.findOne({ where: { slug: productSlug } });

        if(!product){
            return res.status(404).json({
                error: "Not found"
            })
        }

        res.render('product-detail', { product, Categories, user: req.user });
    }catch(error){
         return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }
}

module.exports = {
    categoryDetailAndRender,
    getHome,
    detailProduct
};