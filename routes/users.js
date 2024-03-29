var express = require('express');
const bodyParser = require('body-parser');
let User = require('../models/users');
let passport = require('passport');
let authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get(
  '/',
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
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
  }
);

router.post('/signup', cors.corsWithOptions, function (req, res, next) {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
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
        });
      }
    }
  );
});

router.post(
  '/login',
  cors.corsWithOptions,
  passport.authenticate('local'),
  (req, res) => {
    let token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token: token,
      status: 'Login Successful',
    });
  }
);

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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
