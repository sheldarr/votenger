(function () {
    'use strict';

    app.controller('votingSessionController', votingSessionController);

    votingSessionController.$inject = ['VotingSessionTypes', 'votingSessionService'];

    function votingSessionController(votingSessionTypes, votingSessionService) {
        var vm = this;
        vm.votingSessionTypes = votingSessionTypes;
        vm.votingSession = {};

        vm.createVotingSession = createVotingSession;

        activate();

        function createVotingSession() {
            votingSessionService.createVotingSession(vm.votingSession).success(function() {
                window.location = "/dashboard";
            })
        }

        function activate() {
        }
    }
})();