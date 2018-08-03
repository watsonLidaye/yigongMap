// pages/helper/index.js
var m_DB = require('../DB')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaction: false,
    info: {},
    array: ["抓捕守护", "宣传文案", "医院陪护", "临时安置"],
    aux_array: [],
    exp_show: false,
    experience: [{
      id: 0,
      title: "我领养过流浪动物",
      score: 2,
      status: false
    }, {
      id: 1,
      title: "我帮助流浪动物找到领养",
      score: 2,
      status: false
    }, {
      id: 2,
      title: "我去过小院做义工",
      score: 1,
      status: false
    }, {
      id: 3,
      title: "我去过领养日做义工",
      score: 1,
      status: false
    }, ],
    marker: [{
      id: 4,
      latitude: 28.1334581468,
      longitude: 112.9950714111,
      title: "",
      width: 20,
      height: 20
    }],
    sindex: -1,
    edit_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let info = {}
    let array = this.data.array
    info.username = options.username
    info.openid = options.openid
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      info: info
    })
    m_DB.GetVolunteerByWID(info.openid, res => {
      if (res[0].Phone) {
        let array = this.data.array
        for (let i in array) {
          if (array[i] == res[0].MainJob) {
            this.setData({
              sindex: i
            })
          }
        }
        let info = {}
        info.username = res[0].UserName
        info.address = res[0].Address
        info.name = res[0].AddressName
        info.latitude = Number(res[0].latitude)
        info.longitude = Number(res[0].longitude)
        info.longitude = Number(res[0].longitude)
        info.phone = res[0].Phone
        info.info = res[0].Info
        this.setData({
          info: info,
          aux_array: JSON.parse(res[0].AuxJob),
          experience: JSON.parse(res[0].Experience),
          edit_type: 1,
          loaction: true
        })
      }
    })

  },
  recordText(e) {
    let info = this.data.info
    info.info = e.detail.value
    this.setData({
      info: info
    })
  },
  recordphone(e) {
    let info = this.data.info
    info.phone = e.detail.value
    this.setData({
      info: info
    })
  },
  chooseAddress() {
    let that = this
    let info = this.data.info
    let marker = this.data.marker
    wx.chooseLocation({
        success(res) {
          console.log(res)
          info.address = res.address
          info.latitude = res.latitude
          info.longitude = res.longitude
          info.name = res.name
          marker[0].latitude = res.latitude
          marker[0].longitude = res.longitude
          marker[0].title = res.address
          that.setData({
            loaction: true,
            info: info,
            marker: marker
          })
        },
        fail(res) {
          console.log(res.errMsg)
          let match = 'cancel'
          console.log(res.errMsg.indexOf(match))
          if (res.errMsg.indexOf(match) == -1) {
            wx.showModal({
              title: '温馨提示',
              content: '您拒绝了操作，可删除小程序后重进即可',
              confirmColor: "#19A7D9",
              showCancel: false,
            })
          }

        }
      },

    )
  },
  submit() {
    let current_info = this.data.info
    if (!current_info.latitude) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择您的位置',
        confirmColor: "#19A7D9",
        showCancel: false
      })
      return
    }
    let reg = /^1(3|4|5|7|8)\d{9}$/
    if (!current_info.phone && !reg.test(current_info.phone)) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的手机号码',
        confirmColor: "#19A7D9",
        showCancel: false
      })
      return
    }
    if (this.data.sindex == -1) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择义工类型',
        confirmColor: "#19A7D9",
        showCancel: false
      })
      return
    }
    let data = {}
    data.WID = current_info.openid
    data.UserName = current_info.username
    data.Address = current_info.address
    data.Latitude = current_info.latitude
    data.Longitude = current_info.longitude
    data.AddressName = current_info.name
    data.Valid = 1,
      data.Phone = current_info.phone
    data.TimeStamp = null
    data.Status = 0
    data.Info = current_info.info
    data.MainJob = this.data.array[this.data.sindex]
    data.AuxJob = JSON.stringify(this.data.aux_array)
    data.Experience = JSON.stringify(this.data.experience)
    let Volunteer = data
    wx.showModal({
      title: '温馨提示',
      content: '感谢您的发布，我们会及时处理',
      confirmColor: "#19A7D9",
      showCancel: false,
      success: function(res) {
        if (this.data.edit_type == 0) {
          m_DB.InsertUserInfo(Volunteer, res => {
            console.log(res)
          })
        } else {
          m_DB.UpdateByWID(Volunteer, res => {
            console.log(res)
          })
        }

        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      },
    })
  },

  delect() {
    wx.showModal({
      title: '温馨提示',
      content: '确定删除信息吗？',
      confirmColor: "#19A7D9",
      cancelText: "再想想",
      success: function(res) {
        wx.clearStorageSync('helper')
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      },
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      sindex: e.detail.value
    })
    let array = JSON.parse(JSON.stringify(this.data.array))
    let aux_array = []
    array.splice(e.detail.value, 1)
    for (let i in array) {
      let obj = {}
      obj.title = array[i]
      obj.status = false
      aux_array.push(obj)
    }
    this.setData({
      aux_array: aux_array
    })
  },
  checkStatus(e) {
    let aindex = e.currentTarget.dataset.index
    let etype = e.currentTarget.dataset.type
    let aux_array = this.data.aux_array
    let experience = this.data.experience
    if (etype != 'exp') {
      aux_array[aindex].status = !aux_array[aindex].status
      this.setData({
        aux_array: aux_array
      })
    } else {
      experience[aindex].status = !experience[aindex].status
      this.setData({
        experience: experience
      })
    }
  },
  showEX() {
    this.setData({
      exp_show: !this.data.exp_show
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})