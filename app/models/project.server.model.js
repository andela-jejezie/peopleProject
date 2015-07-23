'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    index: {unique: true, dropDups: true },
    required: 'Please fill in a Project Name',
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tasks: [{
    type: Schema.ObjectId,
    ref: 'Task'
  }],
  timeline: {
    type: Schema.ObjectId,
    ref: 'Timeline'
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
