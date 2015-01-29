(function () {
    'use strict';

    app.controller('votingSessionController', votingSessionController);

    votingSessionController.$inject = ['$scope', 'votingSessionService'];

    function votingSessionController($scope, votingSessionService) {
        var vm = this;

        vm.formSubmitted = false;
        vm.votingSessionCategories = [];

        vm.votingSession = {
            numberOfVotengers: 1,
            draftsPerVotenger: 3,
            category: ""
        };

        vm.createVotingSession = createVotingSession;
        vm.goBack = goBack;

        activate();

        function activate() {
            votingSessionService.getAllVotingCategories().success(function(categories) {
                vm.votingSessionCategories = categories;
            });
        }

        function createVotingSession() {
            vm.formSubmitted = true;

            if ($scope.createSessionForm.$invalid){
                return false; 
            }

            votingSessionService.createVotingSession(vm.votingSession).success(function() {
                window.location = "/dashboard";
            });

            return true;
        }

        function goBack() {
            window.location = "/dashboard";
        }
    }
})();