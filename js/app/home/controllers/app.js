define(['marionette'], function(Marionette) {
  return Marionette.Controller.extend({
    index: function() {
      console.log('index')
    },
    defaultAction(params) {
      console.log('defaultAction', params)
    }
  })
});
