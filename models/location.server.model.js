'use strict';

/**
 * Location Model it has city,state and country saved in the database.
 * Addition to this it also has user which has created this record.
 */
var mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true // Switch on the virtuals
    }
});

/**
 * Virtual fullName useful in search of the locations in UI, it adds up full name of the location in 1 attribute
 * which makes it easy to implement search
 */
LocationSchema.virtual('fullName')
    .get(function() {
        return this.city + ' ' + this.state + ', ' + this.country;
    });

mongoose.model('Location', LocationSchema);