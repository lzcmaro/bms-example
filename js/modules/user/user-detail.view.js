define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user-detail.html'
], function($, _, Backbone, Marionette, template) {
  'use strict';

  return Marionette.ModalView.extend({
    template: template,
    /**
     * 用于显示弹层的配置，详见jquery.ext.js中$.modal()的定义
     */
    modalOptions: {
      title: '用户信息',
      className: 'dlg-user-detail'
    }
  })
});
