// miniprogram/pages/mwssage/message.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:[],
    isLogin:false
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.userInfo._id){
      this.setData({
        isLogin:true,
        message:app.message
      })
    }else{
      wx.showToast({
        title: '请登录',
        duration:2000,
        complete:()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/user/user',
            },2000)
          })
        }
      })
    }
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

  },
  onMyEvent(e){
    this.setData({
      message:[]
    },()=>{
      this.setData({
        message:e.detail
      })
    })
  }
})