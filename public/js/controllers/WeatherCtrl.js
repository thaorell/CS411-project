/**
 * Angular Controller for Weather and Location Page
 */
angular.module('WeatherCtrl', []).controller('WeatherController', function($scope, Authentication, $state, $http) {
    $scope.locations = [];
    $scope.loggedIn = false;

    //Check if user logged in, otherwise send him to home page for twitter auth
    $scope.checkAuthentication = function() {
        Authentication.checkIfLoggedIn().then(function(response) {
            $scope.loggedIn = true;
            Authentication.loggedIn = true;

            console.log(response);
            //User is logged in so we can load locations and show
            $scope.getLocations();
        }, function(err) {
            $scope.loggedIn = false;
            Authentication.loggedIn = false;

            $state.go('home');
            console.log('Not Logged In' + JSON.stringify(err));
        });
    };
    $scope.checkAuthentication();

    $scope.tagline = 'Add Location';

    //Save the new Location or save edited location
    $scope.saveLocation = function(location) {
        console.log("Save Location " + JSON.stringify(location));
        if (location._id) {
            //edit
            $http.put(
                '/api/location',
                location
            ).then(function(response) {
                console.log(response);
                $scope.location = {};
            }, function(err) {
                console.log('error saveLocation ' + JSON.stringify(err));
            });

        } else {
            //create
            $http.post(
                '/api/location',
                location
            ).then(function(response) {
                console.log(response);
                $scope.location = {};
                $scope.locations.push(response.data.data);
            }, function(err) {
                console.log('error saveLocation ' + JSON.stringify(err));
            });

        }
    };

    //Click on Edit Location, orange button
    //Load it for editing
    $scope.editLocation = function(location, $index) {
        $scope.location = location;
        console.log('location for edit');
        console.log(location);
    };

    //Load all locations from database
    $scope.getLocations = function() {
        if ($scope.loggedIn) {
            $http.get('/api/location').then(function(response) {
                console.log(response);
                $scope.locations = response.data.locations;

                console.log($scope.locations);
            }, function(err) {
                console.log('error to load locations ' + JSON.stringify(err));
            });
        }
    };


    //Delete an existing location, red button
    $scope.deleteLocation = function(location, $index) {
        var con = confirm("Do you want to delete " + location.fullName + " ?");
        if (con) {
            $http.delete('/api/location/' + location._id).then(function(response) {
                console.log(response);
                $scope.locations.splice($index, 1);
            }, function(err) {
                console.log('error to delete locations ' + JSON.stringify(err));
            });
        } else {
            // Do Nothing
        }
    };

    /**
     * When down thumb button is clicked, this function loads weather for given location
     */
    $scope.getWeatherByLocation = function(location, $index) {
        $http.get('/api/location/weather/' + location._id).then(function(response) {
            console.log(response);
            location.weather = response.data;
            console.log(location);
            console.log($scope.locations[$index].weather);
        }, function(err) {
            console.log('error to load locations ' + JSON.stringify(err));
        });
    };

    /**
     * Change primary location for logged in user, up -thumb
     */
    $scope.savePrimaryLocation = function(location, $index) {
        $http.put('/api/user/primary/' + location._id).then(function(response) {
            console.log(response);

        }, function(err) {
            console.log('error to update primary locations ' + JSON.stringify(err));
        });
    };
});