(function () {
    'use strict';

    app.service('votingSessionService', votingSessionService);

    votingSessionService.$inject = ['$http'];

    function votingSessionService($http) {
        var service = this;
        service.getAllVotingSessions = getAllVotingSessions;
        service.createVotingSession = createVotingSession;
        service.completeDraft = completeDraft;
        service.completeVote = completeVote;

        function getAllVotingSessions() {
            return $http.get('/api/votingSessions');
        }

        function createVotingSession(votingSession) {
            return $http.post('/session/create', votingSession);
        }

        function completeDraft(id) {
            return $http.get('/draft/complete/' + id);
        }

        function completeVote(id) {
            return $http.get('/vote/complete/' + id);
        }
    }
})();
