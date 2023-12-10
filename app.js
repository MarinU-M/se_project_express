require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { handleServerError } = require("./middlewares/error-handler");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// routes that doesnt require auth
app.post("/signin", login);
app.post("/signup", createUser);

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleServerError);

app.listen(PORT);
