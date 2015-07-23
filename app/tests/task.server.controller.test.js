'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	request = require('supertest'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Person = mongoose.model('Person'),
  Project = mongoose.model('Project'),
  Timeline = mongoose.model('Timeline'),
  Task = mongoose.model('Task');

/**
 * Globals
 */
var person1, person2, project1, project2, task1, task2, user1, user2, timeline1, timeline2;
var agent = request.agent('http://localhost:3001');

describe('Task Endpoint Tests', function() {
  before(function(done) {
  	user1 = new User({
		  name: 'Full',
		  displayName: 'Full Name',
		  email: 'test@test.com',
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

    person1 = new Person({
      name: 'Person1',
      email: 'person1@mail.com',
      skill: 'HTML',
      location: 'Lagos',
      user: user1
    });

    person2 = new Person({
      name: 'Person2',
      email: 'person2@mail.com',
      skill: 'HTML',
      location: 'Lagos',
      user: user2
    });

    project1 = new Project({
      name: 'Project1',
      user: user1
    });

    project2 = new Project({
      name: 'Project2',
      user: user2
    });

    timeline1 = new Timeline({
      owner: user1
    });

    timeline2 = new Timeline({
      owner: user2
    });

    user1.timeline = timeline1;
    user2.timeline = timeline2;

    task1 = new Task({
      projectId: project1,
      personId: person1,
      startDate: '2014-10-10',
      endDate: '2014-11-11',
      user: user1,
      timeline: timeline1
    });

    task2 = new Task({
      projectId: project2,
      personId: person2,
      startDate: '2014-8-8',
      endDate: '2014-9-9',
      user: user2,
      timeline: timeline2
    });

  	user1.save(function() {
      user2.save(function() {
        person1.save(function() {
          person2.save(function() {
            project1.save(function() {
              project2.save(function() {
                task1.save(function() {
                  task2.save(function() {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('User not logged in', function() {
    it('should not create task', function(done) {
    	agent.post('/tasks')
    	.send({
        projectId: project2,
        personId: person2,
        startDate: '2014-8-8',
        endDate: '2014-9-9',
        user: user2
      })
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
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200)
        .end(onResponse);
      function onResponse(err, res) {
       	if (err) return done(err);
       	return done();
      }
    });

    it('should not delete other users task', function(done) {
    	agent.delete('/tasks/' + task2._id)
  	  .expect(403)
   		// end handles the response
  	  .end(function(err, res) {
      	if (err) {
        	throw err;
      	}
      	return done();
      });
    });

    it('should not create a task that already exists', function(done) {
    	agent.post('/tasks')
    	.send(task1)
  	  .expect(400)
   		// end handles the response
  	  .end(function(err, res) {
      	if (err) {
        	throw err;
      	}
      	return done();
      });
    });

    it('should be able to delete a task', function(done) {
      agent.delete('/tasks/' + task1._id)
      .expect(200)
      .end(function(err, res){
        if(err){
          throw err;
        }
        return done();
      });
    });
  });

	after(function(done) {
		Task.remove().exec();
    Project.remove().exec();
    Person.remove().exec();
		User.remove().exec();
		done();
	});
});
