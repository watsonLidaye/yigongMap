// pages/organizer/index.js
var m_DB = require('../DB')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    icon: [
      {
        type: "抓捕守护",
        iconlist: [
          {
            status: 0,
            icon: "/pages/image/03.png"
          },
          {
            status: 1,
            icon: "/pages/image/04.png"
          },
          {
            status: 2,
            icon: "/pages/image/05.png"
          },
        ]

      },
      {
        type: "宣传文案",
        iconlist: [
          {
            status: 0,
            icon: "/pages/image/06.png"
          },
          {
            status: 1,
            icon: "/pages/image/07.png"
          },
          {
            status: 2,
            icon: "/pages/image/08.png"
          },
        ]

      },
      {
        type: "医院陪护",
        iconlist: [
          {
            status: 0,
            icon: "/pages/image/09.png"
          },
          {
            status: 1,
            icon: "/pages/image/10.png"
          },
          {
            status: 2,
            icon: "/pages/image/11.png"
          },
        ]

      },
      {
        type: "临时安置",
        iconlist: [
          {
            status: 0,
            icon: "/pages/image/12.png"
          },
          {
            status: 1,
            icon: "/pages/image/13.png"
          },
          {
            status: 2,
            icon: "/pages/image/14.png"
          },
        ]

      },
    ],
    location:{
      latitude:0,
      longitude:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this,
      location = {}
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        location.latitude = res.latitude
        location.longitude = res.longitude
        that.setData({ location: location })
      },
      fail() {
        wx.showModal({
          title: '温馨提示',
          content: '您拒绝了地理位置请求，默认以长沙市中心位置显示',
        })
      },
      complete() {
        that.pageGet()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  pageGet(){
    wx.showNavigationBarLoading()
    let icon = this.data.icon,
      markers = [],
      marker = {},
      info = []
    this.setData({ height: wx.getSystemInfoSync().windowHeight })
    m_DB.GetAllVolunteerList(res => {
      info = res
      for (let z in res) {
        marker = {
          latitude: 28.1334581468,
          longitude: 112.9950714111,
          title: "",
          width: 50,
          height: 50
        }
        marker.latitude = info[z].Latitude
        marker.longitude = info[z].Longitude
        marker.title = info[z].AddressName
        marker.id = info[z].ID

        let imgs = ""
        for (let i in icon) {
          if (icon[i].type == info[z].MainJob) {
            for (let j in icon[i].iconlist) {
              if (icon[i].iconlist[j].status == info[z].Status) {
                imgs = icon[i].iconlist[j].icon
              }
            }
          }
        }
        marker.iconPath = imgs

        markers.push(marker)
        wx.setStorageSync('info', info)
      }
      console.log(markers)
      this.setData({ info: info, markers: markers })
      wx.hideNavigationBarLoading()
    })
  },
  markertap(e) {
    wx.navigateTo({
      url: '/pages/organizer/detail?id=' + e.markerId,
    })
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
  onShareAppMessage: function () {

  }
})