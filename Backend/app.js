const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const connectToDb = require("./db/db.js");
connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());



const userRoutes = require("./routes/user.routes");

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
