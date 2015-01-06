(function () {
    'use strict';

    app.service('draftService', draftService);

    draftService.$inject = ['$http'];

    function draftService($http) {
        var service = this;

        service.getDraftOptions = getDraftOptions;
        service.saveDraft = saveDraft;

        function getDraftOptions(id) {
            return $http.get('/api/session/options/' + id);
        }

        function saveDraft(draft) {
            return $http.post('/api/session/draft/save', draft);
        }
    }
})();
