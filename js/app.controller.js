define([
  'marionette'
], function(Marionette) {
  return Marionette.Object.extend({
    initialize: function() {
      console.log('App.Controller is initialized.');
    },
    index: function() {
    },
    defaultAction(action) {
      console.log('defaultAction', action);
    }
  })
});
