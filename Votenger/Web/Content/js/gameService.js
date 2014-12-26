(function () {
    'use strict';

    app.service('gameService', gameService);

    gameService.$inject = ['$http'];

    function gameService($http) {
        var service = this;
        service.getAllComputerGames = getAllComputerGames;

        function getAllComputerGames() {
            return $http.get('/api/computerGames');
        }
    }
})();
