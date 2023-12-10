const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NotFoundError } = require("../middlewares/NotFoundError");

router.use("/items", clothingItems);
router.use("/users", users);

router.use(() => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
