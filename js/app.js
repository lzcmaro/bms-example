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
  'modules/main/main-header.view',
  'modules/main/main-header.model'
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
  MainHeaderView,
  MainHeaderModel
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
 
      this.headerChannel = Backbone.Radio.channel(Config.channel.header);
      this.sidebarChannel = Backbone.Radio.channel(Config.channel.sidebar);
      // this.mainChannel = Backbone.Radio.channel(Config.channel.main);
 
      /**
       * view与view间的通信通过App来调度（统一使用Application.vent事件聚合器）
       * ----------------------------------------------------------------
       */ 
      this.headerChannel.on({
        /**
         * 切换sidebar面板样式
         */
        'toggle-sidebar': function() {
          var $body = $('body');
          var collapsed = $body.hasClass('sidebar-collapse');

          // 切换sidebar样式
          $('body').toggleClass('sidebar-collapse', !collapsed);
          // 通知sidebar-view，告之当前sidebar切换了显示状态
          window.App.sidebarChannel.trigger('toggle-sidebar', !collapsed)
        },
        /**
         * TODO: 登出
         */
        signout: function() {}
      });
    },
    onStart: function() {
      console.log('App started.');
      var that = this;
      // 加载用户信息以及系统菜单列表数据
      this.model.fetch().done(function() {
        // 根据菜单列表数据初始化路由及控制器
        that.initAppRouter.call(that);
        // 监听路由变化
        Backbone.history.start();
      });
    },
    /**
     * 根据系统菜单数据，动态加载路由
     */
    initAppRouter: function() {
      var __routes = this.getAppRoutes();
      var routes = {};

      // 设置路由map
      _.each(__routes, function(value, key){
        routes[value.route] = value.route;
      });

      // 初始化Router
      this.router = new AppRouter({routes: routes});

      /**
       * 监听router.route事件
       * 在route变化后，更新MainView的header（后面可考虑添加导航面包屑，或者新增tabs页）
       * @param  {String} route  路由地址
       * @param  {Array}  args   args[0]为location.search，其它值暂未知
       */
      this.router.on('route', function(route, args) {
        console.log('AppRouter.onRoute', route, args);
        // 由于当前JS有App的定义，为避免出错，这里使用window.App
        var App = window.App;
        var routeData = App.routeMap[route];
        var mainHeaderView;
        var mainHeaderModel;
        
        if (!routeData) return;

        mainHeaderView = App.root.getChildView('main-header');

        // 如果view已存在，直接改变它的model即可
        if (mainHeaderView) {
          mainHeaderView.model.set('title', routeData.title);
        } 
        // 初始化mainHaderView
        else {
          mainHeaderModel = new MainHeaderModel({title: routeData.title});
          App.root.showChildView('main-header', new MainHeaderView({model: mainHeaderModel}));
        }

        // 销毁main-content视图，避免当前路由没有实际controller时，还是显示原来的main-content视图
        App.root.detachChildView('main-content');
        
      });
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

  /**
   * 定义一些对外的接口
   * ----------------------------------
   */
  
  /**
   * renderMainContent 渲染主视图
   * @param {Marionette.View} view Marionette.View的实例对象
   */
  App.prototype.renderMainContent = function(view) {
    this.root.showChildView('main-content', view);
  }


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
  
  };


  // 实例化Application，并设值到window，便于后面使用
  return window.App = new App();
});
