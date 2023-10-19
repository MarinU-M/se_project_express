const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NOT_FOUND } = require("../utils/error");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});

router.use((req, res, next) => {
  res.status(500).send({ message: "An error occur on server" });
  next();
});

module.exports = router;
