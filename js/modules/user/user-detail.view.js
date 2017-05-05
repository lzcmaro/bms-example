define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user-detail.html'
], function($, _, Backbone, Marionette, template) {
  'use strict';

  return Marionette.View.extend({
    template: template,
    modelEvents: {
      change: 'render'
    },
    initialize: function(options) {
      // Do something
    },
    onRender: function() {
      // this.model发生变化时，会重新render，这里把原来的modal删除
      if (this.$dialog) {
        this.$dialog.remove()
      } 

      this.$dialog = $.modal({
        className: 'dlg-user-detail',
        title: '用户信息',
        body: this.$el.html(),
        buttons: [{
          text: '确定',
          handler: 'close'
        }]
      });
    }
  })
});
