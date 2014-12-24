(function() {
    'use strict';

    app.service('homeService', homeService);

    homeService.$inject = ['$http'];

    function homeService($http) {
        var service = this;
        service.signIn = signIn;

        function signIn(credentials) {
            return $http.post('/signIn', credentials);
        }
    }
})();
