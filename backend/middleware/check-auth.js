const JWT = require("jsonwebtoken");
const HttpErrors = require("./http-errors");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error("Authentication failed!");
        }
        const decodedToken = JWT.verify(token, "fotograf_slubny_krakow");
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpErrors("Authentication failed!", 403);
        return next(error);
    }
};
