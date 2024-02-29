var express = require("express");
const cors = require("cors");

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index"); // to handle requests to /api/index
var app = express(); // Define app before using it
app.use(cors()); // Use cors middleware

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "/client/dist")));

// Serve static files from the 'public' directory if needed
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", indexRouter);

module.exports = app;
