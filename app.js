var express = require('express');
var app = express(); // Define app before using it
const cors = require('cors'); 
app.use(cors()); // Use cors middleware

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the 'public' directory if needed
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);

module.exports = app;