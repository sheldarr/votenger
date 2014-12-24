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

        function signIn() {
            homeService.signIn(vm.credentials).success(function() {
                window.location = '/dashboard';
            });
        }
    }
})();