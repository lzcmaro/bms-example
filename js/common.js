;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  global.Common = factory(global.jQuery)
}(this, function ($) {
  var Util = function() {
    //...
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

  return new Util();
}));
