const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001, BASE_PATH } = process.env;
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const { createUser, login } = require("./controllers/users");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(express.json());

// routes that doesnt require auth
app.post("/signin", login);
app.post("/signup", createUser);

app.use(routes);

app.listen(PORT, () => {
  console.log(PORT);
  console.log(BASE_PATH);
});
