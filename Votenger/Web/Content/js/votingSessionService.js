(function () {
    'use strict';

    app.service('votingSessionService', votingSessionService);

    votingSessionService.$inject = ['$http'];

    function votingSessionService($http) {
        var service = this;
        service.getAllVotingSessions = getAllVotingSessions;

        function getAllVotingSessions() {
            return $http.get('/api/votingSessions');
        }
    }
})();
