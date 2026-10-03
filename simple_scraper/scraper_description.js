const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
async function scraper() {
    try{
        const filePath = path.join(__dirname, '../data/data_href.json');
        const getHref = fs.readFileSync(filePath, 'utf8');
        const hrefs = JSON.parse(getHref);
        console.log("Số sản phẩm:", hrefs.length);
        const allProducts = [];
        for (const item of hrefs) {
            //loop 1
            const href = item.href;
            const name = item.name;
            const url = href.replace("href: ", "").trim();
            try{
                const response = await axios.get(url);

                const $ = cheerio.load(response.data);

                const product = {
                    name: name,
                    description: {}
                };
                ///loop 2
                $(".technical-content tbody tr").each((index, element) => {
                   const cells = $(element).find("td");
                   const attribute = $(cells[0]).text().trim();
                   const value = $(cells[1]).find("p").text().trim() || $(cells[1]).text().trim();

                if (attribute && value) {
                    product.description[attribute] = value;
                }
                });

                allProducts.push(product);

                fs.writeFileSync(
                    path.join(__dirname, '../data/data_description.json'),
                    JSON.stringify(allProducts, null, 2)
                );

                console.log("Đã lưu vào data_description.json");
            }catch(error){
                console.error(`Lỗi khi truy cập URL ${url}:`, error.message);
            }

        }
    }catch(error){
        console.error("Scraping error:", error.message);
    }
}

scraper();
