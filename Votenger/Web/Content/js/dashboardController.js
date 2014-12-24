(function () {
    'use strict';

    app.controller('dashboardController', dashboardController);

    dashboardController.$inject = ['votingSessionService'];

    function dashboardController(votingSessionService) {
        var vm = this;

        activate();

        function activate() {
            votingSessionService.getAllVotingSessions().then(function (votingSessions) {
                vm.votingSessions = votingSessions.data;
            });
        }
    }
})();