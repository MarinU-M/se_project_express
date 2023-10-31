const router = require("express").Router();
const { auth } = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

// get the current logged in user
router.get("/me", auth, getCurrentUser);

//modify user data
router.patch("/me", auth, updateUser);

// get all users
// router.get("/", getUsers);

// get a specific user
// router.get("/:userId", getAUser);

// create new user
// router.post("/", createUser);

module.exports = router;
