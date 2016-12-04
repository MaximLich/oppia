// Copyright 2016 Maxim Puzanov. All Rights Reserved.

oppia.factory('cardDeckServices', [
  '$http', 'LearnerParamsService', 'explorationContextService',
  'playerTranscriptService', 'ExplorationObjectFactory',
  'expressionInterpolationService',
  function(
      $http, LearnerParamsService, explorationContextService,
      playerTranscriptService, ExplorationObjectFactory,
      expressionInterpolationService) {
    var _explorationId = explorationContextService.getExplorationId();

    var exploration = null;
    var explorationMother = null;
    var version = GLOBALS.explorationVersion;
    var explorationDataUrl = (
      '/explorehandler/init/' + _explorationId +
      (version ? '?v=' + version : ''));
    $http.get(explorationDataUrl).then(function(response) {
      var data = response.data;
      explorationMother = ExplorationObjectFactory.create(data.exploration);
    });

    // Evaluate parameters. Returns null if any evaluation fails.
    var makeParams = function(oldParams, paramChanges, envs) {
      var newParams = angular.copy(oldParams);
      if (paramChanges.every(function(pc) {
        if (pc.generator_id === 'Copier') {
          if (!pc.customization_args.parse_with_jinja) {
            newParams[pc.name] = pc.customization_args.value;
          } else {
            var paramValue = expressionInterpolationService.processUnicode(
              pc.customization_args.value, [newParams].concat(envs));
            if (paramValue === null) {
              return false;
            }
            newParams[pc.name] = paramValue;
          }
        } else {
          // RandomSelector.
          newParams[pc.name] = randomFromArray(
            pc.customization_args.list_of_values);
        }
        return true;
      })) {
        // All parameters were evaluated successfully.
        return newParams;
      }
      // Evaluation of some parameter failed.
      return null;
    };

    // Evaluate question string.
    var makeQuestion = function(newState, envs) {
      return expressionInterpolationService.processHtml(
        newState.content[0].value, envs);
    };

    return {
      pullCard: function(explorationId, stateName, successCallback) {
        version = (explorationId === _explorationId) && version;
        explorationId = explorationId || _explorationId;

        var explorationDataUrl = (
          '/explorehandler/init/' + explorationId +
          (version ? '?v=' + version : ''));
        $http.get(explorationDataUrl).then(function(response) {
          var data = response.data;
          exploration = ExplorationObjectFactory.create(data.exploration);

          var newStateName = stateName;
          var newState = exploration.getState(newStateName);

          var oldParams = LearnerParamsService.getAllParams();
          var newParams = (newState ? makeParams(oldParams,
            newState.paramChanges, [oldParams]) : oldParams);

          var newContentHtml = makeQuestion(newState, [newParams, {
            answer: 'answer'
          }]);

          successCallback({
            newStateName: newStateName,
            newParams: newParams,
            newContentHtml: newContentHtml,
            newState: newState,
            exploration: exploration
          });
        });
      }
    };
  }
]);
