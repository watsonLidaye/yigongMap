const { mysql } = require('../qcloud')

module.exports = async(ctx, next) => {

  //分三种情况：1、读取全部管理员列表；2、读取全部有效的义工列表；3、读取特定WID的有效的义工列表
  var flag = ctx.request.body.flag
  if (flag === 0) //获取全部管理员列表
  {
    await mysql('t_ManagerList').select('*').then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;});
  } else if (flag === 1) //获取全部有效的义工列表
  {
    await mysql('t_VolunteerList').select('*').where('Valid', 1).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;});

  } else if (flag === 2) //获取特定WID的有效的义工列表
  {
    var WID = ctx.request.body.WID;
    await mysql('t_VolunteerList').where({ Valid: 1, WID: WID }).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;
      });

  } else {
    ctx.state.code = -1;
    ctx.state.data = 'flag错误';
  }






}