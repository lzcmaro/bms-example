var path = require('path')
var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router(path.join(__dirname, 'db.json'))
var middlewares = jsonServer.defaults({static: __dirname})
var common = require('./js/common/common')

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
// server.get('/api/account', (req, res) => {
//   res.send('403', {error: '你被禁止访问。'});
// })

// 拦载用户管理下的增、删、改操作
server.all(common.prefix + '/users/*', (req, res) => {
  console.log('body', req.body)
  res.status(201).json({});
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now()
//   }
//   // Continue to JSON Server router
//   next()
// })

// Use default router
server.use(common.prefix, router)

// Startup
server.listen(3000, function() {
  console.log('JSON Server is running. [Listening at http://localhost:3000]')
})
