define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/home/sidebar.html'], 
  function($, _, Backbone, Marionette, menuTemplate) {
    return Marionette.ItemView.extend({
      template: menuTemplate,
      className: 'main-sidebar',
      tagName: 'aside',
      initialize: function(options) {
        console.log('SidebarView is initialized.')
      },
      onRender: function() {
        console.log('SidebarView is rendered.')
      }
    })
  })