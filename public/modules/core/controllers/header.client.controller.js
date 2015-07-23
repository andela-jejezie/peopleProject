'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'md5',
	function($scope, Authentication, Menus, md5) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		
		$scope.getGravatarUrl = function() {
			if ($scope.authentication.user.email) {
				$scope.emailHash = md5.createHash($scope.authentication.user.email);
				$scope.gravatarUrl = 'http://www.gravatar.com/avatar/' + $scope.emailHash + '?s=40';
			}
		}

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
