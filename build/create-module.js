var fs = require('fs');
var path = require('path');


function writeFiles(inputPath, outPath, modulePath, moduleName, routePath) {
  var exts = ['.controller.js', '.html', '.view.model.js', '.view.js'];
  var source, filepath;

  exts.forEach(function(ext) {
    filepath = inputPath + 'example' + ext;
    
    if (fs.existsSync(filepath)) {
      source = fs.readFileSync(filepath, {encoding: 'utf8'});
      source = source.replace(/\{\{module\-path\}\}/g, modulePath)
        .replace(/\{\{module\-name\}\}/g, moduleName)
        .replace(/\{\{route\-path\}\}/g, routePath);
      fs.writeFileSync(outPath + moduleName + ext, source, {encoding: 'utf8'});
    }
  });  
}

function createModuleFiles(input) {
  if (!input) return;

  // modules 的根目录
  var basePath = path.resolve(__dirname, '../js/modules') + '/';
  var examplePath = path.resolve(__dirname, './example') + '/';
  var input, routePath, modulePath, moduleBasePath, moduleName, source;

  // 避免在使用String.split()时，返回的数组，最后一个为空字符
  input = input.replace(/\/$/, '');
  // 路由地址，在前面加上'/'
  routePath = '/' + input.replace(/^\//, '');
  // 把input按'/'拆分成数组
  input = input.split('/');
        
  if (input.length > 1) { // 多级路由
    // 最后一个为 moduleName
    moduleName = input.pop();
    // 剩下的组合为模块的路径
    modulePath = input.join('/');
  } else { // 单级路由
    modulePath = moduleName = input[0];
  }

  // console.log(basePath + modulePath + '/' + moduleName);

  moduleBasePath = basePath;

  // 创建模块目录
  input.forEach(function(dirname) {
    moduleBasePath += dirname + '/';
    if (!fs.existsSync(moduleBasePath)) {
      fs.mkdirSync(moduleBasePath);
    }
  });

  writeFiles(examplePath, moduleBasePath, modulePath, moduleName, routePath);

  console.log('Build end.');
}

(function() {
  var readline = require('readline'); 
  var rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
  });

  console.log('Build start...');

  rl.question('请输入模块的路由地址：', function(input) {
    createModuleFiles(input);
    rl.close();
  });

  rl.on('close',function(){
    process.exit(0);
  });

})();


