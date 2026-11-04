const { Category } = require('../../../models/index');

// GET /api/admin/categories
const listCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['id', 'ASC']] });
        return res.status(200).json({ categories });
    } catch (error) {
        console.error("Lỗi lấy danh sách danh mục:", error);
        return res.status(500).json({ error: "Lỗi lấy danh sách danh mục" });
    }
};

// GET /api/admin/categories/:id
const getCategory = async (req, res) => {
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

// POST /api/admin/categories        body: { name }
const createCategory = async (req, res) => {
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

// DELETE /api/admin/categories/:id
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

module.exports = { listCategories, getCategory, createCategory, deleteCategory };
