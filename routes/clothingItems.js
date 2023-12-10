const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  addLikes,
  removeLikes,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateClothingItem,
  validateUserAndItemID,
} = require("../middlewares/validation");

// create clothing item
// router.post("/", createItem);
router.post("/", auth, validateClothingItem, createItem);

// read cards
router.get("/", getItems);

// delete a card
// router.delete("/:itemId", deleteItem);
router.delete("/:itemId", auth, validateUserAndItemID, deleteItem);

// add likes to the card
// router.put("/:itemId/likes", addLikes);
router.put("/:itemId/likes", auth, validateUserAndItemID, addLikes);

// remove likes from the card
// router.delete("/:itemId/likes", removeLikes);
router.delete("/:itemId/likes", auth, validateUserAndItemID, removeLikes);

module.exports = router;
