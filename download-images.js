const fs = require('fs');
const path = require('path');
const https = require('https');

// Danh sách 30 link ảnh online khả dụng và tên file lưu tương ứng
const imagesToDownload = [
    { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', filename: 'Meo luoi.jpg' },
    { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500', filename: 'Cho ngao.jpg' },
    { url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500', filename: 'Cậu vàng.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1556012018-50c5c0dae359?w=500', filename: 'Gau bong.jpg' },
    { url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500', filename: 'Tho ngoc.jpg' },
    { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beec7?w=500', filename: 'Ga ngo ngac.jpg' }, // Link này nếu vẫn lỗi, dùng link thay thế bên dưới: https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=500
    { url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=500', filename: 'Chim canh cut.jpg' },
    { url: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=500', filename: 'Ca map con.jpg' },
    { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=500', filename: 'Rua cham chap.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1520315342629-6ea920342047?w=500', filename: 'Cu meo thong thai.jpg' },
    { url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=500', filename: 'Cop con hung ho.jpg' },
    { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=500', filename: 'Su tu ngu.jpg' },
    { url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500', filename: 'Voi con ban don.jpg' },
    { url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=500', filename: 'Huou cao co.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500', filename: 'Gau truc.jpg' },
    { url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500', filename: 'Soc chuot.jpg' },
    { url: 'https://images.unsplash.com/photo-1554692939-2db6e0ee7278?w=500', filename: 'Ech op.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500', filename: 'Cua hoang de.jpg' },
    { url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500', filename: 'Tom hum.jpg' },
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', filename: 'Ca heo xanh.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500', filename: 'Chim bo cau.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1535338495130-34d320290e29?w=500', filename: 'De con.jpg' },
    { url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500', filename: 'Cuu trang.jpg' }, // Link mới thay thế
    { url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500', filename: 'Ngua pony.jpg' },
    { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500', filename: 'Rong con.jpg' },
    { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500', filename: 'Ky lan.jpg' },
    { url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500', filename: 'Ca vang.jpg' },
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', filename: 'Sua bien.jpg' },
    { url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=500', filename: 'Khi con tinh nghich.jpg' },
    { url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500', filename: 'Bo sua.jpg' } // Link mới thay thế
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            // Xử lý chuyển hướng nếu link có redirect (Unsplash hay dùng)
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
            } else {
                reject(`Failed to load ${url}, status: ${res.statusCode}`);
            }
        }).on('error', (err) => {
            reject(err.message);
        });
    });
};

async function run() {
    const dir = path.join(__dirname, 'public', 'image');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const img of imagesToDownload) {
        const filePath = path.join(dir, img.filename);
        try {
            await downloadImage(img.url, filePath);
            console.log(`Đã tải xong: ${img.filename}`);
        } catch (error) {
            console.error(`Lỗi tải ${img.filename}:`, error);
        }
    }
    console.log('Hoàn tất tải toàn bộ 30 ảnh!');
}

run();