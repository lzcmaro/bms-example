define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'app.layout', 
  'app.model',
  'app.controller', 
  'app.router',
  'config',
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
  AppCtrl, 
  AppRouter, 
  Config, 
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
      this.router = new AppRouter({controller: new AppCtrl()});

    },
    onStart: function() {
      console.log('App started.');
      var that = this;
      // 加载用户信息以及系统菜单列表数据
      this.model.fetch().done(function() {
        // 监听路由变化
        Backbone.history.start();
      });
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

  return App;
});
