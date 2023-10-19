const ClothingItems = require("../models/clothingItems");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  errorHandler,
} = require("../utils/error");

const createItem = (req, res, next) => {
  const { userId } = req.user._id;
  console.log(userId);

  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner,
    likes,
    createdAt,
    userId,
  })
    // .orFail()
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.status === BAD_REQUEST) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request", err });
      }
      if (err.status === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found", err });
      }
      if (err.status === DEFAULT) {
        return res.status(DEFAULT).send({ message: "Server error", err });
      }
    });
  next();
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
