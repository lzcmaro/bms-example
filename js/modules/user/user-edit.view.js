define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user-add-edit.html'
], function($, _, Backbone, Marionette, template) {
  'use strict';

  return Marionette.ModalView.extend({
    template: template,
    events: {
      'submit form': 'formSubmitted'
    },
    /**
     * 由于需要给modal中的按钮绑定事件，这里重写ModalView的iniinitialize
     */
    initialize: function(options) {
      // this.$dialog 为 ModalView 中所约定使用的变量，这里不能变更，否则无法显示弹层
      this.$dialog = $.modal({
        show: false, // 初始化时，不显示
        className: 'dlg-user-edit',
        title: '用户修改',
        buttons: [{
          text: '取消',
          handler: 'close'
        }, {
          text: '保存',
          handler: _.bind(this.onSubmit, this)
        }]
      });
    },
    formSubmitted: function(e) {
      var that = this, formData = Backbone.Syphon.serialize(this), modelData = this.model.toJSON();

      e.preventDefault();

      // 如果数据没有变化，不做保存操作
      // 注意的是，需要排除modelData中的ID值后，再比较
      if (_.isEqual(formData, _.omit(modelData, 'id'))) {
        return this.$dialog.hide();
      } 

      // 避免刷新视图，不能直接调用save(formData)
      if (this.model.set(formData, {silent: true})){
        this.model.save().done(function() {
          that.$dialog.hide();
          // 通知main-content刷新视图
          that.trigger('user:updated')
        })       
      } else {
        // TODO: 数据不合法...
      }
    },
    onSubmit: function() {
      this.$dialog.find('form').submit();
    }
  })
});
