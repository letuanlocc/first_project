import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Category, Product, ProductDescription } from '../../models/index.js';
import { parseSearchQuery, buildTokenCondition } from '../../services/productSearch.js';
import { queryPage, queryString } from '../../utils/http.js';

// GET /          (có ?search= thì chuyển sang tìm kiếm)
const getHomeOrSearch = (req: Request, res: Response) => {
    if (req.data?.role === "admin" || !queryString(req.query.search)?.trim()) {
        return getHome(req, res);
    }
    return searchProduct(req, res);
};

const PAGE_SIZE = 12;   // số sản phẩm mỗi trang

const getHome = async (req: Request, res: Response) => {
    try {
        if (req.data?.role === "admin") {
            return res.redirect("/admin");
        }

        // /?page=3 -> page = 3. Thiếu, sai (abc) hoặc < 1 thì quay về trang 1.
        const page = queryPage(req.query.page);

        const [Categories, { count, rows: products }] = await Promise.all([
            Category.findAll(),
            Product.findAndCountAll({
                include: [{
                    model: ProductDescription,
                    as: 'descriptions',
                    attributes: ['key', 'value'],
                    required: false
                }],
                distinct: true,                  // đếm số sản phẩm, không đếm số dòng sau JOIN
                order: [['id', 'ASC']],          // bắt buộc có thứ tự cố định thì chia trang mới ổn định
                limit: PAGE_SIZE,                // lấy tối đa ngần này sản phẩm
                offset: (page - 1) * PAGE_SIZE   // bỏ qua các sản phẩm của những trang trước
            })
        ]);

        const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);

        // Gõ page quá lớn (vd ?page=999) thì đưa về trang cuối
        if (page > totalPages) {
            return res.redirect(`/?page=${totalPages}`);
        }

        res.render("user", {
            Categories,
            products: products,
            user: req.data,
            search: '',
            pagination: { page, totalPages, total: count }
        });
    } catch (err) {
        console.error("Lỗi tại getHome:", err);
        res.status(500).send("Internal Server Error");
    }
};

const searchProduct = async (req: Request, res: Response) => {
    const search = String(req.query.search || '').trim();
    if (!search) {
        return getHome(req, res);
    }

    try {
        const Categories = await Category.findAll();
        const tokens = parseSearchQuery(search);

        let products: Product[] = [];
        if (tokens.length > 0) {
            const tokenConditions = tokens.map(buildTokenCondition);
            const matchedProducts = await Product.findAll({
                where: { [Op.and]: tokenConditions },
                include: [
                    { model: Category, attributes: ['id', 'name'], required: false },
                    {
                        model: ProductDescription,
                        as: 'descriptions',
                        attributes: ['key', 'value'],
                        required: false
                    }
                ],
                attributes: ['id', 'name', 'slug', 'price', 'stock', 'image_url', 'category_id'],
                order: [['id', 'ASC']]
            });
            products = matchedProducts;
        }

        res.render("user", {
            Categories,
            products: products,
            user: req.data,
            search
        });
    } catch (error) {
        console.error("Lỗi tìm kiếm sản phẩm:", error);
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm"
        });
    }
};

// GET /categories/:id
const getCategoryPage = async (req: Request, res: Response) => {
    try {
        const categoryId = String(req.params.id);
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
            user: req.data
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

// GET /products/:slug
const getProductPage = async (req: Request, res: Response) => {
    try {
        const productSlug = String(req.params.slug);
        const Categories = await Category.findAll();
        const product = await Product.findOne({ where: { slug: productSlug } });
        if (!product) {
            return res.status(404).json({
                error: "Not found"
            });
        }
        const productDescriptions = await ProductDescription.findAll({
            where: { product_id: product.id },
            attributes: ['key', 'value']
        });

        res.render('product-detail', { product, Categories, user: req.data, productDescriptions });
    } catch (error) {
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        });
    }
};

export {
    getHomeOrSearch,
    getHome,
    searchProduct,
    getCategoryPage,
    getProductPage
};
