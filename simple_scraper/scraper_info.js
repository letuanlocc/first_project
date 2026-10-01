const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
async function scraper() {
    try {
        const filePath = path.join(__dirname, '../data/categoryALL.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const categories = JSON.parse(rawData);

        const allProducts = [];

        for (const item of categories) {

            const nameUrl = item.name || item.name_category;
            const name_category = nameUrl;
            if (!nameUrl) continue;

            const URL = `https://cellphones.com.vn/mobile/${nameUrl}.html`;

            try {
                const response = await axios.get(URL);
                const $ = cheerio.load(response.data);

                $(".product-info").each((index, element) => {
                    const name = $(element).find("a .product__name").text().trim();
                    const price = $(element).find("a .box-info__box-price .product__price--show").text().trim();
                    const image_url = $(element).find('a img').attr('src');

                        allProducts.push({
                            name,
                            price,
                            image_url,
                            name_category
                        });
                });

            } catch (pageError) {
                console.warn(`Bỏ qua trang ${URL} do lỗi:`, pageError.message);
            }
        }
        
        fs.writeFileSync(
            path.join(__dirname, '../data/data.json'),
            JSON.stringify(allProducts, null, 2)
        );

        console.log(`Hoàn tất! Đã lưu tổng cộng ${allProducts.length} sản phẩm vào file data.json`);

    } catch (error) {
        console.error("Scraping error:", error.message);
    }
}

scraper();