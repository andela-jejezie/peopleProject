'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Person Schema
 */
var PersonSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill in Person Name',
    trim: true
  },
  first_name:{
    type:String,
    trim: true
  },
  last_name:{
    type:String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill a valid email address',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  known_as: {
    type: String,
    trim: true
  },
  uid: {
    type: String
  },
  cohort: {
    type: Object
  },
  picture: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  skill: [{
    type: String
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Person', PersonSchema);
