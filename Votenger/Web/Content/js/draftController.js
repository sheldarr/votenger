(function () {
    'use strict';

    app.controller('draftController', draftController);

    draftController.$inject = ['gameService', 'draftService', 'DTOptionsBuilder'];

    function draftController(gameService, draftService, DTOptionsBuilder) {
        var vm = this;

        vm.gamesLeft = 0;
        vm.draftCompleted = false;

        vm.draftOptions = {};

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.goBack = goBack;
        vm.gameSelected = gameSelected;
        vm.saveDraft = saveDraft;

        activate();

        function goBack() {
            window.location = "/dashboard";
        }

        function gameSelected() {
            var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
            vm.gamesLeft = vm.draftOptions.gamesPerPlayer - selectedGames.length;

            vm.draftCompleted = selectedGames.length >= vm.draftOptions.gamesPerPlayer;
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

            draftService.getDraftOptions(vm.votingSessionId).then(function (options) {
                vm.draftOptions = options.data;
                vm.gamesLeft = vm.draftOptions.gamesPerPlayer;
            });

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