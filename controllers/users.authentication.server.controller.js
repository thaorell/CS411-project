'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
    '/authentication/signin',
    '/authentication/signup'
];

/**
 * Checks if user is logged in with current request,
 * it is used as protector middleware for other APIs in the project
 */
exports.isAuthenticated = function(req, res, next) {
    if (req.user) {
        console.log('Authenticated');
        next();
    } else {
        return res.status(403).json({
            message: 'Unauthorized Request'
        });
    }
};

/**
 * Returns the user object when client asks if user is logged and session is running.
 */
exports.checkIfLoggedIn = function(req, res) {
    return res.json({
        message: 'Authenticated',
        user: req.user
    })
};

/**
 * Removes the session and logs out the user
 */
exports.logout = function(req, res) {
    req.logout();
    res.json({
        message: 'Success'
    });
};
/**
 * OAuth provider call (twitter)
 */
exports.oauthCall = function(strategy, scope) {
    console.log('here i am in twitter');
    return function(req, res, next) {
        console.log('called');
        if (req.query && req.query.redirect_to)
            req.session.redirect_to = req.query.redirect_to;

        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * Just for testing , not used in project
 */
exports.oauthTwitterCall = function(req, res, next) {
    console.log('called');
    if (req.query && req.query.redirect_to)
        req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate('Twitter', undefined)(req, res, next);
};


/**
 * OAuth callback, called when twitter returns the control to our app,
 * saves the details and logs in the user
 */
exports.oauthCallback = function(strategy) {
    return function(req, res, next) {

        // info.redirect_to contains inteded redirect path
        passport.authenticate(strategy, function(err, user, info) {
            if (err) {
                console.log('error ' + err);
                console.log(JSON.stringify(err));
                return res.redirect('/?err=' + encodeURIComponent('Oauth Error'));
            }
            if (!user) {
                return res.redirect('/');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/');
                }

                return res.redirect(info.redirect_to || '/');
            });
        })(req, res, next);
    };
};


/**
 * Helper function to save or update a OAuth user profile (fetches information from Twitter)
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    // Setup info and user objects
    var info = {};
    var user;

    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
        info.redirect_to = req.session.redirect_to;
    }

    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
        $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    // Find existing user with this provider account
    User.findOne(searchQuery, function(err, existingUser) {
        if (err) {
            return done(err);
        }

        if (!req.user) {
            if (!existingUser) {
                var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                    user = new User({
                        firstName: providerUserProfile.firstName,
                        lastName: providerUserProfile.lastName,
                        token: providerUserProfile.token,
                        tokenSecret: providerUserProfile.tokenSecret,
                        username: availableUsername,
                        displayName: providerUserProfile.displayName,
                        profileImageURL: providerUserProfile.profileImageURL,
                        provider: providerUserProfile.provider,
                        providerData: providerUserProfile.providerData
                    });

                    // Email intentionally added later to allow defaults (sparse settings) to be applid.
                    // Handles case where no email is supplied.
                    // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
                    user.email = providerUserProfile.email;

                    // And save the user
                    user.save(function(err) {
                        return done(err, user, info);
                    });
                });
            } else {
                return done(err, existingUser, info);
            }
        } else {
            // User is already logged in, join the provider data to the existing user
            user = req.user;

            user.tokenSecret = providerUserProfile.tokenSecret;
            user.token = providerUserProfile.token;

            // Check if an existing user was found for this provider account
            if (existingUser) {
                if (user.id !== existingUser.id) {
                    return done(new Error('Account is already connected to another user'), user, info);
                }
                console.log('Already linked');
                return done(null, user, info);
            }

            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }

            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function(err) {
                return done(err, user, info);
            });
        }
    });
};