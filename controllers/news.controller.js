'use strict';

/**
 * News controller for the system, all the news related code for server is in this file.
 * 
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    request = require('request'),
    config = require('../config/config');
//Get the models
var User = mongoose.model('User');
var Story = mongoose.model('Story');

/**
 * Loads the API key from guardian from config file as suggested by the professor
 */

/**
 * We are loading only 5 news, we can increase this to number we want
 */
var newsPageSize = 5;

//Uncomment this line only for testing
//guardianAPIKey = 'test';

//Creates the guardian API URL which will be called to fetch the news


/**
 * Gets the news from the guardian API
 */
var getAllNews = exports.getAllNews = function(req, res) {
    if (!req.user) {
        res.status(403).json({
            status: 'Failed',
            message: 'Unauthorized Request'
        })
    }
    //Call API
    request(guardianURL, {}, function(err, response) {
        if (err) {
            res.status(410).json({
                status: 'Failed',
                message: 'Unable to process Request'
            });
        } else {

            //REspond to client
            response = JSON.parse(response.body);
            res.json(response);
        }
    });
};


/**
 * GEts the favorite stories of logged in user
 */
exports.getFavorites = function(req, res) {
    Story.find({
        user: req.user
    }).exec(function(err, stories) {
        res.json(stories);
    });
};

/**
 * Save a favorite news story into database
 */
exports.saveNewsItem = function(req, res) {
    var user = req.user;
    var content = req.body;
    var id = content.id;
    var story = new Story({
        user: user,
        id: id,
        content: content
    });
    story.save(function(err) {
        if (err) {
            console.log('err ' + err);
            console.log(JSON.stringify(err));
            res.status(410).json({
                message: ' Error'
            })
        } else {
            res.json(story);
        }
    });
};

/**
 * Deletes already saved news story
 */
exports.deleteNewsItem = function(req, res) {
    var id = req.body.id;
    console.log(JSON.stringify(req.body));
    console.log('id ' + id);
    Story.findOne({
        id: id
    }).exec(function(err, story) {
        if (err || !story) {
            return res.status(410).json({
                message: ' Unable to find story with this id'
            });
        } else {
            console.log('story');
            console.log(JSON.stringify(story));
            story.remove(function(err) {
                if (err) {

                    res.status(410).json({
                        message: ' Unable to remove story'
                    });
                } else {
                    res.json({
                        message: 'Success'
                    });
                }
            });
        }
    });
};