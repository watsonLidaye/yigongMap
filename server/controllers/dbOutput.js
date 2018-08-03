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

  //分三种情况：1、读取全部管理员列表；2、读取全部有效的义工列表；3、读取特定WID的有效的义工列表
  var flag = ctx.request.body.flag
  if (flag === 0) //获取全部管理员列表
  {
    var res = await knex('t_ManagerList').select();
    ctx.state.code = 200;
    ctx.state.data = res;
  } else if (flag === 1) //获取全部有效的义工列表
  {
    var res = await knex('t_VolunteerList').select().where('Valid',1);
    ctx.state.code = 200;
    ctx.state.data = res;

  } else if (flag === 2) //获取特定WID的有效的义工列表
  {
    var WID = ctx.request.body.WID;
    var res = await knex('t_VolunteerList').where({Valid:1,WID:WID});
    ctx.state.code = 200;
    ctx.state.data = res;
  } else {

  }






}