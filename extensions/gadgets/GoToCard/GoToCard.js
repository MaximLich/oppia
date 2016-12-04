// Copyright 2016 Maxim Puzanov. All Rights Reserved.

oppia.directive('oppiaGadgetGoToCard', [
  'oppiaHtmlEscaper', 'cardDeckServices', 'playerTranscriptService',
  'oppiaPlayerService', 'ExplorationPlayerStateService',
  function(oppiaHtmlEscaper, cardDeckServices, playerTranscriptService,
  oppiaPlayerService, ExplorationPlayerStateService) {
    return {
      restrict: 'E',
      scope: {
        showPendingCard: '=',
        setActiveCard: '=',
        setExploration: '='
      },
      templateUrl: 'gadget/GoToCard',
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        $scope.buttonText = oppiaHtmlEscaper.escapedJsonToObj(
          $attrs.buttonTextWithValue);
        $scope.stateName = oppiaHtmlEscaper.escapedJsonToObj(
          $attrs.stateNameWithValue);
        $scope.explorationId = oppiaHtmlEscaper.escapedJsonToObj(
          $attrs.explorationIdWithValue);

        $scope.goToCard = function(explorationId, stateName) {
          cardDeckServices.pullCard(explorationId, stateName, function(data) {
            playerTranscriptService.setDestination(data.newStateName);
            ExplorationPlayerStateService.setExploration(data.exploration);
            oppiaPlayerService.setExploration(data.exploration);
            $scope.setExploration(data.exploration);
            $scope.setActiveCard({
              stateName: data.newStateName,
              currentParams: data.newParams,
              contentHtml: data.newContentHtml,
              interactionHtml: null,
              answerFeedbackPairs: [],
              destStateName: null
            });
            $scope.showPendingCard(
              data.newStateName, data.newParams, data.newContentHtml);
          });
        };
      }]
    };
  }
]);
