const Users = require("../models/users");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  errorHandler,
} = require("../utils/error");

const getUsers = (req, res, next) => {
  Users.find({})
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch(
      (err) => {
        errorHandler(err);
      },
      // if (err.status === BAD_REQUEST) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .send({ message: "Invalid request (getUsers)", err });
      // }
      // if (err.status === NOT_FOUND) {
      //   return res
      //     .status(NOT_FOUND)
      //     .send({ message: "Requested info is not found (getUsers)", err });
      // }
      // if (err.status === DEFAULT) {
      //   return res
      //     .status(DEFAULT)
      //     .send({ message: "Server error (getUsers)", err });
      // }
    );
  // next();
};

const getAUser = (req, res) => {
  const { userId } = req.user._id;
  console.log(userId);

  Users.findById(userId)
    // .orFail()
    .then((user) => res.status(204).send({ data: user }))
    .catch(
      (err) => {
        errorHandler(err);
      },
      // if (err.status === BAD_REQUEST) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .send({ message: "Invalid request (getAUser)", err });
      // }
      // if (err.status === NOT_FOUND) {
      //   return res
      //     .status(NOT_FOUND)
      //     .send({ message: "Requested info is not found (getAUser)", err });
      // }
      // if (err.status === DEFAULT) {
      //   return res
      //     .status(DEFAULT)
      //     .send({ message: "Server error (getAUser)", err });
      // }
    );
};

const createUser = (req, res, next) => {
  console.log(req);
  console.log(res);
  console.log(req.body);

  const { name, avatar } = req.body;
  console.log(name);
  console.log(avatar);

  Users.create({ name, avatar })
    // .orFail()
    .then((user) => {
      console.log(user);
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      errorHandler(err);
      // if (err.status === BAD_REQUEST) {
      //   return res
      //     .status(BAD_REQUEST)
      //     .send({ message: "Invalid request (createUser)", err });
      // }
      // if (err.status === NOT_FOUND) {
      //   return res
      //     .status(NOT_FOUND)
      //     .send({ message: "Requested info is not found (createUser)", err });
      // }
      // if (err.status === DEFAULT) {
      //   return res
      //     .status(DEFAULT)
      //     .send({ message: "Server error (createUser)", err });
      // }
    });
  // next();
};

module.exports = { getUsers, getAUser, createUser };
