define(['backbone', 'config', 'modules/home/menu.model'], function(Backbone, Config, Menu) {
  return Backbone.Collection.extend({
    url: Config.prefix + 'menus',
    model: Menu
  })
})