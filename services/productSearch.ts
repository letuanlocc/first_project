import { Op, literal, type WhereOptions } from 'sequelize';
import { sequelize, type Product } from '../models/index.js';

export type SearchToken =
    | { type: 'range'; raw: string; op: '<' | '>'; num: number; unit: string }
    | { type: 'spec'; raw: string; num: string; unit: string }
    | { type: 'phrase'; raw: string }
    | { type: 'word'; raw: string };

const escape = (value: string) => sequelize.escape(value);

export const parseSearchQuery = (query: string): SearchToken[] => {
    let text = query.trim();
    const tokens: SearchToken[] = [];

    // 1. Nhận diện các cụm khoảng giá trị (range): e.g. "dưới 8 gb", "trên 16 gb", "dưới 6 inch", "trên 6.7 inch"
    const rangeRegex = /\b(dưới|duoi|trên|tren|<|>)\s*(\d+(?:[.,]\d+)?)\s*(gb|tb|mb|hz|inch|inches|in)\b/gi;
    text = text.replace(rangeRegex, (fullMatch: string, prefix: string, num: string, unit: string) => {
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
    text = text.replace(quoteRegex, (fullMatch: string, q1: string | undefined, q2: string | undefined) => {
        const phrase = (q1 || q2 || '').trim();
        if (phrase) tokens.push({ type: 'phrase', raw: phrase });
        return ' ';
    });

    // 3. Nhận diện cụm thông số số + đơn vị: e.g. "12 gb", "12gb", "256gb", "120hz", "6.7 inch", "5000mah"
    const specRegex = /\b(\d+(?:[.,]\d+)?)\s*(gb|tb|mb|hz|khz|mah|mp|inch|inches|in)\b/gi;
    text = text.replace(specRegex, (fullMatch: string, num: string, unit: string) => {
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

export const buildTokenCondition = (t: SearchToken): WhereOptions<Product> => {
    if (t.type === 'range') {
        if (t.unit.startsWith('in')) {
            const re = '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*inch';
            return literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND pd.key = 'Kích thước màn hình'
                  AND pd.value ~ ${escape(re)}
                  AND (substring(pd.value FROM ${escape(re)}))::numeric ${t.op} ${t.num}
            )`);
        } else {
            const re = `(?i)^([0-9]+(?:\\.[0-9]+)?)\\s*${t.unit}`;
            return literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND pd.key IN ('Dung lượng RAM', 'Bộ nhớ trong')
                  AND pd.value ~ ${escape(re)}
                  AND (substring(pd.value FROM ${escape(re)}))::numeric ${t.op} ${t.num}
            )`);
        }
    }

    if (t.type === 'spec') {
        // Cụm thông số: đúng dòng mô tả (hoặc tên sản phẩm) phải chứa cả số và đơn vị đi liền nhau
        const regexPattern = `\\m${t.num}\\s*${t.unit}`;
        return {
            [Op.or]: [
                literal(`"Product"."name" ~* ${escape(regexPattern)}`),
                literal(`EXISTS (
                    SELECT 1 FROM product_descriptions pd
                    WHERE pd.product_id = "Product"."id"
                      AND (pd.value ~* ${escape(regexPattern)} OR (pd.key || ' ' || pd.value) ~* ${escape(regexPattern)})
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
            literal(`EXISTS (
                SELECT 1 FROM product_descriptions pd
                WHERE pd.product_id = "Product"."id"
                  AND (pd.value ILIKE ${escape(pattern)} OR pd.key ILIKE ${escape(pattern)})
            )`)
        ]
    };
};
