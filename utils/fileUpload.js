const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // validation
        // req.user
        cb(null, path.join("./public/images"));
    },
    filename: function (req, file, cb) {
        let prefix =
            Date.now() + "-" + Math.floor(Math.random() * 10000000) + "-";
        let originalname = file.originalname.split(" ").join("-");
        cb(null, prefix + originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
