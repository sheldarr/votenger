(function () {
    'use strict';

    app.controller('draftController', draftController);

    draftController.$inject = ['voteObjectService', 'draftService', 'DTOptionsBuilder'];

    function draftController(voteObjectService, draftService, DTOptionsBuilder) {
        var vm = this;

        vm.voteObjectsLeft = 0;
        vm.draftCompleted = false;

        vm.draftOptions = {};

        vm.dtOptions = DTOptionsBuilder
            .newOptions()
            .withOption('order', [5, 'desc'])
            .withBootstrap();

        vm.goBack = goBack;
        vm.voteObjectSelected = voteObjectSelected;
        vm.saveDraft = saveDraft;

        activate();

        function goBack() {
            window.location = "/dashboard";
        }

        function voteObjectSelected() {
            var selectedVoteObjects = Enumerable.from(vm.voteObjects).where(function (voteObject) { return voteObject.selected; }).toArray();
            vm.voteObjectsLeft = vm.draftOptions.draftsPerVotenger - selectedVoteObjects.length;

            vm.draftCompleted = selectedVoteObjects.length >= vm.draftOptions.draftsPerVotenger;
        }

        function saveDraft() {
            var draft = {
                votingSessionId: vm.votingSessionId,
                selectedVoteObjects: []
            };

            var selectedVoteObjects = Enumerable.from(vm.voteObjects).where(function (voteObject) { return voteObject.selected; }).toArray();
            selectedVoteObjects.forEach(function (voteObject) {
                draft.selectedVoteObjects.push(voteObject.id);
            });

            draftService.saveDraft(draft).success(function() {
                window.location = "/dashboard";
            });
        }

        function activate() {
            vm.votingSessionId = getPathnameParameter();

            draftService.getDraftOptions(vm.votingSessionId).then(function (options) {
                vm.draftOptions = options.data;
                vm.voteObjectsLeft = vm.draftOptions.draftsPerVotenger;
            });

            voteObjectService.getVoteObjectsForDraft(vm.votingSessionId).then(function (voteObjects) {
                vm.voteObjects = voteObjects.data;
                vm.voteObjects.forEach(function (voteObject) {
                    voteObject.selected = false;
                });
            });
        }

        function getPathnameParameter() {
            var pathname = window.location.pathname;
            var pathnameParameterPattern = /\d+$/;
            var pathnameParameter = pathnameParameterPattern.exec(pathname);

            return pathnameParameter[0];
        }
    }
})();