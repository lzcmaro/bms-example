;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.Config = factory()
}(this, function () {
  return {
    /**
     * 与后端接口交互的地址前缀
     */
    prefix: '/api/',
    /**
     * view之间的通信，基于事件管道Backbone.Radio
     * 这里定义各管道的名称，便于后面获取
     */
    channel: {
      header: 'header-channel',
      sidebar: 'sidebar-channel',
      main: 'main-channel'
    }
  }
}));
