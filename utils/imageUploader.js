const cloudinary = require('cloudinary').v2;

exports.imploadImageToCloudinary = async (file,folder,height,quality) =>{
        const option = {folder};
        if(height){
            option.height;
        }
        if(quality){
            option.quality;
        }
        option.resource_type = "auto";
        return await cloudinary.uploader.upload(file.tempFilePath,option);
}