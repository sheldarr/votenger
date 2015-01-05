(function() {
    'use strict';

    app.service('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        var service = this;

        service.isAuthorized = isAuthorized;
        service.getNicksname = getNickname;
        service.signIn = signIn;

        function isAuthorized() {
            return $http.get('/api/user/isAuthorized');
        }

        function getNickname() {
            return $http.get('/api/user/nickname');
        }

        function signIn(credentials) {
            return $http.post('/api/user/signIn', credentials);
        }
    }
})();
