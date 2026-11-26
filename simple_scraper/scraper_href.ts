import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { errorMessage } from '../utils/http.js';

async function scraper() {
    try {
        const filePath = path.join(import.meta.dirname, '../data/categoryALL.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const categories: { name?: string; name_category?: string }[] = JSON.parse(rawData);
        console.log("Số category:", categories.length);
        const allProducts: Record<string, string | undefined>[] = [];

        for (const item of categories) {

            const nameUrl = item.name || item.name_category;
            const name_category = nameUrl;
            if (!nameUrl) continue;

            const URL = `https://cellphones.com.vn/mobile/${nameUrl}.html`;

            try {
                const response = await axios.get<string>(URL);
                const $ = cheerio.load(response.data);

                $(".product-info").each((index, element) => {
                    const name = $(element).find("a .product__name").text().trim();
                    const price = $(element).find("a .box-info__box-price .product__price--show").text().trim();
                    const image_url = $(element).find('a img').attr('src');
                    const href = $(element).find('a').attr('href');

                    allProducts.push({
                        name,
                        price,
                        image_url,
                        href,
                        name_category
                    });
                });

            } catch (pageError) {
                console.warn(`Bỏ qua trang ${URL} do lỗi:`, errorMessage(pageError));
            }
        }

        fs.writeFileSync(
            path.join(import.meta.dirname, '../data/data_href.json'),
            JSON.stringify(allProducts, null, 2)
        );

        console.log(`Hoàn tất! Đã lưu tổng cộng ${allProducts.length} sản phẩm vào file data_href.json`);

    } catch (error) {
        console.error("Scraping error:", errorMessage(error));
    }
}

scraper();
