const express = require("express");
const { check } = require("express-validator");
const imagesControllers = require("../controllers/images-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.use(checkAuth);

module.exports = router;
