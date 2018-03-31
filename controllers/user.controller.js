'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 * It calls the other file, this is for extension of the project, to keep the code structure better
 */
module.exports = _.extend(
    require('./users.authentication.server.controller')
);