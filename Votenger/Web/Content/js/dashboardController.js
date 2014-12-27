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
        vm.createSession = createSession;
        vm.completeDraft = completeDraft;
        vm.completeVote = completeVote;

        activate();

        function draft(id) {
            window.location = '/draft/' + id;
        }

        function createSession() {
            window.location = '/session/';
        }

        function completeDraft(id) {
            votingSessionService.completeDraft(id).success(function() {
                activate();
            });
        }

        function completeVote(id) {
            votingSessionService.completeVote(id).success(function () {
                activate();
            });
        }

        function activate() {
            votingSessionService.getAllVotingSessions().then(function (votingSessions) {
                vm.votingSessions = votingSessions.data;
            });
        }
    }
})();