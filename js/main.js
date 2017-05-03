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
    'easyui-parser': 'lib/jquery-easyui-1.5.2/plugins/jquery.parser',
    'easyui-panel': 'lib/jquery-easyui-1.5.2/plugins/jquery.panel',
    'easyui-resizable': 'lib/jquery-easyui-1.5.2/plugins/jquery.resizable',
    'easyui-linkbutton': 'lib/jquery-easyui-1.5.2/plugins/jquery.linkbutton',
    'easyui-pagination': 'lib/jquery-easyui-1.5.2/plugins/jquery.pagination',
    'easyui-datagrid': 'lib/jquery-easyui-1.5.2/plugins/jquery.datagrid',
    'easyui-treegrid': 'lib/jquery-easyui-1.5.2/plugins/jquery.treegrid',
    // easyui: 'lib/jquery-easyui-1.5.2/jquery.easyui.min',
    easyuiLocale: 'lib/jquery-easyui-1.5.2/locale/easyui-lang-zh_CN',
    common: 'common/common',
    'marionette.ext': 'common/marionette.ext'
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
    // easyui: ['jquery'],
    'easyui-parser': ['jquery'],
    'easyui-panel': ['jquery'],
    'easyui-resizable': ['jquery'],
    'easyui-linkbutton': ['jquery'],
    'easyui-pagination': ['jquery', 'easyui-linkbutton'],
    'easyui-datagrid': ['jquery', 'easyui-parser', 'easyui-panel', 'easyui-resizable', 'easyui-linkbutton', 'easyui-pagination'],
    'easyui-treegrid': ['jquery', 'easyui-datagrid'],
    easyuiLocale: ['easyui-datagrid', 'easyui-treegrid']
  }
});

require([
  'app',
  'marionette.ext',
  'bootstrap',
  'slimScroll',
  'easyuiLocale'
], function(App) {
  App.start();
});
