const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpErrors = require("../middleware/http-errors");
const Image = require("../models/image");
const User = require("../models/user");

const getImagesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    const category = req.params.category;

    // let images;
    let userWithImages;
    try {
        userWithImages = await User.findById(userId).populate({
            path: "images",
            match: { category: { $eq: category } }
        });
    } catch (err) {
        const error = new HttpErrors("Fetching images failed, please try again later." + err, 500);
        return next(error);
    }
    if (!userWithImages || userWithImages.images.length === 0) {
        return next(new HttpErrors("Could not find images for the provided user id.", 404));
    }
    res.json({ images: userWithImages.images.map(image => image.toObject({ getters: true })) });
};

const getWelcomeImagesByWelcomeURL = async (req, res, next) => {
    const welcomeURL = req.params.welcomeURL;
    const category = "welcome";

    // let images;
    let userWithImages;
    try {
        const user = await User.findOne({ welcomeURL: welcomeURL });
        userWithImages = await User.findById(user._id).populate({
            path: "images",
            match: { category: { $eq: category } }
        });
    } catch (err) {
        const error = new HttpErrors("Fetching images failed, please try again later." + err, 500);
        return next(error);
    }
    if (!userWithImages || userWithImages.images.length === 0) {
        return next(new HttpErrors("Could not find images for the provided user id.", 404));
    }
    res.json({ images: userWithImages.images.map(image => image.toObject({ getters: true })) });
};

const getImageById = async (req, res, next) => {
    const imageId = req.params.pid;

    let image;
    try {
        image = await Image.findById(imageId);
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not find a image.", 500);
        return next(error);
    }

    if (!image) {
        const error = new HttpErrors("Could not find image for the provided id.", 404);
        return next(error);
    }

    res.json({ image: image.toObject({ getters: true }) });
};

const createImage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpErrors("Invalid inputs passed, please check your data.", 422));
    }

    const { title, description, address, creator } = req.body;

    const createdImage = new Image({
        title,
        description,
        address,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpErrors("Creating image failed, please try again 1.", 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpErrors("Could not find user for provided id.", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdImage.save({ session: sess });
        user.images.push(createdImage);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpErrors("Creating image failed mongo, please try again.", 500);
        return next(error);
    }

    res.status(200).json({ image: createdImage });
};

const updateImage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpErrors("Invalid inputs passed, please check your data.", 422));
    }

    const { title, description } = req.body;
    const imageId = req.params.pid;

    let image;
    try {
        image = await Image.findById(imageId);
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not update image.", 500);
        return next(error);
    }

    image.title = title;
    image.description = description;

    try {
        await image.save();
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not update image.", 500);
        return next(error);
    }

    res.status(200).json({ image: image.toObject({ getters: true }) });
};

const deleteImage = async (req, res, next) => {
    const imageId = req.params.pid;

    let image;
    try {
        image = await Image.findById(imageId).populate("creator");
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not delete image.", 500);
        return next(error);
    }

    if (!image) {
        const error = new HttpErrors("Could not find image for this id.", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await image.remove({ session: sess });
        image.creator.images.pull(image);
        await image.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not delete image.", 500);
        return next(error);
    }

    res.status(200).json({ message: "Deleted image." });
};

exports.getImageById = getImageById;
exports.getImagesByUserId = getImagesByUserId;
exports.getWelcomeImagesByWelcomeURL = getWelcomeImagesByWelcomeURL;
exports.createImage = createImage;
exports.updateImage = updateImage;
exports.deleteImage = deleteImage;
