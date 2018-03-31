/**
 * This file sets up express server and initialize all the middleware required for server.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var lusca = require('lusca');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('./mongoose');
var config = require('./config/config');


//Initialize Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Loads mongoose models from other file.
mongoose.loadModels();

module.exports.init = function init(callback) {
    mongoose.connect(function(db) {
        // Initialize express
        console.log('mongoose connected');
        //var app = express.init(db);
        if (callback) callback(app, db, config);

    });
};

module.exports.start = function start(callback) {
    var _this = this;

    _this.init(function(app, db, config) {
        //initializes routes for the project
        var routes = require('./routes/index');

        //cookie based session configuration using express-session
        app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: config.sessionSecret,
            cookie: {
                maxAge: config.sessionCookie.maxAge, //Every variable loads from config as suggested
                httpOnly: config.sessionCookie.httpOnly,
                secure: config.sessionCookie.secure && config.secure.ssl
            },
            name: config.sessionKey,
            store: new MongoStore({
                mongooseConnection: db.connection,
                collection: config.sessionCollection
            })
        }));


        // Add Lusca CSRF Middleware for CORS
        app.use(lusca(config.csrf));

        //Runs the users config to get the Passport strategy ( Twitter Strategy for authentication)
        require('./config/users.config')(app, db);
        //sets up all the routes
        app.use('/', routes);
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });


        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // Start the app by listening on <port> at <host>
        app.listen(3000, '0.0.0.0', function() {

            if (callback) callback(app, db, config);
        });

    });

};
module.exports = app;