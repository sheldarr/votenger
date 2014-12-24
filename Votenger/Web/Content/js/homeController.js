(function() {
    'use strict';

    app.controller('homeController', homeController);

    homeController.$inject = ['homeService'];

    function homeController(homeService) {
        var vm = this;

        vm.credentials = {
            nickname: ""
        };

        vm.signIn = signIn;

        activate();

        function activate() {
            alert('activated!');
        }

        //$scope.init = function (id) {
        //    messageService.getMessage(id).then(function (message) {
        //        $scope.message = message.data;
        //        $scope.showMode = true;
        //    });
        //};

        function signIn() {
            homeService.signIn(vm.credentials).success(function() {
                window.location = '/dashboard';
            });
        }
    }
})();