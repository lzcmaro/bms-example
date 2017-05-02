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
    slimScroll: 'lib/slimScroll/jquery.slimScroll.min',
    easyui: 'lib/jquery-easyui-1.5.2/jquery.easyui.min',
    easyuiLocale: 'lib/jquery-easyui-1.5.2/locale/easyui-lang-zh_CN'
  },
  shim: { //引入没有使用requirejs模块写法的类库。backbone依赖underscore
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['backbone', 'backbone.radio'],
      exports: 'Marionette'
    },
    bootstrap: ['jquery'],
    slimScroll: ['jquery'],
    momentLocale: ['moment'],
    easyui: ['jquery'],
    easyuiLocale: ['easyui']
  }
});

require([
  'marionette', 
  'app',
  'bootstrap',
  'slimScroll',
  'easyuiLocale'
], function(Marionette, App) {
  App.start();
});
