define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/user/user.html',
  'config'
], function($, _, Backbone, Marionette, userTemplate, Config) {
  return Marionette.View.extend({
    template: userTemplate,
    collectionEvents: {
      update: 'refreshDatagrid'
    },
    ui: {
      'grid': '#datagrid'
    },
    initialize: function(options) {
      console.log('UserView is initialized.');
    },
    onRender: function() {
      console.log('UserView is rendered.');
      this.ui.grid.datagrid({
        idField: 'id',
        fitColumns: true,
        columns:[[
          {field:'name',title:'名称',width:100},
          {field:'tel',title:'电话号码',width:100},
          {field:'createDate',title:'创建时间',align:'right',width:100}
        ]],
        pagination: true
      })
    },
    refreshDatagrid: function(collection) {
      this.ui.grid.datagrid({data: collection.toJSON()})
    }
  })
})