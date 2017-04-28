define(['marionette', 'modules/home/header.view', 'modules/home/sidebar.view', 'modules/home/main.view', 'modules/account/account.model'], 
  function(Marionette, HeaderView, SidebarView, MainView, Account) {
    return Marionette.Object.extend({
      initialize: function() {
        console.log('App.Controller is initialized.');        
        this.account = new Account();
      },
      index: function() {
        App.root.showChildView('header', new HeaderView({model: this.account}));
        App.root.showChildView('sidebar', new SidebarView());
        App.root.showChildView('main', new MainView());
        // 加载登陆用户信息
        this.account.fetch();
        this.account.set({loginName: 'admin', userName: 'Admin'})
      },
      defaultAction(action) {
        console.log('defaultAction', action)
      }
    })
  });
