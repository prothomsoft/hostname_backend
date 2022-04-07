const express = require("express");
const uploadsController = require("../controllers/uploads-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/upload", fileUpload.array("images"), uploadsController.upload);

module.exports = router;
