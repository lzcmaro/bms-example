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

    'easyui-draggable': 'lib/jquery-easyui-1.5.2/plugins/jquery.draggable',
    'easyui-droppable': 'lib/jquery-easyui-1.5.2/plugins/jquery.droppable',
    'easyui-tree': 'lib/jquery-easyui-1.5.2/plugins/jquery.tree',

    'easyui-messager': 'lib/jquery-easyui-1.5.2/plugins/jquery.messager',
    'easyui-window': 'lib/jquery-easyui-1.5.2/plugins/jquery.window',
    'easyui-dialog': 'lib/jquery-easyui-1.5.2/plugins/jquery.dialog',
    'easyui-progressbar': 'lib/jquery-easyui-1.5.2/plugins/jquery.progressbar',

    // easyui: 'lib/jquery-easyui-1.5.2/jquery.easyui.min',
    easyuiLocale: 'lib/jquery-easyui-1.5.2/locale/easyui-lang-zh_CN',
    common: 'common/common',
    'marionette.ext': 'common/marionette.ext',
    'jquery.ext': 'common/jquery.ext'
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
    // datagrid
    'easyui-parser': ['jquery'],
    'easyui-panel': ['jquery'],
    'easyui-resizable': ['jquery'],
    'easyui-linkbutton': ['jquery'],
    'easyui-pagination': ['jquery', 'easyui-linkbutton'],
    'easyui-datagrid': ['jquery', 'easyui-parser', 'easyui-panel', 'easyui-resizable', 'easyui-linkbutton', 'easyui-pagination'],
    
    // treegrid
    'easyui-treegrid': ['jquery', 'easyui-datagrid'],
    
    // tree
    'easyui-draggable': ['jquery'],
    'easyui-droppable': ['jquery'],
    'easyui-tree': ['jquery', 'easyui-draggable', 'easyui-droppable'],
    
    // messager
    'easyui-progressbar': ['jquery'],
    'easyui-window': ['jquery'],
    'easyui-dialog': ['jquery', 'easyui-window', 'easyui-linkbutton'],
    'easyui-messager': ['jquery', 'easyui-dialog', 'easyui-linkbutton', 'easyui-progressbar'],
    
    // easyui locale 本地化
    easyuiLocale: ['jquery', 'easyui-datagrid', 'easyui-treegrid', 'easyui-tree', 'easyui-messager'],
    
    'jquery.ext': ['jquery', 'bootstrap', 'easyuiLocale', 'common'],
    'marionette.ext': ['jquery', 'marionette', 'easyuiLocale'],

    // app 这里把一些插件类的库先加载了，方便后面使用
    app: ['bootstrap', 'jquery.ext', 'marionette.ext', 'slimScroll']
  }

});

require(['app'], function(App) {
  App.start();
});
