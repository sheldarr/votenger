(function () {
    'use strict';

    app.service('votingSessionService', votingSessionService);

    votingSessionService.$inject = ['$http'];

    function votingSessionService($http) {
        var service = this;
        service.getAllVotingSessions = getAllVotingSessions;
        service.getVotingSessionTypes = getVotingSessionTypes;
        service.completeDraft = completeDraft;
        service.completeVote = completeVote;

        function getAllVotingSessions() {
            return $http.get('/api/votingSessions');
        }

        function getVotingSessionTypes() {
            return $http.get('/api/votingSession/types');
        }

        function completeDraft(id) {
            return $http.get('/draft/complete/' + id);
        }

        function completeVote(id) {
            return $http.get('/vote/complete/' + id);
        }
    }
})();
