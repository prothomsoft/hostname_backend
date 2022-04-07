const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");
const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/clients", usersController.getClients);

router.post("/signup", [check("name").not().isEmpty(), check("login").not().isEmpty()], usersController.signup);

router.post("/login", usersController.login);
router.delete("/:userId", usersController.deleteUser);
router.delete("/hide/:userId/:status", usersController.hideUser);

module.exports = router;
