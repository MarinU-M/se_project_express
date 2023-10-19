const ClothingItems = require("../models/clothingItems");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  // errorHandler,
} = require("../utils/error");

const createItem = (req, res, next) => {
  const owner = req.user._id;
  console.log(owner);

  const { name, weather, imageUrl, likes } = req.body;

  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner,
    likes,
  })
    // .orFail()
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createItem)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (createItem)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (createItem)", err });
      }
    });
  // next();
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getItems)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getItems)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (getItems)", err });
      }
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log(userId);
  console.log(itemId);

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (deleteItem)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (deleteItem)", err });
      }
    });
};

const addLikes = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log(userId);
  console.log(itemId);

  ClothingItems.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: userId },
    },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (addLikes)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (addLikes)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (addLikes)", err });
      }
    });
};

const removeLikes = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log(userId);
  console.log(itemId);

  ClothingItems.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: userId },
    },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (removeLikes)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (removeLikes)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (removeLikes)", err });
      }
    });
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
