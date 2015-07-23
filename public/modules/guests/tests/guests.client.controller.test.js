// 'use strict';

// (function() {
// 	// Guests Controller Spec
// 	describe('Guests Controller Tests', function() {
// 		// Initialize global variables
// 		var GuestsController,
// 		scope,
// 		$httpBackend,
// 		$stateParams,
// 		$location;

// 		// The $resource service augments the response object with methods for updating and deleting the resource.
// 		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
// 		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
// 		// When the toEqualData matcher compares two objects, it takes only object properties into
// 		// account and ignores methods.
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

// 		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
// 		// This allows us to inject a service but then attach it to a variable
// 		// with the same name as the service.
// 		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
// 			// Set a new global scope
// 			scope = $rootScope.$new();

// 			// Point global variables to injected services
// 			$stateParams = _$stateParams_;
// 			$httpBackend = _$httpBackend_;
// 			$location = _$location_;

// 			// Initialize the Guests controller.
// 			GuestsController = $controller('GuestsController', {
// 				$scope: scope
// 			});
// 		}));

// 		it('$scope.find() should create an array with at least one Guest object fetched from XHR', inject(function(Guests) {
// 			// Create sample Guest using the Guests service
// 			var sampleGuest = new Guests({
// 				name: 'New Guest'
// 			});

// 			// Create a sample Guests array that includes the new Guest
// 			var sampleGuests = [sampleGuest];

// 			// Set GET response
// 			$httpBackend.expectGET('guests').respond(sampleGuests);

// 			// Run controller functionality
// 			scope.find();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.guests).toEqualData(sampleGuests);
// 		}));

// 		it('$scope.findOne() should create an array with one Guest object fetched from XHR using a guestId URL parameter', inject(function(Guests) {
// 			// Define a sample Guest object
// 			var sampleGuest = new Guests({
// 				name: 'New Guest'
// 			});

// 			// Set the URL parameter
// 			$stateParams.guestId = '525a8422f6d0f87f0e407a33';

// 			// Set GET response
// 			$httpBackend.expectGET(/guests\/([0-9a-fA-F]{24})$/).respond(sampleGuest);

// 			// Run controller functionality
// 			scope.findOne();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.guest).toEqualData(sampleGuest);
// 		}));

// 		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Guests) {
// 			// Create a sample Guest object
// 			var sampleGuestPostData = new Guests({
// 				name: 'New Guest'
// 			});

// 			// Create a sample Guest response
// 			var sampleGuestResponse = new Guests({
// 				_id: '525cf20451979dea2c000001',
// 				name: 'New Guest'
// 			});

// 			// Fixture mock form input values
// 			scope.name = 'New Guest';

// 			// Set POST response
// 			$httpBackend.expectPOST('guests', sampleGuestPostData).respond(sampleGuestResponse);

// 			// Run controller functionality
// 			scope.create();
// 			$httpBackend.flush();

// 			// Test form inputs are reset
// 			expect(scope.name).toEqual('');

// 			// Test URL redirection after the Guest was created
// 			expect($location.path()).toBe('/guests/' + sampleGuestResponse._id);
// 		}));

// 		it('$scope.update() should update a valid Guest', inject(function(Guests) {
// 			// Define a sample Guest put data
// 			var sampleGuestPutData = new Guests({
// 				_id: '525cf20451979dea2c000001',
// 				name: 'New Guest'
// 			});

// 			// Mock Guest in scope
// 			scope.guest = sampleGuestPutData;

// 			// Set PUT response
// 			$httpBackend.expectPUT(/guests\/([0-9a-fA-F]{24})$/).respond();

// 			// Run controller functionality
// 			scope.update();
// 			$httpBackend.flush();

// 			// Test URL location to new object
// 			expect($location.path()).toBe('/guests/' + sampleGuestPutData._id);
// 		}));

// 		it('$scope.remove() should send a DELETE request with a valid guestId and remove the Guest from the scope', inject(function(Guests) {
// 			// Create new Guest object
// 			var sampleGuest = new Guests({
// 				_id: '525a8422f6d0f87f0e407a33'
// 			});

// 			// Create new Guests array and include the Guest
// 			scope.guests = [sampleGuest];

// 			// Set expected DELETE response
// 			$httpBackend.expectDELETE(/guests\/([0-9a-fA-F]{24})$/).respond(204);

// 			// Run controller functionality
// 			scope.remove(sampleGuest);
// 			$httpBackend.flush();

// 			// Test array after successful delete
// 			expect(scope.guests.length).toBe(0);
// 		}));
// 	});
// }());
