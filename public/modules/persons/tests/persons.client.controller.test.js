// 'use strict';

// (function() {
//   // Persons Controller Spec
//   describe('Persons Controller Tests', function() {
//     // Initialize global variables
//     var PersonsController,
//       scope,
//       $httpBackend,
//       $stateParams,
//       $location;
//     var closePersonPopoverMock = function(){};


//     beforeEach(function() {
//       jasmine.addMatchers({
//         toEqualData: function(util, customEqualityTesters) {
//           return {
//             compare: function(actual, expected) {
//               return {
//                 pass: angular.equals(actual, expected)
//               };
//             }
//           };
//         }
//       });
//     });

//     // Then we can start by loading the main application module
//     beforeEach(module(ApplicationConfiguration.applicationModuleName));
//     // beforeEach(module('nsPopover'));

//     beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
//       // Set a new global scope
//       scope = $rootScope.$new();

//       // Point global variables to injected services
//       $stateParams = _$stateParams_;
//       $httpBackend = _$httpBackend_;
//       $location = _$location_;

//       // Initialize the Persons controller.
//       PersonsController = $controller('PersonsController', {
//         $scope: scope
//       });

//       scope.load = function() {
//       };
//     }));

//     afterEach(function() {
//       $httpBackend.verifyNoOutstandingExpectation();
//       $httpBackend.verifyNoOutstandingRequest();
//     });

//     it ('should find all skills', function(){
//       $httpBackend.expectGET('skills').respond([{skills: ['AngularJs']}, {skills: ['MongoDB']}, {skills: ['NodeJs']}]);
//       scope.findSkills(); 
//       $httpBackend.flush();
//       //verify findSkills added the skills to scope
//       expect(scope.skillTags).toEqual(['AngularJs', 'MongoDB', 'NodeJs']);
//     });

//     it ('should add new tags to skill tags array', function(){
//       scope.person = {
//         name: 'Person name',
//         email: 'person@person.com',
//         skill: ['AngularJs', 'MongoDB', 'SQL']     
//       };
//       scope.skillResponse = {
//         id: '32yr89eyujbkd',
//         skills: ['SQL']
//       };
//       scope.skillTags = ['AngularJs', 'MongoDB', 'NodeJS'];
//       $httpBackend.expectPOST('skills').respond(200, scope.skillResponse );
//       $httpBackend.expectPOST('persons').respond(200, scope.person);
//       $httpBackend.expectGET('skills').respond([{skills: ['AngularJs']}, {skills: ['MongoDB']}, {skills: ['NodeJS']}, {skills: ['SQL']}]);   
//       scope.addPerson(closePersonPopoverMock);
//       $httpBackend.flush(); 
//       expect(scope.skillTags).toEqual(['AngularJs', 'MongoDB', 'NodeJS', 'SQL']);
//     });


    


//     // it(' should be able to remove a person ', inject(function(Persons){
//     //   var dummyPerson = new Persons({
//     //     _id:'54802195db8b8495c1687ede',
//     //     name : 'person',
//     //     email : 'test@test.com'
//     //   });

//     //   scope.persons = [dummyPerson];
//     //   $httpBackend.expectDELETE('persons/54802195db8b8495c1687ede').respond(204);

//     //   scope.removePerson(dummyPerson);
//     //   $httpBackend.flush();
//     //   expect(scope.persons.length).toBe(0);
//     // }));

//     // it('Should be able add a person', inject(function(Persons) {
//     //   var closePersonPopoverMock = function(){};
//     //   scope.person = {
//     //     name: 'Person name',
//     //     email: 'person@person.com'        
//     //   };
//     //   scope.loadData = function(){};

//     //   var dummyResponse = {
//     //     _id: '54802195db8b8495c1687ede',
//     //     name: scope.person.name,
//     //     email: scope.person.email,
//     //     tasks: []         
//     //   };
//     //   $httpBackend.expectPOST('persons').respond(200, dummyResponse);

//     //   scope.addPerson(closePersonPopoverMock);
//     //   $httpBackend.flush();
//     //   expect(scope.msg).toBe('Person name was successfully created');
//     // }));

//   });
// }());

