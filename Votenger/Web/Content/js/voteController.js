(function () {
    'use strict';

    app.controller('voteController', draftController);

    draftController.$inject = ['gameService', 'voteService', 'DTOptionsBuilder'];

    function draftController(gameService, voteService, DTOptionsBuilder) {
        var vm = this;

        vm.voteCompleted = false;

        vm.threePluses = 0;
        vm.twoPluses = 0;
        vm.onePlus = 0;
        vm.threeMinuses = 0;

        vm.scores = {
            threePluses: 5,
            twoPluses: 3,
            onePlus: 2,
            threeMinuses: -5,
            oneUp: 1,
            oneDown: -1
        };

        vm.results = {
            votingSessionId: 0,
            gameScores: []
        };  

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withBootstrap();

        vm.goBack = goBack;
        vm.gameSelected = gameSelected;
        vm.saveVote = saveVote;

        activate();

        function goBack() {
            window.location = '/dashboard';
        }

        function gameSelected() {
            var premiumGames = [];
            premiumGames.push(vm.threePluses);
            premiumGames.push(vm.twoPluses);
            premiumGames.push(vm.onePlus);
            premiumGames.push(vm.threeMinuses);

            var voteCompleted = true;

            vm.games.forEach(function (game) {
                var numberOfSelectedPremiumGames = Enumerable.from(premiumGames).count(function (premiumGame) { return premiumGame == game.id; });

                game.isValid = numberOfSelectedPremiumGames == 1;

                game.isPremiumSelected = vm.threePluses == game.id || vm.twoPluses == game.id || vm.onePlus == game.id || vm.threeMinuses == game.id;
                voteCompleted = voteCompleted && (game.isPremiumSelected || game.basic != 0);
            });

            vm.voteCompleted = voteCompleted;
        }

        function saveVote() {
            vm.games.forEach(function (game) {
                var points = game.isPremiumSelected ? game.premium : game.basic;

                var score = {
                    id: game.id,
                    points: points
                };

                vm.results.push(score);
            });

            //voteService.saveVote(vm.vote).success(function () {
            //    window.location = "/dashboard";
            //});
        }

        function activate() {
            vm.results.votingSessionId = getPathnameParameter();

            gameService.getGamesForVote(vm.results.votingSessionId).then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.isPremiumSelected = false;
                    game.isValid = true;
                    game.premium = 0;
                    game.basic = 0;
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