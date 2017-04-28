// define(['backbone'], function () {

//     var routesMap = {
//         'module1': 'js/app/module1/controller1.js',            //原来应该是一个方法名，这里取巧改为模块路径
//         'module2(/:name)': 'js/app/module2/controller2.js',
//         '*actions': 'defaultAction'
//     };

//     var Router = Backbone.Router.extend({

//         routes: routesMap,

//         defaultAction: function () {
//             console.log('404');
//             location.hash = 'module2';
//         }

//     });

//     var router = new Router();
//     //彻底用on route接管路由的逻辑，这里route是路由对应的value
//     router.on('route', function (route, params) {
//         require([route], function (controller) {
//             if(router.currentController && router.currentController !== controller){
//                 router.currentController.onRouteChange && router.currentController.onRouteChange();
//             }
//             router.currentController = controller;
//             controller.apply(null, params);     //每个模块约定都返回controller
//         });
//     });

//     return router;
// });

define(['marionette', 'app/home/controllers/app'], function(Marionette, AppCtrl) {
  // console.log(new AppCtrl());
  // var appCtrl = {
  //   index: function() {
  //     console.log('index')
  //   },
  //   defaultAction(params) {
  //     console.log('defaultAction', params)
  //   }
  // };

  return Marionette.AppRouter.extend({
    routes: {
      "": "index",
      "*actions": "defaultAction",
    },
    index: function() {
      console.log('index')
    },
    defaultAction(params) {
      console.log('defaultAction', params)
    }
  })

});

