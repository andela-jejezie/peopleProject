'use strict';

//Persons service used to communicate Persons REST endpoints
angular.module('persons').factory('Persons', ['$resource',
	function($resource) {
		return $resource('persons/:personId', { personId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Skilltree API service used to communicate with the endpoint
angular.module('tasks').factory('Skilltree', ['$resource',
  function($resource) {
    return $resource('pullSkilltree',  {
      update: {
        method: 'PUT'
      }
    });
  }
]);
