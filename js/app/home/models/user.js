define([], function() {
  return Backbone.Model.extend({

    //模型默认的数据
    defaults: function() {
      return {
        loginName: 'admin',
        userName: 'Admin'
      }
    }

  })
});
