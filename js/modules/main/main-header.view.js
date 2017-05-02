define(['marionette', 'text!modules/main/main-header.html'], 
  function(Marionette, template) {
    return Marionette.View.extend({
      template: template,
      tagName: 'h1',
      modelEvents: {
        change: 'render'
      }
    });
  });