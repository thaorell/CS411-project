'use strict';
/**
 * This file loads the mongoose models and makes the database connection.
 */
var
    path = require('path'),
    config = require('./config/config'),
    mongoose = require('mongoose');

/**
 * Load all models with this method
 */
module.exports.loadModels = function() {
    require('./models/user.server.model');
    require('./models/story.server.model');
    require('./models/location.server.model');
};


// Initialize Mongoose
module.exports.connect = function(cb) {
    var _this = this;
    // Load the options from config file as suggested in project guidelines
    var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
        // Log Error
        if (err) {
            console.error('Could not connect to MongoDB!');
            console.log(err);
        } else {

            // Call callback FN
            if (cb) cb(db);
        }
    });
};

/**
 * Disconnect function for database
 */
module.exports.disconnect = function(cb) {
    mongoose.disconnect(function(err) {
        console.log('Disconnected from MongoDB.');
        cb(err);
    });
};