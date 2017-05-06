define([
  'marionette',
  'modules/{{module-path}}/{{module-name}}.view',
  'modules/{{module-path}}/{{module-name}}.view.model'
], function(Marionette, View, ViewModel) {
  'use strict';

  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      this.view = new View({model: new ViewModel()})
    },
    route: function(args) {
      // 调用App.renderMainContent()渲染视图
      App.renderMainContent(this.view);
      // 在路由重新切换回来时，由于this.view已存在，它的render等相关方法不会被再次触发
      // 这里调用gridView.resize()，以刷新easyui datagrid
      this.view.gridView && this.view.gridView.resize();
    },
    /**
     * 路由跳转后的回调
     * @param  {String} action 跳至新的路由的Action名称
     */
    onRouteChange: function(action) {
      // Do something
    }
  });

  return new Controller();
});
