
    'use strict';

    var app = angular.module('votengerApp', ['datatables']);

    app.constant('VotingSessionStatus', {
        Draft: 'Draft',
        Vote: 'Vote',
        Completed: 'Completed'
    });
