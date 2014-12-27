
    'use strict';

    var app = angular.module('votengerApp', ['datatables']);

    app.constant('VotingSessionStatus', {
        Draft: 'Draft',
        Vote: 'Vote',
        Completed: 'Completed'
    });

    app.constant('VotingSessionTypes', [
    {
        label: 'Computer',
        value: 0
    },
    {
        label: 'Board',
        value: 1
    }]);
