const router = require("express").Router();

const { getUsers, getAUser, createUser } = require("../controllers/users");

// get all users
router.get("/", getUsers);

// get a pecific user
router.get("/:userId", getAUser);

// create new user
router.post("/:userId", createUser);

module.exports = router;
