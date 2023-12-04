const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const removeUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([e, f]) => f));
};

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + new Date().getTime());
    },
});

const upload = multer({ storage }).single('file');

const multiUpload = multer({ storage }).fields([
    {
        name: 'images',
        maxCount: 10
    }
]);

const uploadToCloudinary = async (locaFilePath) => {
    locaFilePath = locaFilePath.replace("\\", "/");
    var mainFolderName = "main";
    var filePathOnCloudinary =
        mainFolderName + "/" + locaFilePath;

    // console.log(filePathOnCloudinary);

    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {

            fs.unlinkSync(locaFilePath);

            return {
                message: "Success",
                url: result.url,
                public_id: result.public_id
            };
        })
        .catch((error) => {
            //   console.log(error);
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
};

module.exports = {
    removeUndefined,
    upload,
    multiUpload,
    uploadToCloudinary
};
