;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('jquery'), require('underscore'), require('marionette'), require('common')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'underscore', 'marionette', 'common'], factory) :
  factory(global.jQuery, global._, global.Marionette, global.Common)
}(this, function ($, _, Mn, Common) {
  'use strict';

  /**
   * jquery.easyui datagrid 的默认参数配置
   */
  var defaultGridOptions = {
    idField: 'id',
    fitColumns: true,
    // fixed: true,
    rownumbers: true,
    singleSelect: true,
    pagination: true,
    pageSize: 20
  };
  var noop = function() {};
  /**
   * DatagridView
   * 数据网格，扩展自Marionette.View，结合jquery.easyui datagrid做数据展示
   */
  Mn.DatagridView = Mn.View.extend({
    template: false,
    tagName: 'table',
    className: 'easyui-datagrid',
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
    onRender: function() {
      console.log('DatagridView is rendered.')
    },
    /**
     * jquery.easyui datagrid 需要在attach中初始化
     * 不然，因为DOM未挂载，会导致datagrid显示空白
     */
    onAttach: function() {
      this.$el.datagrid(this._getGridOptions());
      // 给操作按钮.link委派click事件
      // 注意的是，表格数据并没有显示在this.$el上面，所以不能在this.events中处理
      this.$el.parent().on('click', '.link', _.bind(this.onLinkClick, this));
    },
    onLinkClick: function(evt) { 
      console.log('onLinkClick', evt.currentTarget);
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

      return $.extend(defaultGridOptions, {loader: _.bind(this.fetch, this)}, gridOptions)
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
    },
    resize: function() {
      this.$el.datagrid('resize')
    },
    getGridEl: function() {
      return this.$el
    }
  });


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
