const { mysql } = require('../qcloud')

module.exports = async(ctx, next) => {


  //分三种情况：1、删除指定WID的数据，数据库中仅把Valid设置为0；2、更新指定WID的用户数据；3、写入新的一条数据；4、更改义工状态（正在帮忙、待命、帮不上忙）
  var flag = ctx.request.body.flag
  if (flag === 0) //删除指定WID的数据，数据库中仅把Valid设置为0
  {
    let WID = ctx.request.body.WID;
    await mysql('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update('Valid', 0).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;});
  } else if (flag === 1) //更新指定WID的用户数据
  {
    let WID = ctx.request.body.WID;
    let UserInfo = ctx.request.body.UserInfo;
    //先删除
    await mysql('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update('Valid', 0).then(res => {

    });
    //再新建一条
    await mysql('t_VolunteerList').insert(UserInfo).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;
    });
  } else if (flag === 2) //写入新的一条数据
  {
    let UserInfo = ctx.request.body.UserInfo;
    await mysql('t_VolunteerList').insert(UserInfo).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;});
  } else if (flag === 3) //更改义工状态（正在帮忙、待命、帮不上忙）
  {
    let WID = ctx.request.body.WID;
    let Status = ctx.request.body.Status;
    await mysql('t_VolunteerList').where({
      Valid: 1,
      WID: WID
    }).update('Status', Status).then(res => {
      ctx.state.code = 200;
      ctx.state.data = res;});

  } else {
    ctx.state.code = -1;
    ctx.state.data = 'flag错误';
  }






}