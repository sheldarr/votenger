(function () {
    'use strict';

    app.service('gameService', gameService);

    gameService.$inject = ['$http'];

    function gameService($http) {
        var service = this;
        service.getAllComputerGames = getAllComputerGames;
        service.getGamesForVote = getGamesForVote;

        function getAllComputerGames() {
            return $http.get('/api/computerGames');
        }

        function getGamesForVote(id) {
            return $http.get('/api/gamesForVote/' + id);
        }
    }
})();
