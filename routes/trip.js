var express = require('express');
var router = express.Router();
const config = require('../config/config');
var mongoose = require('mongoose');
// mongoose middle wear

mongoose.connect(config.db.uri, {/* useMongoClient: true*/ });
const monDb = mongoose.connection;

monDb.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that', config.db.uri, 'is running.');
});

monDb.once('open', function callback() {
  console.info('Connected to MongoDB:', config.db.uri);
});

const Trip = require('../models/trip');


const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

  // Authentication middleware
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `http://localhost:3000/api/.well-known/jwks.json`
    }),
    audience: "http://localhost:3000/api/",
    issuer: `https://${config.auth0.domain}/`,
    algorithm: 'RS256'
  });



//GET TRIPS BY ID
router.get('/:userId', (req, res) => {
  Trip.find({userId: req.params.userId}, (err, trips) => {
    let tripsArr = [];
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (trips) {
      trips.forEach(trip => {
        tripsArr.push(trip);
      });
    }
    res.json(tripsArr);
  });
});

router.post('/all', (req, res) => {
  const newTrip = new Trip(req.body);

  newTrip.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newTrip);
  });
});

router.post('/all', (req, res) => {
  const newTrip = new Trip(req.body);

  newTrip.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newTrip);
  });
});

//to add a restaurant and update in the db

router.put('/all/:id', function(req, res, next){

  //var updTrip = {};


  Trip.findByIdAndUpdate(
      // the id of the item to find
      req.params.id,
      // the change to be made. Mongoose will smartly combine your existing
      // document with this change, which allows for partial updates too
      req.body,

      // an option that asks mongoose to return the updated version
      // of the document instead of the pre-updated one.

      // the callback function
      (err, todo) => {
        // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.send(todo);
      }
    )
});

router.delete('/all/:id', function(req, res, next){
  Trip.findByIdAndRemove(req.params.id, (err, todo) => {
    // As always, handle any potential errors:
    if (err) return res.status(500).send(err);
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: "successfully deleted",
      id: todo._id
    };
    return res.status(200).send(response);
  });
});


module.exports = router;
