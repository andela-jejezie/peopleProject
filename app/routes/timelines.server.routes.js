'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var timelines = require('../../app/controllers/timelines.server.controller');

  // timelines Routes
  app.route('/timelines')
    .get(timelines.listTimelines)
    .post(users.requiresLogin, timelines.createTimeline);
  app.route('/timelines/:timelineId')
    .get(timelines.read)
    .put(users.requiresLogin, timelines.hasAuthorization, timelines.updateTimeline)
    .delete(users.requiresLogin, timelines.hasAuthorization, timelines.deleteTimeline);

  // Finish by binding the Timeline middleware
  app.param('timelineId', timelines.timelineByID);
};
