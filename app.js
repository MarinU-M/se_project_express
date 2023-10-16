const express = require("express");

const mongoose = require("mongoose");
const { PORT = 3001, BASE_PATH } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("Connected to DB"),
    (e) => {
      console.log("Error in DB"), e;
    };
});

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(PORT);
  console.log(BASE_PATH);
});
