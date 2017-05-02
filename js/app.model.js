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
    /**
     * TODO: 登出
     */
    loginOut: function() {}
  });

  // 单菜项Model
  var Menu = Backbone.Model.extend({});

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
