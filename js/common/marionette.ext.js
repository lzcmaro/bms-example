;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('jquery'), require('underscore'), require('marionette'), require('common')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'underscore', 'marionette', 'common'], factory) :
  factory(global.jQuery, global._, global.Marionette, global.Common)
}(this, function ($, _, Mn, Common) {
  'use strict';

  var noop = function() {};


  /**
   * Marionette.DatagridView
   * 继承于 Marionette.View，结合 easyui datagrid 作为表格视图基类
   * ---------------------------------------
   */
  Mn.DatagridView = (function() {
    // easyui datagrid 的默认参数配置
    var defaultOptions = {
      idField: 'id',
      fitColumns: true,
      // fixed: true,
      rownumbers: true,
      singleSelect: true,
      pagination: true,
      pageSize: 20
    };

    var datagridView = Mn.View.extend({
      template: false,
      tagName: 'table',
      className: '__datagrid__',
      initialize: function(options) {
        console.log('DatagridView initialize.', options);
        // 用于保存datagrid columns 配置中的buttons对象
        this.gridColumnButtons = {};
        this.mainChannel = Backbone.Radio.channel(Common.channel.main);
        // sidebar展开或收缩时，刷新datagrid的大小
        this.mainChannel.on('toggle-sidebar', _.bind(this.resize, this));
        // model 的数据发生变化时，调用this._refreshView()刷新datagrid视图
        this.listenTo(this.model, "change", this._refreshView);
        
        // 避免easyui datagrid 插件未加载，而导致后面逻辑报JS错误
        if (!$.fn.datagrid) {
          $.fn.datagrid = noop;
        }
      },
      /**
       * 当前视图在被作为一个childView来渲染的话，它会触发onAttach()事件
       * 而如果被渲染到已存在的element上（外面指定了el属性），它会不会触发onAttach()事件
       * 这里做兼容处理
       */
      onRender: function() {
        console.log('DatagridView is rendered.');
        // 如果this.$el不是默认的，说明外边指定了el属性，这里初始化datagrid
        if (!this.$el.hasClass('__datagrid__')) {
          // 这里延时执行，因为当前DOM还是未attach状态的，可能会导致easyui datagrid在计算宽度时有问题
          setTimeout(_.bind(this.initDatagrid, this), 10);
        }
      },
      onAttach: function() {
        console.log('DatagridView is attached.')
        this.initDatagrid();
      },
      initDatagrid: function() {
        this.$el.datagrid(this._getGridOptions());
        // 给操作按钮.link委派click事件
        // 注意的是，表格数据并没有显示在this.$el上面，所以不能在this.events中处理
        this.$el.parent().on('click', '.link', _.bind(this.onLinkClick, this));
      },
      onLinkClick: function(evt) { 
        var $target = $(evt.currentTarget);
        var field = $target.attr('field');
        var index = $target.index();
        var buttonOptions = (this.gridColumnButtons[field] || {})[index] || {};
        var handler = buttonOptions.handler;
        var $grid, gridData, rowData, rowIndex;

        evt.preventDefault();

        if (!_.isFunction(handler)) return false;

        if (_.isFunction(handler)) {
          $grid = this.getGridEl();
          gridData = $grid.datagrid('getData').rows;
          rowIndex = $target.closest('tr').attr('datagrid-row-index');
          rowData = gridData[rowIndex];

          handler(rowData, rowIndex, evt);
        }
      },
      /**
       * 获取easyui datagrid 的配置信息
       * 这里对传递过来的 gridOptions.columns 做了扩展
       * 可快速配置操作列的按钮显示与事件绑定（不需使用原formatter来处理）
       * TODO: 图标按钮，按钮样式，按钮的其它事件配置
       * 示例如下：
       * [[
       *   {
       *     field: '_opt', 
       *     title: '操作', 
       *     align: 'right',
       *     buttons: [ // 扩展的属性
       *       {
       *         'label': '编辑', // 按钮显示的文本
       *         'handler': func, // 点击按钮时，触发的事件
       *         'formatter': func // 如何显示什么按钮文本的事件，其和原easyui datagrid中的formatter一致
       *       },
       *       {
       *         'label': '详情',
       *         'handler': func
       *       }
       *     ]
       *   }
       * ]]
       */
      _getGridOptions: function() {
        var that = this;
        var gridOptions = (this.options || {}).gridOptions || {};
        var columns = gridOptions.columns;
        var gridColumnButtons = this.gridColumnButtons;

        if (columns && columns.length) {
          // easyui datagrid columns 为数组对象
          // 它的直接子元素也是个数组，可多个，用于配置复杂的、有合并行、列的表格头
          _.each(columns, function(cols) {
            _.each(cols, function(field) {
              if (field.buttons && field.buttons.length) {
                gridColumnButtons[field.field] = field.buttons;
                // 把easyui datagrid columns 中的 formatter 绑定到this._fieldFormatter，方便统一处理
                field.formatter = _.bind(that._fieldFormatter, that, field.field);
              }
            });
          });
        }

        return $.extend({}, defaultOptions, {loader: _.bind(this.fetch, this)}, gridOptions)
      },
      /**
       * easyui datagrid columns 中的 formatter 回调
       * @param {String} field 当前column的field标识
       * @param {String} value 当前column数据，由easyui datagrid返回
       * @param {Object} row 当前row数据，由easyui datagrid返回
       * @param {Number} index 当前row的索引，由easyui datagrid返回
       */
      _fieldFormatter: function(field, value, row, index) {
        var buttonOptions = this.gridColumnButtons[field];
        var className = 'link';
        var link = '<a class="${className}" href="javascript:;" field="${field}">${label}</a>';
        var tpl = '';
        
        if (!buttonOptions || !buttonOptions.length) return;

        _.each(buttonOptions, function(item) {
          var label = _.isFunction(item.formatter) ? item.formatter() : item.label || '';
          tpl += link.replace(/\$\{label\}/g, label || '')
            .replace(/\$\{className\}/, className)
            .replace(/\$\{field\}/, field);
        });

        return tpl;
      },
      _refreshView: function(model) {
        var $grid = this.$el;
        // 关闭easyui.datagrid在request(调用了我们定义的fetch方法)时，显示的loading层
        $grid.datagrid('loaded');
        // 更新数据到datagrid
        $grid.datagrid('loadData', model.toJSON());
        // 当前页面出现滚动条的话，datagrid的宽度计算有问题，这里resize一下
        // TODO: 仅需要在第一次加载时才resize
        this.resize();
      },
      /**
       * 拉取datagrid数据，这里直接调用model.fetch()进行数据拉取
       * @param {Object} param  查询参数
       * @param {Function} success  jquery.easyui datagrid 传递过来的func，用于拉取数据成功时的回调
       * @param {Function} error  jquery.easyui datagrid 传递过来的func，用于拉取数据失败时的回调
       */
      fetch: function(param, success, error) {
        var $grid = this.$el;
        // 获取jquery.easyui datagrid 缓存起来的options
        var data = $grid.data('datagrid');
        var opts = data ? data.options : {};
        

        if (!_.isFunction(success) || !_.isFunction(error)) {
          // 在外部调用时，把param设置到datagrid queryParams中，以便在点击分页按钮时，可以带上这些查询参数
          opts.queryParams = param;

          // 在外部调用时，需要带上当前的分页参数（page, rows）
          if (opts.pagination) {
            $.extend(param, {
              page: opts.pageNumber,
              rows: opts.pageSize
            })
          }
        }

        // 清空this.model，避免存在脏数据
        this.model.clear({silent: true});
        // 显示loading层
        $grid.datagrid('loading');
        // 调用mode.fetch()拉取数据
        this.model.fetch({data: param});

        // 返回当前对象，方便外边链式调用
        return this;
      },
      resize: function() {
        // 避免easyui datagrid 未初始化而报JS错误，这里用try捕获，但不处理异常
        try {
          // 有时候，第一次resize未能正确算出宽度（即使延时执行）
          // 为保险起见，这里调用两次
          this.$el.datagrid('resize').datagrid('resize');
        } catch(e) {};

        // 返回当前对象，方便外边链式调用
        return this;      
      },
      getGridEl: function() {
        return this.$el
      }
    });

    return datagridView;
  })();





  /**
   * Marionette.ModalView 
   * 继承于 Marionette.View，结合 bootstrap modal 作为弹层视图基类
   * ---------------------------------------
   */
  Mn.ModalView = (function() {
    return Mn.View.extend({
      modelEvents: {
        change: 'render'
      },
      initialize: function(options) {
        var defaultOptions = {show: false}, modalOptions;
        // ModalView 可能是 new Mn.ModalView({}) 及 Mn.ModalView.extend({}) 这两种方式定义，这里做兼容处理
        modalOptions = this.modalOptions || (options || {}).modalOptions;
        this.$dialog = $.modal($.extend(defaultOptions, modalOptions));
      },
      render: function() {
        if (!this.$dialog) return this;

        var $dialog = this.$dialog,
          data = this.model.toJSON(),
          modalBody = _.template($(this.template).html())({data: data});

        // 这里把 this.$el append 到 modal-body 上
        // 以保证在 this.$el 上委派的事件有效
        this.$el.html(modalBody).appendTo( $dialog.find('.modal-body') );
        $dialog.show().on('hidden.bs.modal', _.bind(this.__onHidden, this));

        // 返回this，以保持和Marionette.View的行为一致
        return this;
      },
      /**
       * 在 modal 关闭后，把数据清空，避免它在查看相同的数据时，modal层没有显示
       * 因为这个时候，this.model change事件没有触发
       */
      __onHidden: function() {
        // 带上silent参数，清空model后，不触发change
        this.model.clear({silent: true});
      }
    })
  })();





  /**
   * 重写Marionette.View.prototype.serializeData
   * 如果数据为model，把它放到data中，避免在模板中引用变量时出现未定义的错误
   */
  Mn.View.prototype.serializeData = function() {
    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      // 避免在模板中使用变量时出现未定义的错误
      // 这里把model放到data中
      return {
        data: this.serializeModel()
      }
    }

    // Otherwise, we serialize the collection,
    // making it available under the `items` property
    return {
      items: this.serializeCollection()
    };
  
  };
  
}));
