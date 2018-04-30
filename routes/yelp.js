const express = require('express');
const router = express.Router();

const request = require('request-promise-lite');
const async = require('async');

const config= require("../config/config");

var mongojs = require('mongojs');
var db = mongojs(config.db.uri , ['input','search']);

const yelp = require('yelp-fusion');

const apiKey= config.yelp.apiKey;
const google_apiKey= config.google.apiKey;
const cseID = config.google.cseID;

var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');

router.get('/', function(req, res, next){
  console.log("API page");
});


router.get('/yelp/:term/:location', function(req, res, next){
    var input = {
      term: req.params.term,
      location: req.params.location
    }
    db.search.findOne({input: input}, function(err, response){
      console.log(input);
      if (err) callback(null);
      else if (response)
        res.json(response.restaurants);
      else {
        async.waterfall([
            async.constant(input),
            yelpSearch,
            googleSearch
          ],
          function sendJson(err, restaurants) {
            console.log("waterfall starting");
            if (err) res.send(err);
            res.json(restaurants);
            db.search.save({
              input: input,
              restaurants: restaurants
            })
          })
      }
  })
});

router.get('/yelp/searches/', function(req, res, next){
  db.input.find(function(err, input){
    if(err){
      res.send(err);
    }
    res.json(input);
  });
});

router.post('/yelp/search/', function(req, res, next){
    var input = req.body;
    console.log(input);
    db.input.save(input, function(err, result){
      if(err){
        res.send(err);
      }
      res.json(result);
    });
});

// Yelp API call
const yelpSearch = function(input, cb){
  const client = yelp.client(apiKey);
  client.search(input)
    .then( response => {
      cb(null, response.jsonBody.businesses);
    })
    .catch(e => {
      console.log(e);
    });
}

// Google API call
var googleSearch = function(restaurants, cb){
  console.log("google starts");
  const apiKey = google_apiKey;
  const cseKey = cseID;

  return Promise.all(Array.from(restaurants).map(function (restaurant) {

      var keyWord = restaurant.name + " " + restaurant.location.address1 + restaurant.location.city
        + " " + restaurant.location.state + " food";

      var googleURL = "https://www.googleapis.com/customsearch/v1?key=" + apiKey +
        "&q=" + keyWord +
        "&searchType=image" +
        "&cx=" + cseKey +
        "&num=6" +
        "&safe=medium"+
        "&fileType=.jpg"
      ;

      return request
        .get(googleURL,
          {
            json: true, headers: {
              'User-Agent': 'thaorell'
            }
          }
        )
        .then(function (response) {
          restaurant.imageURLs = Array.from(response.items).map(function (item) {
            return item.link;
          });
          return restaurant;
        })
    })
  )
    .then(restaurants2 => cb(null, restaurants2))
    .catch(cb)
};

module.exports = router;
