const ClothingItems = require("../models/clothingItems");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
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

    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createItem)" });
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})

    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getItems)" });
      }
      if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getItems)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (getItems)", err });
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "The item is owned by other user" });
      } else {
        return item
          .deleteOne()
          .then(() => res.status(200).send({ message: "The item deleted" }));
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (deleteItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (deleteItem)" });
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
          .send({ message: "Invalid request (addLikes)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (addLikes)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (addLikes)" });
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
          .send({ message: "Invalid request (removeLikes)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (removeLikes)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (removeLikes)" });
    });
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
