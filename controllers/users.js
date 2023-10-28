const Users = require("../models/users");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  // errorHandler,
} = require("../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getCurrentUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getCurrentUser)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getCurrentUser)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (getCurrentUser)" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  Users.findOne({ email }, next).then((email) => {
    if (email) {
      const ConflictError = new Error({
        message: "A user with this email already exists.",
      });
      ConflictError.name = "ConflictError";
      throw ConflictError;
    }
    next();
  });
  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      // errorHandler(err);
      if (err.name === "ValidationError" || err.name === "ConflictError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createUser)" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        const ConflictError = new Error({
          message: "A user with this email already exists.",
        });
        ConflictError.name = "ConflictError";
        throw ConflictError;
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
    });
};

const updateUser = (req, res) => {};

module.exports = { getCurrentUser, createUser, login };

// no longer use

// const getUsers = (req, res) => {
//   Users.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);

//       if (err.name === "ValidationError") {
//         return res
//           .status(BAD_REQUEST)
//           .send({ message: "Invalid request (getUsers)" });
//       }
//       if (err.name === "NotFound") {
//         return res
//           .status(NOT_FOUND)
//           .send({ message: "Requested info is not found (getUsers)" });
//       }
//       return res.status(DEFAULT).send({ message: "Server error (getUsers)" });
//     });
// };
