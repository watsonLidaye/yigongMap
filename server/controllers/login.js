var request = require('request');
// 登录授权接口
module.exports = async(ctx, next) => {

  let appid = 'wxcf2d491399796ad0';
  let secret = 'b14621f11389f7afa1ec5a126318b906';
  let js_code = ctx.request.body.js_code;
  let grant_type = 'authorization_code';

  let res=await request.get({
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: grant_type,
      appid: appid,
      secret: secret,
      js_code: js_code
    }
  }, (err, response, data) => {
    if (response.statusCode === 200) {
      console.log(data)
      //TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
      //伪代码: redisStore.set(sessionid, openid + session_key, 7200)

      //res.json({
        //sessionid: sessionid
      //})
    } else {
      console.log("[error]", err)
      res.json(err)
    }
  })
  ctx.state.code=200;
  ctx.body = res;
}