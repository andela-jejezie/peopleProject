'use strict';

(function() {
  // Tasks Controller Spec
  describe('Tasks Controller Tests', function() {
    // Initialize global variables
    var TasksController,
    scope,
    $httpBackend,
    $stateParams,
    $location;

    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Tasks controller.
      TasksController = $controller('TasksController', {
        $scope: scope
      });
    }));

    it('Should be able to add tasks irrespective of the view', inject(function(Tasks) {
      var data = {
        personId : '525a8422f6d0f87f0e407a33',
        projectId : '525a8422f6d0f87f0e407a34',
        startDate:'2014-03-11',
        endDate : '2014-03-19',
        cohort: {
          name: 'ClassII',
          color: '#ff53ff'
        },
        infoData:{
          row:{
            addTask: function(){
              var pos = {
                updatePosAndSize: function(){},
                row: {
                  updateVisibleTasks: function(){}
                }                
              };
              return pos;
            }
          }
        }
      };

      var newTask = {
        personId : data.personId,
        projectId : data.projectId,
        startDate:data.startDate,
        endDate : data.endDate,
        cohort: data.cohort
      };

      var uiItemMock = data.infoData.row.addTask();
      uiItemMock.updatePosAndSize();
      uiItemMock.row.updateVisibleTasks();

      var dummyResponse ={
        _id: '525a8422f6d0f87f0e407a45',
        from: newTask.startDate,
        to: newTask.endDate,
        cohort: {
          name: 'Class III',
          color: '#ff33bb'
        }
      };
      scope.drawTaskHandler = function() {
      };

      $httpBackend.expectPOST('tasks').respond(200, dummyResponse);
      scope.createTask(data);
      $httpBackend.flush();
    }));

    it('$scope.updateTask() should update tasks irrespective of views', inject(function(Tasks) {
      var data= {
          task: {
            id :'525a8422f6d0f87f0e407a45',
            from : '2014-10-25',
            to: '2014-11-25'
          },
          model: {
            id: '525a8422f6d0f87f0e407a45'
          },
          row: {
            tasks: [],
            model: {

            }
          }
      };

      var dummyTaskResponse = new Tasks({
        _id: data.task.id,
        startDate: data.task.from,
        endDate: data.task.to
      });

      $httpBackend.expectGET('tasks/525a8422f6d0f87f0e407a45').respond(200,dummyTaskResponse);

      $httpBackend.expectPUT('tasks/525a8422f6d0f87f0e407a45').respond(200,dummyTaskResponse);
      
      // debugger
      scope.updateTask({},data);
      $httpBackend.flush();
    }));

    it('$scope.getTaskData should get task data', inject(function(Persons, Projects) {
      var activeData = new Persons({
        _id: '525a8422f6d0f87f0e407a80',
        name: 'Person name',
        isActive: true,
        tasks: []
      });

      var activeDataArray = [activeData];
      scope.loadData = function(){};

      $httpBackend.expectGET('persons?isActive=true').respond(200, activeDataArray);
      scope.getTaskData();
      $httpBackend.flush();
    }));

    it('Should get the list of inactive set of data ',inject(function(Projects, Persons){

      var dummyPerson = new Persons({
        _id: '525a8422f6d0f87f0e407a80',
        name: 'Person Name',
        isActive: false
      });

      var dummyPersons = [dummyPerson];
      $httpBackend.expectGET('persons?isActive=false').respond(200, dummyPersons);
      $httpBackend.expectGET('/modules/core/views/view_inactive.client.view.html').respond(200);
      scope.viewInactive();
      $httpBackend.flush();
    }));

    it('getRowDetails() should get data details of a row', inject(function(Persons){
      var data = {
          row: {
            id: '525a8422f6d0f87f0e807a80'
          },
          model: {
            id: '525a8422f6d0f87f0e807a80'
          }
      };
      var dummyPerson = {
        _id: '525a8422f6d0f87f0e407a80',
        name: 'Person Name'
      };
      scope.triggerUpdateModal = function(){};
      $httpBackend.expectGET('persons/525a8422f6d0f87f0e807a80').respond(200,dummyPerson);
      scope.getRowDetails(data);
      $httpBackend.flush();
      expect(scope.detail).toEqualData(dummyPerson);
    }));

    it('updateRowLabel() should update row with current data irrespective of views', inject(function(Persons, Projects){
      scope.globalRowData = {
        data : {
          model : {
            name :'project name'
          }
        }
      };
      var data = new Projects({
                _id : '525a8422f6d0f87f0e807a80',
                name : 'project name',
                skill : ['skill1','skill2']
              });
      var responseData = {
              _id : '525a8422f6d0f87f0e807a80',
              name :'new project name',
              skill:['skill3','skill24']
            };
      
      // $httpBackend.expectGET('projects/525a8422f6d0f87f0e807a80').respond(200,data);
      $httpBackend.expectPUT('projects/525a8422f6d0f87f0e807a80').respond(200, responseData);
      scope.labelDetailUpdate(data);
      $httpBackend.flush();
      expect(scope.globalRowData.data.model.name).toBe(responseData.name);
    }));

    it('scope.deactivateRow() should remove data from a row  using the Id successfully',inject(function(Persons,Projects){
      scope.removeData = function() {
        _id : '25a8422f6d0f87f0e807a80'
      };
      scope.rowData =new Persons({
        _id :'25a8422f6d0f87f0e807a80',
        isActive:true
      });
      var responseData = {
        _id:'25a8422f6d0f87f0e807a80',
        isActive : false
      };
      // $scope.api.data
      scope.api =  {
        data: {
        }
      };
      scope.api.data.remove = function(){};

      // $httpBackend.expectGET('persons/25a8422f6d0f87f0e807a80').respond(data);
      $httpBackend.expectPUT('persons/25a8422f6d0f87f0e807a80').respond(responseData);
      scope.deactivateRow(scope.rowData);
      $httpBackend.flush();
      expect(scope.rowData.isActive).toBe(responseData.isActive);
    }));

    it('scope.activateRow() should reactivate data using data Id successfully',inject(function(Persons,Projects){
      scope.getTaskData = function(){};

      scope.label = new Persons({
        _id : '25a8422f6d0f87f0e807a80',
        name: 'Person Name',
        isActive:false
      });

      var dummyLabelResponse = {
        _id: scope.label._id,
        name: scope.label.name,
        isActive: true
      };

      var data = {
        _id : '25a8422f6d0f87f0e807a80',
        isActive:false
      };
      scope.api= {
        side: {}
      };
      scope.api.side.setWidth = function(){};

      $httpBackend.expectGET('persons/25a8422f6d0f87f0e807a80').respond(scope.label);
      $httpBackend.expectPUT('persons/25a8422f6d0f87f0e807a80').respond(dummyLabelResponse);
      scope.activateData(data);
      $httpBackend.flush();
      expect(scope.lbl.isActive).toBe(dummyLabelResponse.isActive);
    }));

  });
}());
