// pages/organizer/detail.js
var m_DB = require('../DB')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      value:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let detail={}
    let info = wx.getStorageSync('info')
    for(let i in info ){
      if (info[i].ID == id){
        detail = info[i]
      }
    }
    let exp = JSON.parse(detail.Experience)
    let score = 0
    for (let i in exp){
      if (exp[i].status){
        score += parseInt(exp[i].score)
      }
    }
    this.insertStar(score)
    detail.AuxJob = JSON.parse(detail.AuxJob)
    detail.Experience = JSON.parse(detail.Experience)
    this.setData({ detail: detail  })
        
  },
  // 插入星星的操作
  insertStar(score){
    let value = this.data.value
    if (score>0){
      value.push(1)
      this.setData({ value: value})
      this.insertStar(score-1)
    }else{

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  go(){
    let info =this.data.detail
    wx.openLocation({
      latitude: info.Latitude,
      longitude: info.Longitude,
      name: info.Address,
      address: info.AddressName,
      scale: 14
    })
  },
  operation(e){
    let etype = e.currentTarget.dataset.op
    let detail = this.data.detail
    let content = ""
    let that =this
    switch (etype){
      case '0':
        detail.Status=0;
        content="确定要恢复么？"
        break;
      case '1':
        detail.Status = 1;
        content = "确定设置成可以帮忙么？"
        break;
      case '2':
        detail.Status = 2;
        content = "确定设置成不可以帮忙么？"
        break;
    }
    wx.showModal({
      title: '温馨提示',
      content: content,
      confirmColor: "#19A7D9",
      success: function (res) {
        if (res.confirm) {

          wx.navigateBack({
            url: '/pages/organizer/index',
          })
        }
      },
    })
    m_DB.UpdateStatusByWID(detail.WID, detail.Status,(res)=>{console.log(res)})

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  phoneCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.Phone,
    })
  }
})