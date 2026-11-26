import type { Request, Response, NextFunction } from 'express';
import type { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {

    try {

        console.log("========== 3. CLOUDINARY ==========");

        console.log("req.file tồn tại:", !!req.file);

        const file = req.file;
        if (!file) {
            console.log("Không có file → bỏ qua Cloudinary");
            return next();
        }

        console.log("Đang upload:", file.originalname);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "products"
                },
                (error, result) => {

                    if (error || !result) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

            stream.end(file.buffer);
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

export default uploadToCloudinary;
