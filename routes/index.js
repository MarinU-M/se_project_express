const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NOT_FOUND, DEFAULT } = require("../utils/error");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});

router.use((req, res) => {
  res.status(DEFAULT).send({ message: "An error occur on server" });
});

module.exports = router;
