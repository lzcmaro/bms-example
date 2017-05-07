define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/main/header.html',
  'common'
], function($, _, Backbone, Marionette, headerTemplate, Common) {
  return Marionette.View.extend({
    template: headerTemplate,
    className: 'main-header', // AdminLTE 约定的class
    tagName: 'header',
    events: {
      'click .sidebar-toggle': 'onToggleSidebar',
      'click .account-signout': 'onSignout'
    },
    modelEvents: {
      change: 'render' // this.model变化时，重新render
    },
    initialize: function(options) {
      console.log('HeaderView initialize.');
      this.channel = Backbone.Radio.channel(Common.channel.header);
    },
    onRender: function() {
      console.log('HeaderView is rendered.')
    },
    onToggleSidebar: function(e) {
      e.preventDefault();
      this.channel.trigger('header:toggle-sidebar')
    },
    onSignout: function(e) {
      e.preventDefault();
      this.channel.trigger('header:signout')
    }
  })
})