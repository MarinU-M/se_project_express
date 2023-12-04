const ClothingItems = require("../models/clothingItems");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  handleServerError,
} = require("../middlewares/error-handler");

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
      res.status(201).send(item);
    })
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid request (createItem)");
      }
    })
    .catch(next);
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteItem = (req, res) => {
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
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid request (deleteItem)");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested info is not found (deleteItem)");
      }
    })
    .catch(next);
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
    .then((item) => res.send(item))
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid request (addLikes)");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested info is not found (addLikes)");
      }
    })
    .catch(next);
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
    .then((item) => res.send(item))
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid request (removeLikes)");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested info is not found (removeLikes)");
      }
    })
    .catch(next);
};

module.exports = { createItem, getItems, deleteItem, addLikes, removeLikes };
