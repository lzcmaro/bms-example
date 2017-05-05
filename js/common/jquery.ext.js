;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('../lib/jquery/jquery.min'), require('./common')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'common'], factory) :
  factory(global.jQuery, global.Common)
}(this, function ($, Common) {
  'use strict';

  /**
   * 重写jQuery.ajax()
   * 1，补全请求地址
   * 2，添加默认header等配置
   * 3, TODO: 统一处理数据异常
   */
  
  // 备份原来的$.ajax;
  var _ajax = $.ajax; 
  // 重写$.ajax
  $.ajax = function(url, options) {
    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    var noop = function() {};

    // 默认配置
    var defaultOptions = {
      headers: {}, // TODO: 添加默认的header信息
      dataType: 'json',
      contentType: 'application/json'
    };

    // 备份原来的error, success, beforeSend, complete方法
    var fn = {
      error: options.error || noop,
      success: options.success || noop,
      beforeSend: options.beforeSend || noop,
      complete: options.complete || noop
    };

    // 补全URL地址，仅当设置了autoCompleteUrl:false时，才不设置
    if (options.autoCompleteUrl !== false) {
      url = Common.prefix + (url || options.url)
    }


    var _options = $.extend(true, defaultOptions, options, {
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        // Something
        fn.error.call(this, XMLHttpRequest, textStatus, errorThrown);
      },
      success: function(data, textStatus, jqXHR) {
        // Something
        fn.success.call(this, data, textStatus, jqXHR);
      },
      beforeSend: function(XMLHttpRequest) {
        // Something
        fn.beforeSend.call(this, XMLHttpRequest)
      },
      complete: function(XMLHttpRequest, textStatus) {
        // Something
        fn.complete.call(this, XMLHttpRequest, textStatus)
      }
    });

    // 调用原来的ajax方法
    return _ajax(url, _options);
  };
  
}));
