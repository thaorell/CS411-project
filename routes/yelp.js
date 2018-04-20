var express = require('express');
var router = express.Router();

var config= require("../config/config");
var apiKey= config.yelp.apiKey;

var mongojs = require('mongojs');
var db = mongojs(config.db.uri , ['input']);


const yelp = require('yelp-fusion');

var input;
router.get('/', function(req, res, next){
  console.log(input);
});


router.get('/yelp', function(req, res, next){
    const client = yelp.client(apiKey);
    db.input.find({},{term:1, location:1, _id:0})
     .limit(1).sort({$natural:-1}, function(err, input){
      if(err){
        res.send(err);
      }
      client.search(input[0])

        .then(  response => {
        res.json(response.jsonBody.businesses).pretty(); }
      ).catch(e => {
        console.log(e);
      });
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
    input = req.body;
    console.log(input);
    db.input.save(input, function(err, input){
      if(err){
        res.send(err);
      }
      res.json(input);
    });
});

module.exports = router;
