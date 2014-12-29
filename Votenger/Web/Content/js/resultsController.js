(function () {
    'use strict';

    app.controller('resultsController', resultsController);

    resultsController.$inject = ['votingSessionService', 'DTOptionsBuilder'];

    function resultsController(votingSessionService, DTOptionsBuilder) {
        var vm = this;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('order', [2, 'desc'])
            .withBootstrap();

        vm.setVotingSession = setVotingSession;
        
        function setVotingSession(id) {
            vm.votingSessionId = id;
            activate();
        }

        function activate() {
            votingSessionService.getVoteResults(vm.votingSessionId).then(function (results) {
                vm.results = results.data.gamesSummary;
            });
        }
    }
})();