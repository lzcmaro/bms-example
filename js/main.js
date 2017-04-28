require.config({
  // urlArgs: "rmd=" + +new Date,
  waitSeconds: 0,
  baseUrl: 'js', //依赖相对路径
  paths: {
    jquery: 'lib/jquery.min',
    bootstrap: 'lib/bootstrap/js/bootstrap.min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone',
    // 'backbone.radio': 'lib/backbone.radio',
    marionette: 'lib/backbone.marionette.min',
    text: 'lib/text.min', //用于requirejs导入html类型的依赖
    moment: 'lib/moment/moment.min',
    momentLocale: 'lib/moment/locale/zh-cn'
  },
  shim: { //引入没有使用requirejs模块写法的类库。backbone依赖underscore
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'marionette': {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  }
});

require([
  'marionette', 
  'app'
  ], function(Marionette, App) {
    App.start();
  });
