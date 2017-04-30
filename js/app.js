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
  'modules/home/header.view', 
  'modules/home/sidebar.view', 
  'modules/home/main.view'
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
      $('body').toggleClass('sidebar-collapse')
    },
    /**
     * TODO: 登出
     */
    signout: function() {}
  });


  App.sidebarChannel.on({
    // 切换路由
    goto: function(url) {
      if (!url || url === '#' || url === 'javascript:;') return false;
      // TODO: 在主视图添加导航面包屑？创建新的tab页？
    }
  });



  /**
   * 由于 Marionette.Renderer.render 在获取template时，
   * 返回的html()的内容，是转义后的（详见Marionette.TemplateCache.prototype.loadTemplate）
   * 从而导致如果直接使用原模板，其数据将无法被显示
   * 这里为方便在 Marionette.View 中使用（不需使用_.template(tpl)这样的方式），重写 Marionette.Renderer.render
   */
  Marionette.Renderer.render = function(template, data) {
    if (!template) {
      throw new Marionette.Error({
        name: 'TemplateNotFoundError',
        message: 'Cannot render the template since its false, null or undefined.'
      });
    }

    // 在 Marionette.TemplateCache.get() 中，最终调用的是_.template()返回的template string
    // 由于在_.template()前，模板已被转义，这里设置_.template()用于替换数据的正规表达式
    var templateSettings = {
      evaluate    : /&lt;%([\s\S]+?)%&gt;/g,
      interpolate : /&lt;%=([\s\S]+?)%&gt;/g,
      escape      : /&lt;%-([\s\S]+?)%&gt;/g
    };
    var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template, templateSettings);
    return templateFunc(data);
  };

  return App;
});
