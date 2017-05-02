define([
  'marionette',
  'modules/user/user.view'
], function(Marionette, UserView) {
  var Controller = Marionette.Object.extend({
      /**
       * args[0] location.search
       */
      route: function(args) {
        console.log('user.routed', args);
        // 调用App.renderMainContent()渲染UserView
        App.renderMainContent(new UserView());
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
