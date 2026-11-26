import fs from 'node:fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { errorMessage } from '../utils/http.js';

const URL = "https://cellphones.com.vn/mobile.html";

async function scraper() {
    try {
        const response = await axios.get<string>(URL);

        const html = response.data;

        const $ = cheerio.load(html);

        const category: { name: string }[] = [];

        $('.list-brand a').each((index, element) => {
            const name_category = $(element)
                .find('img').attr('alt') ?? '';

            const textLower = name_category.toLowerCase();
            const name = textLower
                .replace("điện thoại", "")
                .replace("máy tính bảng", "")
                .trim();
            category.push({
                name
            });

            console.log(category);

            fs.writeFileSync(
                'categoryALL.json',
                JSON.stringify(category, null, 2)
            );
        });

        console.log("Đã lưu vào categoryALL.json");
    } catch (error) {
        console.error("Scraping error:", errorMessage(error));
    }
}

scraper();
