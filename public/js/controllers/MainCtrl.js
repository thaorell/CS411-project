/**
 * This is the main Angular Controller, which is for the home page controller
 */
angular.module('MainCtrl', []).controller('MainController', function($scope, $window, $http, Authentication) {
    $scope.loggedIn = false;
    $scope.tagline = 'Best News Service!';

    //Clicked on Twitter Logged In
    $scope.callOauthProvider = function(url) {
        console.log('Twitter ' + url);
        // Effectively call OAuth authentication route:
        $window.location.href = url;

    };

    /**
     * Watch on Authentication Service, when user logs out from other page, this page needs to change 
     * UI
     */
    $scope.$watch(function() {
        return Authentication.loggedIn;
    }, function() {
        $scope.loggedIn = Authentication.loggedIn;
    });


    /**
     * Check if user is logged in
     */
    $scope.checkAuthentication = function() {
        Authentication.checkIfLoggedIn().then(function(response) {
            Authentication.loggedIn = true;
            $scope.loggedIn = Authentication.loggedIn;

            console.log(response);
            $scope.loadNewsIfLoggedIn();
            $scope.loadWeather();
        }, function(err) {
            Authentication.loggedIn = false;
            $scope.loggedIn = Authentication.loggedIn;
            console.log('Not Logged In' + JSON.stringify(err));
        });
    };
    $scope.checkAuthentication();

    $scope.news = [];

    /**
     * Call Weather API
     */
    $scope.loadWeather = function() {
        $http.get('/api/weather').then(function(response) {
            console.log(response);
            $scope.weather = response.data;

            console.log($scope.weather);
        }, function(err) {
            console.log('error to load weather ' + JSON.stringify(err));
        });
    };
    $scope.loadWeather();

    /**
     * Loads the news Listing using $http service
     */
    $scope.loadNewsIfLoggedIn = function() {
        if ($scope.loggedIn) {
            $http.get('/api/news').then(function(response) {
                console.log(response);
                $scope.news = response.data.response.results;

                console.log($scope.news);
            }, function(err) {
                console.log('error to load news ' + JSON.stringify(err));
            });
        }
    };

    //Like 
    function addToUserLiked(story) {
        console.log('addToUserLiked');
        if ($scope.loggedIn) {
            $http.post(
                '/api/news',
                story
            ).then(function(response) {
                console.log(response);
            }, function(err) {
                console.log('error addToUserLiked ' + JSON.stringify(err));
            });

        } else {
            console.log('User not logged in');
        }
    }

    //Unlike
    function removeFromUserLiked(story) {
        console.log('removeFromUserLiked');
        console.log(story.id);
        if ($scope.loggedIn) {
            $http({
                    url: '/api/news',
                    method: 'DELETE',
                    data: {
                        id: story.id
                    },
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then(function(response) {
                    console.log(response);
                }, function(err) {
                    console.log('error removeFromUserLiked ' + JSON.stringify(err));
                });
        } else {
            console.log('User not logged in');
        }
    }

    //Click on heart icon on the UI,like/unlike
    //Like -- Gray Heart to Red Heart
    //Unlike -- Red Heart to Gray Heart
    $scope.likeSwitch = function(index) {
        var likedItem = $scope.news[index];
        $scope.news[index].like = !$scope.news[index].like;
        if ($scope.news[index].like) {
            console.log('user has clicked like');
            addToUserLiked($scope.news[index]);
        } else {
            console.log('user has clicked unlike');
            removeFromUserLiked($scope.news[index]);
        }
    };
});