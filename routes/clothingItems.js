const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  addLikes,
  removeLikes,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// create clothing item
router.post("/", auth, createItem);

// read cards
router.get("/", getItems);

// delete a card
router.delete("/:itemId", auth, deleteItem);

// add likes to the card
router.put("/:itemId/likes", auth, addLikes);

// remove likes from the card
router.delete("/:itemId/likes", auth, removeLikes);

module.exports = router;
