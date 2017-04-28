define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/home/main.html'], 
  function($, _, Backbone, Marionette, mainTemplate) {
    return Marionette.ItemView.extend({
      template: mainTemplate,
      className: 'content-wrapper',
      ui: {
        header: '.content-header',
        content: '.content'
      },
      initialize: function(options) {
        console.log('MainView is initialized.')
      },
      onRender() {
        console.log('MainView is rendered.')
      }
    })
  })