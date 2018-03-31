'use strict';
/**
 * This is the configuration file as specified in the project specifications, 
 * all constants are stored here
 */
var fs = require('fs'),
    path = require('path');

module.exports = {
    //MongoDB info
    db: {
        uri: 'mongodb://localhost/jimminews',
        options: {
            user: '',
            pass: ''
        },
    },

    //App Title
    app: {
        title: 'Jimmi News',
    },

    //Session info
    sessionCookie: {
        // session expiration is set by default to 24 hours
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: false,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    // sessionKey is the cookie session name
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    // Lusca config
    csrf: {
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    },


    //Twitter Credentials
    twitter: {
        clientID: process.env.TWITTER_KEY || 'AloBEOP54stQzLjgu9bk43WPb',
        clientSecret: process.env.TWITTER_SECRET || 's7adCF1qsmjcpf3vO6FMogdvxfqCYg2NQY4Fql3KaMY7DQq3kN',
        callbackURL: '/api/auth/twitter/callback'
    },

    //Google Custom Search Engine API keys
    google: {
        apiKey:'AIzaSyAIBpaEIl-xgZ19lpxK_yMD_GNfU7qnQzI',
        ID:'009652964909322378393:gju2qjkuvdq'
    }
};