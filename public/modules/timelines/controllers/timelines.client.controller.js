'use strict';

// TImelines controller
angular.module('timelines').controller('TimelinesController', ['$scope', '$timeout', 'Authentication', 'Timelines',
  function($scope, $timeout, Authentication, Timelines) {
    $scope.authentication = Authentication;
    // $scope.notify = true;

    // Create new Timeline
    $scope.createTimeline = function(closePopover) {
      var timeline = new Timelines ($scope.timeline);
      timeline.$save(function(response) {
        $scope.timeline = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Timeline
    $scope.removeTimeline = function(timeline) {
      if ( timeline ) { 
        timeline.$remove();
        for (var i in $scope.timelines) {
          if ($scope.timelines [i] === timeline) {
            $scope.timelines.splice(i, 1);
          }
        }
      } else {
        $scope.timelines.$remove(function() {
        });
      }
    };

    /**
     * Flash Notification
     */
    $scope.$on('response', function(event, notification) {
      $scope.notify = true;
      $timeout(function() {
        $scope.notify = false;
        $scope.responseMsg = true;
        $scope.msg = notification;
        $('.response').css('opacity', 0);
      }, 1000);
      $scope.msg = '';
    });

    // Find a list of Guests
    $scope.findTimelines = function() {
      $scope.timelines = Timelines.query();
    };

    // Update existing Timeline
    $scope.updateTimeline = function(timelineInfo) {
      var timeline = timelineInfo;
      timeline.$update(function() {
      timeline.$remove();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
