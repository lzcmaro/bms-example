define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'app.layout', 
  'app.controller', 
  'app.router',
  'config'
], function($, _, Backbone, Marionette, LayoutView, AppCtrl, AppRouter, Config) {

  'use strict';

  var App = Marionette.Application.extend({
    initialize: function(options) {
      console.log('App initialized', options);
      // TODO: 登录校验   
    },
    onBeforeStart: function() {
      console.log('App before start.');
      // TODO: APP显示的用户信息、菜单改成Notification方式，由Backbone.Radio实现
      // 在APP中分别加载用户信息与及菜单列表，加载成功后，通知HeaderView, SidebarView更新

      // 初始化router
      this.router = new AppRouter({controller: new AppCtrl()});
      // 注册layoutView
      this.root = new LayoutView();

      /**
       * view与view间的通信通过App来调度（统一使用Application.vent事件聚合器）
       * ----------------------------------------------------------------
       */
      this.headerChannel = Backbone.Radio.channel(Config.channel.header);
      // this.sidebarChannel = Backbone.Radio.channel(Config.channel.sidebar);
      // this.mainChannel = Backbone.Radio.channel(Config.channel.main);
      
      
      this.headerChannel.on({
        /**
         * 切换sidebar面板样式
         */
        'toggle:sidebar': function() {
          $('body').toggleClass('sidebar-collapse')
        },
        /**
         * TODO: 登出
         */
        'account:signout': function() {
          console.log('account:signout')
        }
      });

    },
    onStart: function() {
      console.log('App started.', this);
      // 监听路由变化
      Backbone.history.start();
    }
  });

  // 实例化Application，并设值到window，便于后面使用
  window.App = App = new App();   

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
