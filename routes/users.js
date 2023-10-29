const router = require("express").Router();

const { getCurrentUser, login, updateUser } = require("../controllers/users");

// get the current logged in user
router.get("/me", getCurrentUser);

//modify user data
router.patch("/me", updateUser);

// get all users
// router.get("/", getUsers);

// get a specific user
// router.get("/:userId", getAUser);

// create new user
// router.post("/", createUser);

module.exports = router;
