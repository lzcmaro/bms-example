define([
  'underscore',
  'backbone',
  'marionette',
  'modules/main/header.view', 
  'modules/main/sidebar.view', 
  'modules/main/main-header.view'
], function(_, Backbone, Marionette, HeaderView, SidebarView, MainHeaderView) {
  return Marionette.Object.extend({
    initialize: function(options) {
      var App = window.App;
      // 渲染root视图
      App.root.showChildView('header', new HeaderView({model: App.model.get('account')}));
      App.root.showChildView('sidebar', new SidebarView({collection: App.model.get('menuList')}));
      App.root.showChildView('main-header', new MainHeaderView({model: new Backbone.Model()}));

      App.channel.on('router:initialized', _.bind(this.onRoute, this));
    },
    //gets mapped to in AppRouter's appRoutes
    index: function() {
      // 重定向到默认页(系统菜单中的第一个路由)
      // 注意，需要设置trigger:true的参数，否则路由系统不会监测到
      Backbone.history.navigate(_.toArray(App.routeMap)[0].route, {trigger: true});
    },
    /**
     * 监听AppRouter.route事件
     * 在route变化后，更新MainView的header（后面可考虑添加导航面包屑，或者新增tabs页）
     * @param  {String} action  路由地址映射的action，这里实际为路由地址，因为我们配置的处理action为路由地址
     * @param  {Array}  args   args[0]为location.search，其它值暂未知
     */
    onRoute: function() {
      window.App.router.on('route', function(action, args) {
        console.log('AppRouter.onRoute: ', action);
        var App = window.App;
        var rootLayout = App.root;
        var routeData = App.routeMap[action];
        var mainHeaderView = rootLayout.getChildView('main-header');
        
        if (!routeData) return;        

        mainHeaderView.model.set('title', routeData.title);
        // 删除main-content视图，避免当前路由没有实际controller时，还是显示原来的main-content视图
        rootLayout.detachChildView('main-content');
      });
    }
  });
});
