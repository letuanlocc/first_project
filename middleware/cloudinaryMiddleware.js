const cloudinary = require("../config/cloudinary")

const uploadToCloudinary = async (req, res, next) => {

    try {

        console.log("========== 3. CLOUDINARY ==========");

        console.log("req.file tồn tại:", !!req.file);

        if (!req.file) {
            console.log("Không có file → bỏ qua Cloudinary");
            return next();
        }

        console.log("Đang upload:", req.file.originalname);

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "products"
                },
                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

            stream.end(req.file.buffer);
        });

        console.log("Cloudinary upload thành công");
        console.log("URL:", result.secure_url);

        req.imageUrl = result.secure_url;
        req.publicId = result.public_id;

        console.log("req.imageUrl:", req.imageUrl);

        next();

    } catch (error) {

        console.error("Cloudinary ERROR:", error);

        return res.status(500).json({
            error: "Upload ảnh thất bại"
        });
    }
};
module.exports = uploadToCloudinary