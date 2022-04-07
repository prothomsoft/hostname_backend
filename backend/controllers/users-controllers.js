const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpErrors = require("../middleware/http-errors");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({ login: { $ne: "aaAA22@#123" } });
    } catch (err) {
        const error = new HttpErrors("Fetching users failed, please try again later.", 500);
        return next(error);
    }
    res.status(200).json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getClients = async (req, res, next) => {
    let users;
    try {
        users = await User.find({ login: { $ne: "aaAA22@#123" }, isHidden: { $eq: false } }).sort([["creationDate", -1]]);
    } catch (err) {
        const error = new HttpErrors("Fetching users failed, please try again later.", 500);
        return next(error);
    }

    let clients = users.map((user) => {
        return {
            creationDate: user.creationDate,
            name: user.name,
            welcomeURL: user.welcomeURL,
            logCounter: user.logCounter,
        };
    });
    res.status(200).json(clients);
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpErrors("Invalid inputs passed, please check your data.", 422));
    }

    const { name, welcomeURL, creationDate, login } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ login: login });
    } catch (err) {
        const error = new HttpErrors("Signing up failed, please try again later.", 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpErrors("User exists already, please login instead.", 422);
        return next(error);
    }

    let isAdmin = false;
    if (login === "aaAA22@#123") {
        isAdmin = true;
    }

    const createdUser = new User({
        name,
        login,
        welcomeURL,
        creationDate,
        isAdmin: isAdmin,
        logCounter: 0,
        images: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpErrors("Signing up failed, please try again later" + err, 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, isAdmin: createdUser.isAdmin }, "fotograf_slubny_krakow", { expiresIn: "1h" });
    } catch (err) {
        const error = new HttpErrors("Signing up failed, please try again later 2.", 500);
        return next(error);
    }

    res.status(200).json({ userId: createdUser.id, isAdmin: createdUser.isAdmin, token: token, name: createdUser.name });
};

const login = async (req, res, next) => {
    const { login } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ login: login });
    } catch (err) {
        const error = new HttpErrors("Logging in failed, please try again later 3.", 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpErrors("Błędne hasło. Spróbuj jeszcze raz.", 403);
        return next(error);
    }

    let counter = existingUser.logCounter;
    existingUser.logCounter = counter + 1;

    try {
        await existingUser.save();
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not update user.", 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, isAdmin: existingUser.isAdmin }, "fotograf_slubny_krakow", { expiresIn: "1h" });
    } catch (err) {
        const error = new HttpErrors("Logging in failed, please try again later.", 500);
        return next(error);
    }

    res.status(200).json({
        userId: existingUser.id,
        isAdmin: existingUser.isAdmin,
        token: token,
        name: existingUser.name,
        isSlub: existingUser.isSlub,
        isSesjaNarzeczenska: existingUser.isSesjaNarzeczenska,
        isSesjaSlubna: existingUser.isSesjaSlubna,
        isSesjaOkolicznosciowa: existingUser.isSesjaOkolicznosciowa,
        welcomeURL: existingUser.welcomeURL,
    });
};

const deleteUser = async (req, res, next) => {
    const userId = req.params.userId;

    console.log(userId);

    /* example how to add new column on database collection
    let user;
    try {
        user = await User.updateMany({ isHidden: false });
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete user." + err, 500);
        return next(error);
    }*/

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete user." + err, 500);
        return next(error);
    }

    try {
        await user.remove();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete user." + err, 500);
        return next(error);
    }

    res.status(200).json({ message: "User was removed." });
};

const hideUser = async (req, res, next) => {
    const userId = req.params.userId;
    const status = req.params.status;

    let existingUser;

    try {
        existingUser = await User.findById(userId);
    } catch (err) {
        const error = new HttpErrors("Logging in failed, please try again later 3.", 500);
        return next(error);
    }

    if (status === "false") existingUser.isHidden = false;
    if (status === "true") existingUser.isHidden = true;

    try {
        await existingUser.save();
    } catch (err) {
        const error = new HttpErrors("Something went wrong, could not update user.", 500);
        return next(error);
    }

    res.status(200).json({ message: "User was hidden." });
};

exports.getUsers = getUsers;
exports.getClients = getClients;
exports.deleteUser = deleteUser;
exports.hideUser = hideUser;
exports.signup = signup;
exports.login = login;
