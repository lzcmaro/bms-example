define(['backbone'], function(Backbone) { 
  /**
   * 用户列表数据模型（带分页，和jquery.easyui datagrid要求的数据保持一致）
   */
  return Backbone.Model.extend({
    url: '/user-paging',
    defaults: {
      total: 0, // 数据总行数
      rows: [] // 当前页数据集
    }
  });
});
