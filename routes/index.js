/**
 * This file contains all the routes for the project, all the apis with urls are defined here,
 * controllers are loaded as modules and functions are called with each of the API.
 */
var express = require('express');
var router = express.Router();
//users controller
var users = require('../controllers/user.controller');

//news and favorites controller
var newsController = require('../controllers/news.controller');

//weather and locations controller
var weatherController = require('../controllers/weather.controller');


/* GET home page. */
router.get('/', function(req, res, next) {
    //serves the angular homepage
    res.sendfile('./public/index.html');
});

// Setting the twitter oauth route
router.get('/api/auth/twitter', users.oauthCall('twitter'));

//This is a callback method which gets automatically called up after Twitter returns control to our app
router.get('/api/auth/twitter/callback', users.oauthCallback('twitter'));

/**
 * This is helper API to check if user is authenticated with server or not
 */
router.get('/api/auth/check', users.isAuthenticated, users.checkIfLoggedIn);

/**
 * Clears the express session and logs out user 
 */
router.get('/api/auth/logout', users.isAuthenticated, users.logout);

//News Routes are here
/**
 * Gets all the news if user is authenticated
 */
router.get('/api/news', users.isAuthenticated, newsController.getAllNews);

/**
 * Gets favorite / liked stories for the current logged in user
 */
router.get('/api/news/favorites', users.isAuthenticated, newsController.getFavorites);

/**
 *  When user clicks on like, this API is called to save that story into account of the user.
 */
router.post('/api/news', users.isAuthenticated, newsController.saveNewsItem);

/**
 *  When user unlikes the story which he liked earlier, it is removed from the account using this
 *  API.
 */
router.delete('/api/news', users.isAuthenticated, newsController.deleteNewsItem);


//Weather and Location Routes are here
/**
 * Gets the weather, it loads the weather of primary location of the user, but if user is not logged in
 * then it loads the weather of Boston MA
 */
router.get('/api/weather', weatherController.getWeather);

/**
 *  Returns list of all the locations which are saved by the user
 */
router.get('/api/location', users.isAuthenticated, weatherController.listLocationByUser);

/**
 *  Creates and saves the new location into the database using the parameters specified.
 */
router.post('/api/location', users.isAuthenticated, weatherController.saveLocation);

/**
 *  Searches the location according to the search text provided
 */
router.post('/api/location/search', users.isAuthenticated, weatherController.searchLocation);

/**
 *  Edits the details of the location which is already present in the system.
 */
router.put('/api/location', users.isAuthenticated, weatherController.editLocation);

/**
 * Gets the weather of a particular location saved by the user. It works with down thumb button in the UI
 */
router.get('/api/location/weather/:locationId', users.isAuthenticated, weatherController.getWeatherForLocation);

/**
 * Deletes a location from the account ,which was saved earlier by the user
 */
router.delete('/api/location/:locationId', users.isAuthenticated, weatherController.deleteLocation);

/**
 *  Saves a given location as primary location of the current logged in user,
 * when user selects the location as primary, its weather will be shown on the homescreen of the 
 * user when he logs in to the system.
 */
router.put('/api/user/primary/:locationId', users.isAuthenticated, weatherController.markLocationAsPrimary);

//Export the router.
module.exports = router;