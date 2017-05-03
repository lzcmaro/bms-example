define([
  'marionette',
  'modules/{{module-path}}/{{module-name}}.view',
  'modules/{{module-path}}/{{module-name}}.model'
], function(Marionette, View, Model) {
  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      // Do something
    },
    route: function(args) {
      // 调用App.renderMainContent()渲染视图
      App.renderMainContent(new View({model: new Model()}));
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
