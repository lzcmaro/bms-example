define(['backbone', 'config'], function(Backbone, Config) {
  return Backbone.Model.extend({
    urlRoot: function() {
      return Config.prefix + 'account'
    },
    defaults: {
      loginName: '',
      userName: ''
    },
    /**
     * 登出
     * 这里直接
     */
    loginOut: function() {

    }
  })
})