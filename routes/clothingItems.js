const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

// create clothing item
router.post("/", createItem);

// read cards
router.get("/", getItems);

// update a card
// router.put("/:itemId", updateItem);

// delete a card
router.delete("/:itemId", deleteItem);

module.exports = router;
