let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let FileStore = require('session-file-store')(session);
let passport = require('passport');
let authenticate = require('./authenticate');
let config = require('./config');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

connect.then(
  (db) => {
    console.log('Connected to the server');
  },
  (err) => {
    console.log(err);
  }
);

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let promoRouter = require('./routes/promoRouter');
let leaderRouter = require('./routes/leaderRouter');
let uploadRouter = require('./routes/uploadRouter');
let favoriteRouter = require('./routes/favoriteRouter');

let app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(
      307,
      'https://' + req.hostname + ':' + app.get('secPort') + req.url
    );
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser('1234-5678-8765-4321'));

//Using JSON Web Tokens
// app.use(
//   session({
//     name: 'session-id',
//     secret: '1234-5678-8765-4321',
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req, res, next) {
//   if (!req.user) {
//     let err = new Error('You Are Not Authenticated');
//     err.status = 403;
//     return next(err);
//   } else {
//     next();
//   }
// }
// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

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
