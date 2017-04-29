;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  global.Common = factory(global.jQuery)
}(this, function ($) {
  return {}
}));
