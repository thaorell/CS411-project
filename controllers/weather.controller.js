'use strict';

/**
 * Weather and location related Functions 
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    request = require('request'),
    config = require('../config/config');
var User = mongoose.model('User');
var Story = mongoose.model('Story');
var Location = mongoose.model('Location');


/**
 * Gets weather on home page
 */
exports.getWeather = function(req, res) {
    var weatherURL = "https://weathers.co/api.php?city=";
    var user = req.user;
    //checks if user is loggedin and he has saved a primary location otherwise Boston
    if (user && user.primaryLocation) {
        var primaryLocationId = mongoose.Types.ObjectId(user.primaryLocation);
        //find the location name from database
        Location.findById(primaryLocationId).exec(function(err, location) {
            if (err) {
                res.status(410).json({
                    message: 'Unable to Find location',
                    status: 'failed'
                });
            } else {
                var locationString = location.city;
                weatherURL = weatherURL + locationString;
                console.log('Weather URL ' + weatherURL);
                //requesting the weather API for weather details
                request(weatherURL, {}, function(err, response) {
                    if (err) {
                        res.status(410).json({
                            status: 'Failed',
                            message: 'Unable to process Request'
                        })
                    } else {
                        response = JSON.parse(response.body);
                        console.log(JSON.stringify(response));
                        res.json(response.data);
                    }
                });
            }
        });
    } else {
        //Fallback to Boston
        weatherURL = weatherURL + "Boston+MA";
        console.log('Weather URL ' + weatherURL);
        request(weatherURL, {}, function(err, response) {
            if (err) {
                res.status(410).json({
                    status: 'Failed',
                    message: 'Unable to process Request'
                });
            } else {
                response = JSON.parse(response.body);
                console.log(JSON.stringify(response));
                res.json(response.data);
            }
        });
    }

};

/**
 * 
 * This is for down thumb in UI. TO search weather of any of the saved locations
 */
exports.getWeatherForLocation = function(req, res) {
    var locationId = req.params.locationId;
    locationId = mongoose.Types.ObjectId(locationId);
    //Get location details
    Location.findOne({
        user: req.user,
        _id: locationId
    }).exec(function(err, location) {
        if (!location) {
            res.status(410).json({
                status: 'Failed',
                message: 'Unable to process Request'
            })
        } else {
            var weatherURL = "https://weathers.co/api.php?city=";
            weatherURL = weatherURL + location.city;
            console.log('Weather URL ' + weatherURL);
            request(weatherURL, {}, function(err, response) {
                if (err) {
                    res.status(410).json({
                        status: 'Failed',
                        message: 'Unable to process Request'
                    });
                } else {
                    response = JSON.parse(response.body);
                    console.log(JSON.stringify(response));
                    res.json(response.data);
                }
            });
        }
    });
};

/**
 * Gets locations of the user who is logged in
 */
exports.listLocationByUser = function(req, res) {
    Location.find({
        user: req.user
    }).exec(function(err, locations) {
        if (!locations) {
            locations = [];
        }
        res.json({
            locations: locations
        });
    });
};

/**
 * Search location using text
 */
exports.searchLocation = function(req, res) {
    var searchText = req.body.search;
    var searchRegex = new RegExp(searchText, "i");
    var searchMatch = {
        $or: [
            { city: regx },
            { state: regx }
        ]
    };

    searchMatch.user = req.user;
    console.log(JSON.stringify(searchMatch));
    Location.find(searchMatch).exec(function(err, locations) {
        if (!locations) {
            locations = [];
        }
        res.json({
            locations: locations
        });
    });
};


/**
 * Change a primary location for logged in user
 */
exports.markLocationAsPrimary = function(req, res) {
    var user = req.user;
    var locationId = req.params.locationId;
    locationId = mongoose.Types.ObjectId(locationId);
    //Checks if user exists
    Location.findById(locationId).exec(function(err, location) {
        if (err || !location) {
            res.status(410).json({
                message: 'Unable to Find location',
                status: 'failed'
            });
        } else {
            //found , save it to user
            user.primaryLocation = location._id;
            user.save(function(err) {
                if (err) {
                    res.status(410).json({
                        message: 'Unable to Save Primary location',
                        status: 'failed'
                    });
                } else {
                    res.json({
                        message: 'Location saved',
                        status: 'ok'
                    });
                }
            });
        }
    });
};


/**
 * Creates a new location
 */
exports.saveLocation = function(req, res) {
    var location = new Location();
    location.city = req.body.city;
    location.state = req.body.state;
    location.country = req.body.country;
    location.user = req.user;
    location.save(function(err) {
        if (err) {
            res.status(410).json({
                message: 'Unable to Save location',
                reason: err.toString(),
                status: 'failed'
            });
        } else {
            res.json({
                message: 'Saved successfully',
                status: 'ok',
                data: location
            });
        }
    });
};

/**
 * Edits details of already existing location
 */
exports.editLocation = function(req, res) {
    var id = req.body._id;
    id = mongoose.Types.ObjectId(id);
    //find the loaction using id provided
    Location.findById(id).exec(function(err, location) {
        if (err) {
            res.status(410).json({
                message: 'Unable to Save location',
                reason: err.toString(),
                status: 'failed'
            });
        } else {
            //edit the details and then save
            location.city = req.body.city;
            location.state = req.body.state;
            location.country = req.body.country;
            location.save(function(err) {
                if (err) {
                    res.status(410).json({
                        message: 'Unable to Save location',
                        reason: err.toString(),
                        status: 'failed'
                    });
                } else {
                    res.json({
                        message: 'Saved successfully',
                        status: 'ok',
                        data: location
                    });
                }
            });
        }
    });

};


/**
 * Deletes the location
 */
exports.deleteLocation = function(req, res) {
    var user = req.user;
    var id = req.params.locationId;
    id = mongoose.Types.ObjectId(id);

    /**
     * Finds the location if exists
     */
    Location.findById(id).exec(function(err, location) {
        if (err || !location) {
            res.json({
                status: 'failed',
                message: 'Unable to find location'
            });
        } else {
            console.log('compare');
            console.log(user._id);
            console.log(location.user);
            //checks if user has access to location, (Access control)
            if (user._id + "" != location.user + "") {
                return res.status(403).json({
                    status: 'failed',
                    message: 'Unauthorized Access'
                });
            }
            //all well, we can delete the location
            location.remove(function(err) {
                if (err) {
                    res.json({
                        status: 'failed',
                        message: 'Unable to delete location'
                    });
                } else {
                    res.json({
                        status: 'ok',
                        message: 'Location Deleted'
                    });
                }
            });
        }
    });


};