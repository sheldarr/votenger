(function() {
    'use strict';

    app.controller('homeController', homeController);

    homeController.$inject = ['userService'];

    function homeController(userService) {
        var vm = this;

        vm.user = {
            isAuthorized: false,
            nickname: ""
        };

        vm.credentials = {
            nickname: "",
            password: ""
        };

        vm.signIn = signIn;
        vm.start = start;

        activate();

        function signIn() {
            if (vm.credentials.login == "" || vm.credentials.password == "") {
                return;
            }

            userService.signIn(vm.credentials).success(function () {
                window.location.reload();
            });
        }

        function start() {
            window.location = '/dashboard';
        }

        function activate() {
            userService.isAuthorized().success(function (isAuthorized) {
                vm.user.isAuthorized = isAuthorized;
            });
            userService.getNicksname().success(function (nickname) {
                vm.user.nickname = nickname;
            });
        }
    }
})();