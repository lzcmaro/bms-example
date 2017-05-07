/**
 * 重写jQuery.ajax()
 * 1，补全请求地址
 * 2，添加默认header等配置
 * 3, 统一处理数据异常
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
      // 这里把error, success设为空涵数，统一在$.ajax().done().fail()中处理
      // 避免有些地方使用了$.ajax().done().fail()这样的方式，从而导致没控制到
      error: noop,
      success: noop,
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
    return _ajax(url, _options)
      .done(function(data, textStatus, jqXHR) {
        // Something
        fn.success.call(this, data, textStatus, jqXHR);
      })
      .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        var status = XMLHttpRequest.status,
          defaultMsg = '系统出错了，请稍候重试。', 
          errorMsg;

        // 异务异常处理
        // Unauthorized 未登录，没有权限
        if (status === 401) {
          return location.href = '/login.html';
        }

        try {
          errorMsg = $.parseJSON(XMLHttpRequest.responseText).error || defaultMsg;
        } catch(e) {
          errorMsg = defaultMsg;
        }

        // 其它错误
        $.alert({
          title: '错误',
          msg: errorMsg,
          icon: 'error'
        });

        // 这里不在$.alert()的回调中触发，因为如果外边使用的是$.ajax().fail()的方式，
        // 它的fail()会在$.alert()关闭前先触发，这里保持行为一致
        fn.error.call(this, XMLHttpRequest, textStatus, errorThrown);
      });
  };
})(jQuery);



/**
 * Tip, Alert, Confirm, Prompt, Modal
 * 由于系统引用了easyui, bootstrap，为方便调用，这里统一提供对外接口（都挂载到jQuery下）
 */
(function($) {
  var noop = function() {};
  // easyui messager
  var messager = $.messager || {};

  /**
   * Easyui messager.alert
   * ---------------------------------------
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
   * ---------------------------------------
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
   * ---------------------------------------
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
   * Tip 扩展于 bootstrap alert
   * 由于easyui 已存在 alert，这里把bootstrap alert封装成tip
   * ---------------------------------------
   */
  $.tips = function(options) {
    var defaultOptions = {
      target: 'body', // 指定tip显示时的目标位置，默认显示在body下。类型为String(Selector)或jquery对象
      type: 'info', // 类型，分别有success, info, warning, danger
      className: null, // 自定义样式类
      msg: '', // 显示的提示信息
      closeButton: true, // 是否显示关闭按钮
      autoClose: true, // 是否自动关闭
      duration: 2500 // 自动隐藏的时间间隔，毫秒
    };

    var tpl = '<div class="tips alert" role="alert" aria-hidden="true"></div>';
    var closeButtonTpl = '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                       +   '<span aria-hidden="true">&times;</span>'
                       + '</button>';
    var $tips = $(tpl);
    var tipOptions = $.extend({}, defaultOptions, options);
    var timer;

    if (tipOptions.closeButton !== false) {
      $tips.addClass('alert-dismissible').append(closeButtonTpl);
    }

    if (tipOptions.autoClose !== false) {
      timer = setTimeout(function() {
        $tips.alert('close')
      }, tipOptions.duration || defaultOptions.duration)
    }

    $tips.append(tipOptions.msg)
      .addClass('alert-' + tipOptions.type || defaultOptions.type)
      .addClass(tipOptions.className); 

    // 添加$tips.close方法，方便外边调用
    $tips.close = function() {
      return $(this).alert('close');
    }
    // 监听它的close事件，使用jquery slideUp动效
    $tips.on('close.bs.alert', function() {
      var $this = $(this);
      $this.slideUp('slow', function() {
        // 由于阻止了默认的关闭事件，这里需要手动remove
        $this.remove();
      });

      // 销毁timer
      clearTimeout(timer);
      timer = null;

      // 阻击原来$.fn.alert('close')的事件，否则动效出现不了
      return false;
    });

    return $tips.appendTo(tipOptions.target).alert().slideDown('slow');

  };
  

  

  /**
   * Modal 扩展于 bootstrap modal
   * ---------------------------------------
   */
  $.modal = function (options) {
    var defaultOptions = {
      show: true, // 初始化时是否显示
      backdrop: true, // 是否显示遮盖层
      keyboard: true, // 是否在按下键盘ESC键时，关闭弹层
      className: '', // 添加到modal-dialog中的样式
      header: true, // 是否显示Modal header
      closeButton: true, // 是否显示Modal header中的关闭按钮
      title: '', // Modal header显示的Title
      body: '', // Modal body显示的内容，可为jquery实例对象或者HTML String
      buttons: [{
        text: '确定',
        handler: 'close'
      }] // Modal footer显示的按钮，如果为空，Modal footer将不显示
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
    
    var $modal = $(tpl),
      $body = $modal.find('.modal-body'),
      modalOptions = $.extend({}, defaultOptions, options),
      $header, $footer;

    $body.html(modalOptions.body);

    if (modalOptions.header !== false) {
      $header = $(headerTpl).insertBefore($body);
      if (modalOptions.closeButton !== false) {
        $(buttonTpl)
          .html('<span aria-hidden="true">&times;</span>')
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
    
    // 添加自定义class到modal-dialog中
    $modal.appendTo('body').find('.modal-dialog').addClass(modalOptions.className);

    // 重写$modal.hide(), $modal.show()，方便外面使用
    $modal.show = function() {
      return $(this).modal('show')
    }
    $modal.hide = function() {
      return $(this).modal('hide')
    }

    
    // 调用jquery.fn.modal弹出modal层，并返回当前modal的jquery对象
    return $modal.modal(modalOptions);
  };
})(jQuery);
