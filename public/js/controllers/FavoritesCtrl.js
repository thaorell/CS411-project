angular.module('FavoritesCtrl', []).controller('FavoritesController', function($scope, Authentication, $state, $http) {
    $scope.loggedIn = false;
    /**
     * Controller for Favorite News Page
     */


    //Checks if user is logged in, otherwise send him to home page
    $scope.checkAuthentication = function() {
        Authentication.checkIfLoggedIn().then(function(response) {
            $scope.loggedIn = true;
            console.log(response);
            Authentication.loggedIn = true;
            $scope.loadFavoriteNewsIfLoggedIn();

        }, function(err) {
            $scope.loggedIn = false;
            Authentication.loggedIn = false;
            //not logged in, send to home
            $state.go('home');
            console.log('Not Logged In' + JSON.stringify(err));
        });
    };
    $scope.checkAuthentication();

    //Click handler for logout button
    $scope.logout = function() {
        Authentication.logout().then(function(response) {
            $scope.loggedIn = false;
            console.log(response);
            Authentication.loggedIn = false;
            //go to home and log in again
            $state.go('home');

        }, function(err) {

            console.log('Not Logged In' + JSON.stringify(err));
        });
    };

    $scope.tagline = 'These are my favorites!';

    /**
     * Load favorite stories of logged in user
     */
    $scope.loadFavoriteNewsIfLoggedIn = function() {
        if ($scope.loggedIn) {
            $http.get('/api/news/favorites').then(function(response) {
                console.log(response);
                $scope.news = response.data;

                console.log($scope.news);
            }, function(err) {
                console.log('error to load news ' + JSON.stringify(err));
            });
        }
    };

    //like 
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

    //unlike
    function removeFromUserLiked(story) {
        console.log('removeFromUserLiked');
        console.log(story.id);
        if ($scope.loggedIn) {
            // $http.delete(
            //     '/api/news', { id: story.id }
            // ).then(function(response) {
            //     console.log(response);
            // }, function(err) {
            //     console.log('error removeFromUserLiked ' + JSON.stringify(err));
            // });
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
        var likedItem = $scope.news[index].content;
        $scope.news[index].content.like = !$scope.news[index].content.like;
        if ($scope.news[index].content.like) {
            console.log('user has clicked like');
            addToUserLiked($scope.news[index].content);
        } else {
            console.log('user has clicked unlike');
            removeFromUserLiked($scope.news[index].content);
        }
    };

});