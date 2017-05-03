define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html'
], function($, _, Backbone, Marionette, userTemplate) {
  return Marionette.View.extend({
    template: userTemplate,
    regions: {
      'grid': '#datagrid-wrapper'
    },
    ui: {
      form: 'form'
    },
    events: {
      'click .btn-search': 'doSearch'
    },
    initialize: function(options) {
      console.log('UserView initialize.');
    },
    onRender: function() {
      console.log('UserView is rendered.');
      var gridView = this.gridView = new Marionette.DatagridView({
        // 绑定this.model到datagridView
        model: this.model,
        // jquery.easyui datagrid的参数
        // 由于DatagridView做了默认配置，一般情况，只需传递columns即可
        gridOptions: {
          columns:[[
            {field: 'name', title: '名称', width: 100},
            {field: 'tel', title: '电话号码', width: 100},
            {field: 'createDate', title: '创建时间', align: 'right', width: 100}
          ]]
        }
      });

      this.showChildView('grid', gridView);
    },
    doSearch: function() {
      var $form = this.ui.form;
      // Get query params
      var queryParams = {
        name: $form.find('input[name="name"]').val(),
        tel: $form.find('input[name="tel"]').val(),
        beginDate: $form.find('input[name="beginDate"]').val(),
        endDate: $form.find('input[name="endDate"]').val()
      };
      // fetch data
      this.gridView.fetch(queryParams);

      // Prevent default (form submit)
      return false;
    }
  })
});
