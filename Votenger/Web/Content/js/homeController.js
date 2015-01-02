(function() {
    'use strict';

    app.controller('homeController', homeController);

    homeController.$inject = ['homeService'];

    function homeController(homeService) {
        var vm = this;

        vm.credentials = {
            nickname: "",
            password: ""
        };

        vm.signIn = signIn;
        vm.start = start;

        function signIn() {
            if (vm.credentials.login == "" || vm.credentials.password == "") {
                return;
            }

            homeService.signIn(vm.credentials).success(function() {
                window.location.reload();
            });
        }

        function start() {
            window.location = '/dashboard';
        }
    }
})();