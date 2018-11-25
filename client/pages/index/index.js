//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var m_DB = require('../DB')
var config = require('../../config')
var util = require('../../utils/util.js')


//不显示的数据声明
var manger_list = []

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    height: ""
  },
  onLoad() {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
    m_DB.GetAllManagerList(this.getList)
  },
  //peifeng
  onGotUserInfo(e) {
    wx.showLoading({
      title: '登陆中...',
    })
    let jumpStauts = 0
    let nickName = e.detail.userInfo.nickName
    let user_list = manger_list
    let path = ""
 
    if (e.detail.userInfo.nickName) {
     
      wx.login({
        success: function(res) {
          m_DB.GetOpenID(res.code, res => {
            for (let i in user_list) {
              if (user_list[i].WID == res.openid) {
                jumpStauts = 1
              }
            }
            wx.setStorageSync('jumpStauts', jumpStauts )
            switch (jumpStauts) {
              case 0:
                path = "/pages/helper/index?username=" + nickName
                break;
              case 1:
                path = "/pages/organizer/index"
                break;
            }
            wx.navigateTo({
              url: path + '&openid=' + res.openid,
            })
            wx.hideLoading()
          })
        
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }

  },

  getList(res) {
    manger_list = res
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }
})