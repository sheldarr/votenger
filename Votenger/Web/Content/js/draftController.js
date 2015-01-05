(function () {
    'use strict';

    app.controller('draftController', draftController);

    draftController.$inject = ['gameService', 'draftService', 'DTOptionsBuilder'];

    function draftController(gameService, draftService, DTOptionsBuilder) {
        var vm = this;

        vm.gamesLeft = 3;
        vm.draftCompleted = false;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.gameSelected = gameSelected;
        vm.saveDraft = saveDraft;

        activate();

        function gameSelected() {
            var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
            vm.gamesLeft = 3 - selectedGames.length;

            vm.draftCompleted = selectedGames.length >= 3;
        }

        function saveDraft() {
            var draft = {
                votingSessionId: vm.votingSessionId,
                selectedGames: []
            };

            var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
            selectedGames.forEach(function (game) {
                draft.selectedGames.push(game.id);
            });

            draftService.saveDraft(draft).success(function() {
                window.location = "/dashboard";
            });
        }

        function activate() {
            vm.votingSessionId = getPathnameParameter();

            gameService.getAllComputerGames().then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.selected = false;
                });
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