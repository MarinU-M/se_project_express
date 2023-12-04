const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NotFoundError } = require("../middlewares/error-handler");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res) => {
  throw new NotFoundError("Requested resource not found");
  // res.status(NOT_FOUND).send({
  //   message: "Requested resource not found",
  // });
});

// router.use((req, res) => {
//   res.status(DEFAULT).send({ message: "An error occur on server" });
// });

module.exports = router;
