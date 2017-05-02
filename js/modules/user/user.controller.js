define([
  'marionette',
  'modules/user/user.view',
  'modules/user/user.collection'
], function(Marionette, UserView, UserCollection) {
  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      console.log('UserController is initialized.');
    },
    /**
     * args[0] location.search
     */
    route: function(args) {
      var collection = new UserCollection();
      // 调用App.renderMainContent()渲染UserView
      App.renderMainContent(new UserView({collection: collection}));
      // 加载用户列表数据
      collection.fetch();
    },
    /**
     * 路由跳转前的回调
     * @param  {String} action 将要跳转至的路由的Action名称
     */
    onRouteChange: function(action) {
      console.log('user.onRouteChange', action)
    }
  });

  return new Controller();
});
