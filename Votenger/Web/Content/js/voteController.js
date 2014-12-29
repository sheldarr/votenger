(function () {
    'use strict';

    app.controller('voteController', draftController);

    draftController.$inject = ['gameService', 'voteService', 'DTOptionsBuilder'];

    function draftController(gameService, voteService, DTOptionsBuilder) {
        var vm = this;

        vm.voteCompleted = false;

        vm.vote = {
            mustPlayGame: 0,
            mustNotPlayGame: 0,
            threePointsGame: 0,
            twoPointsGame: 0,
            onePointGame: 0
        };

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.setVotingSession = setVotingSession;
        vm.gameSelected = gameSelected;
        vm.saveVote = saveVote;
        
        function setVotingSession(id) {
            vm.vote.votingSessionId = id;
            activate();
        }

        function gameSelected() {
            var voteSelections = [];

            voteSelections.push(vm.vote.mustPlayGame);
            voteSelections.push(vm.vote.mustNotPlayGame);
            voteSelections.push(vm.vote.threePointsGame);
            voteSelections.push(vm.vote.twoPointsGame);
            voteSelections.push(vm.vote.onePointGame);

            var groups = Enumerable.from(voteSelections).groupBy(function(selection) { return selection; }).toArray();
            var nonValidGroups = Enumerable.from(groups)
                .where(function (group) { return group.getSource().length > 1; })
                .select(function (group) { return group.key(); })
                .toArray();

            vm.games.forEach(function(game) {
                game.isValid = true;
                game.isSelected = false;

                if (Enumerable.from(nonValidGroups).any(function (nonValidGroup) { return game.id == nonValidGroup; })) {
                    game.isValid = false;
                };
                
                if (Enumerable.from(voteSelections).any(function (voteSelection) { return game.id == voteSelection; })) {
                    game.isSelected = true;
                };
            });

            vm.voteCompleted = (nonValidGroups.length == 0) && !Enumerable.from(voteSelections).any(function(voteSelection) { return voteSelection == 0; });
        }

        function saveVote() {
            voteService.saveVote(vm.vote).success(function () {
                window.location = "/dashboard";
            });
        }

        function activate() {
            gameService.getGamesForVote(vm.vote.votingSessionId).then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.isSelected = false;
                    game.isValid = true;
                });
            });
        }
    }
})();