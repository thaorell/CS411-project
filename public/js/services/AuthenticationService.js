angular.module('AuthenticationService', []).service('Authentication', ['$http', function($http) {
    /**
     * This is for authentication purposes, to check if user is logged in, to logout etc.
     * This service is used for communication accross all the controllers
     */
    this.loggedIn = false;
    this.user = undefined;
    // call to check if logged in
    this.checkIfLoggedIn = function() {
        return $http.get('/api/auth/check');
    };

    //call logout
    this.logout = function() {
        return $http.get('/api/auth/logout');
    }

}]);