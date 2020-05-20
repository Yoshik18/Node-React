var express = require('express');
const bodyParser = require('body-parser');
let User = require('../models/users');
let passport = require('passport');
let authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({})
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({user});
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post('/signup', function (req, res, next) {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful',
          });
        });
      }
    }
  );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    status: 'Login Successful',
  });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    let err = new Error('You Are Not Logged In');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 403;
    return next(err);
  }
});

module.exports = router;
