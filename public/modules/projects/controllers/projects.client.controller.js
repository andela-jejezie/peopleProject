'use strict';
angular.module('projects').controller('ProjectsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', 'Authentication', '$modal', 'Projects', 'Tasks', 'SwitchViews',
  function($http, $scope, $stateParams, $location, $timeout, Authentication, $modal, Projects, Tasks, SwitchViews) {
    $scope.authentication = Authentication;
    
    // Create new Project
    $scope.addProject = function(closeProjectPopover) {
      closeProjectPopover();
      var project = new Projects($scope.project);
      project.$save(function(response) {
        $scope.project = '';
        $scope.msg = response.name+ ' was successfully created';
        $scope.$emit('response', $scope.msg); 
        if (SwitchViews.state !== 'Person') {
          var newProject = {
            id: response._id,
            name: response.name,
            tasks: []
          };
          $scope.load();
        }
      }, function(errorResponse) {
        $scope.error = errorResponse.config.data.message;
        if (errorResponse.config.data.name) {
          $scope.msg = errorResponse.config.data.name + ' already exist!';
          $scope.$emit('errorMsg',$scope.msg);     
        }
        else {
          $scope.msg = 'Enter a project name';
          $scope.$emit('errorMsg',$scope.msg);  
        }
      });
    };
    // Remove existing Project
    $scope.removeProject = function(project) {
      if (project) {
        project.$remove();
        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
          $scope.project.$remove(function() {});
      }
    };
  }
]);
