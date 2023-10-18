const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  addLikes,
  removeLikes,
} = require("../controllers/clothingItems");

// create clothing item
router.post("/", createItem);

// read cards
router.get("/", getItems);

// delete a card
router.delete("/:itemId", deleteItem);

// add likes to the card
router.put("/:itemId/likes", addLikes);

// remove likes from the card
router.delete("/:itemId/likes", removeLikes);

module.exports = router;
