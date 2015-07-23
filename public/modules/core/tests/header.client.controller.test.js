// 'use strict';

(function() {
	describe('HeaderController', function() {
		// Initialize global variables
		var scope,
			HeaderController;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			HeaderController = $controller('HeaderController', {
				$scope: scope
			});
		}));

		it('should create the correct gravatarUrl based on the User', function(){
			var correctGravatarUrl = 'http://www.gravatar.com/avatar/7d7b81a687274bd4eaec52547cca476b?s=40'
			// - Create a dummy user
			scope.authentication = {
				user: {
					email: 'tolulope.awoyemi@andela.co',
					name: 'Tolu'
				}
			};
			// create the gravatar URL
			scope.getGravatarUrl();
			// verify Url created by matching with the md5 hash of the dummy user
			expect(scope.gravatarUrl).toEqual(correctGravatarUrl);
		});

		it('should toggle', function(){
			scope.isCollapsed = true;
			scope.toggleCollapsibleMenu();
			expect(scope.isCollapsed).toBe(false);
		});
	});
})();
