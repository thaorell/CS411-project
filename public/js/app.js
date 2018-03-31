/**
 * This is the main angular app file. project starts from here
 */
var app = angular.module('jimmiNews', ['ui.router', 'MainCtrl', 'WeatherCtrl', 'FavoritesCtrl', 'AuthenticationService']);

// States for the project, i.e. all the possible URLs
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        console.log('We were here');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })

        $urlRouterProvider.otherwise('home');
    }
]);