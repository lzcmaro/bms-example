define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html',
  'config'
], function($, _, Backbone, Marionette, userTemplate, Config) {
  return Marionette.View.extend({
    template: userTemplate,
    initialize: function(options) {
      console.log('UserView is initialized.');
    },
    onRender: function() {
      console.log('UserView is rendered.')
    }
  })
})