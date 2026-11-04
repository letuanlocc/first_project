const { Op } = require("sequelize");
const { Product } = require('../models/index');

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

module.exports = { parseSearchQuery, buildTokenCondition };
