const express = require("express");
const { check } = require("express-validator");
const imagesControllers = require("../controllers/images-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/:pid", imagesControllers.getImageById);

router.get("/user/:uid/:category", imagesControllers.getImagesByUserId);

router.get("/welcome/:welcomeURL/:category", imagesControllers.getWelcomeImagesByWelcomeURL);

router.use(checkAuth);

router.post(
    "/",
    [
        check("title")
            .not()
            .isEmpty(),
        check("description").isLength({ min: 5 }),
        check("address")
            .not()
            .isEmpty()
    ],
    imagesControllers.createImage
);

router.patch(
    "/:pid",
    [
        check("title")
            .not()
            .isEmpty(),
        check("description").isLength({ min: 5 })
    ],
    imagesControllers.updateImage
);

router.delete("/:pid", imagesControllers.deleteImage);

module.exports = router;
