'use strict';

// Persons controller
angular.module('persons').controller('PersonsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', 'Authentication', '$modal', 'Persons', 'Skills', 'SwitchViews',
  function($http, $scope, $stateParams, $location, $timeout, Authentication, $modal, Persons, Skills, SwitchViews) {
    $scope.authentication = Authentication;
    $scope.groupOptions = ['Developer', 'Ghost', 'Ninja'];
    $scope.locationOptions = ['New York', 'Lagos', 'Others'];

    $scope.person = {};
    $scope.skillTags = [];

    $scope.findSkills = function() {
      $scope.skills = Skills.query(function(res){
        if (res.length === 0) {
          $scope.skillTags = ['AngularJS','JavaScript', 'NodeJs'];          
          for (var i = 0; i< $scope.skillTags.length; i++) {
            var skill = new Skills($scope.skill);
            skill.skills = $scope.skillTags[i];
            skill.$save();
          }
        }
        else {
          res.forEach(function(data){
            $scope.skillTags.push(data.skills[0]);
          });
        }
      });
    };


    // Create new Person
    $scope.addPerson = function(closePersonPopover) {
      closePersonPopover();
      for (var i =0; i<= $scope.person.skill.length -1; i++) {
        if ($scope.skillTags.indexOf($scope.person.skill[i]) === -1) {
          var skill = new Skills($scope.skill);
          skill.skills = $scope.person.skill[i];
          skill.$save();
        }
      }

      var person = new Persons($scope.person);

      person.$save(function(response) {
        $scope.person = {};
        $scope.msg = response.name + ' was successfully created';
        console.log('response: ', response);
        $scope.$emit('response', $scope.msg);
        if (SwitchViews.state !== 'Project') {
          var newPerson = [{
            id: response._id,
            name: response.name,
            tasks: []
          }];
          $scope.load();
        }
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
        $scope.msg = errorResponse.data.message;
        $scope.$emit('errorMsg', $scope.msg);
      });
      $scope.skillTags=[];
      $scope.findSkills();
    };

    // Remove existing Person
    $scope.removePerson = function(person) {
      if (person) {
        person.$remove();
        for (var i in $scope.persons) {
          if ($scope.persons[i] === person) {
            $scope.persons.splice(i, 1);
          }
        }
      } else {
        $scope.person.$remove(function() {});
      }
    };
  }
]);
