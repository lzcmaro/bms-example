;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    && typeof require === 'function' ? module.exports = factory(require('jquery'), require('underscore'), require('marionette')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'underscore', 'marionette'], factory) :
  factory(global.jQuery, global._, global.Marionette)
}(this, function ($, _, Mn) {
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
      var options = this.options || {};
      // 这里定义了loader，在datagrid请求数据时，将调用我们定义的方法，即这里的this.fetch()
      var gridOptions = $.extend(defaultGridOptions, {loader: this.fetch.bind(this)}, options.gridOptions);
      // TODO：操作列封装
      this.$el.datagrid(gridOptions);
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
      var queryParams = {};
      

      // 如果当前方法不是从jquery.easyui datagrid 触发，这里把param设置到datagrid queryParams中
      // 以便在点击分页按钮时，可以带上这些查询参数
      if (!$.isFunction(success) || !$.isFunction(error)) {
        $grid.datagrid({ queryParams: param });
      }

      // 清空this.model，避免存在脏数据
      this.model.clear({silent: true});
      // 显示loading层
      $grid.datagrid('loading');
      // fetch 可能是jquery.easyui datagrid的loader触发，也可能是外部调用
      // 在外部调用时，这里需要带上当前的分页参数（page, rows）
      if (opts.pagination) {
        $.extend(queryParams, param, {
          page: opts.pageNumber,
          rows: opts.pageSize
        })
      }
      this.model.fetch({data: queryParams});
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
