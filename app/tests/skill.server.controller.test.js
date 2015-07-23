'use strict';

/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    url = require('url'),
    assert = require('assert'),
    User = mongoose.model('User'),
    Person = mongoose.model('Person'),
    Skill = mongoose.model('Skill'),
    expect = chai.expect;

/**
 * Globals
 */
var agent = request.agent('http://localhost:3001');
var skills1,
    skills2,
    skills3;

describe('Skills backend tests', function(){

  beforeEach(function(done){
    skills1 = new Skill({
      skills: ['ObjectiveC', 'Swift', 'EmberJS']
    });
    skills2 = new Skill({
      skills: ['KnockoutJS', 'AngularJS']
    });
    skills3 = new Skill({
      skills: ['CSS'],
      _id: '54c506d403c64a9007c18f5a'
    });

    skills1.save(done);
  });

  describe('save skill method', function(){
    it('should save skills without problem', function(){
      skills2.save();
    });
    after(function(done) {
      Skill.remove().exec();
      done();
    });
  });

  describe('Query skill', function(){
    it('should expect skills to be succesfully listed', function(done){
      agent.get('/skills')
      .expect(200)
      .end(function(err, res){
        if(err){
          throw err;
        }
        assert.deepEqual(res.body[0].skills, ['ObjectiveC', 'Swift', 'EmberJS']);
        return done(); 
      });
    });

    it('should expect skills to be deleted', function(done){
      skills3.save();
      agent.del('/skills/' + skills3._id)
      .expect(200)
      .end(function(err, res){
        expect(err).to.be.null;
        return done();
      });

    });

    after(function(done) {
      Skill.remove().exec();
      done();
    });
  });
});
