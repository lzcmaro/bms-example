define(['backbone'], function(Backbone) { 
  return Backbone.Model.extend({
    urlRoot: function() {
      return '/users'
    }
    // TODO: 数据校验
  });
});
