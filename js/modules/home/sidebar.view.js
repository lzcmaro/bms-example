define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/home/sidebar.html'], 
  function($, _, Backbone, Marionette, sidebarTemplate) {
    return Marionette.View.extend({
      template: sidebarTemplate,
      className: 'main-sidebar', // AdminLTE 约定的class
      tagName: 'aside',
      collectionEvents: {
        'update': 'render' // this.collection变化时，重新render
      },
      initialize: function(options) {
        console.log('SidebarView is initialized.', this.collection)
      },
      onRender: function() {
        console.log('SidebarView is rendered.')
        // TODO: 选中菜单项
      }
    })
  })