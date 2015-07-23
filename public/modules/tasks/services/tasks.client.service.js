'use strict';

//Tasks service used to communicate Tasks REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
  function($resource) {
    return $resource('tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

// Service to monitor the view we are in (Persons or Project)
angular.module('tasks').factory('SwitchViews', function($rootScope) {
  return {
    state: '',
    taskClicked: {
      isClicked : false,
      taskObj: {},
      taskRowData: {},
      delState : false
    }
  };
});

angular.module('tasks').service('Sample', function Sample() {
        return {
            getSampleTimespans: function() {
                return [
                        {
                            from: new Date(2014, 1, 1, 8, 0, 0),
                            to: new Date(2014, 12, 1, 15, 0, 0),
                            name: 'Sprint 1 Timespan'
                        }
                    ];
            }
        };
});

