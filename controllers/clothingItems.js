const ClothingItems = require("../models/clothingItems");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { ForbiddenError } = require("../middlewares/ForbiddenError");
const { NotFoundError } = require("../middlewares/NotFoundError");

const createItem = (req, res, next) => {
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
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request (createItem)"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        throw new ForbiddenError("The item is owned by other user");
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "The item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid request (deleteItem)"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested info is not found (deleteItem)"));
      } else {
        next(err);
      }
    });
};

const addLikes = (req, res, next) => {
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
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid request (addLikes)"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested info is not found (addLikes)"));
      } else {
        next(err);
      }
    });
};

const removeLikes = (req, res, next) => {
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
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid request (removeLikes)"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested info is not found (removeLikes)"));
      } else {
        next(err);
      }
    });
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
