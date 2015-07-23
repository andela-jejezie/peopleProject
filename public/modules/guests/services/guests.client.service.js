'use strict';

//Guests service used to communicate Guests REST endpoints
angular.module('guests').factory('Guests', ['$resource',
	function($resource) {
		return $resource('guests/:guestId', { guestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);