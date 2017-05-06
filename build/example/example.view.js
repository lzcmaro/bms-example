define([
  'jquery', 
  'underscore', 
  'backbone', 
  'marionette', 
  'text!modules/{{module-path}}/{{module-name}}.html'
], function($, _, Backbone, Marionette, template) {
  'use strict';

  return Marionette.View.extend({
    template: template,
    ui: {
      form: 'form',
      grid: '.datagrid'
    },
    initialize: function(options) {
      // Do something
    },
    onRender: function() {
      this.gridView = new Marionette.DatagridView({
        el: this.ui.grid,
        model: this.model,
        gridOptions: {
          columns: [[
            // TODO
          ]]
        }
      }).render();
    }
  })
});
