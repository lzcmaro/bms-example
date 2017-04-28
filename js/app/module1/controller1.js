define(['app/module1/view1', 'common'], function(View, Common) {
  console.log(Common)
  var controller = function() {
    var view = new View();
    view.render('kenko');
  };
  return controller;
});
