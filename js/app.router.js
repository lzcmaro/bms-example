define(['underscore', 'marionette'], function(_, Marionette) {
  /**
   * AppRouter
   * 路由数据routes，由外边的Application设置。注意的是，设置的是routes，而不是appRoutes，
   * 因为appRoutes必须保证路由所配置的ActionMethod是存在的（在Controller或AppRouter中）
   * 而routes不要求，在没有ActionMethod的情况下，它只是忽略掉。
   * 所以这里利用这个特性，在onRoute()中动态加载相应的Controller来处理对应的路由请求。
   */
  var AppRouter = Marionette.AppRouter.extend({
    /**
     * appRoutes 配置index，让app.controller处理
     * 其它模块的路由，由onRoute()方法动态加载
     */
    appRoutes: {
      '': 'index'
    },
    initialize: function(options) {
      console.log('AppRouter initialize.');
    },
    onRoute: function(action, path, args) {
      // 可能是无效路由，如：index首页路由，或者是404路由，这里直接return
      if (!App.isValidRoute(action)) return;

      var that = this;
      var controllerPath = this.getControllerPath(action);
      

      // 这里加载实际的Controller，并且调用其route()方法
      // 如果controller.js不存在，require会报错，但不影响后面的执行。
      require([controllerPath], function(controller) { 
        if (that.currentController && that.currentController !== controller) {
          // 调用原来的controller.onRouteChange()方法，通知其路由发生了变化
          that.currentController.onRouteChange && that.currentController.onRouteChange(action);
        }

        that.currentController = controller;
        // route为约定的方法，路由变化后的逻辑处理Action
        controller.route && controller.route(args);
      }); 
    },
    /**
     * 根据当前路由获取它的ControllerPath
     * 路由与模块对应的约定：js/modules/module1[/module2]/route.controller.js
     * @param  {String} route 路由
     * @return {String}       返回Controller.js的实际路径
     */
    getControllerPath(route) {
      if (!route) return;

      var paths = route.split('/'), modulePath, controllerName;
      
      if (paths.length > 1) { // 多级路由
        // 最后一个为controllerName
        controllerName = paths.pop();
        // 剩下的组合为模块的路径
        modulePath = paths.join('/');
      } else { // 单级路由
        modulePath = controllerName = route;
      }

      return 'js/modules/' + modulePath + '/' + controllerName + '.controller.js';
    }
  });

  return AppRouter;
});