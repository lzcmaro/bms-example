define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/home/header.html',
  'config'
], function($, _, Backbone, Marionette, headerTemplate, Config) {
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
      console.log('HeaderView is initialized.');
      this.channel = Backbone.Radio.channel(Config.channel.header);
    },
    onRender: function() {
      console.log('HeaderView is rendered.')
    },
    onToggleSidebar: function(e) {
      this.channel.trigger('toggle:sidebar')
    },
    onSignout: function(e) {
      this.channel.trigger('account:signout')
    }
  })
})