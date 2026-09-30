const axios = require("axios")
const fs = require("fs")
const cheerio = require("cheerio")

const URL = "https://cellphones.com.vn/mobile.html"
async function scraper() {
    try{
        const response = await axios.get(URL)

        const html = await response.data

        const $ = cheerio.load(html)

        const category = []

        $('.list-brand a').each((index,element) => {
            const name_category= $(element)
                .find('img').attr('alt')

            let textLower = name_category.toLowerCase();
            let name = textLower
                .replace("điện thoại", "")
                .replace("máy tính bảng", "")
                .trim();
            category.push({
                name
            })

            console.log(category);

            fs.writeFileSync(
                'categoryALL.json',
                JSON.stringify(category, null, 2)
            )
        });

        console.log("Đã lưu vào categoryALL.json");
    }catch(error){
        console.error("Scraping error:", error.message);
    }
}
scraper();