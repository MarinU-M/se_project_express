const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/error-handler");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid request (getCurrentUser)");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested info is not found (getCurrentUser)");
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid request (createUser)");
  }

  return Users.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("The user with this email already exists");
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
        .then((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            throw new BadRequestError("Invalid request (createUser)");
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .then((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        throw new UnauthorizedError("Unauthorized request (login)");
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
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
    .then((user) => res.send(user))
    .then((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid request (updateUser)");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested info is not found (updateUser)");
      }
    })
    .catch(next);
};

module.exports = { getCurrentUser, createUser, login, updateUser };
