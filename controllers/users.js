const Users = require("../models/users");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
  // errorHandler,
} = require("../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid request (createUser)" });
  }

  Users.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(CONFLICT)
        .send({ message: "The user with this email already exists" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => Users.create({ name, avatar, email, password: hash }))
      .then((newUser) => {
        res.status(201).send({
          name: newUser.name,
          avatar: newUser.avatar,
          email: newUser.email,
        });
      })
      .catch((err) => {
        console.error(err);
        // errorHandler(err);
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST)
            .send({ message: "Invalid request (createUser)" });
        }
        return res
          .status(DEFAULT)
          .send({ message: "Server error (createUser)" });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    // .select("+password")
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "Error") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (login)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (login)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (login)" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.params;

  Users.findByIdAndUpdate(
    { userId },
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (updateUser)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (updateUser)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (updateUser)" });
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };

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
