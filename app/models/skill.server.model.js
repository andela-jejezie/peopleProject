'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
  skills: [{
    type: String
  }]
});

module.exports = mongoose.model('Skill', SkillSchema);
