const ClothingItems = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req.user._id);

  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner, likes, createdAt })
    .orFail()
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((evt) => {
      res.status(500).send({ message: "Error from createItem", evt });
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((evt) =>
      res.status(500).send({ message: "Error from getItems" }, evt),
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((evt) =>
      res.status(500).send({ message: "Error from deleteItem" }, evt),
    );
};

const addLikes = (req, res) => {
  const { userId } = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((evt) =>
      res.status(500).send({ message: "Error from updateItem" }, evt),
    );
};

const removeLikes = (req, res) => {
  const { userId } = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: userId },
    },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((evt) =>
      res.status(500).send({ message: "Error from updateItem" }, evt),
    );
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
