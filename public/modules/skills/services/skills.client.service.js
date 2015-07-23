'use strict';

//Guests service used to communicate Guests REST endpoints
angular.module('skills').factory('Skills', ['$resource',
	function($resource) {
		return $resource('skills/:skillId', { skillId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);