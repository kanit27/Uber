const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");
// Allow requests from the frontend
app.use(cors({
    origin: [process.env.REACT_APP_SERVER_URL, 'http://localhost:5173'], // Add explicit origin
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
}));

// For preflight requests
app.options('*', cors());

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
const mapRoutes = require("./routes/map.routes");

app.use("/users", userRoutes);
app.use("/caption", captionRoutes);
app.use("/map", mapRoutes);

const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [process.env.REACT_APP_SERVER_URL, 'http://localhost:5173'], // Add explicit origin
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }
});


io.on('connection', function(socket) {
    console.log('User connected with ID:', socket.id);
});

// Root endpoint with CORS headers explicitly set
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.send("Hello World");
});



module.exports = { app, server };