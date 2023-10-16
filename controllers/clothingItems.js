const ClothingItems = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req);
  console.log(res);
  console.log(req.body);

  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner, likes, createdAt })
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
    .then((items) => res.status(200).send(items))
    .catch((evt) =>
      res.status(500).send({ message: "Error from getItems" }, evt),
    );
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItems.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((evt) =>
//       res.status(500).send({ message: "Error from updateItem" }, evt),
//     );
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((evt) =>
      res.status(500).send({ message: "Error from deleteItem" }, evt),
    );
};
module.exports = { createItem, getItems, deleteItem };
