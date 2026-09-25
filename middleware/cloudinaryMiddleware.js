const cloudinary = require("../config/cloudinary")

const uploadToCloudinary = async(req,res,next) => {
    try{
        if(!req.file){
            return next()
        }
        const result = await new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "phone_shop"
                },
                (error,result) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(result)
                    }
                }
        );
            stream.end(req.file.buffer)
        });
        req.imageUrl = result.secure_url;

        next()
    }catch(error){
        return res.status(500).json({
            error: "Upload ảnh thất bại"
        });
    }
}

module.exports = uploadToCloudinary