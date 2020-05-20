const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promo = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter
  .route('/')
  .get((req, res, next) => {
    Promo.find({})
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promo.create(req.body)
      .then(
        (resp) => {
          console.log('Promo Created');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promo.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promoRouter
  .route('/:promoId')
  .get((req, res, next) => {
    Promo.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'POST operation not supported on /promotions/' + req.params.promoId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promo.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {$new: true})
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promo.findByIdAndDelete(req.params.promoId)
      .then(
        (promo) => {
          console.log('Inside delete');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = promoRouter;
