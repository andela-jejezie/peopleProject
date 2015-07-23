'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var TimelineSchema = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Timeline', TimelineSchema);
