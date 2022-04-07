const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");



const s3 = new aws.S3();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
};

const fileUpload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: "sk99foto",
        contentType: function(req, file, cb) {
            cb(null, file.mimetype);
        },
        key: function(req, file, cb) {
            const { folder } = req.body;
            const originalname = file.originalname;
            fileName = `${folder}/${originalname}`;
            cb(null, fileName);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type!");
        cb(error, isValid);
    }
});

module.exports = fileUpload;
