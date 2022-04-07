const express = require("express");
const router = express.Router();

router.get("/healthcheck.html", function(req, res) {
    res.writeHead(200, { "content-type": "text/plain", "Content-Length": 2 });
    res.write("OK");
    res.end();
});

module.exports = router;
