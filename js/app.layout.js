define(['marionette'], function(Marionette) {
  /**
   * RootLayout
   * 在Main视图中，分为两部分：main-header, main-content
   * 其中，main-header由App控制，用于显示当前页面title，后面也可添加导航面包屑等
   * main-content由实际模块控制，用于显示具体的业务视图
   */
  return Marionette.View.extend({
      el: '#container',
      regions: {
        header: '#header',
        sidebar: '#sidebar',
        'main-header': '#main .content-header',
        'main-content': '#main .content .box-body'
      }
    })
});
