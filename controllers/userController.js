
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
        console.log("Kết quả tìm kiếm category:", result);
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

module.exports = {
    categoryDetailAndRender
};