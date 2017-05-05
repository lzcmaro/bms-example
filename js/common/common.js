;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('../lib/jquery/jquery.min')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  global.Common = factory(global.jQuery)
}(this, function ($) {
  'use strict';

  var Util = function() {
    /**
     * 与后端接口交互的地址前缀
     */
    this.prefix = '/api';
    /**
     * view之间的通信，基于事件管道Backbone.Radio
     * 这里定义各管道的名称，便于后面获取
     */
    this.channel = {
      header: 'header-channel',
      sidebar: 'sidebar-channel',
      main: 'main-channel'
    };
  };
  var fn = Util.prototype;

  /**
   * 首字母大写
   */
  fn.firstUpperCase = function(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/( |^)[a-z]/g, function(L){return L.toUpperCase()});
  };

  /**
   * 转成驼峰式字符串
   */
  fn.toCamelCase = function(str) {
    if (!str) return '';
    return str.replace(/\-(\w)/g, function(all, letter){return letter.toUpperCase()});
  };

  /**
   * 获取当前浏览器下所支持的TransitionEnd的事件名称
   */
  fn.getTransEndEventName = function() {
    var body = document.body || document.documentElement, 
      style = body.style,
      transEndEventNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition   : 'transitionend',
        OTransition     : 'oTransitionEnd otransitionend',
        transition      : 'transitionend'
      };

    for (var name in transEndEventNames) {
      if (typeof style[name] === "string") {
        return transEndEventNames[name]
      }
    }
  }

  return new Util();
}));
