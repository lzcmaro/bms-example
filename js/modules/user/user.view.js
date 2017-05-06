define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html',
  'modules/user/user-detail.view',
  'modules/user/user-edit.view',
  'modules/user/user.model'
], function($, _, Backbone, Marionette, userTemplate, DetailView, EditView, UserModel) {
  return Marionette.View.extend({
    template: userTemplate,
    ui: {
      form: 'form',
      grid: '.datagrid'
    },
    events: {
      'click .btn-search': 'doSearch'
    },
    initialize: function(options) {
      console.log('UserView initialize.');
    },
    onRender: function() {
      console.log('UserView is rendered.');
      this.gridView = new Marionette.DatagridView({
        // 让DatagridView 在 this.ui.grid 中渲染
        el: this.ui.grid,
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
      }).render();
    },
    doSearch: function() {
      // Get query params
      var queryParams = Backbone.Syphon.serialize(this.ui.form);
      // fetch data
      this.gridView.fetch(queryParams);
    },
    showDetail: function(rowData, rowIndex) {
      if (this.detailView) {
        this.detailView.model.set(rowData)
      } else {
        this.detailView = new DetailView({model: new UserModel(rowData)}).render();
      }
    },
    doEdit: function(rowData, rowIndex) {
      if (this.editView) {
        this.editView.model.set(rowData)
      } else {
        this.editView = new EditView({model: new UserModel(rowData)}).render();
      }
    },
    doEnableOrDisable: function(rowData, rowIndex) {
      console.log('doEnableOrDisable', rowData)
    }
  })
});
