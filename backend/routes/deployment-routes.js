const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/*", function(req, res) {
    res.sendFile(path.resolve("public/build", "index.html"));
});

module.exports = router;
