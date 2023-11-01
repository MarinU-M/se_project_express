const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
} = require("../utils/error");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

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

  return Users.findOne({ email })
    .then((user) => {
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
          if (err.name === "ValidationError") {
            return res
              .status(BAD_REQUEST)
              .send({ message: "Invalid request (createUser)" });
          }
          return res
            .status(DEFAULT)
            .send({ message: "Server error (createUser)" });
        });
    })
    .catch(() =>
      res.status(DEFAULT).send({ message: "Server error (createUser)" }),
    );
};

const login = (req, res) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Unauthorized request (login)" });
      }

      return res.status(DEFAULT).send({ message: "Server error (login)" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  Users.findByIdAndUpdate(
    userId,
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
