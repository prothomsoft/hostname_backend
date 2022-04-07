const mongoose = require("mongoose");
const HttpErrors = require("../middleware/http-errors");
const Image = require("../models/image");
const User = require("../models/user");
const probe = require('probe-image-size');

const upload = async (req, res, next) => {
    const reqFiles = [];
    const { userId, category } = req.body;
    for (var i = 0; i < req.files.length; i++) {
        let result = await probe(req.files[i].location);
       
        var data = { "imgSrc": result.url, "width": result.width, "height": result.height };
        reqFiles.push(data);

        const createdImage = new Image({
            src: data.imgSrc,
            width: data.width,
            height: data.height,
            category,
            userId
        });

        let user;
        try {
            user = await User.findById(userId);
        } catch (err) {
            const error = new HttpErrors("Creating image failed, please try again.", 500);
            return next(error);
        }

        if (!user) {
            const error = new HttpErrors("Could not find user for provided id.", 404);
            return next(error);
        }

        if (category === "sesja_narzeczenska") {
            user.isSesjaNarzeczenska = true;
        }
        if (category === "slub") {
            user.isSlub = true;
        }
        if (category === "sesja_slubna") {
            user.isSesjaSlubna = true;
        }
        if (category === "sesja_okolicznosciowa") {
            user.isSesjaOkolicznosciowa = true;
        }
        if (category === "welcome") {
            user.isWelcome = true;
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdImage.save({ session: sess });
            user.images.push(createdImage);
            await user.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            const error = new HttpErrors("Creating image failed, please try again." + err, 500);
            return next(error);
        }
    }
    res.status(200).json({ response: reqFiles });
};

exports.upload = upload;
