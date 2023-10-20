const ClothingItems = require("../models/clothingItems");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  // errorHandler,
} = require("../utils/error");

const createItem = (req, res) => {
  const owner = req.user._id;
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
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createItem)", err });
      }
      if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (createItem)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (createItem)", err });
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
      }
      if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getItems)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (getItems)", err });
    });
};

const deleteItem = (req, res) => {
  // const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)", err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (deleteItem)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (deleteItem)", err });
    });
};

const addLikes = (req, res) => {
  const userId = req.user._id;
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
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (addLikes)", err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (addLikes)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (addLikes)", err });
    });
};

const removeLikes = (req, res) => {
  const userId = req.user._id;
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
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (removeLikes)", err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (removeLikes)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (removeLikes)", err });
    });
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
