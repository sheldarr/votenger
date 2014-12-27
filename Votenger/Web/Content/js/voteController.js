(function () {
    'use strict';

    app.controller('voteController', draftController);

    draftController.$inject = ['gameService', 'voteService', 'DTOptionsBuilder'];

    function draftController(gameService, voteService, DTOptionsBuilder) {
        var vm = this;

        vm.voteCompleted = false;

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.setVotingSession = setVotingSession;
        //vm.gameSelected = gameSelected;
        //vm.saveDraft = saveDraft;
        
        function setVotingSession(id) {
            vm.votingSessionId = id;
            activate();
        }

        //function gameSelected() {
        //    var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
        //    vm.gamesLeft = 10 - selectedGames.length;

        //    vm.draftCompleted = selectedGames.length >= 10;
        //}

        //function saveDraft() {
        //    var draft = {
        //        votingSessionId: vm.votingSessionId,
        //        selectedGames: []
        //    };

        //    var selectedGames = Enumerable.from(vm.games).where(function (game) { return game.selected; }).toArray();
        //    selectedGames.forEach(function (game) {
        //        draft.selectedGames.push(game.id);
        //    });

        //    draftService.saveDraft(draft).success(function () {
        //        window.location = "/dashboard";
        //    });
        //}

        function activate() {
            gameService.getGamesForVote(vm.votingSessionId).then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.mustPlay = false;
                    game.mustNotPlay = false;
                    game.threePoints = false;
                    game.twoPoints = false;
                    game.onePoint = false;
                });
            });
        }
    }
})();