const Users = require("../models/users");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  // errorHandler,
} = require("../utils/error");

const getUsers = (req, res) => {
  Users.find({})
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      //   errorHandler(err);
      // },
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getUsers)", err });
      }
      if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getUsers)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (getUsers)", err });
    });
  // next();
};

const getAUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      //   errorHandler(err);
      // },
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getAUser)", err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getAUser)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (getAUser)", err });
    });
  // next();
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  Users.create({ name, avatar })
    // .orFail()
    .then((user) => {
      console.log(user);
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      // errorHandler(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)", err });
      }
      if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (createUser)", err });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (createUser)", err });
    });
  // next();
};

module.exports = { getUsers, getAUser, createUser };
