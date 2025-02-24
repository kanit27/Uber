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

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const userRoutes = require("./routes/user.routes");
const captionRoutes = require("./routes/caption.routes");

app.use("/users", userRoutes);

app.use("/caption", captionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
