const Users = require("../models/users");

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((evt) =>
      res.status(500).send({ message: "Error from getUsers" }, evt),
    );
};

const getAUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(204).send({ data: user }))
    .catch((evt) =>
      res.status(500).send({ message: "Error from getAUser" }, evt),
    );
};

const createUser = (req, res) => {
  console.log(req);
  console.log(res);
  console.log(req.body);

  const { name, avatar } = req.body;

  Users.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((evt) => {
      res.status(500).send({ message: "Error from createUser", evt });
    });
};

module.exports = { getUsers, getAUser, createUser };