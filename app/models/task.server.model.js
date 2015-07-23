'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Task Schema
 */
var TaskSchema = new Schema ({
 	personId: {
 		type: Schema.ObjectId,
 		ref: 'Person'
 	},
 	personName: {
 		type: String
 	},
 	projectId: {
 		type: Schema.ObjectId,
 		ref: 'Project'
 	},
 	projectName: {
 		type: String
 	},
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date
	},
	group: {
		type: String
	},
	cohort: {
		type: Object
	},
	timeline: {
		type: Schema.ObjectId,
		ref: 'Timeline'
	}
 });

mongoose.model('Task', TaskSchema);
