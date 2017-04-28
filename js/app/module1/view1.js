define(['text!app/module1/tpl.html'], function(tpl) {

  var View1 = Backbone.View.extend({
    el: '#container',

    initialize: function() {},

    render: function(name) {
      console.log('view1.render: ', name, tpl)
      this.$el.html(_.template(tpl, { name: name }));
    }
  });

  return View1;
});
