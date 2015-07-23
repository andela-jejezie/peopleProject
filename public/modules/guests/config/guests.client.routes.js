'use strict';

//Setting up route
angular.module('guests').config(['$stateProvider',
  function($stateProvider) {
    // guests state routing
    $stateProvider.
    state('guest-signup', {
      url: '/guest/:guestID',
      templateUrl: 'modules/users/views/authentication/guest-signup.client.view.html'
    });
  }
]);