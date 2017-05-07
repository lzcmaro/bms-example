var faker = require('faker');
var db = {
  // 登录帐户信息
  "account": {
    "id": "1001",
    "name": "Admin",
    "loginName": "admin"
  },
  // 系统菜单列表
  "menus": [
    {
      "id": "101",
      "type": "section",
      "label": "功能管理",
      "children": [
        {
          "id": "1001",
          "label": "产品管理",
          "icon": "fa fa-pie-chart"
        },
        {
          "id": "1002",
          "label": "贷款管理",
          "icon": "fa fa-pie-chart",
          "children": [
            {
              "id": "100201",
              "label": "贷款信息查询",
              "url": "loan/loan-search"
            },
            {
              "id": "100202",
              "label": "授信信息查询"
            },
            {
              "id": "100203",
              "label": "借款信息查询"
            }
          ]
        }
      ]
    },
    {
      "id": "102",
      "type": "section",
      "label": "系统管理",
      "children": [
        {
          "id": "1003",
          "label": "用户管理",
          "url": "user",
          "icon": "fa fa-gears"
        },
        {
          "id": "1004",
          "label": "角色管理",
          "url": "role",
          "icon": "fa fa-gears"
        },
        {
          "id": "1005",
          "label": "权限管理",
          "url": "privilege",
          "icon": "fa fa-gears"
        }
      ]
    }
  ]
};

faker.locale = 'zh_CN';

// 生成用户数据
function generateUsers () {
  var list = []

  for (var id = 0; id < 20; id++) {
    var name = faker.name.findName()
    var tel = faker.phone.phoneNumber()
    var createDate = faker.date.future();

    list.push({
      "id": id,
      "name": name,
      "tel": tel,
      "status": id % 2,
      "createDate": createDate
    })
  }

  return list
}


function generateDatas () {
  var userList = generateUsers();
  // 用户增、删、改用到的集合
  db['users'] = userList;
  // 用户的分页数据对象
  db['user-paging'] = {total: 30, rows: userList};

  return db
}

module.exports = generateDatas;