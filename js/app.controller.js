define([
  'marionette', 
  'modules/home/header.view', 
  'modules/home/sidebar.view', 
  'modules/home/main.view'
], function(Marionette, HeaderView, SidebarView, MainView) {
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
