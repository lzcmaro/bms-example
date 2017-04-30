define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/home/sidebar.html',
  'text!modules/home/menu-item.html',
  'config'
], function($, _, Backbone, Marionette, sidebarTemplate, menuItemTemplate, Config) {
  var SectionNode = Marionette.View.extend({
    template: '<li><%=label%></li>',
    tagName: 'li',
    className: 'header'
  })

  var TreeNode = Marionette.View.extend({
    template: menuItemTemplate,
    tagName: 'li',
    className: 'treeview',
    regions: {
      tree: {
        el: 'ul',
        replaceElement: true
      }
    },
    onRender: function() {
      var nodes = this.model.get('children'), 
        iconCls = this.model.get('icon') || 'fa fa-circle-o',
        treeView;

      if (nodes && nodes.length) {
        // 存在子节点时，渲染其childView
        treeView = new TreeView({
          collection: new Backbone.Collection(nodes)
        });

        this.showChildView('tree', treeView);
      } else {
        // 移除其treeview样式以及箭头图标，以便标识其是叶子点
        this.$el.removeClass('treeview').find('.pull-right-container').remove();
        // 删除多余的元素
        this.$el.find('> ul').remove();
      }

      // 由于_.template()无法对元素的class替换，这里作特殊处理
      this.$el.find('i.icon').removeClass('icon').addClass(iconCls)
    }
  });

  /**
   * 由于AdminLTE的sidebar-menu不是标准的tree结构，为方便模板处理，
   * 这里对数据做清洗，把数据组装成合适的列表数据
   */
  var TreeView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'treeview-menu',
    childView: function(node) {
      var nodeType = node.get('type');
      return nodeType === 'section' ? SectionNode : TreeNode;
    },
    collectionEvents: {
      update: 'filterDatas'
    },
    filterDatas: function() {
      var treeDatas = this.collection.toJSON(), list = [], tmp;
      if (!treeDatas.length) return;

      _.each(treeDatas, function(item) {
        // 把
        if (item.type === 'section' && item.children && item.children.length) {
          tmp = _.clone(item);
          delete tmp.children;
          list.push(tmp);
          _.each(item.children, function(node) {
            list.push(node)
          })
        } else {
          list.push(item)
        }
      })

      // 这里需要调用reset重置，它不会使视图重新render
      this.collection.reset(list);
    },
    onRender: function() {
      if (this.$el.parent().is('.sidebar')) {
        this.$el.removeClass('treeview-menu').addClass('sidebar-menu');
      }
    }
  });

  return Marionette.View.extend({
    template: sidebarTemplate,
    className: 'main-sidebar', // AdminLTE 约定的class
    tagName: 'aside',
    regions: {
      treeview: {
        el: 'ul',
        replaceElement: true
      }
    },  
    events: {
      'click li a': 'onMenuClick'
    },
    initialize: function(options) {
      console.log('SidebarView is initialized.');
      this.channel = Backbone.Radio.channel(Config.channel.sidebar);
    },
    onRender: function() {
      console.log('SidebarView is rendered.');
      // 注意的是，这里给treeview绑定的是this.collection
      // 如果当前view也监听collectionEvents的话，它将会在当前view以及treeview都触发
      this.showChildView('treeview', new TreeView({
        collection: this.collection
      }))
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
        collapsed = $('body').hasClass('sidebar-collapse'),
        href = $target.attr('href');


      if ($item.is('.header')) {
        return e.preventDefault();
      }


      if (collapsed) { // sidebar收缩状态下

        if ($parent.is('.treeview-menu')) { // 点击的是子菜单项          
          if (hasChild) {
            // TODO: 多级菜单时，这里需要展开、收缩
          } else {
            this.goto(href);
            // 移除所有li的active样式
            $wrap.find('li.active').removeClass(activeCls);
            // 给当前li以及所有的上级li.treeview都添加active样式
            $item.addClass(activeCls).parents('li.treeview').addClass(activeCls);
          }          
        } else if($parent.is('.sidebar-menu') && !hasChild) { // 点击的是一级菜单，且没有子菜单时，才切换样式
          this.goto(href);
          // 移除所有li的active样式
          $wrap.find('li.active').removeClass(activeCls);
          // 给当前li添加active样式
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
            // 收起同级，并已展开的菜单项（避免收起了当前菜单，如果点击的是三级菜单的话）
            $item.siblings('li.active').find(' > a').next().slideUp(animationSpeed);
            // 展开其子菜单
            $next.slideDown(animationSpeed, function() {
              //Fix the layout in case the sidebar stretches over the height of the window
            });
            // 只移除其同级li的active样式，因为其子菜单项可能已选中
            $item.siblings('li').removeClass(activeCls);
            $item.addClass(activeCls);
          }
        } else { // 点击的是叶级菜单，做菜单切换操作
          if ($parent.is('.sidebar-menu')) { // 一级菜单项
            // 收缩已展开的菜单菜项
            $next = $wrap.find('> li.active > a').next();
            $next.slideUp(animationSpeed, function() {
              //Fix the layout in case the sidebar stretches over the height of the window
            });           
          }

          // 移除所有li的active样式
          $wrap.find('li.active').removeClass(activeCls);
          // 给当前li以及所有的上级li.treeview都添加active样式
          $item.addClass(activeCls).parents('li.treeview').addClass(activeCls);

          this.goto(href);          
        }

      }

    },
    goto: function(url) {
      console.log('goto:', url)
      // 这里不作跳转处理，只把事件trigger出去
      this.channel.trigger('goto', url)
    }
  })
});
