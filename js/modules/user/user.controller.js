define([
  'marionette',
  'modules/user/user.view',
  'modules/user/user.view.model',
  'common'
], function(Marionette, UserView, UserViewModel, Common) {
  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      console.log('UserController initialize.');
      this.view = new UserView({model: new UserViewModel()});
    },
    /**
     * args[0] location.search
     */
    route: function(args) {
      // 调用App.renderMainContent()渲染UserView
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
      console.log('user.onRouteChange', action)
    }
  });

  return new Controller();
});
