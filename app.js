require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
const cors = require("cors");
const { errors } = require("celebrate");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");

const routes = require("./routes/index");

const { createUser, login } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { handleServerError } = require("./middlewares/error-handler");
const {
  validateUserInfo,
  validateLoginUser,
} = require("./middlewares/validation");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(helmet());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

// routes that doesnt require auth
app.post("/signin", validateLoginUser, login);
app.post("/signup", validateUserInfo, createUser);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleServerError);

app.listen(PORT);
