// miniprogram/pages/name/name.js
const db=wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:''
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
    this.setData({
      nickName:app.userInfo.nickName
    })
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
  onShareAppMessage: function () {

  },
  handleValue(e){
    const value=e.detail.value
    this.setData({
      nickName:value
    })
  },
  handleClick(){

    this.updateSignature()
  },
  updateSignature(){
    wx.showLoading({
      title: '更新中',
    })
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        nickName:this.data.nickName
      }
    }).then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '更新成功',
      })
      app.userInfo.nickName=this.data.nickName
    })
  },
  getUserProfile(e){
    wx.getUserProfile({
      desc: 'desc',
      success:res=>{
        this.setData({
          nickName:res.userInfo.nickName
        })
      }
    })
    
    if(this.data.nickName){
      
      this.updateSignature()
    }
  }
})