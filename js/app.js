define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'app.layout', 
  'app.model', 
  'app.router',
  'app.controller',
  'common',
  'modules/main/header.view', 
  'modules/main/sidebar.view', 
  'modules/main/main-header.view'
], function(
  $, 
  _, 
  Backbone, 
  Marionette, 
  LayoutView, 
  AppModel, 
  AppRouter, 
  AppController,
  Common,
  HeaderView, 
  SidebarView, 
  MainHeaderView
) {
  'use strict';

  var App = Marionette.Application.extend({
    initialize: function(options) {
      console.log('App initialize.');
      // TODO: 登录校验  

      
      // 设置app.model，方便后面使用
      this.model = new AppModel();
      // 注册layoutView
      this.root = new LayoutView(/*{model: this.model}*/);

      // 初始化事件管道
      this.headerChannel = Backbone.Radio.channel(Common.channel.header);
      this.sidebarChannel = Backbone.Radio.channel(Common.channel.sidebar);
      this.mainChannel = Backbone.Radio.channel(Common.channel.main);
      this.channel = Backbone.Radio.channel(Common.channel.app); 
    },
    onBeforeStart: function() {
      console.log('App before:start.');
      // 初始化AppController，先渲染LayoutView();
      this.controller = new AppController();
      // 由于AppRouter需要加载系统菜单，放在了onStart()中初始化
      // this.router = new AppRouter({controller: this.controller});
      
      /**
       * view与view间的通信通过App来调度（统一使用Application.vent事件聚合器）
       * ----------------------------------------------------------------
       */ 
      this.headerChannel.on({
        /**
         * 切换sidebar面板样式
         */
        'header:toggle-sidebar': function() {
          var $body = $('body');
          var collapsed = $body.hasClass('sidebar-collapse');
          var transEndEventName = Common.getTransEndEventName();

          // 监听sidebar的transitionend事件
          // 在tarnsform结束后，才通知其它view
          $('#sidebar .main-sidebar').one(transEndEventName, function(){
            // 保险起见，这里在动画结束后，延时100毫秒处理
            setTimeout(function() {
              window.App.sidebarChannel.trigger('sidebar:toggle-sidebar', !collapsed);
              window.App.mainChannel.trigger('main:toggle-sidebar', !collapsed);
            }, 100)
          });
          // 切换sidebar样式
          $body.toggleClass('sidebar-collapse', !collapsed);         
        },
        /**
         * TODO: 登出
         */
        'header:signout': function() {}
      });
    },
    onStart: function() {   
      var that = this;
      // 加载用户信息以及系统菜单列表数据
      this.model.fetch()
        .done(_.bind(this.initAppRouter, this))
        .done(function() {
          // 广播路由初始化完成事件，以便让AppController做路由监听处理
          that.channel.trigger('app:router-initialized');
        })
        .done(function() {
          // 监听路由变化
          Backbone.history.start();
          // that.channel.trigger('app:started');
          console.log('App started.');
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

      // 添加404路由
      // 没把它内置在appRoutes中，是因为它的优先级比routes要高，
      // 先设置的话，会导致后面设置的routes无效，都转到了AppController中
      // 故只在AppRouter中，设置了appRoutes: {'': 'index'}首页的路由
      routes['*action'] = '__not_found__';

      // 初始化Router
      // 对于routes，它会自动设值到this.routes中
      this.router = new AppRouter({routes: routes, controller: this.controller});
    },
    /**
     * 获取路由数据（根据系统菜单生成）
     * @return {Object} 返回一个map数据，key为路由地址，value包括route, title
     */
    getAppRoutes: function() {
      var routeMap = {}, menuList = this.model.get('menuList').toJSON(), loop;

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
    var rootLayout = this.root;

    // 监听当前将要被挂载的view的before:detach事件，在detach前，把.box面板设为隐藏
    view.on('before:detach', function() {
      rootLayout.$el.find('#main .content .box').hide();
    })

    // 显示被隐藏的.box面板
    rootLayout.$el.find('#main .content .box').show();
    // TODO: main-content 视图更新后，用slimScroll插件来做内容滚动处理？
    rootLayout.showChildView('main-content', view);
    // this.mainChannel.trigger('main-content:shown');
  };

  /**
   * 判断当前路由是否有效
   * @param  {String} route 路由地址
   * @return {Boolean}      如果当前路由地址在App.routeMap能找到，说明它是有效的
   */
  App.prototype.isValidRoute = function(route) {
    return !!this.routeMap[route]
  };

  /**
   * 用于在系统层面上显示提示信息，采用$.tips的方式，并默认指定了其target和className
   * @param  {String} msg      显示的信息
   * @param  {String} type     tip类型：success, info, warning, danger
   * @param  {Boolean} autoClose 是否自动关闭
   */
  App.prototype.showMessage = function(msg, type, autoClose) {
    $.tips({
      className: 'tips-app',
      target: '#main > .content-wrapper',
      type: type,
      msg: msg,
      autoClose: autoClose
    })
  };


  // 实例化Application，并设值到window，便于后面使用
  return window.App = new App();
});
