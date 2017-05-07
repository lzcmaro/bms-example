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
      // model.isNew() 会根据当前model是否存在id值来判断
      var isNew = this.model.isNew();    
      // this.$dialog 为 ModalView 中所约定使用的变量，这里不能变更，否则无法显示弹层
      this.$dialog = $.modal({
        show: false, // 初始化时，不显示
        className: 'dlg-user-edit',
        title: isNew ? '新增用户' : '用户编辑',
        buttons: [{
          text: '取消',
          handler: 'close'
        }, {
          text: isNew ? '新增' : '保存',
          handler: _.bind(this.onSubmit, this)
        }]
      });
    },
    formSubmitted: function(e) {
      var that = this, 
        formData = Backbone.Syphon.serialize(this), 
        model = this.model, 
        modelData = model.toJSON(),
        isNew = model.isNew();

      e.preventDefault();

      // 如果数据没有变化，不做保存操作
      // 注意的是，需要排除modelData中的ID和status值后，再比较
      if (_.isEqual(formData, _.omit(modelData, ['id', 'status']))) {
        return this.$dialog.hide();
      } 

      // 避免刷新视图，不能直接调用save(formData)
      model.set(formData, {silent: true})
      
      if (model.isValid()){
        model.save().done(function() {
          that.$dialog.hide();
          // 通知main-content刷新视图
          that.trigger(isNew ? 'user:added' : 'user:updated')
        })       
      } else {
        // 数据不合法...
        $.alert('提示', model.validationError);
        // 把model数据重置，避免它再次点击保存时，把弹层关闭了，因为这时候，model的数据和formData是一致的
        model.set(modelData, {silent: true});
      }
    },
    onSubmit: function() {
      this.$dialog.find('form').submit();
    }
  })
});
