/**
 * 重写jQuery.ajax()
 * 1，补全请求地址
 * 2，添加默认header等配置
 * 3, TODO: 统一处理数据异常
 */
(function($) {
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
      url = window.Common.prefix + (url || options.url)
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
})(jQuery);



/**
 * Alert, Confirm, Prompt, Modal
 * 由于系统引用了easyui, bootstrap，为方便调用，这里统一提供对外接口（都挂载到jQuery下）
 */
(function($) {
  var noop = function() {};
  // easyui messager
  var messager = $.messager || {};

  /**
   * Easyui messager.alert
   * Parameters:
      title: The title text to be showed on header panel.
      msg: The message text to be showed.
      icon: The icon image to be showed. Available value are: error,question,info,warning.
      fn: The callback function triggered when clicking on the OK button.
      
      The configuration object can be passed to the function argument.
      Code example:

      $.messager.alert('My Title','Here is a info message!','info');
      $.messager.alert({
        title: 'My Title',
        msg: 'Here is a message!',
        fn: function(){
          //...
        }
      });
   */
  $.alert = messager.alert || noop;
  /**
   * Easyui messager.confirm
   * Parameters:
      title: The title text to be showed on header panel.
      msg: The message text to be showed.
      fn(b): The callback function, when user click Ok button, pass a true value to function, otherwise pass a false to it.
      
      The configuration object can be passed to the function argument.
      Code example:

      $.messager.confirm('Confirm', 'Are you sure to exit this system?', function(r){
        if (r){
          // exit action;
        }
      });
      $.messager.confirm({
        title: 'My Title',
        msg: 'Are you confirm this?',
        fn: function(r){
          if (r){
            alert('confirmed: '+r);
          }
        }
      });
   */
  $.confirm = messager.confirm || noop;
  /**
   * Easyui messager.prompt
   * Parameters:
      title: The title text to be showed on header panel.
      msg: The message text to be showed.
      fn(b): The callback function, when user click Ok button, pass a true value to function, otherwise pass a false to it.
      The configuration object can be passed to the function argument.
      Code example:

      $.messager.confirm('Confirm', 'Are you sure to exit this system?', function(r){
        if (r){
          // exit action;
        }
      });
      $.messager.confirm({
        title: 'My Title',
        msg: 'Are you confirm this?',
        fn: function(r){
          if (r){
            alert('confirmed: '+r);
          }
        }
      });
   */
  $.prompt = messager.prompt || noop;

  

  /**
   * Modal defalt options
   */
  var defaultOptions = {
    show: true, // 初始化时是否显示
    backdrop: true, // 是否显示遮盖层
    keyboard: true, // 是否在按下键盘ESC键时，关闭弹层
    className: '', // 添加到modal-dialog中的样式
    header: true, // 是否显示Modal header
    closeButton: true, // 是否显示Modal header中的关闭按钮
    title: '', // Modal header显示的Title
    body: '', // Modal body显示的内容，可为jquery实例对象或者HTML String
    buttons: null // Modal footer显示的按钮，如果为空，Modal footer将不显示
    /**
     * buttons：
     *  [{ 
          text: '关闭', // 按钮显示的文本
          className: 'btn-default', // 按钮的样式，默认最后一个为btn-primary，其它为btn-default
          handler: 'close' // 如果仅仅需要关闭弹层，可指定handler:'close'，否则指定handler事件
        }, {
          text: '确定',
          className: 'btn-primary',
          handler: null
        }]
     */
  };
  var tpl = '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
          +   '<div class="modal-dialog">'
          +     '<div class="modal-content">'
          +       '<div class="modal-body"></div>'
          +     '</div>'
          +   '</div>'
          + '</div>';

  var headerTpl = '<div class="modal-header"></div>';
  var footerTpl = '<div class="modal-footer"></div>';
  var buttonTpl = '<button type="button"></button>';

  /**
   * 封装bootstrap modal
   * @param {Object} options modal配置，见上面的defaultOptions
   */
  function modal(options) {
    var $modal = $(tpl),
      $body = $modal.find('.modal-body'),
      modalOptions = $.extend({}, defaultOptions, options),
      $header, $footer;

    if (modalOptions.header === true) {
      $header = $(headerTpl).insertBefore($body);
      if (modalOptions.closeButton === true) {
        $(buttonTpl)
          .html('×')
          .addClass('close')
          .attr('data-dismiss', 'modal') // 让bootstrap关联modal的关闭事件
          .appendTo($header);
      }
      $header.append('<h4 class="modal-title">' + modalOptions.title + '</h4>');
    }

    if (modalOptions.buttons && modalOptions.buttons.length) {
      $footer = $(footerTpl).insertAfter($body);

      // 添加footer中的按钮
      $.each(modalOptions.buttons, function(index, btn) {
        var $btn = $(buttonTpl)
          .html(btn.text)
          .addClass('btn')
          // 如果没指定className，默认最后一个为btn-primary，其它为btn-default
          .addClass(btn.className || (index === modalOptions.buttons.length - 1 ? 'btn-primary' : 'btn-default'))
          .appendTo($footer);

        // 如果handler指定为close，为其添加data-dismiss属性，让bootstrap处理关闭事件
        if (btn.handler === 'close') {
          $btn.attr('data-dismiss', 'modal')
        } 
        // 如果handler指定为function，为该按钮添加点击事件，并处理回调
        else if ($.isFunction(btn.handler)) {
          $btn.on('click', btn.handler);
        }
      });
    }

    $body.html(modalOptions.body);
    $modal.appendTo('body').find('.modal-dialog').addClass(modalOptions.className);
    
    // 调用jquery.fn.modal弹出modal层，并返回当前modal的jquery对象
    return $modal.modal(modalOptions);
  };

  $.modal = modal;
})(jQuery);
