(function () {
    'use strict';

    app.service('voteObjectService', voteObjectService);

    voteObjectService.$inject = ['$http'];

    function voteObjectService($http) {
        var service = this;
        service.getVoteObjectsForDraft = getVoteObjectsForDraft;
        service.getVoteObjectsForVote = getVoteObjectsForVote;

        function getVoteObjectsForDraft(id) {
            return $http.get('/api/voteObjectsForDraft/' + id);
        }

        function getVoteObjectsForVote(id) {
            return $http.get('/api/voteObjectsForVote/' + id);
        }
    }
})();
