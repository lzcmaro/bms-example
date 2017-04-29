define([
  'marionette', 
  'modules/home/header.view', 
  'modules/home/sidebar.view', 
  'modules/home/main.view', 
  'modules/account/account.model',
  'modules/home/menu.collection'
], function(Marionette, HeaderView, SidebarView, MainView, Account, MenuList) {
  return Marionette.Object.extend({
    initialize: function() {
      console.log('App.Controller is initialized.');
      this.account = new Account();
      this.menuList = new MenuList();
    },
    index: function() {
      App.root.showChildView('header', new HeaderView({model: this.account}));
      App.root.showChildView('sidebar', new SidebarView({collection: this.menuList}));
      App.root.showChildView('main', new MainView());
      // 加载登陆用户信息
      this.account.fetch();
      // 加载菜单数据
      this.menuList.fetch();
    },
    defaultAction(action) {
      console.log('defaultAction', action)
    }
  })
});
