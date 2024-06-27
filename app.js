var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./database/database');
var session = require('express-session');
const passport = require('./configuration/passport');
const models = require('./models');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var placesRouter = require('./routes/places');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/fontawesome/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/fontawesome/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts')));

// Sync models with the database
sequelize.sync({ alter: true }) // This will alter the tables to match the models
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to synchronize models:', err);
  });

// Session middleware
app.use(session({
  secret: 'h4@d%e<.9J0l!?.jkL30#gW2%oq!sA32)Vd*P5eW#q', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Flash middleware
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Middleware to make `user` available in all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Add routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/places', placesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
