'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	request = require('supertest'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
  Timeline = mongoose.model('Timeline'),
	Project = mongoose.model('Project');

/**
 * Globals
 */
var project1, project2, user1, user2, timeline1, timeline2;
var agent = request.agent('http://localhost:3001');

describe('Project Endpoint Tests', function() {
  before(function(done) {
  	user1 = new User({
  		name: 'Full',
  		displayName: 'Full Name',
  		email: 'tester@test.com',
  		username: 'username',
  		password: 'password',
  		verified: true,
  		provider: 'local'
  	});

  	user2 = new User({
  		name: 'Another Joe',
  		displayName: 'Another',
  		email: 'joe@another.com',
  		username: 'anotherjoe',
  		password: 'password',
  		verified: true,
  		provider: 'local'
  	});
  	
    timeline1 = new Timeline({
      owner: user1
    });
    timeline2 = new Timeline({
      owner: user2
    });

    user1.timeline = timeline1;
    user2.timeline = timeline2;
  	
    project1 = new Project({
      name: 'Project1',
      timeline: timeline1,
      user: user1
    });

    project2 = new Project({
      name: 'Project2',
      timeline: timeline2,
      user: user2
    });

    user1.save(function() {
      user2.save(function() {
        project1.save(function() {
          project2.save(function() {
            done();
          });
        });
      });  
    });
  });

  describe('User not logged in', function() {
    it('should not create project', function(done) {
      agent.post('/projects')
      .send({name: 'matsi'})
      .expect(401)
      .end(onResponse);
      function onResponse(err, res) {
        if(err) return done(err);
        return done();
      }
    });
  });

  describe('User logged in', function() {
    before(function(done) {
      agent.post('/auth/signin')
      .send({ email: 'tester@test.com', password: 'password' })
      .expect(200)
      .end(onResponse);
      function onResponse(err, res) {
        if (err) return done(err);
        return done();
      }
    });

    it('Should be able to update a project', function(done){
      agent.put('/projects/'+ project1._id)
      .send({name: 'Another Name'})
      .expect(200)
      .end(function(err, res){
        if(err) done(err);
        Project.findOne({name: 'Another Name'}, function(err, per) {
          should.exist(per);
        });
        return done();
      });
    });

    it('should get all projects', function(done) {
      agent.get('/projects')
      .expect(200)
      .end(function(err, res){
        if(err) done(err);
        Project.find({}, function(err, pro){
          should.exist(pro);
        });
        return done(); 
      });
    });

    it('should not delete other users projects', function(done) {
      agent.delete('/projects/' + project2._id)
      .expect(403)
      // end handles the response
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
    });

    it('should not create a project that already exists', function(done) {
      agent.post('/projects')
      .send(project1)
      .expect(400)
      // end handles the response
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
    });
  });

	after(function(done) {
		Project.remove().exec();
		User.remove().exec();
		done();
	});
});
