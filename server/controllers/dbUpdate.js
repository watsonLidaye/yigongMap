const {
  mapMysql: config
} = require('../config')

module.exports = async(ctx, next) => {
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.pass,
      database: config.db,
      charset: config.char,
      multipleStatements: true
    }
  })

  //分三种情况：1、删除指定WID的数据，数据库中仅把Valid设置为0；2、更新指定WID的用户数据；3、写入新的一条数据；4、更改义工状态（正在帮忙、待命、帮不上忙）
  var flag = ctx.request.body.flag
  if (flag === 0) //删除指定WID的数据，数据库中仅把Valid设置为0
  {
    let WID = ctx.request.body.WID;
    var res = await knex('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update('Valid', 0);
    ctx.state.code = 200;
    ctx.state.data = res;
  } else if (flag === 1) //更新指定WID的用户数据
  {
    let WID = ctx.request.body.WID;
    let UserInfo = ctx.request.body.UserInfo;
    var res = await knex('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update(UserInfo);
    ctx.state.code = 200;
    ctx.state.data = res;

  } else if (flag === 2) //写入新的一条数据
  {
    let UserInfo = ctx.request.body.UserInfo;
    var res = await knex('t_VolunteerList').insert(UserInfo);
    ctx.state.code = 200;
    ctx.state.data = res;
  } else if (flag === 3) //更改义工状态（正在帮忙、待命、帮不上忙）
  {
    let WID = ctx.request.body.WID;
    let Status = ctx.request.body.Status;
    var res = await knex('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update('Status', Status);
    ctx.state.code = 200;
    ctx.state.data = res;
  } else {
    ctx.state.code = -1;
    ctx.state.data = 'flag错误';
  }






}