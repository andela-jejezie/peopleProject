'use strict';

//Guests service used to communicate Guests REST endpoints
angular.module('timelines').factory('Timelines', ['$resource',
  function($resource) {
    return $resource('timelines/:timelineId', { timelineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
