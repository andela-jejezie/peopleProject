'use strict';

// Tasks controller
angular.module('tasks')
  .controller('TasksController', ['$http', '$scope', '$stateParams', '$location', '$timeout', 'Authentication', '$log', 'Sample', 'moment', '$modal', 'Persons', 'Projects', 'Tasks', 'SwitchViews',
    'GanttObjectModel', 'ganttDebounce', 'ganttUtils', 'ganttMouseOffset', 'Skilltree',
    function($http, $scope, $stateParams, $location, $timeout, Authentication, $log, Sample, moment, $modal, Persons, Projects, Tasks, SwitchViews, ObjectModel, debounce, utils, mouseOffset, Skilltree) {

      // Global Variables
      $scope.groupOptions = ['Maintenance', 'Installation', 'Electrical'];
      $scope.locationOptions = ['Location 1', 'Location 2', 'Location 3', 'Others'];
      $scope.authentication = Authentication;
      $scope.assignTask = {};
      $scope.globalRowData = {};
      var objectModel, dataToRemove;
      var assignment = {};
      var autoView = {
        resource: Persons,
        param: {
          personId: null
        },
        paramKey: 'personId'
      };
      SwitchViews.state = 'Person';
      $scope.dataView = SwitchViews.state;
      $scope.msg = '';
      $scope.notify = true;


      /**
       * Task Functions
       */
      // Creating a new Assignment/Task
      $scope.createTask = function(data) {
        var newTask = {
          personId: data.personId,
          projectId: data.projectId,
          startDate: data.startDate,
          endDate: data.endDate,
          group: data.group,
          cohort: data.cohort
        };
        var task = new Tasks(newTask);
        task.$save(function(response) {
          var taskParam = {
            id: response._id,
            from: new Date(response.startDate),
            to: new Date(response.endDate),
          };          
          taskParam.group = response.group;
          taskParam.color = task.cohort.color;

          if (SwitchViews.state === 'Person') {
            taskParam.name = response.projectName;
          } else {
            taskParam.name = response.personName;
          }

          $scope.drawTaskHandler(taskParam);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.delUpTask = function (assignment, data){
        var tskParam = SwitchViews.taskClicked.taskObj.tasks[0].id;
        var task = Tasks.get({
          taskId: tskParam
        });        
        switch (SwitchViews.state) {
          case 'Person':
            task.projectId = assignment.projectId;
            task.projectName = assignment.projectName;
            break;
          case 'Project':
            task.personId = assignment.personId;
            task.personName = assignment.personName;
            task.group = assignment.group;
            task.cohort = assignment.cohort;
            break;
        }
        task._id = tskParam;
        task.$update(function() {
          SwitchViews.taskClicked.isClicked = false;
          SwitchViews.taskClicked.taskRowData.model.name = data.name;
          var taskParam = {};
          taskParam.color = task.cohort.color;
          SwitchViews.taskClicked.taskRowData.model.color = task.cohort.color;
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        // $scope.getTaskData();
      };

      // Updating Tasks
      $scope.updateTask = function(event, data) {
        var task = Tasks.get({
          taskId: data.model.id
        });
        task._id = data.model.id;
        task.startDate = moment(data.model.from).format();
        task.endDate = moment(data.model.to).format();
        task.$update(function() {
          $scope.checkOverlapping(data.row);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Function to Populate Calender with Data
      $scope.getTaskData = function() {
        $scope.data = [];
        $scope.dbData = autoView.resource.query({
            isActive: true
          },
          function() {
            $scope.dbData.forEach(function(assign) {
              var $label = {};
              var displayName = assign.name;
              $label.tasks = [];
              $label.id = assign._id;
              $label.name = displayName;
              $label.group = assign.group;
              $label.cohort = assign.cohort;

              assign.tasks.forEach(function(task) {
                var $task = {};
                $task.id = task._id;
                $task.from = moment(task.startDate);
                $task.to = moment(task.endDate);
                //if the task has a cohort color, use it
                if (task.cohort) {
                  $task.color = task.cohort.color;
                }
                else {
                  //find the cohort color for the task owner and apply it on the task
                  var findTaskOwner = Persons.query(function (response) {
                    response.forEach(function(taskOwner){
                      if (task.personName === taskOwner.name) {
                        $task.color = taskOwner.cohort.color;
                      }
                    });
                  });
                }
                $task.name = (SwitchViews.state === 'Person') ? task.projectName : task.personName;
                $label.tasks.push($task);
              });
              $scope.data.push($label);
            });
          });
      };

      /**
       * Modal Windows Function
       */
      $scope.triggerAssignModal = function(group, cohort) {
        var modalInstance = $modal.open({
          templateUrl: '/modules/core/views/assign_task_modal.client.view.html',
          controller: 'AssignTaskController',
          size: 'sm',
          resolve: {}
        });
        modalInstance.result.then(function(data) {
          if(data === undefined){
            SwitchViews.taskClicked.isClicked = false;
            var delTask = SwitchViews.taskClicked.taskObj;
            $scope.api.data.remove([delTask]);
            Tasks.delete({
              taskId: delTask.tasks[0].id
            });
          } else{
              switch (SwitchViews.state) {
                case 'Person':
                  assignment.projectId = data._id;
                  assignment.projectName = data.name;
                  assignment.group = group;
                  assignment.cohort = cohort;
                  break;
                case 'Project':
                  assignment.personId = data._id;
                  assignment.personName = data.name;
                  assignment.group = data.group;
                  assignment.cohort = data.cohort;
                  break;
              }
              if(!SwitchViews.taskClicked.isClicked){
                $scope.createTask(assignment);
              }
              else {           
                $scope.delUpTask(assignment, data);
              }
            }
        }, function() {});
      };

      /*  Trigger Update Modal Window  */
      $scope.triggerUpdateModal = function(details) {
        var updateObj = {
          controller: function($scope, updateData, $modalInstance) {
            $scope.updateData = updateData;
            $scope.updateLabel = function() {
              labelDetailUpdate(updateData);
              $modalInstance.close();
            };
            $scope.deactivate = function() {
              deactivateRow(updateData);
              $modalInstance.close();
            };
            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          },
          size: 'sm',
          resolve: {
            updateData: function() {
              return details;
            }
          }
        };
        if (SwitchViews.state === 'Person') {
          updateObj.templateUrl = '/modules/core/views/edit_person.client.view.html';
        } else {
          updateObj.templateUrl = '/modules/core/views/edit_project.client.view.html';
        }
        var modalInstance = $modal.open(updateObj);
      };

      $scope.groupOptions = ['Developer', 'Ghost', 'Member'];
      $scope.locationOptions = ['New York', 'Lagos', 'Others'];

      /* Function to trigger the view of Inactive Project/Person */
      var viewInactiveModal = function(list) {
        var inactiveList = $modal.open({
          templateUrl: '/modules/core/views/view_inactive.client.view.html',
          controller: function($scope, $modalInstance, listData) {
            $scope.datas = listData;
            $scope.state = SwitchViews.state;
            $scope.activateData = function(data) {
              activateData(data);
              $modalInstance.close();
            };
            $scope.deleteData = function(data) {
              deleteData(data);
              $modalInstance.close();
            };
            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          },
          size: 'lg',
          resolve: {
            listData: function() {
              return list;
            }
          }
        });
      };

      /**
       * Flash Notification
       */
      $scope.$on('response', function(event, notification) {
        $scope.notify = true;
        $timeout(function() {
          $scope.notify = false;
          $scope.responseMsg = true;
          $scope.msg = notification;
          $('.response').css('opacity', 0);
          
        }, 1200);
        $scope.msg = '';
      }); 

      $scope.$on('errorMsg', function(event, errorNotification) {
        $scope.notify = true;
        $timeout(function() {
          $scope.notify = false;
          $scope.responseMsg = false;
          $scope.msg = errorNotification;
          $('.errorMsg').css('opacity', 0);
        }, 1500);
        $scope.msg = '';
      }); 


      /**
       * Row Label Functions
       */
      $scope.getRowDetails = function(data) {
        $scope.globalRowData.data = data;
        var id = data.model.id;
        autoView.param[autoView.paramKey] = id;
        $scope.detail = autoView.resource.get(autoView.param);
        $scope.triggerUpdateModal($scope.detail);
      };

      var labelDetailUpdate = function(labelData) {
        var label = labelData;
        label.$update(function(response) {
          $scope.globalRowData.data.model.name = response.name;
          $scope.msg = response.name + ' is successfully updated';
          $scope.$emit('response', $scope.msg);
        },function(errorResponse) {
            $scope.error = errorResponse.data.message;
            $scope.msg = errorResponse.data.message;
            $scope.$emit('errorMsg',$scope.msg);
        });
      };
      $scope.labelDetailUpdate = labelDetailUpdate;
      var deactivateRow = function(data) {
        dataToRemove = [{
          'id': data._id
        }];
        $scope.api.data.remove(dataToRemove);
        $scope.infoData = data;
        $scope.infoData._id = data._id;
        $scope.infoData.isActive = false;
        $scope.infoData.$update(function(response) {
          $scope.msg = response.name + ' is now inactive';
          $scope.$emit('response', $scope.msg);
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
            $scope.msg = errorResponse.data.message;
            $scope.$emit('errorMsg',$scope.msg);
        });
      };
      $scope.deactivateRow = deactivateRow;

      // Get inactive assignments
      $scope.viewInactive = function() {
        var inactiveList = autoView.resource.query({
          isActive: false
        });
        viewInactiveModal(inactiveList);
      };

      var activateData = function(data) {
        autoView.param[autoView.paramKey] = data._id;
        $scope.lbl = autoView.resource.get(autoView.param);
        $scope.lbl.isActive = true;
        $scope.lbl._id = data._id;
        $scope.lbl.$update(function(response) {
          $scope.reload();
          $scope.msg = response.name + ' is now active';
          $scope.$emit('response', $scope.msg);
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
            $scope.msg = errorResponse.data.message;
            $scope.$emit('errorMsg',$scope.msg);
        });
      };
      $scope.activateData = activateData;
      var deleteData = function(labelData) {
        var lbl = labelData;
        lbl.$delete(function(response) {
          $scope.msg = response.name + ' is successfully deleted';
          $scope.$emit('response', $scope.msg);
        },function(errorResponse) {
            $scope.error = errorResponse.data.message;
            $scope.msg = errorResponse.data.message;
            $scope.$emit('errorMsg',$scope.msg);
        });
      };
      $scope.deleteData = deleteData;
      $scope.loadTabData = function(view) {
        SwitchViews.state = view;
        $scope.dataView = view;
        switch (view) {
          case 'Person':
            autoView.resource = Persons;
            autoView.paramKey = 'personId';
            break;
          case 'Project':
            autoView.resource = Projects;
            autoView.paramKey = 'projectId';
            break;
        }
        $scope.clear();
        $scope.load();
      };

      /**
       * Angular Gantt-chart Options/Functions
       */

      $scope.options = {
        scale: 'day',
        width: true,
        autoExpand: 'both',
        taskOutOfRange: 'expand',
        fromDate: moment(Date.now()).subtract(2, 'days'),
        toDate: moment(Date.now()).add(1, 'months'),
        allowSideResizing: true,
        labelsEnabled: true,
        currentDate: 'line',
        currentDateValue: Date.now(),
        draw: false,
        readOnly: false,
        headersFormats: {
          'year': 'YYYY',
          'quarter': '[Q]Q YYYY',
          month: 'MMMM YYYY',
          week: function(column) {
            return column.date.format('MMM D [-]') + column.endDate.format('[ ]MMM D');
          },
          day: 'ddd',
          hour: 'H',
          minute: 'HH:mm'
        },
        timeFrames: {
          'day': {
            start: moment('0:00', 'HH:mm'),
            end: moment('23:59', 'HH:mm'),
            working: true,
            default: true
          },
          'weekend': {
            working: false
          }
        },
        dateFrames: {
          'weekend': {
            evaluator: function(date) {
              return date.isoWeekday() === 6 || date.isoWeekday() === 7;
            },
            targets: ['weekend']
          }
        },
        timeFramesNonWorkingMode: 'visible',
        timeFramesMagnet: true,
        columnMagnet: '24 hours',
        drawTaskFactory: function(data) {
          var task = {};
          return task;
        },
        api: function(api) {
          // API Object is used to control methods and events from angular-gantt.
          $scope.api = api;
          api.core.on.ready($scope, function() {
            // When gantt is ready, load data.
            if ($scope.authentication.user !== '') {
              $scope.load();
              $scope.$watch(function(scope){
                return $scope.api.gantt.rowsManager.rows;
              }, function() {
                angular.forEach($scope.api.gantt.rowsManager.rows, function(row){
                  $scope.checkOverlapping(row);
                });
              });
            }
            if (api.tasks.on.moveBegin) {
              api.tasks.on.moveEnd($scope, addEventName('tasks.on.moveEnd', $scope.updateTask));
              api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resizeEnd', $scope.updateTask));
            }

            if (api.tasks.on.remove) {
              api.tasks.on.remove($scope, function(event, data) {
                $scope.checkOverlapping(event.row);
              });
            }

            // Add some DOM events
            api.directives.on.new($scope, function(directiveName, directiveScope, element) {
              if (directiveName === 'ganttTask') {
                element.bind('click', function() {
                  var data = directiveScope.task;
                  SwitchViews.taskClicked.isClicked = true;
                  SwitchViews.taskClicked.taskObj = {
                    'id' : data.row.model.id,
                    'tasks':[{
                      'id': data.model.id,
                      'name': data.model.name
                    }]
                  };
                  SwitchViews.taskClicked.taskRowData = data;
                });
              } 
              else if (directiveName === 'ganttRow') {
                element.bind('dblclick', function(evt) {
                  var data = directiveScope.row;
                  switch (SwitchViews.state) {
                    case 'Person':
                      assignment.personId = data.model.id;
                      break;
                    case 'Project':
                      assignment.projectId = data.model.id;
                      break;
                  }
                  var getDate = api.core.getDateByPosition(mouseOffset.getOffset(evt).x);
                  var taskBegin = moment(getDate).format();
                  assignment.startDate = moment(taskBegin).format('YYYY-MM-DD');
                  var taskEnd = moment(assignment.startDate).add(7, 'd');
                  assignment.endDate = moment(taskEnd).format('YYYY-MM-DD');
                  if(SwitchViews.state === 'Person')
                    $scope.triggerAssignModal(data.model.group, data.model.cohort);
                  else
                    $scope.triggerAssignModal();
                  $scope.drawTaskHandler = function(task) {
                    var taskParam = $scope.options.drawTaskFactory();
                    taskParam = {
                      id: task.id,
                      name: task.name,
                      from: assignment.startDate,
                      to: assignment.endDate,
                      color: task.color,
                      group: task.group
                    };
                    var uiItem = directiveScope.row.addTask(taskParam);
                    $scope.checkOverlapping(data);
                    uiItem.updatePosAndSize();
                    directiveScope.row.updateVisibleTasks();
                  };
                });
              } else if (directiveName === 'ganttRowLabel') {
                element.bind('click', function() {
                  var data = directiveScope.row;
                  $scope.getRowDetails(data);
                });
              }
            });
            api.tasks.on.rowChange($scope, function(task) {
              $scope.live.row = task.row.model;
            });
            objectModel = new ObjectModel(api);
          });
        }
      };

      // Reload data action
      $scope.load = function() {
        
        $scope.getTaskData();

        dataToRemove = undefined;
        $scope.api.side.setWidth(250);
      };
      $scope.reload = function() {
        $scope.load();
      };

      // Remove data action
      $scope.remove = function(data) {
        dataToRemove = [data];
        $scope.api.data.remove(dataToRemove);
      };

      // Clear data action
      $scope.clear = function() {
        $scope.data = [];
      };

      // Event utility function
      var addEventName = function(eventName, func) {
        return function(data) {
          return func(eventName, data);
        };
      };

      // Check Task Overlap and stack Tasks
      $scope.checkOverlapping = function (row) {
        //sort all the tasks on the row from earliest to latest
        row.tasks.sort(function(a, b) {
          var c = new Date(a.model.from);
          var d = new Date(b.model.from);
          return c - d;
        });
        
        //declare and initialize variables
        var taskArray = row.tasks;
        var numOfTask = row.tasks.length;
        var overlappingElemsCount = 0;
        var overlapGroup = [];
        var tempArray = [];
        var order;
        

        row.model.height = '28px';
        for (var i = 0; i < numOfTask; i++) {
          taskArray[i].model.top = '';
        }
        
        //loop through the array of tasks
        for ( i = 0; i < numOfTask; i++) {

          //check for overlap on the LHS
          if (i !== 0 && moment(taskArray[i].model.from).valueOf() <= moment(taskArray[i - 1].model.to).valueOf()) {
            overlappingElemsCount++;

            //push to existing overlap group array
            tempArray.push(taskArray[i]);

            //push the temp array into an overlap group array
            if (i === numOfTask -1) {
              overlapGroup.push(tempArray);
            }

            for (var j = 0; j < tempArray.length; j++) {
              if (j !== 0) {
                var top = j * 26;
                tempArray[j].model.top = top.toString() + 'px';
              }
            }
          }
          else if (i !== numOfTask - 1 && (moment(taskArray[i].model.to).valueOf() >= moment(taskArray[i + 1].model.from).valueOf())) {
            overlappingElemsCount++;
            //push to the global overlap array
            if (tempArray.length > 0) {
              overlapGroup.push(tempArray);
            }
            tempArray = [];
            tempArray.push(taskArray[i]);
            for (var j = 0; j < tempArray.length; j++) {
              if (j !== 0) {
                var top = j * 26;
                tempArray[j].model.top = top.toString() + 'px';
              }
            }
          } 
          else {

            if (tempArray.length > 0) {
              overlapGroup.push(tempArray);
              tempArray = [];
            }
          }
        }
        if (overlapGroup.length !== 0) {
          order = d3.max(overlapGroup).length; //D3 library was included to get this method
        }
        if (overlappingElemsCount > 0) {
          var rowHeight = order * 27;
          row.model.height = rowHeight.toString() + 'px';
        }
        else {
          row.model.height = '28px';
          for ( i = 0; i < numOfTask; i++) {
            taskArray[i].model.top = '';
          }
        }
      };
    }
  ]);
