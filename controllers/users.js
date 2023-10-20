const Users = require("../models/users");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  // errorHandler,
} = require("../utils/error");

const getUsers = (req, res, next) => {
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
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getUsers)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (getUsers)", err });
      }
    });
  // next();
};

const getAUser = (req, res) => {
  const userId = req.params.userid;
  console.log(userId);

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      //   errorHandler(err);
      // },
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getAUser)", err });
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getAUser)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (getAUser)", err });
      }
    });
  // next();
};

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;
  console.log(name);
  console.log(avatar);

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
      } else if (err.name === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (createUser)", err });
      } else {
        return res
          .status(DEFAULT)
          .send({ message: "Server error (createUser)", err });
      }
    });
  // next();
};

module.exports = { getUsers, getAUser, createUser };
