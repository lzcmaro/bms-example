define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'app.layout', 
  'app.model', 
  'app.router',
  'config',
  'common',
  'modules/main/header.view', 
  'modules/main/sidebar.view', 
  'modules/main/main.view'
], function(
  $, 
  _, 
  Backbone, 
  Marionette, 
  LayoutView, 
  AppModel, 
  AppRouter, 
  Config, 
  Common,
  HeaderView, 
  SidebarView, 
  MainView
) {
  'use strict';

  var App = Marionette.Application.extend({
    initialize: function(options) {
      console.log('App initialized', options);
      // TODO: 登录校验   
    },
    onBeforeStart: function() {
      console.log('App before start.');

      // 注册layoutView
      this.root = new LayoutView();
      // 设置app.model，方便后面使用
      this.model = new AppModel();
      // 渲染root视图
      this.root.showChildView('header', new HeaderView({model: this.model.get('account')}));
      this.root.showChildView('sidebar', new SidebarView({collection: this.model.get('menuList')}));
      this.root.showChildView('main', new MainView());

      // 初始化router
      // this.router = new AppRouter();

    },
    onStart: function() {
      console.log('App started.');
      var that = this;
      // 加载用户信息以及系统菜单列表数据
      this.model.fetch().done(function() {
        // 根据菜单列表数据初始化路由及控制器
        that.initAppRoutes.call(that);
        // 监听路由变化
        Backbone.history.start();
      });
    },
    /**
     * 根据系统菜单数据，动态加载路由
     */
    initAppRoutes: function() {
      var __routes = this.getAppRoutes();
      var routes = {};

      // 设置路由map
      _.each(__routes, function(value, key){
        routes[value.route] = value.route;
      });

      // 初始化Router
      this.router = new AppRouter({routes: routes});
    },
    /**
     * 获取路由数据（根据系统菜单生成）
     * @return {Object} 返回一个map数据，key为路由地址，value包括route, title
     */
    getAppRoutes: function() {
      var routeMap = {}, menuList = this.model.get('menuList').toJSON(), loop;

      // 已经存在routeMap时，直接返回this.routeMap
      if (this.routeMap) return this.routeMap;

      // 菜单数据为空时，直接返回空对象
      if (!menuList || menuList.length <= 0) return {};

      loop = function(list) {
        if (!list || list.length <= 0) return [];

        var route;

        _.each(list, function(item){
          route = item.url;

          if (item.type !== 'section' && route && route !== '#' && route !== 'javascript:;') {
            // 截取首字符'#'
            route = route.replace(/^#/, '');
            routeMap[route] = {
              title: item.label,
              route: route
            };
          }

          if (item.children && item.children.length) {
            loop(item.children)
          }
        });
      };

      loop(menuList);

      return (this.routeMap = routeMap);

    }
  });

  // 实例化Application，并设值到window，便于后面使用
  window.App = App = new App();


  /**
   * view与view间的通信通过App来调度（统一使用Application.vent事件聚合器）
   * ----------------------------------------------------------------
   */
  App.headerChannel = Backbone.Radio.channel(Config.channel.header);
  App.sidebarChannel = Backbone.Radio.channel(Config.channel.sidebar);
  // App.mainChannel = Backbone.Radio.channel(Config.channel.main);
  
  
  App.headerChannel.on({
    /**
     * 切换sidebar面板样式
     */
    'toggle-sidebar': function() {
      var $body = $('body');
      var collapsed = $body.hasClass('sidebar-collapse');

      // 切换sidebar样式
      $('body').toggleClass('sidebar-collapse', !collapsed);
      // 通知sidebar-view，告之当前sidebar切换了显示状态
      App.sidebarChannel.trigger('toggle-sidebar', !collapsed)
    },
    /**
     * TODO: 登出
     */
    signout: function() {}
  });


  App.sidebarChannel.on({
    // 切换路由
    forward: function(url) {
      if (!url || url === '#' || url === 'javascript:;') return false;
      // TODO: 在主视图添加导航面包屑？创建新的tab页？
    }
  });


  /**
   * 重写Marionette.View.prototype.serializeData
   * 如果数据为model，把它放到data中，避免在模板中引用变量时出现未定义的错误
   */
  Marionette.View.prototype.serializeData = function() {
    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      // 避免在模板中使用变量时出现未定义的错误
      // 这里把model放到data中
      return {
        data: this.serializeModel()
      }
    }

    // Otherwise, we serialize the collection,
    // making it available under the `items` property
    return {
      items: this.serializeCollection()
    };
  
  }

  return App;
});
