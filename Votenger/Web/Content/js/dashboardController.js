(function () {
    'use strict';

    app.controller('dashboardController', dashboardController);

    dashboardController.$inject = ['votingSessionService', 'DTOptionsBuilder'];

    function dashboardController(votingSessionService, DTOptionsBuilder) {
        var vm = this;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        activate();

        function activate() {
            votingSessionService.getAllVotingSessions().then(function (votingSessions) {
                vm.votingSessions = votingSessions.data;
            });
        }
    }
})();