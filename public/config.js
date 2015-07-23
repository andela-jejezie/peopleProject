'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'task';

	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngTouch',  'ngSanitize', 'ui.router', 'mgcrea.ngStrap','ui.bootstrap', 'ui.utils', 'gantt', 'gantt.labels','gantt.movable','gantt.drawtask','gantt.tooltips','gantt.bounds', 'gantt.progress', 'nsPopover', 'validation.match', 'angular-md5', 'ui.select'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
