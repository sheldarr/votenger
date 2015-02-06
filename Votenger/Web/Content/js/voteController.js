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
        vm.voteObjectSelected = voteObjectSelected;
        vm.saveVote = saveVote;

        activate();

        function goBack() {
            window.location = '/dashboard';
        }

        function voteObjectSelected() {
            var voteCompleted = true;

            vm.games.forEach(function (voteObject) {
                voteObject.isPremiumSelected = vm.threePluses == voteObject.id || vm.twoPluses == voteObject.id || vm.onePlus == voteObject.id || vm.threeMinuses == voteObject.id;
                voteObject.isBasicSelected = voteObject.basic != 0;

                voteObject.isValid = checkIfPremiumVoteObjectIsSelectedOnlyOnce(voteObject) && (voteObject.isPremiumSelected || voteObject.isBasicSelected);

                voteCompleted = voteCompleted && voteObject.isValid;
            });

            vm.voteCompleted = voteCompleted;
        }

        function getPremiumVoteObjects() {
            var premiumVoteObjects = [];

            premiumVoteObjects.push(vm.threePluses);
            premiumVoteObjects.push(vm.twoPluses);
            premiumVoteObjects.push(vm.onePlus);
            premiumVoteObjects.push(vm.threeMinuses);

            return premiumVoteObjects;
        }

        function checkIfPremiumVoteObjectIsSelectedOnlyOnce(voteObject) {
            var premiumVoteObjects = getPremiumVoteObjects();

            var numberOfPremiumSelections = Enumerable.from(premiumVoteObjects).count(function (premiumVoteObject) { return premiumVoteObject == voteObject.id; });

            return numberOfPremiumSelections == 1;
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