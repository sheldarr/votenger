(function () {
    'use strict';

    app.service('votingSessionService', votingSessionService);

    votingSessionService.$inject = ['$http'];

    function votingSessionService($http) {
        var service = this;
        service.getAllVotingSessions = getAllVotingSessions;
        service.getVoteResults = getVoteResults;
        service.createVotingSession = createVotingSession;
        service.completeDraft = completeDraft;
        service.completeVote = completeVote;

        function getAllVotingSessions() {
            return $http.get('/api/votingSessions');
        }

        function getVoteResults(id) {
            return $http.get('/api/voteResults/' + id);
        }

        function createVotingSession(votingSession) {
            return $http.post('/api/session/create', votingSession);
        }

        function completeDraft(id) {
            return $http.get('/api/session/draft/complete/' + id);
        }

        function completeVote(id) {
            return $http.get('/api/session/vote/complete/' + id);
        }
    }
})();
