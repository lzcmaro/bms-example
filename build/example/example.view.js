define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/{{module-path}}/{{module-name}}.html'
], function($, _, Backbone, Marionette, template) {
  'use strict';

  return Marionette.View.extend({
    template: template,
    initialize: function(options) {
      // Do something
    },
    onRender: function() {
      // Do something
    }
  })
});
