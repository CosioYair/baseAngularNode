const passportConf = require('./passport');
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sharedRouter = require('./routes/shared');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var actionsRouter = require('./routes/actions');
var rolesRouter = require('./routes/roles');
var userFileTypesRouter = require('./routes/userfiletypes');
var gendersRouter = require('./routes/genders');
var tfasRouter = require('./routes/tfas');
var activeProcessGroupsRouter = require('./routes/activeProcessGroups');
var languagesRouter = require('./routes/languages');
var mailRouter = require('./routes/mail');
var baseUrl = "/api";
var userDevicesRouter = require('./routes/userDevices');
var dotenv = require('dotenv').config();

var cors = require('cors');
var app = express();

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/users`, usersRouter);
app.use(`${baseUrl}/actions`, actionsRouter);
app.use(`${baseUrl}/roles`, rolesRouter);
app.use(`${baseUrl}/activeProcessGroups`, activeProcessGroupsRouter);
app.use(`${baseUrl}/languages`, languagesRouter);
app.use(`${baseUrl}/userfiletypes`, userFileTypesRouter);
app.use(`${baseUrl}/genders`, gendersRouter);
app.use(`${baseUrl}/tfas`, tfasRouter);
app.use(`${baseUrl}/shared`, sharedRouter);
app.use(`${baseUrl}/mail`, mailRouter);
app.use(`${baseUrl}/userDevices`, userDevicesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
