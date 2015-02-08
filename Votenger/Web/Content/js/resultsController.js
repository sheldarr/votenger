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

        vm.goBack = goBack;

        activate();

        function goBack() {
            window.location = '/dashboard';
        }

        function activate() {
            vm.votingSessionId = getPathnameParameter();

            votingSessionService.getVoteResults(vm.votingSessionId).then(function (results) {
                vm.results = results.data.voteObjectsSummary;
            });
        }
        
        function getPathnameParameter() {
            var pathname = window.location.pathname;
            var pathnameParameterPattern = /\d+$/;
            var pathnameParameter = pathnameParameterPattern.exec(pathname);

            return pathnameParameter[0];
        }
    }
})();