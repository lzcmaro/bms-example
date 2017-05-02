define(['backbone', 'config', 'modules/user/user.model'], function(Backbone, Config, UserModel) { 
  return Backbone.Collection.extend({
    url: Config.prefix + 'users',
    model: UserModel
  })
});
