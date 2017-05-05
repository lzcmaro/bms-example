define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html',
  'modules/user/user-detail.view',
  'modules/user/user-detail.model'
], function($, _, Backbone, Marionette, userTemplate, DetailView, DetailModel) {
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
            {field: 'name', title: '名称', width: 300},
            {field: 'tel', title: '电话号码', width: 300},
            {field: 'createDate', title: '创建时间', align: 'right', width: 300},
            {field: '_opt', title: '操作', align: 'center', width: 180, buttons: [
              {label: '编辑', handler: _.bind(this.doEdit, this)},
              {label: '详情', handler: _.bind(this.showDetail, this)},
              {handler: _.bind(this.doEnableOrDisable, this), formatter: function(value, row, index) {
                return value == 1 ? '停用' : '启用'
              }}
            ]}
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
    },
    showDetail: function(rowData, rowIndex) {
      if (this.detailView) {
        this.detailView.model.set(rowData)
      } else {
        this.detailView = new DetailView({model: new DetailModel(rowData)}).render();
      }
    },
    doEdit: function(rowData, rowIndex) {
      console.log('doEdit', rowData)
    },
    doEnableOrDisable: function(rowData, rowIndex) {
      console.log('doEnableOrDisable', rowData)
    }
  })
});
