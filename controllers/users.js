const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const { UnauthorizedError } = require("../middlewares/UnauthorizedError");
const { ConflictError } = require("../middlewares/ConflictError");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { NotFoundError } = require("../middlewares/NotFoundError");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid request (getCurrentUser)"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested info is not found (getCurrentUser)"));
      } else {
        next(err);
      }
    });
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
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request (createUser)"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        },
      );
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Unauthorized request (login)"));
      } else {
        next(err);
      }
    });
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
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Invalid request (updateUser)"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested info is not found (updateUser)"));
      } else {
        next(err);
      }
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
