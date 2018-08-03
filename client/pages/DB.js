var configURL = require('../config.js')

//用户登录换取openid
function GetOpenID(code,resFunc) {
  //console.log(configURL.config.service.loginUrl);
  wx.request({
    url: configURL.config.service.loginUrl,
    data: {
      js_code: code
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data);
    }
  })
}

//读取全部管理员列表
function GetAllManagerList(resFunc) {
  wx.request({
    url: configURL.config.service.databaseOutputUrl,
    data: {
      flag: 0 //flag为0，表示获取全部管理员列表
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//读取全部的有效的义工列表
function GetAllVolunteerList(resFunc) {
  wx.request({
    url: configURL.config.service.databaseOutputUrl,
    data: {
      flag: 1 //flag为1，表示获取全部有效的义工列表
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//读取特定WID的有效的义工列表
function GetVolunteerByWID(WID, resFunc) { //WID为微信用户的唯一识别ID
  wx.request({
    url: configURL.config.service.databaseOutputUrl,
    data: {
      flag: 2, //flag为2，表示获取特定WID的有效的义工列表
      WID: WID
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//删除指定WID的数据，数据库中仅把Valid设置为0
function DeleteByWID(WID, resFunc) {
  wx.request({
    url: configURL.config.service.databaseUpdateUrl,
    data: {
      flag: 0, //flag为0，表示删除指定WID的数据
      WID: WID
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//更新指定WID的用户数据
function UpdateByWID(WID, UserInfo, resFunc) { //UserInfo只需写有修改的Key:Value对
  wx.request({
    url: configURL.config.service.databaseUpdateUrl,
    data: {
      flag: 1, //flag为1，更新指定WID的用户数据
      WID: WID,
      UserInfo: UserInfo
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//写入新的一条数据
function InsertUserInfo(UserInfo, resFunc) { //完整的UserInfo,ID不用写，TimeStamp为null，返回的是ID值
  wx.request({
    url: configURL.config.service.databaseUpdateUrl,
    data: {
      flag: 2, //flag为2，写入新的一条数据
      UserInfo: UserInfo
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

//更改义工状态（正在帮忙、待命、帮不上忙）
function UpdateStatusByWID(WID, Status, resFunc) {
  wx.request({
    url: configURL.config.service.databaseUpdateUrl,
    data: {
      flag: 3, //flag为3，更改义工状态（正在帮忙、待命、帮不上忙）
      WID: WID,
      Status: Status
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function(res) {
      resFunc(res.data.data);
    }
  })
}

module.exports = {
  GetAllManagerList: GetAllManagerList,
  GetAllVolunteerList: GetAllVolunteerList,
  GetVolunteerByWID: GetVolunteerByWID,
  DeleteByWID: DeleteByWID,
  UpdateByWID: UpdateByWID,
  InsertUserInfo: InsertUserInfo,
  UpdateStatusByWID: UpdateStatusByWID,
  GetOpenID: GetOpenID
};