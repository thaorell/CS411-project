const express = require('express');
const router = express.Router();

const request = require('request-promise-lite');
const async = require('async');

const config= require("../config/config");

var mongojs = require('mongojs');
var db = mongojs(config.db.uri , ['input']);

const yelp = require('yelp-fusion');

const apiKey= config.yelp.apiKey;
const google_apiKey= config.google.apiKey;
const cseID = config.google.cseID;


router.get('/', function(req, res, next){
  console.log("API page");
});

router.get('/yelp', function(req, res, next){
    // const client = yelp.client(apiKey);
  // db.input.find({},{term:1, location:1, _id:0})
  //  .limit(1).sort({$natural:-1}, function(err, input){
  //   if(err){
  //     res.send(err);
  //   }
  //   client.search(input[0])
  //     .then(  response => {
  //     res.json(response.jsonBody.businesses);
  //     })
  //     .catch(e => {
  //     console.log(e);
  //   });
  // });
  var lastInput = {};
  db.input.find({},{term:1, location:1, _id:0})
    .limit(1).sort({$natural:-1}, function(err, input){
      if(err){
        res.send(err);
      }
      lastInput = input[0];
    //console.log(lastInput);
    async.waterfall([
      async.constant(input[0]),
        yelpSearch,
        googleSearch
      ],
      function sendJson(err, restaurants) {
        console.log("waterfall starting");
        if (err) res.send(err);
        res.json(restaurants);
      })
  });
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
  var apiKey = google_apiKey;
  var cseKey = cseID;
  var Restaurants = restaurants;
  for (var i = 0; i< Restaurants.length; i++){

    var restaurant = Restaurants[i];
    restaurant['imageURLs'] = [];

    var keyWord = restaurant.name + restaurant.city + restaurant.state;
    var googleURL = "https://www.googleapis.com/customsearch/v1?key="+ apiKey +
      "&q="+ keyWord +
      "&searchType=image" +
      "&cx=" + cseKey +
      "&num=7" +
      "&safe=medium"
    ;

    //image URLs of each restaurants to be displayed in the front end
    var imageURLs = [];

    request
      .get(googleURL,
        {
          json : true, headers: {
            'User-Agent' : 'thaorell'
          }
        })
      .then(function(response){
        response.items.forEach(function(item){
          imageURLs.push(item.link)
        });

        restaurant.imageURLs = imageURLs;
      })
      .catch(e => {
        console.log(e);
      })
  }
  cb(null, Restaurants)
};

module.exports = router;
