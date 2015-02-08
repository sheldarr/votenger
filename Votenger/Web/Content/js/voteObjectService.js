(function () {
    'use strict';

    app.service('voteObjectService', voteObjectService);

    voteObjectService.$inject = ['$http'];

    function voteObjectService($http) {
        var service = this;
        service.getAllVoteObjects = getAllVoteObjects;
        service.getVoteObjectsForVote = getVoteObjectsForVote;

        function getAllVoteObjects() {
            return $http.get('/api/voteObjects');
        }

        function getVoteObjectsForVote(id) {
            return $http.get('/api/voteObjectsForVote/' + id);
        }
    }
})();
