
const { Category, Product, ProductDescription } = require('../models/index');
const { Op } = require("sequelize");
const loadSearchOptions = async () => {
    const specifications = await ProductDescription.findAll({
        attributes: ['key', 'value'],
        where: { [Op.and]: [
            { value: { [Op.not]: null } },
            { [Op.or]: [
                { key: { [Op.in]: ['Dung lượng RAM', 'Bộ nhớ trong', 'Kích thước màn hình', 'Công nghệ màn hình'] } },
                { key: { [Op.iLike]: '%Hz%' } },
                { value: { [Op.iLike]: '%Hz%' } }
            ] }
        ] }
    });

    const valuesFor = key => [...new Set(specifications
        .filter(specification => specification.key === key)
        .map(specification => String(specification.value).trim())
        .filter(Boolean))];
    const optionsFrom = (key, allowedValues) => {
        const available = new Set(valuesFor(key));
        return allowedValues.filter(value => available.has(value)).map(value => ({ label: value, value }));
    };
    const displayValues = valuesFor('Công nghệ màn hình').map(value => value.toLocaleLowerCase('vi'));
    const displayOptions = ['AMOLED', 'OLED', 'LCD']
        .filter(value => displayValues.some(display => display.includes(value.toLocaleLowerCase('vi'))))
        .map(value => ({ label: value, value }));
    const refreshRates = new Set();

    for (const specification of specifications) {
        const text = `${specification.key} ${specification.value}`;
        for (const match of text.matchAll(/(\d+(?:[.,]\d+)?)\s*Hz/gi)) {
            const rate = Number(match[1].replace(',', '.'));
            if (rate >= 50 && rate <= 300) refreshRates.add(rate);
        }
    }

    return [
        { label: 'RAM', options: optionsFrom('Dung lượng RAM', ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB']) },
        { label: 'Bộ nhớ', options: optionsFrom('Bộ nhớ trong', ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB']) },
        {
            label: 'Màn hình',
            options: valuesFor('Kích thước màn hình').length > 0
                ? [
                    { label: 'Trên 6 inch', value: 'Trên 6 inch' },
                    { label: 'Dưới 6 inch', value: 'Dưới 6 inch' }
                ]
                : []
        },
        { label: 'Loại màn hình', options: displayOptions },
        {
            label: 'Tần số quét',
            options: [60, 120, 144].filter(rate => refreshRates.has(rate)).map(rate => ({
                label: `${rate} Hz`,
                value: `${rate} Hz`
            }))
        }
    ].filter(group => group.options.length > 0);
};

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
            const [products, searchOptions] = await Promise.all([
                Product.findAll({
                    include: [{
                        model: ProductDescription,
                        as: 'descriptions',
                        attributes: ['key', 'value'],
                        required: false
                    }]
                }),
                loadSearchOptions()
            ]);

            res.render("user",{
                Categories,
                products,
                user: req.data,
                search: '',
                suggestion: '',
                searchOptions
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

const searchProduct = async(req,res) => {
    const search = String(req.query.search || '').trim();
    const suggestion = String(req.query.suggestion || '').trim();
    if (!search && !suggestion) {
        return getHome(req, res);
    }

    try{
        const keyword = [search, suggestion]
            .filter(Boolean)
            .join(' ');
        const Categories = await Category.findAll();
        const pattern = `%${keyword}%`;
        const productInclude = [{
            model: ProductDescription,
            as: 'descriptions',
            attributes: ['key', 'value'],
            required: false
        }];
        const screenRange = keyword === 'Trên 6 inch' || keyword === 'Dưới 6 inch';
        let products;

        if (screenRange) {
            const allProducts = await Product.findAll({ include: productInclude });
            const isAboveSixInches = keyword === 'Trên 6 inch';
            products = allProducts.filter(product => {
                const screenSpec = (product.descriptions || []).find(specification =>
                    specification.key === 'Kích thước màn hình'
                );
                const sizeMatch = String(screenSpec?.value || '').match(/\d+(?:[.,]\d+)?/);
                if (!sizeMatch) return false;
                const size = Number(sizeMatch[0].replace(',', '.'));
                return isAboveSixInches ? size > 6 : size < 6;
            });
        } else {
            const refreshRate = keyword.match(/^(\d+(?:[.,]\d+)?)\s*Hz$/i);
            const patterns = refreshRate
                ? [`%${refreshRate[1]} Hz%`, `%${refreshRate[1]}Hz%`]
                : [pattern];
            const searchConditions = patterns.flatMap(searchPattern => [
                { name: { [Op.iLike]: searchPattern } },
                { '$descriptions.key$': { [Op.iLike]: searchPattern } },
                { '$descriptions.value$': { [Op.iLike]: searchPattern } },
                { '$Category.name$': { [Op.iLike]: searchPattern } }
            ]);

            products = await Product.findAll({
                where: { [Op.or]: searchConditions },
                include: [
                    ...productInclude,
                    { model: Category, attributes: [], required: false }
                ],
                distinct: true
            });
        }
        const searchOptions = await loadSearchOptions();

        res.render("user",{
            Categories,
            products,
            user: req.data,
            search,
            suggestion,
            searchOptions
        });
    }catch(error){
        console.error("Lỗi tìm kiếm sản phẩm:", error);
        return res.status(500).json({
            error: "Lỗi hệ thống khi tìm kiếm"
        });
    }
}
module.exports = {
    categoryDetailAndRender,
    getHome,
    detailProduct,
    searchProduct
};