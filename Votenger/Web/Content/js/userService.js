(function() {
    'use strict';

    app.service('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        var service = this;

        service.isAuthorized = isAuthorized;
        service.getNicksname = getNickname;
        service.signIn = signIn;
        service.logout = logout;

        function isAuthorized() {
            return $http.get('/api/user/isAuthorized');
        }

        function getNickname() {
            return $http.get('/api/user/nickname');
        }

        function signIn(credentials) {
            return $http.post('/api/user/signIn', credentials);
        }

        function logout() {
            document.cookie = 'VoteAuth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
})();
