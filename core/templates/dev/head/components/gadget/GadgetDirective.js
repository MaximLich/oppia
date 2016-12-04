// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directives for gadgets.
 */

oppia.directive('oppiaGadget', function() {
  return {
    restrict: 'E',
    scope: {
      gadgetCustomizationArgs: '&',
      gadgetName: '&',
      gadgetType: '&',
      showPendingCard: '=',
      setActiveCard: '=',
      setExploration: '='
    },
    templateUrl: 'components/gadget',
    controller: [
      '$scope', '$filter', 'oppiaHtmlEscaper', 'extensionTagAssemblerService',
      function(
          $scope, $filter, oppiaHtmlEscaper, extensionTagAssemblerService) {
        var el = $(
          '<oppia-gadget-' +
          $filter('camelCaseToHyphens')($scope.gadgetType()) + '>');
        el = extensionTagAssemblerService.formatCustomizationArgAttrs(
          el, $scope.gadgetCustomizationArgs());
        el.attr(
          'gadget-name',
          oppiaHtmlEscaper.objToEscapedJson($scope.gadgetName()));
        if ($scope.gadgetName().indexOf('Go to Card') === 0) {
          el.attr('show-pending-card', 'showPendingCard');
          el.attr('set-active-card', 'setActiveCard');
          el.attr('set-exploration', 'setExploration');
        }

        $scope.gadgetHtml = ($('<div>').append(el)).html();
      }
    ]
  };
});
