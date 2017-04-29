define(['marionette'], function(Marionette) {
  return Marionette.View.extend({
      el: '#container',
      regions: {
        header: '#header',
        sidebar: '#sidebar',
        main: '#main'
      }
    })
});
