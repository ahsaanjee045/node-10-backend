const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromLocalSystem = (localFilePath) => {
    fs.unlinkSync(localFilePath)
    return true
}


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        let result = await cloudinary.uploader.upload(localFilePath, {
            folder: "myimages",
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteFromCloudinary = async (public_id, resourcetype = "image") => {
    try {
        if (!public_id) {
            return null;
        }

        let result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resourcetype,
        });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    deleteFromCloudinary,
    uploadOnCloudinary
};
