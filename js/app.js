define(['jquery', 'underscore', 'backbone', 'marionette', 'app.layout', 'app.controller', 'app.router'],
  function($, _, Backbone, Marionette, RootLayout, AppCtrl, AppRouter) {

    'use strict';

    // 实例Application对象，并设值到window中，便于后面使用
    var App = window.App = new Marionette.Application();

    var initialize = function(options) {
      console.log('App.initialize', options);
      // 初始化router
      App.router = new AppRouter({controller: new AppCtrl()});

      /**
       * view与view间的通信通过App来调度（统一使用Application.vent事件聚合器）
       * ----------------------------------------------------------------
       */
      
      /**
       * 切换sidebar面板样式
       */
      App.vent.on('toggle:sidebar', function() {
        $('body').toggleClass('sidebar-collapse')
      });
    }

    // initialise everything here
    App.on('before:start', function() {
      // 注册layoutView
      this.root = new RootLayout();
      this.addInitializer(initialize);
    });

    // start the navigation history
    App.on('start', function() {
      console.log('App is started.');
      Backbone.history.start();
    });

    // use jst templates by overriding marionette render
    // Marionette.Renderer.render = function(template, data) {
    //   // allow No template
    //   if (template === undefined) {
    //     return '';
    //   }
    //   if (!window.JST[template]) {
    //     throw 'Template "' + template + '" not found!';
    //   }
    //   // underscore create a template
    //   return _.template(JST[template](data));
    // };


    return App;
  });
