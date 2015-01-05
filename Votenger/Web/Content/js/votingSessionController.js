(function () {
    'use strict';

    app.controller('votingSessionController', votingSessionController);

    votingSessionController.$inject = ['VotingSessionTypes', 'votingSessionService'];

    function votingSessionController(votingSessionTypes, votingSessionService) {
        var vm = this;
        vm.votingSessionTypes = votingSessionTypes;
        vm.votingSession = {
            numberOfPlayers: 1,
            gamesPerPlayer: 3,
            type: 0
        };

        vm.createVotingSession = createVotingSession;
        vm.goBack = goBack;

        function createVotingSession() {
            votingSessionService.createVotingSession(vm.votingSession).success(function() {
                window.location = "/dashboard";
            });
        }

        function goBack() {
            window.location = "/dashboard";
        }
    }
})();