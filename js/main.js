require.config({
  // urlArgs: "rmd=" + +new Date,
  waitSeconds: 0,
  baseUrl: 'js', //依赖相对路径
  paths: {
    jquery: 'lib/jquery/jquery.min',
    bootstrap: 'lib/bootstrap/js/bootstrap.min',
    underscore: 'lib/underscore/underscore',
    backbone: 'lib/backbone/backbone',
    'backbone.radio': 'lib/marionette/backbone.radio',
    marionette: 'lib/marionette/backbone.marionette',
    text: 'lib/text/text.min', //用于requirejs导入html类型的依赖
    moment: 'lib/moment/moment.min',
    momentLocale: 'lib/moment/locale/zh-cn',
    slimScroll: 'lib/slimScroll/jquery.slimScroll.min'
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
      deps: ['backbone', 'backbone.radio'],
      exports: 'Marionette'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'slimScroll': {
      deps: ['jquery']
    }
  }
});

require([
  'marionette', 
  'app',
  'bootstrap',
  'slimScroll'
], function(Marionette, App) {
  App.start();
});
