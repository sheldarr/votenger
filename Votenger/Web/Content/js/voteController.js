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

        vm.voteResults = {
            votingSessionId: 0,
            threePlusesVoteObject: 0,
            twoPlusesVoteObject: 0,
            onePlusVoteObject: 0,
            threeMinusesVoteObject: 0,
            basicScores: []
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

                voteObject.isSelected = voteObject.isPremiumSelected || voteObject.isBasicSelected;
                voteObject.isValid = checkIfPremiumVoteObjectIsSelectedOnlyOnce(voteObject)
                    || voteObject.isBasicSelected;

                voteCompleted = voteCompleted && voteObject.isValid;
            });

            vm.voteCompleted = voteCompleted;
        }

        function checkIfPremiumVoteObjectIsSelectedOnlyOnce(voteObject) {
            var premiumVoteObjects = getPremiumVoteObjects();

            var numberOfPremiumSelections = Enumerable.from(premiumVoteObjects).count(function (premiumVoteObject) { return premiumVoteObject == voteObject.id; });

            return numberOfPremiumSelections == 1;
        }

        function getPremiumVoteObjects() {
            var premiumVoteObjects = [];

            premiumVoteObjects.push(vm.threePluses);
            premiumVoteObjects.push(vm.twoPluses);
            premiumVoteObjects.push(vm.onePlus);
            premiumVoteObjects.push(vm.threeMinuses);

            return premiumVoteObjects;
        }

        function saveVote() {

            vm.voteResults.threePlusesVoteObject = vm.threePluses;
            vm.voteResults.twoPlusesVoteObject = vm.twoPluses,
            vm.voteResults.onePlusVoteObject = vm.onePlus;
            vm.voteResults.threeMinusesVoteObject = vm.threeMinuses;
            
            vm.games.forEach(function (voteObject) {
                if (voteObject.isBasicSelected) {
                    var points = voteObject.basic;

                    var basicScore = {
                        voteObjectId: voteObject.id,
                        points: points
                    };

                    vm.voteResults.basicScores.push(basicScore);
                } 
            });

            voteService.saveVote(vm.voteResults).success(function () {
                window.location = "/dashboard";
            });
        }

        function activate() {
            vm.voteResults.votingSessionId = getPathnameParameter();

            gameService.getGamesForVote(vm.voteResults.votingSessionId).then(function (games) {
                vm.games = games.data;
                vm.games.forEach(function (game) {
                    game.isPremiumSelected = false;
                    game.isValid = true;
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