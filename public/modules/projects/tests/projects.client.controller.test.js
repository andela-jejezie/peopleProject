// 'use strict';

// (function() {
// 	// Projects Controller Spec
// 	describe('Projects Controller Tests', function() {
// 		// Initialize global variables
// 		var ProjectsController,
// 		scope,
// 		$httpBackend,
// 		$stateParams;

// 		beforeEach(function() {
// 			jasmine.addMatchers({
// 				toEqualData: function(util, customEqualityTesters) {
// 					return {
// 						compare: function(actual, expected) {
// 							return {
// 								pass: angular.equals(actual, expected)
// 							};
// 						}
// 					};
// 				}
// 			});
// 		});

// 		// Then we can start by loading the main application module
// 		beforeEach(module(ApplicationConfiguration.applicationModuleName));
// 		beforeEach(inject(function($controller, $rootScope, _$stateParams_, _$httpBackend_) {
// 			// Set a new global scope
// 			scope = $rootScope.$new();
// 			$httpBackend = _$httpBackend_;
// 			$stateParams = _$stateParams_;
// 			// Initialize the Projects controller.
// 			ProjectsController = $controller('ProjectsController', {
// 				$scope: scope
// 			});
// 		}));

// 		it('$scope.removeProject() should send a DELETE request with a valid projectId and remove the Project from the scope', inject(function(Projects){

// 			var dummyProject = new Projects({
// 				_id: '525a8422f6d0f87f0e407a33',
// 				name: 'Project'
// 			});
// 			scope.projects = [dummyProject];
// 			$httpBackend.expectDELETE(/projects\/([0-9a-fA-F]{24})$/).respond(204);
// 			scope.removeProject(dummyProject);
// 			$httpBackend.flush();
// 			expect(scope.projects.length).toBe(0);
// 		}));
		
// 		it('$scope.addProject() should be able to save a project object without errors' ,inject (function(Projects){
//       var closeProjectPopoverMock = function(){};
// 			scope.project  =  {
//         name :'Project name'
//       };
//       scope.loadData = function(){};
//       var dummyResponse = {
//         _id:'525a8422f6d0f87f0e407a34',
//         name : scope.project.name
//       };
// 			$httpBackend.expectPOST('projects').respond(dummyResponse);

// 			scope.addProject(closeProjectPopoverMock);
// 			$httpBackend.flush();
// 			expect(scope.project).toBe('');
//       expect(scope.msg).toBe('Project name was successfully created');
// 		}));
		
// 	});
// }());
