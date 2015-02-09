(function() {
    'use strict';

    app.controller('authorizationController', authorizationController);

    authorizationController.$inject = ['userService'];

    function authorizationController(userService) {
        var vm = this;

        vm.logout = logout;

        vm.user = {
            isAuthorized: false,
            nickname: ""
        };

        activate();

        function logout() {
            userService.logout();
            window.location = '/';
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