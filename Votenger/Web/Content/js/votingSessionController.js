(function () {
    'use strict';

    app.controller('votingSessionController', votingSessionController);

    votingSessionController.$inject = ['votingSessionService'];

    function votingSessionController(votingSessionService) {
        var vm = this;

        activate();

        function activate() {
            votingSessionService.getVotingSessionTypes().then(function (votingSessionTypes) {
                vm.votingSessionTypes = votingSessionTypes.data;
            });
        }
    }
})();