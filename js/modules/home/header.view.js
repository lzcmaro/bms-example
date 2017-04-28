define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/home/header.html'], 
  function($, _, Backbone, Marionette, headerTemplate) {
    return Marionette.ItemView.extend({
      template: _.template(headerTemplate),
      className: 'main-header',
      tagName: 'header',
      events: {
        'click .sidebar-toggle': 'onToggleSidebar',
        'click .account-signout': 'onSignout'
      },
      modelEvents: {
        change: 'render' //model变化时，重新render
      },
      initialize: function(options) {
        console.log('HeaderView is initialized.', this.model)
      },
      onRender: function() {
        console.log('HeaderView is rendered.')
      },
      onToggleSidebar: function(e) {
        console.log('onToggleSidebar');
        App.vent.trigger('toggle:sidebar')
      },
      onSignout: function(e) {
        // TODO: 登出
        console.log('onSignout')
      }
    })
  })