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
	Person = mongoose.model('Person');

/**
 * Globals
 */
var person1, person2, user1, user2, timeline1, timeline2;
var agent = request.agent('http://localhost:3001');

describe('Person Endpoint Tests', function() {
    
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

    timeline1 = new Timeline({
      owner: user1
    });

    timeline2 = new Timeline({
      owner: user2
    });

    user1.timeline = timeline1;
    user2.timeline = timeline2;

    person1 = new Person({
      name: 'Person1',
      email: 'person1@mail.com',
      skill: 'HTML',
      location: 'Lagos',
      group: 'Ninja',
      timeline: timeline1,
      user: user1
    });

    person2 = new Person({
      name: 'Person2',
      email: 'person2@mail.com',
      skill: 'HTML',
      location: 'Lagos',
      group: 'Ghost',
      timeline: timeline2,
      user: user2
    });
		
  	user1.save(function() {
      user2.save(function() {
        person1.save(function(err, result) {
          person2.save(function() {
            done();
          });
        });
      });
    });
  });

  // it('should not create person if user is not logged in', function(done) {

  //   function onResponse(err, res) {
  //     if(err) return done(err);
  //     return done();
  //   }

  // 	agent.post('/persons')
  // 	.send({name: 'example'})
  // 	.expect(401)
  // 	.end(onResponse);
  // });

  it('should login User', function(done) {
    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
    
    agent.post('/auth/signin')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200)
      .end(onResponse);
  });

  // it('should not create a person that already exists', function(done) {
  // 	agent.post('/persons')
  // 	.send(person1)
	 //  .expect(400)

 	// 	// end handles the response
	 //  .end(function(err, res) {
  //   	if (err) {
  //     	throw err;
  //   	}
  //   	return done();
  //   });
  // });

  it('should not create a person without an email', function(done) {
    agent.post('/persons')
    .send({name: 'new person', email: ''})
    .expect(400)
    .end(function(err, res) {
        if (err) {
          should.exist(err);
        }
        return done();
      });
  });

  // it('should not create a person without name', function(done) {
  //   agent.post('/persons')
  //   .send({name: '', email:'jyd@y.com'})
  //   .expect(400)
  //   .end(function(err, res){
  //     if(err) {
  //       throw err;
  //     }
  //     return done();
  //   });
  // });

  it('Should be able to update a person', function(done) {
    agent.put('/persons/'+ person1._id)
    .send({name: 'Another Name', email:'jyd@y.com'})
    .expect(200)
    .end(function(err, res){
      if(err){
        throw err;
      }
      Person.findOne({name: 'Another Name'}, function(err, per){
        should.exist(per);
      });
      return done();
    });
  });

  it('should list persons', function(done){
    agent.get('/persons')
    .expect(200)
    .end(function(err, res){
      if(err){
        throw err;
      }
      Person.find({}, function(err, pers){
        should.exist(pers);
      });
      return done(); 
    });
  });

  it('should be able to delete a person', function(done){
    agent.delete('/persons/' + person1._id)
    .expect(200)
    .end(function(err, res){
      if(err){
        throw err;
      }
      return done();
    });
  });

  it('should not delete a person that does not belong to him', function(done) {
    agent.delete('/persons/' + person2._id)
    .expect(403)
    // end handles the response
    .end(function(err, res) {
        if (err) {
          should.exist(err);
        }
        return done();
      });
  });

	after(function(done) {
		Person.remove().exec();
		User.remove().exec();
		done();
	});
});
