define(['backbone', 'config'], function(Backbone, Config) {
  return Backbone.Model.extend({
    urlRoot: function() {
      return Config.prefix + 'menu'
    }
  })
})