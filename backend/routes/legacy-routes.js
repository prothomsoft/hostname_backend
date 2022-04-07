const express = require("express");
const router = express.Router();

router.get("/logowanie/marzenamateusz.html", function(req, res) {
    res.redirect("http://sk.99foto.pl/logowanie/marzenamateusz.html");
});

module.exports = router;
