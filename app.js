const express = require("express");

const mongoose = require("mongoose");
const { PORT = 3001, BASE_PATH } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  (r) => {
    console.log("Connected to DB", r);
  },
    (e) => {
      console.log("Error in DB", e);
    };
});

const routes = require("./routes/index");

app.use(express.json());

app.use(routes);
app.use((req, res, next) => {
  req.user = {
    _id: "652f069dfdda4b8ee1510294", // paste the _id of the test user created in the previous step
  };
  next();
});

app.listen(PORT, () => {
  console.log(PORT);
  console.log(BASE_PATH);
});
