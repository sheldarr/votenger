(function () {
    'use strict';

    app.service('voteService', voteService);

    voteService.$inject = ['$http'];

    function voteService($http) {
        var service = this;
        service.saveVote = saveVote;

        function saveVote(vote) {
            return $http.post('/api/session/vote/save', vote);
        }
    }
})();
