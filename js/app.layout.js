define(['marionette'], function(Marionette) {
  return Marionette.LayoutView.extend({
      el: '#container',
      regions: {
        header: '#header',
        sidebar: '#sidebar',
        main: '#main'
      }
    })
});
