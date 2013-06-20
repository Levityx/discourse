/**
  This route is used for retrieving a topic based on params

  @class TopicFromParamsRoute
  @extends Discourse.Route
  @namespace Discourse
  @module Discourse
**/
Discourse.TopicFromParamsRoute = Discourse.Route.extend({

  setupController: function(controller, params) {
    params = params || {};
    params.track_visit = true;

    var postStream = this.modelFor('topic').get('postStream');

    var queryParams = Discourse.URL.get('queryParams');
    if (queryParams) {
      // Set bestOf on the postStream if present
      postStream.set('bestOf', Em.get(queryParams, 'filter') === 'best_of');

      // Set any username filters on the postStream
      var userFilters = Em.get(queryParams, 'username_filters[]');
      if (userFilters) {
        if (typeof userFilters === "string") { userFilters = [userFilters]; }
        userFilters.forEach(function (username) {
          postStream.get('userFilters').add(username);
        });
      }
    }

    postStream.refresh(params);
  }

});


