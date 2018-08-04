/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://miuwxl1q.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    //数据库读取
    databaseOutputUrl: `${host}/weapp/dbOutput`,

    //数据库更新
    databaseUpdateUrl: `${host}/weapp/dbUpdate`,
  }
};

var manager_list = [
  ''
]

module.exports = {
  config: config,
  user_list: manager_list
};