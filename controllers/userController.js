
const { Category, Product, ProductDescription, OrderItem, Order, User} = require('../models/index');
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize');
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
    try {
        if (req.data?.role === "admin") {
            return res.redirect("/admin");
        }
        const [Categories, products] = await Promise.all([
            Category.findAll(),
            Product.findAll({
                include: [{
                    model: ProductDescription,
                    as: 'descriptions',
                    attributes: ['key', 'value'],
                    required: false
                }]
            })
        ]);

        res.render("user", {
            Categories,
            products: products,
            user: req.data,
            search: ''
        });
    } catch (err) {
        console.error("Lỗi tại getHome:", err);
        res.status(500).send("Internal Server Error");
    }
};

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
        const productDescriptions = await ProductDescription.findAll({
            where: { product_id: product.id },
            attributes: ['key', 'value']
        });

        res.render('product-detail', { product, Categories, user: req.data, productDescriptions });
    }catch(error){
         return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm danh mục"
        })
    }
}

const parseSearchQuery = (query) => {
    let text = query.trim();
    const tokens = [];

    // 1. Nhận diện các cụm khoảng giá trị (range): e.g. "dưới 8 gb", "trên 16 gb", "dưới 6 inch", "trên 6.7 inch"
    const rangeRegex = /\b(dưới|duoi|trên|tren|<|>)\s*(\d+(?:[.,]\d+)?)\s*(gb|tb|mb|hz|inch|inches|in)\b/gi;
    text = text.replace(rangeRegex, (fullMatch, prefix, num, unit) => {
        const isUnder = /dưới|duoi|</i.test(prefix);
        tokens.push({   
            type: 'range',
            raw: fullMatch,
            op: isUnder ? '<' : '>',
            num: parseFloat(num.replace(',', '.')),
            unit: unit.toLowerCase()
        });
        return ' ';
    });

    // 2. Nhận diện cụm từ trong ngoặc kép: e.g. "màn hình gập"
    const quoteRegex = /"([^"]+)"|'([^']+)'/g;
    text = text.replace(quoteRegex, (fullMatch, q1, q2) => {
        const phrase = (q1 || q2).trim();
        if (phrase) tokens.push({ type: 'phrase', raw: phrase });
        return ' ';
    });

    // 3. Nhận diện cụm thông số số + đơn vị: e.g. "12 gb", "12gb", "256gb", "120hz", "6.7 inch", "5000mah"
    const specRegex = /\b(\d+(?:[.,]\d+)?)\s*(gb|tb|mb|hz|khz|mah|mp|inch|inches|in)\b/gi;
    text = text.replace(specRegex, (fullMatch, num, unit) => {
        tokens.push({
            type: 'spec',
            raw: fullMatch,
            num: num.replace(',', '.'),
            unit: unit.toLowerCase()
        });
        return ' ';
    });

    // 4. Các từ đơn lẻ còn lại: e.g. "samsung", "iphone"
    const words = text.split(/\s+/).filter(Boolean);
    for (const w of words) {
        tokens.push({ type: 'word', raw: w });
    }

    return tokens;
};

const buildTokenCondition = (t) => {
    if (t.type === 'range') {
        if (t.unit.startsWith('in')) {
            const re = '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*inch';
            return Product.sequelize.literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND pd.key = 'Kích thước màn hình'
                  AND pd.value ~ ${Product.sequelize.escape(re)}
                  AND (substring(pd.value FROM ${Product.sequelize.escape(re)}))::numeric ${t.op} ${t.num}
            )`);
        } else {
            const re = `(?i)^([0-9]+(?:\\.[0-9]+)?)\\s*${t.unit}`;
            return Product.sequelize.literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND pd.key IN ('Dung lượng RAM', 'Bộ nhớ trong')
                  AND pd.value ~ ${Product.sequelize.escape(re)}
                  AND (substring(pd.value FROM ${Product.sequelize.escape(re)}))::numeric ${t.op} ${t.num}
            )`);
        }
    }

    if (t.type === 'spec') {
        // Cụm thông số: đúng dòng mô tả (hoặc tên sản phẩm) phải chứa cả số và đơn vị đi liền nhau
        const regexPattern = `\\m${t.num}\\s*${t.unit}`;
        return {
            [Op.or]: [
                Product.sequelize.literal(`"Product"."name" ~* ${Product.sequelize.escape(regexPattern)}`),
                Product.sequelize.literal(`EXISTS (
                    SELECT 1 FROM product_descriptions pd
                    WHERE pd.product_id = "Product"."id"
                      AND (pd.value ~* ${Product.sequelize.escape(regexPattern)} OR (pd.key || ' ' || pd.value) ~* ${Product.sequelize.escape(regexPattern)})
                )`)
            ]
        };
    }

    // phrase hoặc word thông thường: tìm kiếm qua tên sản phẩm, danh mục, hoặc mô tả
    const pattern = `%${t.raw}%`;
    return {
        [Op.or]: [
            { name: { [Op.iLike]: pattern } },
            { '$Category.name$': { [Op.iLike]: pattern } },
            Product.sequelize.literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND (pd.value ILIKE ${Product.sequelize.escape(pattern)} OR pd.key ILIKE ${Product.sequelize.escape(pattern)})
            )`)
        ]
    };
};


const searchProduct = async(req,res) => {
    const search = String(req.query.search || '').trim();
    if (!search) {
        return getHome(req, res);
    }

    try{
        const Categories = await Category.findAll();
        const tokens = parseSearchQuery(search);

        let products = [];
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
    }catch(error){
        console.error("Lỗi tìm kiếm sản phẩm:", error);
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm"
        });
    }
};

const getCart = async(req,res) => {
    try {
        const Categories = await Category.findAll();
        const userId = req.data?.userId
        const order  = await Order.findOne({
            where: {user_id: userId, status: 'pending'},
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        })
        return res.render('cart', {
            cartItems: order ? order.OrderItems : [],
            Categories,
            user: req.data
        });
    } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
        return res.status(500).send("Lỗi hệ thống khi tải giỏ hàng");
    }
};

const addCart = async(req,res) => {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);
    const userId = Number(req.data?.userId);

    // if(!userId){
    //    return res.redirect("/login");
    // }

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Mã sản phẩm không hợp lệ" });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Số lượng phải là số nguyên dương" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: "Vui lòng đăng nhập lại" });
    }

    try {
        const result = await Product.sequelize.transaction(async transaction => {

            const order = await Order.findOne({
                where: {
                    user_id: userId, 
                    status: "pending"
                },
                transaction
            })

            const product = await Product.findByPk(productId, {transaction})

            if (!product) {
                return {status: 404, error: "Không tìm thấy sản phẩm"};
            }
            
            const checkOrderItem = order ? await OrderItem.findOne({
                    where: {
                        order_id: order.id,
                        product_id: productId
                    },
                    transaction
                }): null;
            
            const newQuantity = Number(checkOrderItem?.quantity || 0) + quantity;

            if (newQuantity > product.stock) {
                return {status: 400, error: "Số lượng sản phẩm đã chọn lớn hơn số lượng tồn kho"};
            }

            const activeOrder = order || await Order.create({
                user_id: userId,
                total_amount: 0,
                status: "pending"
            }, { transaction });

            if (checkOrderItem) {
                await checkOrderItem.update({
                    quantity: newQuantity
                }, { transaction });
            }else {
                await OrderItem.create({
                    order_id: activeOrder.id,
                    product_id: productId,
                    quantity: quantity,
                    price_at_that_time: product.price
                }, { transaction });
            }
            
            const getOrderItem = await OrderItem.findAll({
                where: {order_id: activeOrder.id},
                transaction
            })

            let totalAmount = 0;

            for (const item of getOrderItem) {
                totalAmount += item.quantity * item.price_at_that_time;
            }

            await activeOrder.update({
                total_amount: totalAmount
            },{ transaction })

            return {
                status: order ? 200 : 201,
                message: "Đã thêm sản phẩm vào giỏ hàng",
                orderId: activeOrder.id,
                quantity: newQuantity
            };
        });
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi thêm vào giỏ hàng" });
    }
};

const removeCartItem = async(req, res) => {
    const productId = Number(req.params.id)
    const userId = Number(req.data?.userId)

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Mã sản phẩm không hợp lệ" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: "Vui lòng đăng nhập lại" });
    }

    try{
        const result = await Product.sequelize.transaction(async (transaction) => {
            const order = await Order.findOne({
                where: {
                    user_id: userId,
                    status: "pending"
                },
                 transaction
            })
             if (!order) {
                return { status: 404, error: "Không tìm thấy giỏ hàng" };
            }
            const orderItem = await OrderItem.findOne({
                where:{
                    order_id: order.id,
                    product_id: productId
                },
                transaction
            })
            if (!orderItem) {
                return { status: 404, error: "Sản phẩm không có trong giỏ hàng" };
            }

            if(orderItem.quantity > 1){
               await orderItem.update({quantity: orderItem.quantity - 1},{transaction})
            }else{
                await orderItem.destroy({transaction})
            }

            const remainingItems = await OrderItem.findAll({
                where: {order_id: order.id},
                transaction
            })

            if(remainingItems.length === 0){
                await order.destroy({transaction})
                return { status: 200, message: "Đã xóa giỏ hàng", orderDeleted: true };
            }

            let totalAmount = 0
            for(const i of remainingItems){
                totalAmount += i.quantity * i.price_at_that_time
            }

            await order.update({total_amount: totalAmount}, {transaction})

            return { status: 200, message: "Đã xóa sản phẩm khỏi giỏ hàng", totalAmount };
            })
            if (result.error) {
                return res.status(result.status).json({ error: result.error });
            }
             return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi xóa sản phẩm" });
    }
};

module.exports = {
    categoryDetailAndRender,
    getHome,
    detailProduct,
    searchProduct,
    getCart,
    addCart,
    removeCartItem
};