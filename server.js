

var express = require("express"); // FrameWork
var app = express();
var port = 8080;
var mongoose = require("mongoose"); // For Db
var passport = require("passport"); // For Authentication
var flash = require("connect-flash"); // Allow for passing FlashData Message
var morgan = require("morgan");
var cookierParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDb = require("./config/database.js");

mongoose.connect(configDb.url); 

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to console
app.use(cookierParser()); // read Cookie for Auth
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs'); // setup ejs for templating

// Passport
app.use(session({secret: '1234567'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // Persistent Login Session
app.use(flash()); // use connect-flash for Flash Messages stroed in session


// routes
require('./app/routes.js')(app, passport);


app.listen(port);
console.log('server is running on Port' + port);