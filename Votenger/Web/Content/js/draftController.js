(function () {
    'use strict';

    app.controller('draftController', draftController);

    draftController.$inject = ['gameService', 'draftService', 'DTOptionsBuilder'];

    function draftController(gameService, draftService, DTOptionsBuilder) {
        var vm = this;

        vm.gamesLeft = 10;
        vm.draftCompleted = false;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.setVotingSession = setVotingSession;
        vm.gameSelected = gameSelected;
        vm.saveDraft = saveDraft;

        activate();

        function setVotingSession(id) {
            vm.votingSessionId = id;
        }

        function gameSelected() {
            var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
            vm.gamesLeft = 10 - selectedGames.length;

            vm.draftCompleted = selectedGames.length >= 10;
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
            gameService.getAllComputerGames().then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.selected = false;
                });
            });
        }
    }
})();