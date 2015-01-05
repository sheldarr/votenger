(function () {
    'use strict';

    app.service('draftService', draftService);

    draftService.$inject = ['$http'];

    function draftService($http) {
        var service = this;
        service.saveDraft = saveDraft;

        function saveDraft(draft) {
            return $http.post('/api/session/draft/save', draft);
        }
    }
})();
