'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    Schema = mongoose.Schema;

/**
 * Story Schema which is used to save the favorites of a particular user. When user likes a news
 * the details are saved in stories collection using this schema.
 */
var StorySchema = new Schema({
    content: {
        type: Object
    },
    //unique id given by the guardian's API
    id: {
        type: String
    },
    //User attribute defines which user has saved it
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

mongoose.model('Story', StorySchema);