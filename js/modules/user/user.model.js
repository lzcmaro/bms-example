define(['backbone', 'common'], function(Backbone, Common) { 
  /**
   * 用户列表数据模型（带分页，和jquery.easyui datagrid要求的数据保持一致）
   */
  return Backbone.Model.extend({
    urlRoot: function() {
      return Common.prefix + 'users'
    },
    defaults: {
      total: 0, // 数据总行数
      rows: [] // 当前页数据集
    },
    onChange: function() {
      console.log('onChange', this)
    }
  });
});
