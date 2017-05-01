define(['underscore', 'marionette'], function(_, Marionette) {
  /**
   * AppRouter
   * 路由数据在 initialize 中设值，且设置的是routes，而不是AppRoutes.
   * 因为AppRoutes必须保证路由所配置的ActionMethod是存在的（在Controller或AppRouter中）
   * 而routes不要求，在没有ActionMethod的情况下，它只是忽略掉。
   * 所以这里利用这个特性，在onRoute()中动态加载相应的Controller来处理对应的路由请求。
   */
  var AppRouter = Marionette.AppRouter.extend({
     initialize: function(options) {
      console.log('App.Router is initialized.');
      this.routes = options ? options.routes : {};
    },
    onRoute: function(name, path, args) {
      var that = this;
      // Controller.js 的实际路径（按约定）
      var controllerPath = 'js/modules/' + name + '/' + name + '.controller.js';

      // 这里加载实际的Controller，并且调用其route()方法
      // 如果controller.js不存在，require会报错，但不影响后面的执行。
      require([controllerPath], function(controller) { 
        if (that.currentController && that.currentController !== controller) {
          that.currentController.onRouteChange && that.currentController.onRouteChange(name);
        }

        that.currentController = controller;
        controller.route(args);
      }); 
    }
  });

  return AppRouter;
});