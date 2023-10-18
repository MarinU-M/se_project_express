const ClothingItems = require("../models/clothingItems");
const { errorHandler } = require("../utils/error");

const createItem = (req, res) => {
  console.log(req.user._id);

  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner, likes, createdAt })
    .orFail()
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => errorHandler(err));
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((err) => errorHandler(err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((err) => errorHandler(err));
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
    .catch((err) => errorHandler(err));
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
    .catch((err) => errorHandler(err));
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
