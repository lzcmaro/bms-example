define(['jquery', 'underscore', 'backbone', 'marionette', 'text!modules/home/sidebar.html'], 
  function($, _, Backbone, Marionette, sidebarTemplate) {
    return Marionette.View.extend({
      template: sidebarTemplate,
      className: 'main-sidebar', // AdminLTE 约定的class
      tagName: 'aside',
      collectionEvents: {
        'update': 'render' // this.collection变化时，重新render
      },
      events: {
        'click li a': 'onMenuClick'
      },
      initialize: function(options) {
        console.log('SidebarView is initialized.');
      },
      onRender: function() {
        console.log('SidebarView is rendered.')
        // TODO: 选中菜单项
      },
      onMenuClick: function(e) {
        var $target = $(e.currentTarget),
          $item = $target.parent('li'),
          $parent = $item.closest('ul'),
          $wrap = $item.closest('ul.sidebar-menu'),
          $next = $target.next(),
          hasChild = $next.length > 0,
          animationSpeed = 500,
          activeCls = 'active',
          collapsed = $('body').hasClass('sidebar-collapse');


        if ($item.is('.header')) {
          return e.preventDefault();
        }


        if (collapsed) { // sidebar收缩状态下

          if ($parent.is('.treeview-menu')) { // 点击的是子菜单项          
            if (hasChild) {
              // TODO: 多级菜单时，这里需要展开、收缩
            } else {
              $wrap.find('li.active').removeClass(activeCls);
              // 给当前li以及所有的上级li.treeview都添加active样式
              $item.addClass(activeCls).parents('li.treeview').addClass(activeCls)
            }          
          } else if($parent.is('.sidebar-menu') && !hasChild) { // 点击的是一级菜单，且没有子菜单时，才切换样式
            $wrap.find('li.active').removeClass(activeCls);
            $item.addClass(activeCls);
          }

        } else { // sidebar展开状态下

          if (hasChild) { // 有子菜单项时，展开或收缩
            if ($item.hasClass(activeCls)) {
              $next.slideUp(animationSpeed, function() {
                //Fix the layout in case the sidebar stretches over the height of the window      
              });
              // 收缩时，不需要把当前已激活的子项设为未激活
              // $item.find('li.active').removeClass(activeCls);
              $item.removeClass(activeCls);          
            } else {
              $next.slideDown(animationSpeed, function() {
                //Fix the layout in case the sidebar stretches over the height of the window
              });
              // 移除其同级li的active样式
              $item.siblings('li').removeClass(activeCls);
              $item.addClass(activeCls);
            }
          } else { // 点击的是叶级菜单，做菜单切换操作
            if ($parent.is('.sidebar-menu')) { // 一级菜单项
              // 查找已展开的菜单项，把它收缩起来
              $next = $wrap.find('> li.active > a').next();
              $next.slideUp(animationSpeed, function() {
                //Fix the layout in case the sidebar stretches over the height of the window
              });
              // 从wrap中查找所有的li.active
              $wrap.find('li.active').removeClass(activeCls);
              
            } else { // 二级菜单项
              // 移除其同级li的active样式
              $item.siblings('li').removeClass(activeCls);
            }
            // 没有子菜单项时，直接切换active样式就行
            $item.addClass(activeCls);
          }

        }

      }
    })
  })