(function () {
    'use strict';

    app.controller('dashboardController', dashboardController);

    dashboardController.$inject = ['VotingSessionStatus', 'votingSessionService', 'DTOptionsBuilder'];

    function dashboardController(VotingSessionStatus, votingSessionService, DTOptionsBuilder) {
        var vm = this;

        vm.VotingSessionStatus = VotingSessionStatus;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.draft = draft;

        activate();

        function draft(id) {
            window.location = '/draft/' + id;
        }

        function activate() {
            votingSessionService.getAllVotingSessions().then(function (votingSessions) {
                vm.votingSessions = votingSessions.data;
            });
        }
    }
})();