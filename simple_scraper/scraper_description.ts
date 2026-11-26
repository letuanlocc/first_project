import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { errorMessage } from '../utils/http.js';

type ProductDescription = {
    name: string;
    description: Record<string, string>;
};

async function scraper() {
    try {
        const filePath = path.join(import.meta.dirname, '../data/data_href.json');
        const getHref = fs.readFileSync(filePath, 'utf8');
        const hrefs: { href: string; name: string }[] = JSON.parse(getHref);
        console.log("Số sản phẩm:", hrefs.length);
        const allProducts: ProductDescription[] = [];
        for (const item of hrefs) {
            //loop 1
            const href = item.href;
            const name = item.name;
            const url = href.replace("href: ", "").trim();
            try {
                const response = await axios.get<string>(url);

                const $ = cheerio.load(response.data);

                const product: ProductDescription = {
                    name: name,
                    description: {}
                };
                ///loop 2
                $(".technical-content tbody tr").each((index, element) => {
                    const cells = $(element).find("td");
                    const attribute = cells.eq(0).text().trim();
                    const value = cells.eq(1).find("p").text().trim() || cells.eq(1).text().trim();

                    if (attribute && value) {
                        product.description[attribute] = value;
                    }
                });

                allProducts.push(product);

                fs.writeFileSync(
                    path.join(import.meta.dirname, '../data/data_description.json'),
                    JSON.stringify(allProducts, null, 2)
                );

                console.log("Đã lưu vào data_description.json");
            } catch (error) {
                console.error(`Lỗi khi truy cập URL ${url}:`, errorMessage(error));
            }

        }
    } catch (error) {
        console.error("Scraping error:", errorMessage(error));
    }
}

scraper();
