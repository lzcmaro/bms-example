define([
  'jquery',
  'underscore',
  'backbone', 
  'config'
], function($, _, Backbone, Config) { 
  /**
   * 为方便在header-view, sidebar-view中绑定对应的model, collection
   * 这里的account, menuList设为Backbone.Model, Backbone.Collection类型
   */
  
  // 登录用户Model
  var Account = Backbone.Model.extend({
    url: Config.prefix + 'account',
    // 这里需要设置默认值，避免在绑定该model的视图中，首次取不到值而报变量未定义的错误
    defaults: {
      name: null,
      loginName: null
    },
    /**
     * TODO: 登出
     */
    loginOut: function() {}
  });

  // 单菜项Model
  var Menu = Backbone.Model.extend({
    defaults: {
      url: null,
      label: null,
      icon: null,
      children: []
    },
    initialize: function() {
      /**
       * 为方便在页面模板中直接使用数据，这里对数据作过滤处理
       */
      var filter = function(list) {
        if (!list || list.length <= 0) return;

        _.each(list, function(item) {
          if (!item.url || item.url === '#') {
            // 设置默认的url为javascript:;
            item.url = 'javascript:;'
          } else {
            // 当前应用使用的是hash方式的路由，这里给url添加#
            item.url = '#' + item.url
          }

          item.children && filter(item.children)
        });

        return list
      }

      this.on('add', function(model) {
        var list = filter([model.toJSON()]);
        // 传入silent:true参数，避免其触发change事件
        model.set(list[0], {silent: true});     
      })
    }
  });

  // 菜单列表Collection
  var MenuList = Backbone.Collection.extend({
    url: Config.prefix + 'menus',
    model: Menu
  });

  return Backbone.Model.extend({
    defaults: {
      account: new Account(),
      menuList: new MenuList()
    },
    /**
     * app.model 由account + menus组成，它们为两个接口，这里需要重载fetch()
     */
    fetch: function(options) {
      var that = this;
      options || (options = {});
    
      return $.when(
        $.ajax({
          url: Config.prefix + 'account',
          method: 'GET'
        })
        .done(function(resp) {
          that.get('account').set(resp)
        }),

        $.ajax({
          url: Config.prefix + 'menus',
          method: 'GET'
        })
        .done(function(resp) {
          that.get('menuList').set(resp)
        })
      )
      /**
       * ajaxArgs[0]: data, ajax[1]: textStatus, ajax[2]: jqXHR
       */
      .done(function(ajaxArgs) {
        if (options.success) {
          options.success.call(options.context, that, ajaxArgs[2], options)
        }
      })
      .fail(function(resp) {
        if (options.error) {
          options.error.call(options.context, that, resp, options)
        }
      });
    }
  })
});
