define(['backbone', 'common'], function(Backbone, Common) { 
  return Backbone.Model.extend({
    urlRoot: function() {
      return '/users'
    },
    // 数据校验
    // 它可以返回一个用来显示的字符串错误信息，或一个以编程方式描述错误的完整错误对象。
    validate: function(attrs, options) {
      if (!Common.regex.tel.test(attrs.tel)) {
        return '手机号码不正确。'
      }
    }
  });
});
