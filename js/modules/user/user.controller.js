define([
  'marionette',
  'modules/user/user.view',
  'modules/user/user.model'
], function(Marionette, UserView, UserModel) {
  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      console.log('UserController initialize.');
    },
    /**
     * args[0] location.search
     */
    route: function(args) {
      // 调用App.renderMainContent()渲染UserView
      App.renderMainContent(new UserView({model: new UserModel()}));
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
