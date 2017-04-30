define(['marionette'], function(Marionette) {
  return Marionette.AppRouter.extend({
    initialize: function() {
      console.log('App.Router is initialized.');
    },
    appRoutes: {
      "": "index",
      "*actions": "defaultAction"
    }
  })
});